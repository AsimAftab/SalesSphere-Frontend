import { useState, useEffect, useCallback } from 'react';
import api, { setCsrfToken } from './api';

const LOGIN_TIME_KEY = 'loginTime';

// --- 1. Enterprise Interfaces ---

export interface Permission {
  view: boolean;
  add: boolean;
  update: boolean;
  delete: boolean;
}

export interface UserPermissions {
  [module: string]: Permission;
}

export interface SubscriptionInfo {
  planName: string;
  tier: 'basic' | 'standard' | 'premium' | 'custom';
  maxEmployees: number;
  enabledModules: string[];
  subscriptionEndDate: string;
  isActive: boolean;
}

export interface User {
  _id: string;
  id?: string;
  name: string;
  email: string;
  role: 'superadmin' | 'developer' | 'admin' | 'user';
  isActive: boolean;
  organizationId?: string;
  permissions: UserPermissions;
  subscription?: SubscriptionInfo;
  avatarUrl?: string;
  avatar?: string;
  position?: string;
  phone?: string;
  dateJoined?: string;
  mobileAppAccess?: boolean;
  webPortalAccess?: boolean;
}

// Ensure this interface has the 'export' keyword
export interface RegisterOrganizationRequest {
  name: string;
  email: string;
  organizationName: string;
  panVatNumber: string;
  phone: string;
  address: string;
  latitude: number;
  longitude: number;
  googleMapLink: string;
  subscriptionType: string;
  subscriptionPlanId: string;  // Required by backend
  checkInTime: string;
  checkOutTime: string;
  halfDayCheckOutTime?: string;
  weeklyOffDay: string;
  timezone?: string;
  country?: string;
}

// --- 2. Auth State Management (Observer Pattern) ---

type AuthStateListener = (user: User | null) => void;
const authStateListeners = new Set<AuthStateListener>();

let cachedUser: User | null = null;
let userFetchPromise: Promise<User> | null = null;

const notifyAuthChange = (user: User | null) => {
  cachedUser = user;
  if (user === null) {
    userFetchPromise = null;
  }
  authStateListeners.forEach((listener) => listener(user));
};

export const subscribeToAuthChanges = (listener: AuthStateListener): (() => void) => {
  authStateListeners.add(listener);
  return () => {
    authStateListeners.delete(listener);
  };
};

export interface LoginResponse {
  status: string;
  data: {
    user: User;
    permissions: UserPermissions;
    webPortalAccess: boolean;
    mobileAppAccess: boolean;
    subscription?: SubscriptionInfo;
  };
}

// --- 3. API Actions ---

export const fetchCsrfToken = async (): Promise<void> => {
  try {
    const { data } = await api.get('/csrf-token');
    if (data.csrfToken) {
      setCsrfToken(data.csrfToken);
    }
  } catch (error) {
    console.error('CSRF Fetch Error:', error);
  }
};

export const checkAuthStatus = async (): Promise<boolean> => {
  try {
    await api.get('/auth/check-status');
    return true;
  } catch {
    return false;
  }
};

export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>('/auth/login', {
      email,
      password,
      isMobileApp: false,
    });

    const { user, webPortalAccess, permissions, subscription } = response.data.data;

    if (!webPortalAccess) {
      await api.post('/auth/logout');
      throw new Error('Access denied. Web portal access is disabled for your account.');
    }

    const userWithSessionData: User = {
      ...user,
      permissions: permissions || {},
      subscription: subscription || undefined,
      avatar: user.avatarUrl,
      position: user.role
    };

    localStorage.setItem(LOGIN_TIME_KEY, Date.now().toString());
    notifyAuthChange(userWithSessionData);
    return response.data;
  } catch (error: any) {
    localStorage.removeItem(LOGIN_TIME_KEY);
    notifyAuthChange(null);
    throw error;
  }
};

/**
 * FIX: Reconstructs full User permissions and subscription on reload
 */
