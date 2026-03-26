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
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { AppError } from '../../utils/AppError.js';

// Create or get conversation
export const createOrGetConversationCtrl = asyncHandler(async (req, res) => {
  const { adminId, subject } = req.body;
  const userId = req.user._id;

  if (!adminId) {
    throw new AppError('Admin ID is required', 400);
  }

  const conversation = await createOrGetConversation(userId, adminId, subject);

  res.status(200).json({
    success: true,
    data: conversation,
  });
});

// Get all conversations for admin
export const getAdminConversationsCtrl = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const adminId = req.user._id;

  if (req.user.role !== 'admin') {
    throw new AppError('Only admins can access admin conversations', 403);
  }

  const result = await getAdminConversations(adminId, parseInt(page), parseInt(limit));

  res.status(200).json({
    success: true,
    data: result.conversations,
    pagination: result.pagination,
  });
});

// Get all conversations for user
export const getUserConversationsCtrl = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const userId = req.user._id;

  const result = await getUserConversations(userId, parseInt(page), parseInt(limit));

  res.status(200).json({
    success: true,
    data: result.conversations,
    pagination: result.pagination,
  });
});

// Get conversation by ID
export const getConversationCtrl = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const userId = req.user._id;

  const conversation = await getConversationById(conversationId);

  // Check authorization
  if (
    conversation.participant._id.toString() !== userId.toString() &&
    conversation.admin._id.toString() !== userId.toString()
  ) {
    throw new AppError('You do not have access to this conversation', 403);
  }

  // Mark messages as read
  await markMessagesAsRead(conversationId, userId);

  res.status(200).json({
    success: true,
    data: conversation,
  });
});

// Get messages for conversation
export const getMessagesCtrl = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const { page = 1, limit = 50 } = req.query;
  const userId = req.user._id;

  // Verify authorization
  const conversation = await getConversationById(conversationId);
  if (
    conversation.participant._id.toString() !== userId.toString() &&
    conversation.admin._id.toString() !== userId.toString()
  ) {
    throw new AppError('You do not have access to these messages', 403);
  }

  const result = await getMessages(conversationId, parseInt(page), parseInt(limit));

  res.status(200).json({
    success: true,
    data: result.messages,
    pagination: result.pagination,
  });
});

// Send message
export const sendMessageCtrl = asyncHandler(async (req, res) => {
  const { conversationId, message, attachments = [] } = req.body;
  const userId = req.user._id;
  const userRole = req.user.role;

  if (!conversationId) {
    throw new AppError('Conversation ID is required', 400);
  }

  if (!message || message.trim().length === 0) {
    throw new AppError('Message cannot be empty', 400);
  }

  // Verify authorization
  const conversation = await getConversationById(conversationId);
  if (
    conversation.participant._id.toString() !== userId.toString() &&
    conversation.admin._id.toString() !== userId.toString()
  ) {
    throw new AppError('You do not have access to this conversation', 403);
  }

  const newMessage = await sendMessage(conversationId, userId, userRole, message, attachments);

  res.status(201).json({
    success: true,
    data: newMessage,
  });
});

// Mark messages as read
export const markAsReadCtrl = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const userId = req.user._id;

  // Verify authorization
  const conversation = await getConversationById(conversationId);
  if (
    conversation.participant._id.toString() !== userId.toString() &&
    conversation.admin._id.toString() !== userId.toString()
  ) {
    throw new AppError('You do not have access to this conversation', 403);
  }

  await markMessagesAsRead(conversationId, userId);

  res.status(200).json({
    success: true,
    message: 'Messages marked as read',
  });
});

// Edit message
export const editMessageCtrl = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const { message } = req.body;
  const userId = req.user._id;

  if (!message || message.trim().length === 0) {
    throw new AppError('Message cannot be empty', 400);
  }

  const updatedMessage = await editMessage(messageId, message, userId);

  res.status(200).json({
    success: true,
    data: updatedMessage,
  });
});

// Delete message
export const deleteMessageCtrl = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const userId = req.user._id;

  await deleteMessage(messageId, userId);

  res.status(200).json({
    success: true,
    message: 'Message deleted successfully',
  });
});

// Close conversation
export const closeConversationCtrl = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const userId = req.user._id;

  const closedConversation = await closeConversation(conversationId, userId);

  res.status(200).json({
    success: true,
    data: closedConversation,
  });
});

// Get admin chat statistics
export const getAdminChatStatsCtrl = asyncHandler(async (req, res) => {
  const adminId = req.user._id;

  if (req.user.role !== 'admin') {
    throw new AppError('Only admins can access chat statistics', 403);
  }

  const stats = await getAdminChatStats(adminId);

  res.status(200).json({
    success: true,
    data: stats,
  });
});

// Search conversations
export const searchConversationsCtrl = asyncHandler(async (req, res) => {
  const { query } = req.query;
  const adminId = req.user._id;

  if (!query) {
    throw new AppError('Search query is required', 400);
  }

  if (req.user.role !== 'admin') {
    throw new AppError('Only admins can search conversations', 403);
  }

  const results = await searchConversations(adminId, query);

  res.status(200).json({
    success: true,
    data: results,
  });
});
