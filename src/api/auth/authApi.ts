/**
 * Auth API - Single Responsibility: API calls only
 * Handles all authentication-related HTTP requests.
 */

import api, { setCsrfToken, getCsrfToken } from '../api';
import { API_ENDPOINTS } from '../endpoints';
import { handleApiError } from '../errors';
import type {
  User,
  UserPermissions,
  SubscriptionInfo,
  LoginResponse,
  RegisterOrganizationRequest,
  RegisterSuperAdminRequest,
  ContactAdminRequest,
} from './types';
import {
  notifyAuthChange,
  setLoginTime,
  clearLoginTime,
  getCachedUser,
  getUserFetchPromise,
  setUserFetchPromise,
} from './authState';

// --- CSRF Token ---

export const fetchCsrfToken = async (): Promise<void> => {
  // Skip if token already exists (idempotent)
  if (getCsrfToken()) return;

  try {
    const { data } = await api.get(API_ENDPOINTS.auth.CSRF_TOKEN);
    if (data.csrfToken) {
      setCsrfToken(data.csrfToken);
    }
  } catch {
    /* silently ignore csrf fetch failures */
  }
};

// --- Auth Status ---

export const checkAuthStatus = async (): Promise<boolean> => {
  try {
    await api.get(API_ENDPOINTS.auth.CHECK_STATUS);
    return true;
  } catch {
    return false;
  }
};

// --- Login ---

export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  // Ensure CSRF token is available before login attempt
  await fetchCsrfToken();

  try {
    const response = await api.post<LoginResponse>(API_ENDPOINTS.auth.LOGIN, {
      email,
      password,
      isMobileApp: false,
    });

    const { user, webPortalAccess, permissions, subscription } = response.data.data;

    if (!webPortalAccess) {
      await api.post(API_ENDPOINTS.auth.LOGOUT);
      throw new Error('Access denied. Web portal access is disabled for your account.');
    }

    const userWithSessionData: User = {
      ...user,
      permissions: permissions || {},
      subscription: subscription || undefined,
      avatar: user.avatarUrl,
      position: user.role,
    };

    setLoginTime();
    notifyAuthChange(userWithSessionData);
    return response.data;
  } catch (error: unknown) {
    clearLoginTime();
    notifyAuthChange(null);
    throw handleApiError(error, 'Login failed');
  }
};

// --- Get Current User ---

export const getCurrentUser = async (): Promise<User> => {
  const cached = getCachedUser();
  if (cached) return cached;

  const existingPromise = getUserFetchPromise();
  if (existingPromise) return existingPromise;

  const fetchPromise = (async () => {
    try {
      const response = await api.get<{
        data: User & { permissions: UserPermissions; subscription?: SubscriptionInfo };
      }>(API_ENDPOINTS.users.ME);

      const userDataFromApi = response.data.data;
      const { permissions, subscription } = userDataFromApi;

      const userData: User = {
        ...userDataFromApi,
        permissions: permissions || {},
        subscription: subscription || undefined,
        avatar: userDataFromApi.avatarUrl,
        position: userDataFromApi.role,
      };

      notifyAuthChange(userData);
      return userData;
    } catch (error: unknown) {
      setUserFetchPromise(null);
      notifyAuthChange(null);
      throw handleApiError(error, 'Failed to get current user');
    }
  })();

  setUserFetchPromise(fetchPromise);
  return fetchPromise;
};

// --- Logout ---

export const logout = async (): Promise<void> => {
  try {
    await api.post(API_ENDPOINTS.auth.LOGOUT);
  } catch {
    /* silently ignore logout API failures */
  } finally {
    clearLoginTime();
    notifyAuthChange(null);
    window.location.replace('/login');
  }
};

// --- Password Management ---

export const forgotPassword = async (email: string): Promise<{ message: string }> => {
  await fetchCsrfToken();

  try {
    const response = await api.post(API_ENDPOINTS.auth.FORGOT_PASSWORD, { email });
    return response.data;
  } catch (error: unknown) {
    throw handleApiError(error, 'Failed to send reset link');
  }
};

export const resetPassword = async (
  token: string,
  password: string,
  passwordConfirm: string
): Promise<{ message: string }> => {
  await fetchCsrfToken();

  try {
    const response = await api.patch(API_ENDPOINTS.auth.RESET_PASSWORD(token), {
      password,
      passwordConfirm,
    });
    return response.data;
  } catch (error: unknown) {
    throw handleApiError(error, 'Failed to reset password');
  }
};

// --- Contact Admin ---

export const contactAdmin = async (data: ContactAdminRequest) => {
  await fetchCsrfToken();

  try {
    const response = await api.post(API_ENDPOINTS.auth.CONTACT_ADMIN, data);
    return response.data;
  } catch (error: unknown) {
    throw handleApiError(error, 'Failed to contact admin');
  }
};

// --- Registration ---

export const registerOrganization = async (data: RegisterOrganizationRequest) => {
  await fetchCsrfToken();

  try {
    const response = await api.post(API_ENDPOINTS.auth.REGISTER, data);
    return response.data;
  } catch (error: unknown) {
    throw handleApiError(error, 'Failed to register organization');
  }
};

export const registerSuperAdmin = async (data: RegisterSuperAdminRequest) => {
  await fetchCsrfToken();

  try {
    const response = await api.post(API_ENDPOINTS.auth.REGISTER_SUPERADMIN, data);
    return response.data;
  } catch (error: unknown) {
    throw handleApiError(error, 'Failed to register super admin');
  }
};
