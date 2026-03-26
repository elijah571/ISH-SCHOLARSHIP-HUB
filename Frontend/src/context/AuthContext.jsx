import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import api, { setAccessToken } from '../services/api';

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
  const [loading, setLoading] = useState(true);
  // Track if we've attempted session restore on initial mount
  const hasRestoredSession = useRef(false);

  const fetchProfile = useCallback(async () => {
    try {
      const { data } = await api.get('/api/auth/profile');
      return data.data;
    } catch {
      return null;
    }
  }, []);
  
  useEffect(() => {
    // Skip if user is already authenticated (from login) or already restored
    if (user || hasRestoredSession.current) {
      setLoading(false);
      return;
    }

    const restoreSession = async () => {
      hasRestoredSession.current = true;
      try {
        const { data } = await api.post('/api/auth/refresh');
        setAccessToken(data.accessToken);
        const profileData = await fetchProfile();
        if (profileData) {
          setUser(profileData);
        } else {
          setUser({ authenticated: true });
        }
      } catch {
        setUser(null);
        setAccessToken(null);
      } finally {
        setLoading(false);
      }
    };
    
    restoreSession();
  }, [fetchProfile, user]);

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/api/auth/login', { email, password });
    setAccessToken(data.accessToken);
    setUser(data.data);
    return data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/api/auth/logout');
    } catch {
    } finally {
      setUser(null);
      setAccessToken(null);
      document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/api/auth/refresh;';
      document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      window.location.href = '/';
    }
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
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
