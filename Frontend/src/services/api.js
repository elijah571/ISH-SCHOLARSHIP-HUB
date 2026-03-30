import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const ACCESS_TOKEN_STORAGE_KEY = 'ish_access_token';

// ─── Axios instance ───
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // sends cookies (refresh token + CSRF)
});

// ─── CSRF token cache ───
let csrfToken = null;

export const fetchCsrfToken = async () => {
  const { data } = await api.get('/api/csrf');
  csrfToken = data.csrfToken;
  return csrfToken;
};

// ─── Access token (kept in memory, never in localStorage) ───
let accessToken =
  typeof window !== 'undefined'
    ? window.sessionStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)
    : null;

export const setAccessToken = (token) => {
  accessToken = token;

  if (typeof window !== 'undefined') {
    if (token) {
      window.sessionStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
    } else {
      window.sessionStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
    }
  }
};

export const getAccessToken = () => accessToken;

export const clearAccessToken = () => {
  setAccessToken(null);
};

// ─── Request interceptor ───
// Attaches Authorization header and CSRF token automatically
api.interceptors.request.use(async (config) => {
  // Attach access token if available
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  // For mutating requests, ensure we have a CSRF token
  const needsCsrf = ['post', 'patch', 'put', 'delete'].includes(config.method?.toLowerCase());
  if (needsCsrf) {
    if (!csrfToken) {
      await fetchCsrfToken();
    }
    config.headers['X-XSRF-TOKEN'] = csrfToken;
  }

  return config;
});

// ─── Response interceptor ───
// On 401, attempt a silent token refresh and retry once
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only retry on 401 and not for auth endpoints themselves
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/api/auth/login') &&
      !originalRequest.url?.includes('/api/auth/refresh')
    ) {
      if (isRefreshing) {
        // Queue requests while refresh is in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await api.post('/api/auth/refresh');
        setAccessToken(data.accessToken);
        processQueue(null, data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearAccessToken();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
