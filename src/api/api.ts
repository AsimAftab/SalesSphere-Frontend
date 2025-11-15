import axios, {
  type AxiosResponse,
  type AxiosError,
  type InternalAxiosRequestConfig,
} from 'axios';

// --- CSRF Token Logic (Unchanged) ---
export let csrfToken: string | null = null;
export const setCsrfToken = (token: string) => {
  csrfToken = token;
};

// --- Axios Instance (Unchanged) ---
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
  withCredentials: true,
});

// --- Request Interceptor (Unchanged) ---
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const methodsToProtect = ['post', 'put', 'patch', 'delete'];
    if (methodsToProtect.includes(config.method as string)) {
      if (csrfToken) {
        config.headers['x-csrf-token'] = csrfToken;
      }
    }
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error: any) => Promise.reject(error)
);

// --- ⬇️ NEW REFRESH TOKEN LOGIC ⬇️ ---

// This flag prevents an infinite loop if the refresh token itself fails
let isRefreshing = false;
// This queue holds requests that failed while we were refreshing
let failedQueue: Array<{ resolve: (value?: any) => void; reject: (reason?: any) => void }> = [];

const processQueue = (error: any) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

// --- ⬇️ REPLACED RESPONSE INTERCEPTOR ⬇️ ---
api.interceptors.response.use(
  (response: AxiosResponse) => response, // On success, just return the response

  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const originalRequestUrl = originalRequest.url || '';

    // --- Keep your original special-case rejections ---
    if (originalRequestUrl.includes('/auth/check-status')) {
      return Promise.reject(error);
    }
    if (error.response?.status === 401 && originalRequestUrl === '/users/me/password') {
      return Promise.reject(error);
    }
    // --- End of special cases ---

    // Main refresh logic:
    // Check for 401, ensure it's not a retry, and not the refresh endpoint itself
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/refresh') {
      
      if (isRefreshing) {
        // If we are already refreshing, add this request to the queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          // Retry the original request after refresh completes
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call your backend /auth/refresh endpoint.
        // The backend will automatically set new httpOnly cookies.
        await api.post('/auth/refresh'); 
        
        // Refresh was successful, process the queue and retry original request
        processQueue(null);
        isRefreshing = false;
        return api(originalRequest);

      } catch (refreshError: any) {
        // The REFRESH token itself failed (e.g., 7-day cookie expired)
        isRefreshing = false;
        processQueue(refreshError);

        // NOW we log the user out.
        localStorage.removeItem('loginTime'); // 'loginTime' key from your code
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    // For any other error (like 403, 404, 500), just reject it
    return Promise.reject(error);
  }
);

export default api;