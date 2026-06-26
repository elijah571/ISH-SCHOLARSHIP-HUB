import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import { User, Conversation, Message } from '../database/models/index.js';
import { logger } from '../utils/logger.js';

const MAX_MESSAGE_LENGTH = 2000;
const MAX_ATTACHMENTS = 5;

const socketRateLimits = new Map();
const RATE_LIMITS = {
  send_message: { max: 20, windowMs: 60_000 },
  edit_message: { max: 10, windowMs: 60_000 },
  delete_message: { max: 10, windowMs: 60_000 },
  user_typing: { max: 30, windowMs: 60_000 },
  mark_read: { max: 20, windowMs: 60_000 },
};

function checkSocketRateLimit(socketId, event) {
  const config = RATE_LIMITS[event];
  if (!config) return true;
  const now = Date.now();
  if (!socketRateLimits.has(socketId)) socketRateLimits.set(socketId, {});
  const limits = socketRateLimits.get(socketId);
  if (!limits[event] || now > limits[event].resetAt) {
    limits[event] = { count: 1, resetAt: now + config.windowMs };
    return true;
  }
  limits[event].count++;
  return limits[event].count <= config.max;
}

const userAttrs = ['id', 'fullName', 'email', 'role'];
const convWithUsers = {
  include: [
    { model: User, as: 'participant', attributes: userAttrs },
    { model: User, as: 'admin', attributes: userAttrs },
  ],
};

const activeUsers = new Map();
const activeConnections = {};

const emitConversationUpdate = async (io, conversationId) => {
  const conversation = await Conversation.findByPk(conversationId, convWithUsers);
  if (!conversation) return;

  io.to(`conversation_${conversationId}`).emit('conversation_updated', conversation);
  Object.values(activeConnections).forEach((userId) => {
    const activeUser = activeUsers.get(userId);
    if (activeUser?.role === 'admin') {
      io.to(activeUser.socketId).emit('conversation_updated', conversation);
    }
  });
  io.to(`user_${conversation.participantId}`).emit('conversation_updated', conversation);
};

const canSocketAccessConversation = (socket, conversation) => {
  if (socket.userRole === 'admin') return true;
  return conversation.participantId === socket.userId;
};

