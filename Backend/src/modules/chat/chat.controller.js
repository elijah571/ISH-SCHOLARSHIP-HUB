import {
  createOrGetConversation,
  getAdminConversations,
  getUserConversations,
  getConversationById,
  getMessages,
  sendMessage,
  markMessagesAsRead,
  editMessage,
  deleteMessage,
  closeConversation,
  getAdminChatStats,
  searchConversations,
} from './chat.service.js';
import { User } from '../../database/models/index.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { AppError } from '../../utils/AppError.js';

const canAccessConversation = (user, conversation) => {
  if (user.role === 'admin') return true;
  return conversation.participantId === user.id;
};

export const createOrGetConversationCtrl = asyncHandler(async (req, res) => {
  const { adminId, subject } = req.body;
  const userId = req.user.id;

  let assignedAdminId = adminId;

  if (!assignedAdminId) {
    const admin = await User.findOne({ where: { role: 'admin' }, attributes: ['id'] });
    if (!admin) throw new AppError('No admin available to handle your request', 400);
    assignedAdminId = admin.id;
  }

  const conversation = await createOrGetConversation(userId, assignedAdminId, subject);

  res.status(200).json({ success: true, data: conversation });
});

export const getAdminConversationsCtrl = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;

  if (req.user.role !== 'admin') throw new AppError('Only admins can access admin conversations', 403);

  const result = await getAdminConversations(parseInt(page), parseInt(limit));

  res.status(200).json({ success: true, data: result.conversations, pagination: result.pagination });
});

export const getUserConversationsCtrl = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;

  const result = await getUserConversations(req.user.id, parseInt(page), parseInt(limit));

  res.status(200).json({ success: true, data: result.conversations, pagination: result.pagination });
});

export const getConversationCtrl = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;

  const conversation = await getConversationById(conversationId);

  if (!canAccessConversation(req.user, conversation)) {
    throw new AppError('You do not have access to this conversation', 403);
  }

  await markMessagesAsRead(conversationId, req.user.id, req.user.role);

  res.status(200).json({ success: true, data: conversation });
});

export const getMessagesCtrl = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const { page = 1, limit = 50 } = req.query;

  const conversation = await getConversationById(conversationId);
  if (!canAccessConversation(req.user, conversation)) {
    throw new AppError('You do not have access to these messages', 403);
  }

  const result = await getMessages(conversationId, parseInt(page), parseInt(limit));

  res.status(200).json({ success: true, data: result.messages, pagination: result.pagination });
});

export const sendMessageCtrl = asyncHandler(async (req, res) => {
  const { conversationId, message, attachments = [] } = req.body;

  if (!conversationId) throw new AppError('Conversation ID is required', 400);
  if (!message || message.trim().length === 0) throw new AppError('Message cannot be empty', 400);

  const conversation = await getConversationById(conversationId);
  if (!canAccessConversation(req.user, conversation)) {
    throw new AppError('You do not have access to this conversation', 403);
  }

  const newMessage = await sendMessage(conversationId, req.user.id, req.user.role, message, attachments);

  res.status(201).json({ success: true, data: newMessage });
});

export const markAsReadCtrl = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;

  const conversation = await getConversationById(conversationId);
  if (!canAccessConversation(req.user, conversation)) {
    throw new AppError('You do not have access to this conversation', 403);
  }

  await markMessagesAsRead(conversationId, req.user.id, req.user.role);

  res.status(200).json({ success: true, message: 'Messages marked as read' });
});

export const editMessageCtrl = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const { message } = req.body;

  if (!message || message.trim().length === 0) throw new AppError('Message cannot be empty', 400);

  const updatedMessage = await editMessage(messageId, message, req.user.id);

  res.status(200).json({ success: true, data: updatedMessage });
});

export const deleteMessageCtrl = asyncHandler(async (req, res) => {
  const { messageId } = req.params;

  await deleteMessage(messageId, req.user.id);

  res.status(200).json({ success: true, message: 'Message deleted successfully' });
});

export const closeConversationCtrl = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;

  const closedConversation = await closeConversation(conversationId, req.user.id);

  res.status(200).json({ success: true, data: closedConversation });
});

export const getAdminChatStatsCtrl = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') throw new AppError('Only admins can access chat statistics', 403);

  const stats = await getAdminChatStats();

  res.status(200).json({ success: true, data: stats });
});

export const searchConversationsCtrl = asyncHandler(async (req, res) => {
  const { query } = req.query;

  if (!query) throw new AppError('Search query is required', 400);
  if (req.user.role !== 'admin') throw new AppError('Only admins can search conversations', 403);

  const results = await searchConversations(query);

  res.status(200).json({ success: true, data: results });
});
