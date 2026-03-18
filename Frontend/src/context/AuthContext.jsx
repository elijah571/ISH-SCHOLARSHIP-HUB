import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api, { setAccessToken, getAccessToken } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // initial auth check

  // ─── Try to restore session on mount via refresh token cookie ───
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const { data } = await api.post('/api/auth/refresh');
        setAccessToken(data.accessToken);
        // The refresh endpoint doesn't return user data,
        // so we just mark as authenticated with a minimal user object.
        // If you have a /api/user/profile endpoint, call it here.
        setUser({ authenticated: true });
      } catch {
        // No valid session — stay logged out
        setUser(null);
        setAccessToken(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  // ─── Login ───
  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/api/auth/login', { email, password });
    // data = { success, accessToken, data: { user } }
    setAccessToken(data.accessToken);
    setUser(data.data);
    return data;
  }, []);

  // ─── Logout ───
  const logout = useCallback(async () => {
    try {
      await api.post('/api/auth/logout');
    } catch {
      // Even if API fails, clear local state
    } finally {
      setUser(null);
      setAccessToken(null);
    }
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
