import { chatRepo } from './chat.repository.js';
import { AppError } from '../../utils/AppError.js';
import { logger } from '../../utils/logger.js';

export const createOrGetConversation = async (participantId, adminId, subject = 'Admin Support') => {
  let conversation = await chatRepo.findActiveConversationByParticipant(participantId);
  if (!conversation) {
    conversation = await chatRepo.createConversation({ participantId, adminId, subject });
  }
  return conversation;
};

export const getAdminConversations = async (page = 1, limit = 20) => {
  const { conversations, total } = await chatRepo.getAdminConversations(page, limit);
  return {
    conversations,
    pagination: {
      currentPage: page, totalPages: Math.ceil(total / limit), total,
      hasMore: (page - 1) * limit + conversations.length < total,
    },
  };
};

export const getUserConversations = async (userId, page = 1, limit = 20) => {
  const { conversations, total } = await chatRepo.getUserConversations(userId, page, limit);
  return {
    conversations,
    pagination: {
      currentPage: page, totalPages: Math.ceil(total / limit), total,
      hasMore: (page - 1) * limit + conversations.length < total,
    },
  };
};

export const getConversationById = async (conversationId) => {
  const conversation = await chatRepo.findConversationById(conversationId);
  if (!conversation) throw new AppError('Conversation not found', 404);
  return conversation;
};

export const getMessages = async (conversationId, page = 1, limit = 50) => {
  const { messages, total } = await chatRepo.getMessages(conversationId, page, limit);
  return {
    messages,
    pagination: {
      currentPage: page, totalPages: Math.ceil(total / limit), total,
      hasMore: (page - 1) * limit + messages.length < total,
    },
  };
};

export const sendMessage = async (conversationId, senderId, senderRole, message, attachments = []) => {
  const conversation = await chatRepo.findConversationById(conversationId);
  if (!conversation) throw new AppError('Conversation not found', 404);

  const newMessage = await chatRepo.createMessage({
    conversationId, senderId, senderRole, message, attachments,
  });

  await chatRepo.updateConversation(conversationId, {
    lastMessage: message,
    lastMessageTime: new Date(),
    status: 'active',
    isActive: true,
    ...(senderRole === 'user' && { adminUnread: conversation.adminUnread + 1 }),
    ...(senderRole === 'admin' && { participantUnread: conversation.participantUnread + 1 }),
  });

  return newMessage;
};

export const markMessagesAsRead = async (conversationId, userId, userRole) => {
  await chatRepo.markMessagesRead(conversationId, userId);
  await chatRepo.updateConversation(conversationId, userRole === 'admin' ? { adminUnread: 0 } : { participantUnread: 0 });
};

export const editMessage = async (messageId, newMessage, userId) => {
  const msg = await chatRepo.findMessageById(messageId);
  if (!msg) throw new AppError('Message not found', 404);
  if (msg.senderId !== userId) throw new AppError('You can only edit your own messages', 403);

  return chatRepo.updateMessage(messageId, { message: newMessage, editedAt: new Date() });
};

export const deleteMessage = async (messageId, userId) => {
  const msg = await chatRepo.findMessageById(messageId);
  if (!msg) throw new AppError('Message not found', 404);
  if (msg.senderId !== userId) throw new AppError('You can only delete your own messages', 403);

  return chatRepo.updateMessage(messageId, { isDeleted: true });
};

export const closeConversation = async (conversationId, userId) => {
  const conversation = await chatRepo.findConversationById(conversationId);
  if (!conversation) throw new AppError('Conversation not found', 404);
  if (conversation.adminId !== userId) throw new AppError('Only admin can close this conversation', 403);

  return chatRepo.updateConversation(conversationId, { status: 'closed', isActive: false });
};

export const getAdminChatStats = async () => {
  const [activeConversations, totalMessages, unreadMessages, closedConversations] = await Promise.all([
    chatRepo.countActive(), chatRepo.countMessages(), chatRepo.countUnread(), chatRepo.countClosed(),
  ]);
  return { activeConversations, totalMessages, unreadMessages, closedConversations };
};

export const searchConversations = (query) => chatRepo.searchConversations(query);
