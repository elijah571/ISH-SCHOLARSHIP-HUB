import jwt from 'jsonwebtoken';
import { Conversation, Message } from '../models/chat.model.js';
import { User } from '../models/user.model.js';
import { logger } from '../utils/logger.js';

// Store active connections: { userId: { socketId, role, conversationId } }
const activeUsers = new Map();
const activeConnections = {};

const emitConversationUpdate = async (io, conversationId) => {
  const conversation = await Conversation.findById(conversationId)
    .populate('participant', 'fullName email avatar role')
    .populate('admin', 'fullName email avatar role')
    .lean();

  if (!conversation) {
    return;
  }

  io.to(`conversation_${conversationId}`).emit('conversation_updated', conversation);

  Object.values(activeConnections).forEach((userId) => {
    const activeUser = activeUsers.get(userId);
    if (activeUser?.role === 'admin') {
      io.to(activeUser.socketId).emit('conversation_updated', conversation);
    }
  });

  io.to(`user_${conversation.participant._id.toString()}`).emit('conversation_updated', conversation);
};

const canSocketAccessConversation = (socket, conversation) => {
  if (socket.userRole === 'admin') {
    return true;
  }

  return conversation.participant.toString() === socket.userId;
};

export const initializeChatSocket = (io) => {
  io.on('connection', async (socket) => {
    logger.info(`User connected with socket ID: ${socket.id}`);

    // Authenticate user
    socket.on('authenticate', async (token) => {
      try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        const user = await User.findById(decoded.userId).select('_id fullName email role');

        if (!user) {
          socket.emit('auth_error', { message: 'User not found' });
          socket.disconnect();
          return;
        }

        socket.userId = user._id.toString();
        socket.userRole = user.role;
        socket.userName = user.fullName;
        socket.userEmail = user.email;

        activeUsers.set(socket.userId, {
          socketId: socket.id,
          role: socket.userRole,
          name: socket.userName,
          email: socket.userEmail,
        });

        activeConnections[socket.id] = socket.userId;
        socket.join(`user_${socket.userId}`);
        if (socket.userRole === 'admin') {
          socket.join('admins');
        }

        socket.emit('auth_success', { message: 'Authenticated successfully' });
        logger.info(`User ${socket.userId} authenticated`);
      } catch (error) {
        logger.error('Authentication error:', error);
        socket.emit('auth_error', { message: 'Invalid token' });
        socket.disconnect();
      }
    });

    // Join conversation room
    socket.on('join_conversation', async (conversationId) => {
      try {
        if (!socket.userId) {
          socket.emit('error', { message: 'Not authenticated' });
          return;
        }

        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
          socket.emit('error', { message: 'Conversation not found' });
          return;
        }

        // Verify user is part of conversation
        if (!canSocketAccessConversation(socket, conversation)) {
          socket.emit('error', { message: 'You do not have access to this conversation' });
          return;
        }

        socket.conversationId = conversationId;
        socket.join(`conversation_${conversationId}`);

        // Notify others in conversation
        socket.to(`conversation_${conversationId}`).emit('user_joined', {
          userId: socket.userId,
          userName: socket.userName,
          conversationId,
        });

        logger.info(`User ${socket.userId} joined conversation ${conversationId}`);
      } catch (error) {
        logger.error('Error joining conversation:', error);
        socket.emit('error', { message: 'Failed to join conversation' });
      }
    });

    // Leave conversation room
    socket.on('leave_conversation', (conversationId) => {
      try {
        if (!socket.userId) return;
        socket.leave(`conversation_${conversationId}`);
        if (socket.conversationId === conversationId) {
          socket.conversationId = null;
        }

        socket.to(`conversation_${conversationId}`).emit('user_left', {
          userId: socket.userId,
          userName: socket.userName,
        });

        logger.info(`User ${socket.userId} left conversation ${conversationId}`);
      } catch (error) {
        logger.error('Error leaving conversation:', error);
      }
    });

    // Send message
    socket.on('send_message', async (data) => {
      try {
        const { conversationId, message, attachments } = data;

        if (!socket.userId || !socket.conversationId) {
          socket.emit('error', { message: 'Not authenticated or not in a conversation' });
          return;
        }

        if (conversationId !== socket.conversationId) {
          socket.emit('error', { message: 'Invalid conversation' });
          return;
        }

        if (!message || message.trim().length === 0) {
          socket.emit('error', { message: 'Message cannot be empty' });
          return;
        }

        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
          socket.emit('error', { message: 'Conversation not found' });
          return;
        }

        if (!canSocketAccessConversation(socket, conversation)) {
          socket.emit('error', { message: 'You do not have access to this conversation' });
          return;
        }

        // Save message to database
        const newMessage = await Message.create({
          conversation: conversationId,
          sender: socket.userId,
          senderRole: socket.userRole,
          message: message.trim(),
          attachments: attachments || [],
        });

        // Populate sender details
        await newMessage.populate('sender', 'fullName email avatar role');

        // Update conversation
        await Conversation.findByIdAndUpdate(
          conversationId,
          {
            lastMessage: message.trim(),
            lastMessageTime: new Date(),
            ...(socket.userRole === 'user' && { adminUnread: conversation.adminUnread + 1 }),
            ...(socket.userRole === 'admin' && {
              participantUnread: conversation.participantUnread + 1,
            }),
          },
          { new: true }
        );

        await emitConversationUpdate(io, conversationId);

        // Broadcast message to conversation room
        io.to(`conversation_${conversationId}`).emit('receive_message', {
          _id: newMessage._id,
          conversationId,
          sender: newMessage.sender,
          senderRole: newMessage.senderRole,
          message: newMessage.message,
          attachments: newMessage.attachments,
          createdAt: newMessage.createdAt,
          isRead: newMessage.isRead,
        });

        // Notify admin about new message if it's from user
        if (socket.userRole === 'user') {
          io.to('admins').emit('new_message_notification', {
            conversationId,
            message: message.substring(0, 50),
            sender: socket.userName,
          });
        }

        logger.info(`Message sent in conversation ${conversationId}`);
      } catch (error) {
        logger.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Edit message
    socket.on('edit_message', async (data) => {
      try {
        const { messageId, newMessage } = data;

        if (!socket.userId) {
          socket.emit('error', { message: 'Not authenticated' });
          return;
        }

        const message = await Message.findById(messageId);

        if (!message) {
          socket.emit('error', { message: 'Message not found' });
          return;
        }

        if (message.sender.toString() !== socket.userId) {
          socket.emit('error', { message: 'You can only edit your own messages' });
          return;
        }

        message.message = newMessage.trim();
        message.editedAt = new Date();
        await message.save();
        await message.populate('sender', 'fullName email avatar role');

        io.to(`conversation_${message.conversation}`).emit('message_edited', {
          messageId: message._id,
          newMessage: message.message,
          editedAt: message.editedAt,
        });

        logger.info(`Message ${messageId} edited`);
      } catch (error) {
        logger.error('Error editing message:', error);
        socket.emit('error', { message: 'Failed to edit message' });
      }
    });

    // Delete message
    socket.on('delete_message', async (data) => {
      try {
        const { messageId, conversationId } = data;

        if (!socket.userId) {
          socket.emit('error', { message: 'Not authenticated' });
          return;
        }

        const message = await Message.findById(messageId);

        if (!message) {
          socket.emit('error', { message: 'Message not found' });
          return;
        }

        if (message.sender.toString() !== socket.userId) {
          socket.emit('error', { message: 'You can only delete your own messages' });
          return;
        }

        message.isDeleted = true;
        await message.save();

        io.to(`conversation_${conversationId}`).emit('message_deleted', {
          messageId: message._id,
        });

        logger.info(`Message ${messageId} deleted`);
      } catch (error) {
        logger.error('Error deleting message:', error);
        socket.emit('error', { message: 'Failed to delete message' });
      }
    });

    // User is typing
    socket.on('user_typing', async (data) => {
      try {
        const { conversationId } = data;

        if (!socket.userId) {
          socket.emit('error', { message: 'Not authenticated' });
          return;
        }

        socket.to(`conversation_${conversationId}`).emit('user_typing', {
          userId: socket.userId,
          userName: socket.userName,
          conversationId,
        });
      } catch (error) {
        logger.error('Error in user_typing:', error);
      }
    });

    // User stopped typing
    socket.on('stop_typing', async (data) => {
      try {
        const { conversationId } = data;

        if (!socket.userId) {
          socket.emit('error', { message: 'Not authenticated' });
          return;
        }

        socket.to(`conversation_${conversationId}`).emit('stop_typing', {
          userId: socket.userId,
          conversationId,
        });
      } catch (error) {
        logger.error('Error in stop_typing:', error);
      }
    });

    // Mark messages as read
    socket.on('mark_read', async (data) => {
      try {
        const { conversationId } = data;

        if (!socket.userId) {
          socket.emit('error', { message: 'Not authenticated' });
          return;
        }

        const messages = await Message.updateMany(
          {
            conversation: conversationId,
            isRead: false,
            sender: { $ne: socket.userId },
          },
          {
            isRead: true,
            readAt: new Date(),
          }
        );

        // Update conversation unread count
        if (socket.userRole === 'admin') {
          await Conversation.findByIdAndUpdate(conversationId, { adminUnread: 0 });
        } else {
          await Conversation.findByIdAndUpdate(conversationId, { participantUnread: 0 });
        }

        await emitConversationUpdate(io, conversationId);

        io.to(`conversation_${conversationId}`).emit('messages_marked_read', {
          conversationId,
          userId: socket.userId,
        });

        logger.info(`Messages in conversation ${conversationId} marked as read`);
      } catch (error) {
        logger.error('Error marking messages as read:', error);
        socket.emit('error', { message: 'Failed to mark messages as read' });
      }
    });

    // Get online users in conversation
    socket.on('get_online_users', (conversationId) => {
      const room = io.sockets.adapter.rooms.get(`conversation_${conversationId}`);
      const onlineUsers = [];

      if (room) {
        room.forEach((socketId) => {
          const userId = activeConnections[socketId];
          if (userId && activeUsers.has(userId)) {
            const user = activeUsers.get(userId);
            onlineUsers.push({
              userId,
              userName: user.name,
              isOnline: true,
            });
          }
        });
      }

      socket.emit('online_users', onlineUsers);
    });

    // Disconnect
    socket.on('disconnect', () => {
      if (socket.userId) {
        activeUsers.delete(socket.userId);
      }
      delete activeConnections[socket.id];

      if (socket.conversationId) {
        socket.to(`conversation_${socket.conversationId}`).emit('user_left', {
          userId: socket.userId,
          userName: socket.userName,
        });
      }

      logger.info(`User ${socket.userId} disconnected`);
    });

    // Error handling
    socket.on('error', (error) => {
      logger.error('Socket error:', error);
    });
  });

  return { activeUsers, activeConnections };
};

export { activeUsers, activeConnections };
