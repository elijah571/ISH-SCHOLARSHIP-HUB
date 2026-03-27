import api from './api';

/**
 * Scholarship API Service
 * Handles all scholarship-related API calls
 */

const scholarshipService = {
  /**
   * Get all scholarships with optional filters
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.limit - Items per page (default: 10)
   * @param {string} params.search - Search query
   * @param {string} params.country - Filter by country
   * @param {string} params.funding_type - Filter by funding type
   * @returns {Promise} API response
   */
  getAll: async ({ page = 1, limit = 10, search, country, funding_type } = {}) => {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (search) params.append('search', search);
    if (country) params.append('country', country);
    if (funding_type) params.append('funding_type', funding_type);

    const queryString = params.toString();
    const url = `/api/scholarship${queryString ? `?${queryString}` : ''}`;
    return api.get(url);
  },

  /**
   * Get single scholarship by ID
   * @param {string} id - Scholarship ID
   * @returns {Promise} API response
   */
  getById: async (id) => {
    return api.get(`/api/scholarship/${id}`);
  },
  
  /**
   * Create new scholarship (Admin only)
   * @param {FormData} formData - Scholarship data including optional image file
   * @returns {Promise} API response
   */
  create: async (formData) => {
    return api.post('/api/scholarship/create', formData);
  },

  /**
   * Create scholarship with JSON data (for when no image upload)
   * @param {Object} data - Scholarship data
   * @returns {Promise} API response
   */
  createJson: async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });
    return api.post('/api/scholarship/create', formData);
  },

  /**
   * Update scholarship (Admin only)
   * @param {string} id - Scholarship ID
   * @param {FormData|Object} data - Updated scholarship data
   * @returns {Promise} API response
   */
  update: async (id, data) => {
    if (!(data instanceof FormData)) {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });
      data = formData;
    }
    return api.patch(`/api/scholarship/${id}`, data);
  },

  /**
   * Delete scholarship (Admin only)
   * @param {string} id - Scholarship ID
   * @returns {Promise} API response
   */
  delete: async (id) => {
    return api.delete(`/api/scholarship/${id}`);
  },
};

export default scholarshipService;
