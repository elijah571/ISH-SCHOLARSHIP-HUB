import api from './api';

const userService = {
  saveScholarship: async (scholarshipId) => {
    return api.post(`/api/auth/saved/${scholarshipId}`);
  },

  unsaveScholarship: async (scholarshipId) => {
    return api.delete(`/api/auth/saved/${scholarshipId}`);
  },

  markAsApplied: async (scholarshipId) => {
    return api.post(`/api/auth/applied/${scholarshipId}`);
  },

  getSavedScholarships: async () => {
    return api.get('/api/auth/saved');
  },

  getAppliedScholarships: async () => {
    return api.get('/api/auth/applied');
  },
};

export default userService;
