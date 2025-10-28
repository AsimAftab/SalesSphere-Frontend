import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
});

api.interceptors.request.use(
  (config) => {
    // 1. Get the token from localStorage (where you saved it after login)
    const token = localStorage.getItem('jwtToken');

    // 2. If the token exists, add it to the Authorization header
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // CRITICAL: Don't set Content-Type for FormData
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    // 3. Return the modified request config so the request can proceed
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// ⭐ ADD response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    // Log all responses in development
    if (import.meta.env.DEV) {
      console.log('📥 API Response:', {
        url: response.config.url,
        status: response.status,
        data: response.data
      });
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.error('Unauthorized - Session expired');
      localStorage.removeItem('jwtToken');

      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
