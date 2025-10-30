import axios from 'axios';

// Use a constant for the token key to ensure consistency
const TOKEN_KEY = 'authToken';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY); 

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response) => {
   
    return response;
  },
  (error) => {
    
    if (error.response?.status === 401) {
      
      // --- THIS IS THE FIX ---
      // Get the URL of the request that failed
      const originalRequestUrl = error.config.url;

      // Check if this is the password change endpoint
      if (originalRequestUrl === '/users/me/password') {
        // This is an "Incorrect Password" error, NOT an "Expired Token" error.
        // Do NOT redirect. Just reject the promise so the
        // updateUserPassword() function's catch block can handle it.
        return Promise.reject(error);
      }
      // --- END OF FIX ---

      // If it's a 401 from ANY OTHER page, it's an expired token. Log out.
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem('systemUser');
      localStorage.removeItem('loginTime');

      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;