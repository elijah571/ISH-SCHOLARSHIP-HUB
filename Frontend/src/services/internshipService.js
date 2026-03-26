import api from './api';

const internshipService = {
  getAll: async ({ page = 1, limit = 10, search, type, country } = {}) => {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (search) params.append('search', search);
    if (type) params.append('type', type);
    if (country) params.append('country', country);

    const queryString = params.toString();
    const url = `/api/internship${queryString ? `?${queryString}` : ''}`;
    return api.get(url);
  },

  getById: async (id) => {
    return api.get(`/api/internship/${id}`);
  },

  create: async (formData) => {
    return api.post('/api/internship/create', formData);
  },

  update: async (id, formData) => {
    return api.patch(`/api/internship/${id}`, formData);
  },

  delete: async (id) => {
    return api.delete(`/api/internship/${id}`);
  },
};

export default internshipService;
