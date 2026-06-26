/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback } from 'react';
import scholarshipService from '../services/scholarshipService';

const ScholarshipContext = createContext(null);

export const useScholarships = () => {
  const context = useContext(ScholarshipContext);
  if (!context) {
    throw new Error('useScholarships must be used within ScholarshipProvider');
  }
  return context;
};

export const ScholarshipProvider = ({ children }) => {
  const [scholarships, setScholarships] = useState([]);
  const [currentScholarship, setCurrentScholarship] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchScholarships = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await scholarshipService.getAll(params);
      setScholarships(data.scholarships || data.data || []);
      if (data.pagination) {
        setPagination({
          page: data.pagination.page,
          limit: data.pagination.limit,
          total: data.pagination.total,
          totalPages: data.pagination.totalPages,
        });
      } else if (data.total !== undefined) {
        setPagination((prev) => ({
          ...prev,
          total: data.total,
          totalPages: Math.ceil(data.total / (params.limit || 10)),
        }));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch scholarships');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchScholarshipById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    setCurrentScholarship(null);
    try {
      const { data } = await scholarshipService.getById(id);
      setCurrentScholarship(data.scholarship || data.data);
      return data.scholarship || data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch scholarship');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createScholarship = useCallback(async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await scholarshipService.create(formData);
      return { success: true, data };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create scholarship';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateScholarship = useCallback(async (id, formData) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await scholarshipService.update(id, formData);
      return { success: true, data };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update scholarship';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteScholarship = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await scholarshipService.delete(id);
      setScholarships((prev) => prev.filter((s) => s.id !== id));
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete scholarship';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const value = {
    scholarships,
    currentScholarship,
    loading,
    error,
    pagination,
    fetchScholarships,
    fetchScholarshipById,
    createScholarship,
    updateScholarship,
    deleteScholarship,
    clearError,
  };

  return (
    <ScholarshipContext.Provider value={value}>
      {children}
    </ScholarshipContext.Provider>
  );
};

export default ScholarshipContext;
