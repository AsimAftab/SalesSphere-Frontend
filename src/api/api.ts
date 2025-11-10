import axios, {
  type AxiosResponse,
  type AxiosError,
  type InternalAxiosRequestConfig,
} from 'axios';



export let csrfToken: string | null = null;
export const setCsrfToken = (token: string) => {
  csrfToken = token;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
  withCredentials: true, 
});


api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
 
    const methodsToProtect = ['post', 'put', 'patch', 'delete'];
    if (methodsToProtect.includes(config.method as string)) {
      if (csrfToken) {
        config.headers['x-csrf-token'] = csrfToken;
      } else {
        console.warn('CSRF token is not set. Request may fail.');
      }
    }
    if (config.data instanceof FormData) {
      
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error: any) => Promise.reject(error) 
);

api.interceptors.response.use(
  (response: AxiosResponse) => response, 
  (error: AxiosError) => {
    const isAuthFailure = error.response?.status === 401;
    const isNetworkError = !error.response;

    if (isAuthFailure) {
      const originalRequestUrl = error.config?.url;
      if (originalRequestUrl === '/users/me/password') {
        return Promise.reject(error);
      }
    }

    if (isNetworkError || isAuthFailure) {
      if (isNetworkError) {
        console.error('🌐 Network error: Backend might be offline.');
      }

      localStorage.removeItem('loginTime');

      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;