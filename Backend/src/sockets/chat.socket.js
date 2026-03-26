import { Message } from '../modules/chat/message.model.js';
import { Chat } from '../modules/chat/chat.model.js';
import { verifySocketUser } from '../middleware/socketAuth.js';
import mongoose from 'mongoose';

export const chatSocket = (io) => {
  const onlineUsers = new Map(); // userId => Set(socketIds)

  io.use(verifySocketUser);

  io.on('connection', (socket) => {
    const userIdObj = new mongoose.Types.ObjectId(socket.user._id);

    // ✅ Track all socket connections for this user
    const userIdStr = socket.user._id.toString();
    if (!onlineUsers.has(userIdStr)) onlineUsers.set(userIdStr, new Set());
    onlineUsers.get(userIdStr).add(socket.id);

    if (onlineUsers.get(userIdStr).size === 1) {
      socket.broadcast.emit('user_online', { userId: userIdStr });
      console.log('🟢 User online:', userIdStr);
    }

    socket.emit('online_users', { users: Array.from(onlineUsers.keys()) });

    // =========================
    // JOIN CHAT
    // =========================
    socket.on('join_chat', async ({ chatId }) => {
      try {
        if (!chatId) return;

        let chat = await Chat.findById(chatId).select('user admin status');
        if (!chat) return socket.emit('error', 'Chat not found');

        // Auto-assign admin if empty
        if (!chat.admin && socket.user.role === 'admin') {
          await Chat.findByIdAndUpdate(chatId, { admin: userIdObj });
          chat = await Chat.findById(chatId);
        }

        const isUser = chat.user.equals(userIdObj);
        const isAdmin = chat.admin?.equals(userIdObj);
        if (!isUser && !isAdmin) return;

        if (chat.status === 'closed') return socket.emit('error', 'Chat is closed');

        socket.join(`chat_${chatId}`);
      } catch (err) {
        console.error('join_chat error:', err);
      }
    });

    // =========================
    // SEND MESSAGE (TEXT OR FILE)
    // =========================
    socket.on('send_message', async (data, callback) => {
      try {
        const { chatId, message, messageType = 'text', fileUrl } = data;
        if (!chatId || (!message && !fileUrl)) return callback?.({ error: 'Invalid data' });

        const chat = await Chat.findById(chatId).select('user admin status');
        if (!chat) return callback?.({ error: 'Chat not found' });
        if (chat.status === 'closed') return callback?.({ error: 'Chat is closed' });

        const isUser = chat.user.equals(userIdObj);
        const isAdmin = chat.admin?.equals(userIdObj);
        if (!isUser && !isAdmin) return callback?.({ error: 'Unauthorized' });

        const allowedTypes = ['text', 'image', 'file'];
        const safeMessageType = allowedTypes.includes(messageType) ? messageType : 'text';

        const normalizedFileUrl = fileUrl?.secure_url
          ? { url: fileUrl.secure_url, publicId: fileUrl.public_id }
          : undefined;

        const savedMessage = await Message.create({
          chat: chatId,
          sender: userIdObj,
          senderType: socket.user.role,
          message,
          messageType: safeMessageType,
          fileUrl: normalizedFileUrl,
        });

        const isSenderAdmin = socket.user.role === 'admin';
        await Chat.findByIdAndUpdate(chatId, {
          lastMessage: message || safeMessageType,
          lastMessageAt: new Date(),
          $inc: {
            'unreadCounts.user': isSenderAdmin ? 1 : 0,
            'unreadCounts.admin': isSenderAdmin ? 0 : 1,
          },
        });

        io.to(`chat_${chatId}`).emit('receive_message', savedMessage);
        callback?.({ success: true, message: savedMessage });
      } catch (err) {
        console.error('send_message error:', err);
        callback?.({ error: 'Message failed' });
      }
    });

    // =========================
    // MARK AS READ
    // =========================
    socket.on('mark_read', async ({ chatId }) => {
      try {
        if (!chatId) return;
        const chat = await Chat.findById(chatId);
        if (!chat) return;

        const isUser = chat.user.equals(userIdObj);
        const isAdmin = chat.admin?.equals(userIdObj);
        if (!isUser && !isAdmin) return;

        const update =
          socket.user.role === 'admin' ? { 'unreadCounts.admin': 0 } : { 'unreadCounts.user': 0 };
        await Chat.findByIdAndUpdate(chatId, update);

        await Message.updateMany(
          { chat: chatId, read: false, sender: { $ne: userIdObj } },
          { $set: { read: true } }
        );
      } catch (err) {
        console.error('mark_read error:', err);
      }
    });

    // =========================
    // TYPING INDICATOR
    // =========================
    socket.on('typing', ({ chatId }) => {
      if (!chatId) return;
      socket.to(`chat_${chatId}`).emit('typing', { user: userIdStr });
    });

    // =========================
    // CHECK ONLINE
    // =========================
    socket.on('check_online', ({ userId }, callback) => {
      callback?.({ isOnline: onlineUsers.has(userId) });
    });

    // =========================
    // DISCONNECT
    // =========================
    socket.on('disconnect', () => {
      const userSockets = onlineUsers.get(userIdStr);
      if (!userSockets) return;

      userSockets.delete(socket.id);
      if (userSockets.size === 0) {
        onlineUsers.delete(userIdStr);
        socket.broadcast.emit('user_offline', { userId: userIdStr });
        console.log('🔴 User offline:', userIdStr);
      }
    });
  });
};
