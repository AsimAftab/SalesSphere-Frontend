/**
 * API Client Configuration
 *
 * Centralized Axios instance with interceptors for:
 * - CSRF protection
 * - Token refresh handling
 * - Standardized error formatting
 *
 * Following Single Responsibility Principle - each interceptor handles one concern.
 */

import axios, {
  type AxiosResponse,
  type AxiosError,
  type InternalAxiosRequestConfig,
} from 'axios';
import { API_ENDPOINTS } from './endpoints';
import { ApiError, API_ERROR_CODES, extractErrorMessage, type ApiErrorCode } from './errors';

// =============================================================================
// Types
// =============================================================================

interface FailedRequest {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}

interface RefreshState {
  isRefreshing: boolean;
  failedQueue: FailedRequest[];
}

// =============================================================================
// State Management (Module-scoped)
// =============================================================================

/** CSRF token for state-changing requests */
let csrfToken: string | null = null;

/** Token refresh state */
const refreshState: RefreshState = {
  isRefreshing: false,
  failedQueue: [],
};

// =============================================================================
// CSRF Token Management
// =============================================================================

/**
 * Sets the CSRF token for subsequent requests
 */
export const setCsrfToken = (token: string): void => {
  csrfToken = token;
};

/**
 * Gets the current CSRF token (for testing/debugging)
 */
export const getCsrfToken = (): string | null => csrfToken;

// =============================================================================
// Token Refresh Queue Management
// =============================================================================

/**
 * Process the queue of requests that were waiting for a token refresh.
 */
const processQueue = (error: unknown = null): void => {
  refreshState.failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  refreshState.failedQueue = [];
};

/**
 * Add a request to the refresh queue
 */
const queueRequest = (): Promise<unknown> => {
  return new Promise((resolve, reject) => {
    refreshState.failedQueue.push({ resolve, reject });
  });
};

// =============================================================================
// Request Interceptor Handlers
// =============================================================================

/**
 * Adds CSRF token to state-changing requests
 */
const addCsrfToken = (config: InternalAxiosRequestConfig): void => {
  const methodsToProtect = ['post', 'put', 'patch', 'delete'];
  if (methodsToProtect.includes(config.method?.toLowerCase() || '') && csrfToken) {
    config.headers['x-csrf-token'] = csrfToken;
  }
};

/**
 * Handles FormData content type (let browser set it with boundary)
 */
const handleFormData = (config: InternalAxiosRequestConfig): void => {
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
};

// =============================================================================
// Response Interceptor Handlers
// =============================================================================

/** URLs that should not trigger token refresh */
const SKIP_REFRESH_URLS = [
  API_ENDPOINTS.auth.LOGIN,
  API_ENDPOINTS.auth.CHECK_STATUS,
  API_ENDPOINTS.auth.REFRESH,
  API_ENDPOINTS.users.ME_PASSWORD,
];

/** Public paths that should not redirect to login on 401 */
const PUBLIC_PATHS = ['/', '/login', '/contact-admin', '/forgot-password'];

/**
 * Check if the request URL should skip refresh logic
 */
const shouldSkipRefresh = (url: string): boolean => {
  return SKIP_REFRESH_URLS.some((skipUrl) => url.includes(skipUrl));
};

/**
 * Check if current path is public (no login redirect needed)
 */
const isPublicPath = (): boolean => {
  const currentPath = window.location.pathname;
  return PUBLIC_PATHS.includes(currentPath) || currentPath.startsWith('/reset-password/');
};

/**
 * Handle session expiry - clear storage and redirect if needed
 */
const handleSessionExpiry = (): void => {
  localStorage.removeItem('loginTime');
  if (!isPublicPath()) {
    window.location.href = '/login';
  }
};

/**
 * Attempt to refresh the authentication token
 */
const attemptTokenRefresh = async (
  originalRequest: InternalAxiosRequestConfig & { _retry?: boolean }
): Promise<AxiosResponse> => {
  // If already refreshing, queue this request
  if (refreshState.isRefreshing) {
    await queueRequest();
    return api(originalRequest);
  }

  originalRequest._retry = true;
  refreshState.isRefreshing = true;

  try {
    await api.post(API_ENDPOINTS.auth.REFRESH, {});
    refreshState.isRefreshing = false;
    processQueue(null);
    return api(originalRequest);
  } catch (refreshError) {
    refreshState.isRefreshing = false;
    processQueue(refreshError);
    handleSessionExpiry();
    throw refreshError;
  }
};

/**
 * Create a standardized ApiError from an Axios error
 */
const createApiErrorFromAxios = (error: AxiosError): ApiError => {
  const status = error.response?.status ?? 500;
  const responseData = error.response?.data as { message?: string; errors?: Record<string, string[]> } | undefined;
  const message = extractErrorMessage(error, 'An unexpected error occurred');

  // Map status to error code
  let code: ApiErrorCode = API_ERROR_CODES.UNKNOWN_ERROR;
  switch (status) {
    case 401:
      code = API_ERROR_CODES.UNAUTHORIZED;
      break;
    case 403:
      code = API_ERROR_CODES.FORBIDDEN;
      break;
    case 404:
      code = API_ERROR_CODES.NOT_FOUND;
      break;
    case 409:
      code = API_ERROR_CODES.CONFLICT;
      break;
    case 422:
      code = API_ERROR_CODES.VALIDATION_ERROR;
      break;
    case 500:
      code = API_ERROR_CODES.INTERNAL_ERROR;
      break;
    case 503:
      code = API_ERROR_CODES.SERVICE_UNAVAILABLE;
      break;
  }

  const apiError = new ApiError(message, {
    status,
    code,
    data: responseData ?? undefined,
    originalError: error,
  });

  // Attach response for backward compatibility with existing error handlers
  Object.assign(apiError, {
    response: error.response,
  });

  return apiError;
};

// =============================================================================
// Axios Instance Configuration
// =============================================================================

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
  withCredentials: true, // Required for HTTP-only cookies
});

// =============================================================================
// Request Interceptor
// =============================================================================

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    addCsrfToken(config);
    handleFormData(config);
    return config;
  },
  (error: unknown) => Promise.reject(error)
);

// =============================================================================
// Response Interceptor
// =============================================================================

api.interceptors.response.use(
  // Success handler - pass through
  (response: AxiosResponse) => response,

  // Error handler
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const requestUrl = originalRequest?.url || '';

    // 1. Handle 401 with token refresh (if applicable)
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !shouldSkipRefresh(requestUrl)
    ) {
      try {
        return await attemptTokenRefresh(originalRequest);
      } catch {
        // Refresh failed, convert to ApiError and reject
        return Promise.reject(createApiErrorFromAxios(error));
      }
    }

    // 2. Convert to standardized ApiError
    return Promise.reject(createApiErrorFromAxios(error));
  }
);

// =============================================================================
// Exports
// =============================================================================

export default api;

// Re-export for backward compatibility
export { csrfToken };
