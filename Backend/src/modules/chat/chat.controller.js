import * as chatService from './chat.service.js';
import { uploadsToCloudinary } from '../../config/cloudinary.js';
import mongoose from 'mongoose';

// =========================
// CREATE OR GET CHAT
// =========================
export const createChat = async (req, res, next) => {
  try {
    const userIdObj = new mongoose.Types.ObjectId(req.user.id);
    const chat = await chatService.getOrCreateChat(userIdObj);
    res.json(chat);
  } catch (err) {
    next(err);
  }
};

// =========================
// GET MY CHATS
// =========================
export const getMyChats = async (req, res, next) => {
  try {
    const userIdObj = new mongoose.Types.ObjectId(req.user.id);
    const chats = await chatService.getUserChats(userIdObj);
    res.json(chats);
  } catch (err) {
    next(err);
  }
};

// =========================
// GET ALL CHATS (ADMIN)
// =========================
export const getAllChats = async (req, res, next) => {
  try {
    const chats = await chatService.getAllChats();
    res.json(chats);
  } catch (err) {
    next(err);
  }
};

// =========================
// GET CHAT MESSAGES
// =========================
export const getChatMessages = async (req, res, next) => {
  try {
    const chatId = req.params.chatId;
    if (!chatId) return res.status(400).json({ message: 'chatId is required' });

    const userIdObj = new mongoose.Types.ObjectId(req.user.id);
    const messages = await chatService.getMessages(chatId, userIdObj);
    res.json(messages);
  } catch (err) {
    next(err);
  }
};

// =========================
// SEND MESSAGE
// =========================
export const sendMessage = async (req, res, next) => {
  try {
    const chatId = req.params.chatId;
    const { message, messageType } = req.body;
    if (!chatId || (!message && messageType !== 'image')) {
      return res.status(400).json({ message: 'Invalid data' });
    }

    const userIdObj = new mongoose.Types.ObjectId(req.user.id);
    const newMessage = await chatService.createMessage({
      chatId,
      senderId: userIdObj,
      senderType: req.user.role || 'user',
      message,
      messageType: messageType || 'text',
    });

    res.json(newMessage);
  } catch (err) {
    next(err);
  }
};

// =========================
// UPLOAD CHAT FILE
// =========================
export const uploadChatFile = async (req, res, next) => {
  try {
    const chatId = req.body.chatId || req.params.chatId;
    const file = req.file;

    if (!chatId) return res.status(400).json({ message: 'chatId is required' });
    if (!file) return res.status(400).json({ message: 'No file uploaded' });

    const uploadResult = await uploadsToCloudinary(file.buffer, 'chat');

    const userIdObj = new mongoose.Types.ObjectId(req.user.id);
    const newMessage = await chatService.createMessage({
      chatId,
      senderId: userIdObj,
      senderType: req.user.role || 'user',
      message: uploadResult.secure_url,
      messageType: 'image',
      fileUrl: { url: uploadResult.secure_url, publicId: uploadResult.public_id },
    });

    res.json(newMessage);
  } catch (err) {
    next(err);
  }
};
