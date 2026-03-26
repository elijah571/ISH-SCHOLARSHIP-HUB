// src/services/chatService.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const chatService = {
  // Conversation endpoints
  createOrGetConversation: (adminId, subject) =>
    axios.post(`${API_BASE_URL}/chat/conversations`, { adminId, subject }),

  getAdminConversations: (page = 1, limit = 20) =>
    axios.get(`${API_BASE_URL}/chat/conversations/admin`, { params: { page, limit } }),

  getUserConversations: (page = 1, limit = 20) =>
    axios.get(`${API_BASE_URL}/chat/conversations/user`, { params: { page, limit } }),

  getConversation: (conversationId) =>
    axios.get(`${API_BASE_URL}/chat/conversations/${conversationId}`),

  closeConversation: (conversationId) =>
    axios.patch(`${API_BASE_URL}/chat/conversations/${conversationId}/close`),

  searchConversations: (query) =>
    axios.get(`${API_BASE_URL}/chat/conversations/search`, { params: { query } }),

  // Message endpoints
  getMessages: (conversationId, page = 1, limit = 50) =>
    axios.get(`${API_BASE_URL}/chat/conversations/${conversationId}/messages`, {
      params: { page, limit },
    }),

  sendMessage: (conversationId, message, attachments = []) =>
    axios.post(`${API_BASE_URL}/chat/messages`, {
      conversationId,
      message,
      attachments,
    }),

  editMessage: (messageId, message) =>
    axios.patch(`${API_BASE_URL}/chat/messages/${messageId}`, { message }),

  deleteMessage: (messageId) => axios.delete(`${API_BASE_URL}/chat/messages/${messageId}`),

  markAsRead: (conversationId) =>
    axios.patch(`${API_BASE_URL}/chat/conversations/${conversationId}/read`),

  // Admin stats
  getAdminStats: () => axios.get(`${API_BASE_URL}/chat/stats`),
};

export default chatService;
