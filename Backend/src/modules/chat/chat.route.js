import express from 'express';
import * as chatController from './chat.controller.js';
import { VerifyUser } from '../../middleware/auth.middleware.js';
import { upload } from '../../middleware/upload.js';
import mongoose from 'mongoose';

const router = express.Router();

// Protect all routes
router.use(VerifyUser);

// =========================
// Helper middleware: validate chatId param
// =========================
const validateChatId = (req, res, next) => {
  const chatId = req.params.chatId || req.body.chatId;
  if (chatId && !mongoose.Types.ObjectId.isValid(chatId)) {
    return res.status(400).json({ message: 'Invalid chatId' });
  }
  next();
};

// =========================
// USER ROUTES
// =========================
router.post('/', chatController.createChat);
router.get('/', chatController.getMyChats);
router.get('/:chatId/messages', validateChatId, chatController.getChatMessages);
router.post('/:chatId/message', validateChatId, chatController.sendMessage);
router.post(
  '/:chatId/upload',
  validateChatId,
  upload.single('image'),
  chatController.uploadChatFile
);

// =========================
// ADMIN ROUTES
// Place admin routes before :chatId routes to avoid conflicts
// =========================
router.get('/admin/all', chatController.getAllChats);

export default router;
