import axios, {
  type AxiosResponse,
  type AxiosError,
  type InternalAxiosRequestConfig,
} from 'axios';

// --- Types ---
interface FailedRequest {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}

// --- State Management ---
export let csrfToken: string | null = null;
export const setCsrfToken = (token: string) => {
  csrfToken = token;
};

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

/**
 * Process the queue of requests that were waiting for a token refresh.
 * Now returns the retry of the API call for each queued item.
 */
const processQueue = (error: unknown = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

// --- Axios Instance Configuration ---
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
  withCredentials: true, // Crucial for HTTP-only cookies
});

// --- Request Interceptor ---
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // CSRF Protection
    const methodsToProtect = ['post', 'put', 'patch', 'delete'];
    if (methodsToProtect.includes(config.method?.toLowerCase() || '') && csrfToken) {
      config.headers['x-csrf-token'] = csrfToken;
    }

    // Handle FormData
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error: unknown) => Promise.reject(error)
);

// --- Response Interceptor ---
api.interceptors.response.use(
  (response: AxiosResponse) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const originalRequestUrl = originalRequest.url || '';

    // 1. Silent Rejections: Removed '/users/me' from the skip list
    // This allows page refreshes to trigger a refresh if the session is still valid.
    const skipRefreshUrls = [
      '/auth/login',
      '/auth/check-status',
      '/auth/refresh',
      '/users/me/password'
    ];

    const shouldSkipRefresh = skipRefreshUrls.some(url => originalRequestUrl.includes(url));

    // 2. Token Refresh Logic (401 Unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry && !shouldSkipRefresh) {

      if (isRefreshing) {
        // Queue this request and return the eventual retry
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Request new access token via HTTP-only Refresh Cookie
        await api.post('/auth/refresh', {});

        isRefreshing = false;
        processQueue(null); // Resolve queue

        // RETRY the original failed request and RETURN the result
        return api(originalRequest);
      } catch (refreshError: unknown) {
        isRefreshing = false;
        processQueue(refreshError); // Fail queue

        // Permanent Session Expiry
        localStorage.removeItem('loginTime');

        // Define public paths that should NOT redirect to login on 401
        // This allows the Landing Page ('/') and others to render for unauthenticated users
        const currentPath = window.location.pathname;
        const publicPaths = ['/', '/login', '/contact-admin', '/forgot-password'];
        const isPublicPath = publicPaths.includes(currentPath) || currentPath.startsWith('/reset-password/');

        if (!isPublicPath) {
          window.location.href = '/login';
        }

        return Promise.reject(refreshError);
      }
    }

    // 3. Global Error Formatting
    // We only reach here if the refresh failed or wasn't applicable.
    const backendMessage = (error.response?.data as { message?: string })?.message || error.message;
    const customizedError = new Error(backendMessage);

    // Explicitly attach properties to match the checks in useAuth hook
    Object.assign(customizedError, {
      status: error.response?.status,
      data: error.response?.data,
      response: error.response,
    });

    return Promise.reject(customizedError);
  }
);

export default api;