/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';
import api, { clearAccessToken, getAccessToken, setAccessToken } from '../services/api';

const AuthContext = createContext(null);
let restoreSessionRequest = null;

const hasSessionCookie = () =>
  document.cookie
    .split(';')
    .map((cookie) => cookie.trim())
    .some((cookie) => cookie === 'ish_session=1');

const clearSessionCookie = () => {
  document.cookie = 'ish_session=; Max-Age=0; path=/';
};

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

      const existingAccessToken = getAccessToken();
      if (existingAccessToken) {
        const profileData = await fetchProfile();
        if (profileData) {
          setUser(profileData);
          setLoading(false);
          return;
        }

        clearAccessToken();
      }

      if (!hasSessionCookie()) {
        setUser(null);
        clearAccessToken();
        setLoading(false);
        return;
      }

      try {
        if (!restoreSessionRequest) {
          restoreSessionRequest = api
            .post('/api/auth/refresh')
            .finally(() => {
              restoreSessionRequest = null;
            });
        }

        const { data } = await restoreSessionRequest;
        setAccessToken(data.accessToken);
        const profileData = await fetchProfile();
        if (profileData) {
          setUser(profileData);
        } else {
          setUser({ authenticated: true });
        }
      } catch {
        setUser(null);
        clearAccessToken();
        clearSessionCookie();
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
      toast.error('We could not reach the server to log you out cleanly.');
    } finally {
      setUser(null);
      clearAccessToken();
      clearSessionCookie();
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
