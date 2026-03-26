import express from 'express';
import { VerifyUser } from '../../middleware/auth.middleware.js';
import {
  createOrGetConversationCtrl,
  getAdminConversationsCtrl,
  getUserConversationsCtrl,
  getConversationCtrl,
  getMessagesCtrl,
  sendMessageCtrl,
  markAsReadCtrl,
  editMessageCtrl,
  deleteMessageCtrl,
  closeConversationCtrl,
  getAdminChatStatsCtrl,
  searchConversationsCtrl,
} from './chat.controller.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(VerifyUser);

// Conversation routes
router.post('/conversations', createOrGetConversationCtrl);
router.get('/conversations/admin', getAdminConversationsCtrl);
router.get('/conversations/user', getUserConversationsCtrl);
router.get('/conversations/search', searchConversationsCtrl);
router.get('/conversations/:conversationId', getConversationCtrl);
router.patch('/conversations/:conversationId/close', closeConversationCtrl);

// Message routes
router.get('/conversations/:conversationId/messages', getMessagesCtrl);
router.post('/messages', sendMessageCtrl);
router.patch('/messages/:messageId', editMessageCtrl);
router.delete('/messages/:messageId', deleteMessageCtrl);
router.patch('/conversations/:conversationId/read', markAsReadCtrl);

// Admin stats
router.get('/stats', getAdminChatStatsCtrl);

export default router;