export const initializeChatSocket = (io) => {
  io.on('connection', async (socket) => {
    logger.info(`Socket connected: ${socket.id}`);

    socket.on('authenticate', async (token) => {
      try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        const user = await User.findByPk(decoded.userId, { attributes: userAttrs });
        if (!user) { socket.emit('auth_error', { message: 'User not found' }); socket.disconnect(); return; }

        socket.userId = user.id;
        socket.userRole = user.role;
        socket.userName = user.fullName;
        socket.userEmail = user.email;

        activeUsers.set(user.id, { socketId: socket.id, role: user.role, name: user.fullName, email: user.email });
        activeConnections[socket.id] = user.id;
        socket.join(`user_${user.id}`);
        if (user.role === 'admin') socket.join('admins');

        socket.emit('auth_success', { message: 'Authenticated successfully' });
        logger.info(`User ${user.id} authenticated via socket`);
      } catch (err) {
        logger.error('Socket auth error:', err.message);
        socket.emit('auth_error', { message: 'Invalid token' });
        socket.disconnect();
      }
    });

    socket.on('join_conversation', async (conversationId) => {
      try {
        if (!socket.userId) { socket.emit('error', { message: 'Not authenticated' }); return; }
        const conversation = await Conversation.findByPk(conversationId);
        if (!conversation) { socket.emit('error', { message: 'Conversation not found' }); return; }
        if (!canSocketAccessConversation(socket, conversation)) {
          socket.emit('error', { message: 'Access denied' }); return;
        }
        socket.conversationId = conversationId;
        socket.join(`conversation_${conversationId}`);
        socket.to(`conversation_${conversationId}`).emit('user_joined', {
          userId: socket.userId, userName: socket.userName, conversationId,
        });
      } catch (err) {
        logger.error('join_conversation error:', err.message);
        socket.emit('error', { message: 'Failed to join conversation' });
      }
    });

    socket.on('leave_conversation', (conversationId) => {
      if (!socket.userId) return;
      socket.leave(`conversation_${conversationId}`);
      if (socket.conversationId === conversationId) socket.conversationId = null;
      socket.to(`conversation_${conversationId}`).emit('user_left', { userId: socket.userId, userName: socket.userName });
    });

    socket.on('send_message', async (data) => {
      try {
        if (!checkSocketRateLimit(socket.id, 'send_message')) {
          socket.emit('error', { message: 'Too many messages. Please slow down.' }); return;
        }

        const { conversationId, message, attachments } = data;

        if (!socket.userId || !socket.conversationId) { socket.emit('error', { message: 'Not authenticated or not in a conversation' }); return; }
        if (conversationId !== socket.conversationId) { socket.emit('error', { message: 'Invalid conversation' }); return; }
        if (!message?.trim()) { socket.emit('error', { message: 'Message cannot be empty' }); return; }
        if (message.trim().length > MAX_MESSAGE_LENGTH) { socket.emit('error', { message: `Message too long (max ${MAX_MESSAGE_LENGTH} chars)` }); return; }
        if (attachments && (!Array.isArray(attachments) || attachments.length > MAX_ATTACHMENTS)) {
          socket.emit('error', { message: `Max ${MAX_ATTACHMENTS} attachments` }); return;
        }

        const conversation = await Conversation.findByPk(conversationId);
        if (!conversation) { socket.emit('error', { message: 'Conversation not found' }); return; }
        if (!canSocketAccessConversation(socket, conversation)) { socket.emit('error', { message: 'Access denied' }); return; }

        const newMessage = await Message.create({
          conversationId,
          senderId: socket.userId,
          senderRole: socket.userRole,
          message: message.trim(),
          attachments: attachments || [],
        });

        await newMessage.reload({ include: [{ model: User, as: 'sender', attributes: userAttrs }] });

        await conversation.update({
          lastMessage: message.trim(),
          lastMessageTime: new Date(),
          ...(socket.userRole === 'user' && { adminUnread: conversation.adminUnread + 1 }),
          ...(socket.userRole === 'admin' && { participantUnread: conversation.participantUnread + 1 }),
        });

        await emitConversationUpdate(io, conversationId);

        io.to(`conversation_${conversationId}`).emit('receive_message', {
          id: newMessage.id, conversationId,
          sender: newMessage.sender, senderRole: newMessage.senderRole,
          message: newMessage.message, attachments: newMessage.attachments,
          createdAt: newMessage.createdAt, isRead: newMessage.isRead,
        });

        if (socket.userRole === 'user') {
          io.to('admins').emit('new_message_notification', {
            conversationId, message: message.substring(0, 50), sender: socket.userName,
          });
        }
      } catch (err) {
        logger.error('send_message error:', err.message);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    socket.on('edit_message', async (data) => {
      try {
        if (!checkSocketRateLimit(socket.id, 'edit_message')) { socket.emit('error', { message: 'Too many edits.' }); return; }
        const { messageId, newMessage } = data;
        if (!newMessage?.trim()) { socket.emit('error', { message: 'Message cannot be empty' }); return; }
        if (newMessage.trim().length > MAX_MESSAGE_LENGTH) { socket.emit('error', { message: 'Message too long' }); return; }
        if (!socket.userId) { socket.emit('error', { message: 'Not authenticated' }); return; }

        const msg = await Message.findByPk(messageId);
        if (!msg) { socket.emit('error', { message: 'Message not found' }); return; }
        if (msg.senderId !== socket.userId) { socket.emit('error', { message: 'You can only edit your own messages' }); return; }

        await msg.update({ message: newMessage.trim(), editedAt: new Date() });
        io.to(`conversation_${msg.conversationId}`).emit('message_edited', {
          messageId: msg.id, newMessage: msg.message, editedAt: msg.editedAt,
        });
      } catch (err) {
        logger.error('edit_message error:', err.message);
        socket.emit('error', { message: 'Failed to edit message' });
      }
    });

    socket.on('delete_message', async (data) => {
      try {
        if (!checkSocketRateLimit(socket.id, 'delete_message')) { socket.emit('error', { message: 'Too many deletions.' }); return; }
        const { messageId, conversationId } = data;
        if (!socket.userId) { socket.emit('error', { message: 'Not authenticated' }); return; }

        const msg = await Message.findByPk(messageId);
        if (!msg) { socket.emit('error', { message: 'Message not found' }); return; }
        if (msg.senderId !== socket.userId) { socket.emit('error', { message: 'You can only delete your own messages' }); return; }

        await msg.update({ isDeleted: true });
        io.to(`conversation_${conversationId}`).emit('message_deleted', { messageId });
      } catch (err) {
        logger.error('delete_message error:', err.message);
        socket.emit('error', { message: 'Failed to delete message' });
      }
    });

    socket.on('user_typing', (data) => {
      if (!checkSocketRateLimit(socket.id, 'user_typing') || !socket.userId) return;
      socket.to(`conversation_${data.conversationId}`).emit('user_typing', {
        userId: socket.userId, userName: socket.userName, conversationId: data.conversationId,
      });
    });

    socket.on('stop_typing', (data) => {
      if (!socket.userId) return;
      socket.to(`conversation_${data.conversationId}`).emit('stop_typing', {
        userId: socket.userId, conversationId: data.conversationId,
      });
    });

    socket.on('mark_read', async (data) => {
      try {
        if (!checkSocketRateLimit(socket.id, 'mark_read') || !socket.userId) return;
        const { conversationId } = data;

        await Message.update(
          { isRead: true, readAt: new Date() },
          { where: { conversationId, isRead: false, senderId: { [Op.ne]: socket.userId } } }
        );

        await Conversation.update(
          socket.userRole === 'admin' ? { adminUnread: 0 } : { participantUnread: 0 },
          { where: { id: conversationId } }
        );

        await emitConversationUpdate(io, conversationId);
        io.to(`conversation_${conversationId}`).emit('messages_marked_read', { conversationId, userId: socket.userId });
      } catch (err) {
        logger.error('mark_read error:', err.message);
        socket.emit('error', { message: 'Failed to mark messages as read' });
      }
    });

    socket.on('get_online_users', (conversationId) => {
      const room = io.sockets.adapter.rooms.get(`conversation_${conversationId}`);
      const onlineUsers = [];
      if (room) {
        room.forEach((socketId) => {
          const userId = activeConnections[socketId];
          if (userId && activeUsers.has(userId)) {
            const u = activeUsers.get(userId);
            onlineUsers.push({ userId, userName: u.name, isOnline: true });
          }
        });
      }
      socket.emit('online_users', onlineUsers);
    });

    socket.on('disconnect', () => {
      if (socket.userId) activeUsers.delete(socket.userId);
      delete activeConnections[socket.id];
      socketRateLimits.delete(socket.id);
      if (socket.conversationId) {
        socket.to(`conversation_${socket.conversationId}`).emit('user_left', {
          userId: socket.userId, userName: socket.userName,
        });
      }
      logger.info(`Socket disconnected: ${socket.userId}`);
    });

    socket.on('error', (err) => logger.error('Socket error:', err));
  });

  return { activeUsers, activeConnections };
};

export { activeUsers, activeConnections };
