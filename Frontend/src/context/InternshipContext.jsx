import React, { createContext, useContext, useState, useCallback } from 'react';
import internshipService from '../services/internshipService';

const InternshipContext = createContext(null);

export const useInternships = () => {
  const context = useContext(InternshipContext);
  if (!context) {
    throw new Error('useInternships must be used within InternshipProvider');
  }
  return context;
};

export const InternshipProvider = ({ children }) => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchInternships = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await internshipService.getAll(params);
      setInternships(data.internships || data.data || []);
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
      setError(err.response?.data?.message || 'Failed to fetch internships');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const value = {
    internships,
    loading,
    error,
    pagination,
    fetchInternships,
    clearError,
  };

  return (
    <InternshipContext.Provider value={value}>
      {children}
    </InternshipContext.Provider>
  );
};

export default InternshipContext;
