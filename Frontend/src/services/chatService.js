import api from './api';

const chatService = {
  createOrGetConversation: (adminId, subject) =>
    api.post('/api/chat/conversations', { adminId, subject }),

  getAdminConversations: (page = 1, limit = 20) =>
    api.get('/api/chat/conversations/admin', { params: { page, limit } }),

  getUserConversations: (page = 1, limit = 20) =>
    api.get('/api/chat/conversations/user', { params: { page, limit } }),

  getConversation: (conversationId) =>
    api.get(`/api/chat/conversations/${conversationId}`),

  closeConversation: (conversationId) =>
    api.patch(`/api/chat/conversations/${conversationId}/close`),

  searchConversations: (query) =>
    api.get('/api/chat/conversations/search', { params: { query } }),

  getMessages: (conversationId, page = 1, limit = 50) =>
    api.get(`/api/chat/conversations/${conversationId}/messages`, {
      params: { page, limit },
    }),
    
  sendMessage: (conversationId, message, attachments = []) =>
    api.post('/api/chat/messages', {
      conversationId,
      message,
      attachments,
    }),

  editMessage: (messageId, message) =>
    api.patch(`/api/chat/messages/${messageId}`, { message }),

  deleteMessage: (messageId) => api.delete(`/api/chat/messages/${messageId}`),

  markAsRead: (conversationId) =>
    api.patch(`/api/chat/conversations/${conversationId}/read`),

  getAdminStats: () => api.get('/api/chat/stats'),
};

export default chatService;