export const getCurrentUser = async (): Promise<User> => {
  if (cachedUser) return cachedUser;
  if (userFetchPromise) return userFetchPromise;

  userFetchPromise = (async () => {
    try {
      const response = await api.get<{ data: any }>('/users/me');
      // Axios typically handles 304 by returning the cached data in response.data
      const { user, permissions, subscription } = response.data.data;

      const userData: User = {
        ...user,
        permissions: permissions || {},
        subscription: subscription || undefined,
        avatar: user.avatarUrl,
        position: user.role
      };

      notifyAuthChange(userData);
      return userData;
    } catch (error: any) {
      userFetchPromise = null;
      notifyAuthChange(null);
      throw error;
    }
  })();
  return userFetchPromise;
};


export const logout = async (): Promise<void> => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Logout failed:', error);
  } finally {
    localStorage.removeItem(LOGIN_TIME_KEY);
    notifyAuthChange(null);
    window.location.replace('/login');
  }
};

export const forgotPassword = async (email: string): Promise<any> => {
  try {
    const response = await api.post('/auth/forgotpassword', { email });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to send reset link' };
  }
};

export const resetPassword = async (token: string, password: string, passwordConfirm: string): Promise<any> => {
  try {
    const response = await api.patch(`/auth/resetpassword/${token}`, {
      password,
      passwordConfirm,
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to reset password' };
  }
};

// --- 4. Custom Hook: useAuth ---

// --- 4. Custom Hook: useAuth ---

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(cachedUser);
  const [isLoading, setIsLoading] = useState(!cachedUser);

  const initAuth = useCallback(async () => {
    try {
      const freshUser = await getCurrentUser();
      setUser(freshUser);
    } catch (error: any) {
      const status = error.status || error.response?.status;

      if (status === 401) {
        console.error("Session expired.");
        setUser(null);
      } else {
        const recoveredUser = await getCurrentUser().catch(() => null);
        setUser(recoveredUser);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Only initialize if we don't have a user in memory (standard on refresh)
    if (!cachedUser) initAuth();

    const unsubscribe = subscribeToAuthChanges((updatedUser) => {
      setUser(updatedUser);
    });
    return () => unsubscribe();
  }, [initAuth]);

  const refreshUser = useCallback(async () => {
    setIsLoading(true);
    await initAuth();
  }, [initAuth]);

  // can() and isFeatureEnabled() logic remains unchanged as they are robust.
  const can = (module: string, action: keyof Permission = 'view'): boolean => {
    if (!user) return false;

    // Strict Separation: System roles cannot access standard org modules via this check
    // They should use the System Admin portal instead.
    if (['superadmin', 'developer'].includes(user.role)) {
      return false;
    }

    if (user.role === 'admin') return true;
    const modulePerms = user.permissions?.[module];
    return !!modulePerms?.[action];
  };

  const isFeatureEnabled = (module: string): boolean => {
    const userRole = user?.role?.toLowerCase() || '';

    // System roles bypass all checks
    // UPDATE: System roles restricted to System Admin pages only. 
    // They do NOT have "features enabled" in the context of an organization.
    if (['superadmin', 'developer'].includes(userRole)) return false;

    // System modules bypass plan check for admin role (matches backend)
    const systemModules = ['organizations', 'systemUsers', 'subscriptions', 'settings'];
    if (userRole === 'admin' && systemModules.includes(module)) return true;

    // For other modules, check the subscription plan
    const planActive = user?.subscription?.isActive;
    const moduleInPlan = user?.subscription?.enabledModules?.includes(module);
    return !!(planActive && moduleInPlan);
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    can,
    isFeatureEnabled,
    logout,
    refreshUser,
    isSuperAdmin: user?.role === 'superadmin',
    isDeveloper: user?.role === 'developer',
    isAdmin: user?.role === 'admin',
  };
};

export const contactAdmin = async (data: any) => {
  const response = await api.post('/auth/contact-admin', data);
  return response.data;
};

export const registerOrganization = async (data: any) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

export const registerSuperAdmin = async (data: any) => {
  const response = await api.post('/auth/register/superadmin', data);
  return response.data;
};