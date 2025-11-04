import axios from 'axios';
import { clearAuthStorage } from '../components/auth/authutils';

// Constant for the token key
const TOKEN_KEY = 'authToken';

// Create an Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
});

// ✅ Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // If data is FormData, let the browser set the Content-Type
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthFailure = error.response?.status === 401;
    const isNetworkError = !error.response; // Happens when backend is offline

    if (isAuthFailure) {
      const originalRequestUrl = error.config?.url;

      // Skip logout for incorrect password endpoint
      if (originalRequestUrl === '/users/me/password') {
        return Promise.reject(error);
      }
    }

    if (isNetworkError || isAuthFailure) {
      if (isNetworkError) {
        console.error('🌐 Network error: Backend might be offline.');
      }

      // ✅ Centralized cleanup
      clearAuthStorage();

      // Redirect to login (only if not already there)
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
