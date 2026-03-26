import { Chat } from './chat.model.js';
import { Message } from './message.model.js';
import mongoose from 'mongoose';

// =========================
// GET OR CREATE CHAT
// =========================
export const getOrCreateChat = async (userId) => {
  const userIdObj = new mongoose.Types.ObjectId(userId);

  let chat = await Chat.findOne({ user: userIdObj, status: 'open' });
  if (!chat) {
    chat = await Chat.create({ user: userIdObj });
  }

  return chat;
};

// =========================
// GET USER CHATS
// =========================
export const getUserChats = async (userId) => {
  const userIdObj = new mongoose.Types.ObjectId(userId);
  return Chat.find({ user: userIdObj })
    .populate('admin', 'fullName email role')
    .sort({ updatedAt: -1 })
    .lean();
};

// =========================
// GET ALL CHATS
// =========================
export const getAllChats = async () => {
  return Chat.find().populate('user admin', 'fullName email role').sort({ updatedAt: -1 }).lean();
};

// =========================
// GET MESSAGES
// =========================
export const getMessages = async (chatId, userId, page = 1, limit = 50) => {
  const skip = (page - 1) * limit;
  const userIdObj = new mongoose.Types.ObjectId(userId);

  const messages = await Message.find({ chat: chatId })
    .sort({ createdAt: 1 })
    .skip(skip)
    .limit(limit)
    .populate('sender', 'fullName email role')
    .lean();

  // Mark unread messages as read
  await Message.updateMany(
    { chat: chatId, read: false, sender: { $ne: userIdObj } },
    { $set: { read: true } }
  );

  // Reset unread counts in chat
  const chat = await Chat.findById(chatId);
  if (chat) {
    if (chat.user.equals(userIdObj)) chat.unreadCounts.user = 0;
    else if (chat.admin?.equals(userIdObj)) chat.unreadCounts.admin = 0;
    await chat.save();
  }

  return messages;
};

// =========================
// CREATE MESSAGE
// =========================
export const createMessage = async ({
  chatId,
  senderId,
  senderType,
  message,
  messageType = 'text',
  fileUrl,
}) => {
  const senderIdObj = new mongoose.Types.ObjectId(senderId);

  const newMessage = await Message.create({
    chat: chatId,
    sender: senderIdObj,
    senderType,
    message,
    messageType,
    fileUrl,
  });

  // Increment unread counts
  const update = {
    lastMessage: message || messageType,
    lastMessageAt: new Date(),
    $inc: senderType === 'admin' ? { 'unreadCounts.user': 1 } : { 'unreadCounts.admin': 1 },
  };

  await Chat.findByIdAndUpdate(chatId, update);

  return newMessage;
};
