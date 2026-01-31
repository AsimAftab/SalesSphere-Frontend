import { useState, useEffect, useCallback } from 'react';
import api, { setCsrfToken } from './api';

const LOGIN_TIME_KEY = 'loginTime';

// --- 1. Enterprise Interfaces ---

/**
 * Granular permissions for a module
 * Each feature key maps to a boolean (enabled/disabled)
 * Examples: 'view', 'create', 'update', 'delete', 'exportPdf', 'webCheckIn', 'bulkImport'
 */
export interface GranularPermissions {
  [featureKey: string]: boolean;
}

/**
 * User permissions organized by module
 * Each module maps to its granular permissions
 */
export interface UserPermissions {
  [module: string]: GranularPermissions;
}

/**
 * @deprecated Use GranularPermissions instead
 * Legacy interface kept for backward compatibility
 */
export interface Permission {
  view: boolean;
  create: boolean; // Changed from 'add' to match backend
  update: boolean;
  delete: boolean;
}

export interface SubscriptionInfo {
  planName: string;
  tier: 'basic' | 'standard' | 'premium' | 'custom';
  maxEmployees: number;
  enabledModules: string[];
  moduleFeatures?: {
    [module: string]: {
      [featureKey: string]: boolean;
    };
  };
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
  organizationId?: string | { _id: string; name: string; isActive?: boolean; isSubscriptionActive?: boolean };
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
  } catch { /* silently ignore csrf fetch failures */ }
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
  } catch (error: unknown) {
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
      const response = await api.get<{ data: User & { permissions: UserPermissions; subscription?: SubscriptionInfo } }>('/users/me');
      // Axios typically handles 304 by returning the cached data in response.data
      const userDataFromApi = response.data.data;
     
      const { permissions, subscription } = userDataFromApi;

      const userData: User = {
        ...userDataFromApi,
        permissions: permissions || {},
        subscription: subscription || undefined,
        avatar: userDataFromApi.avatarUrl,
        position: userDataFromApi.role
      };

      notifyAuthChange(userData);
      return userData;
    } catch (error: unknown) {
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
  } catch { /* silently ignore logout API failures */ } finally {
    localStorage.removeItem(LOGIN_TIME_KEY);
    notifyAuthChange(null);
    window.location.replace('/login');
  }
};

export const forgotPassword = async (email: string): Promise<{ message: string }> => {
  try {
    const response = await api.post('/auth/forgotpassword', { email });
    return response.data;
  } catch (error: unknown) {
    const axiosErr = error as { response?: { data?: { message?: string } } };
    throw axiosErr.response?.data || { message: 'Failed to send reset link' };
  }
};

export const resetPassword = async (token: string, password: string, passwordConfirm: string): Promise<{ message: string }> => {
  try {
    const response = await api.patch(`/auth/resetpassword/${token}`, {
      password,
      passwordConfirm,
    });
    return response.data;
  } catch (error: unknown) {
    const axiosErr = error as { response?: { data?: { message?: string } } };
    throw axiosErr.response?.data || { message: 'Failed to reset password' };
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
    } catch (error: unknown) {
      const axiosErr = error as { status?: number; response?: { status?: number } };
      const status = axiosErr.status || axiosErr.response?.status;

      if (status === 401) {
       
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

  // ============================================
  // NEW: Granular Permission Checking Functions
  // ============================================

  /**
   * Check if user's role has a specific feature permission
   * Supports any feature key (not limited to view/create/update/delete)
   * @param module - Module name (e.g., 'products', 'attendance')
   * @param feature - Feature key (e.g., 'exportPdf', 'webCheckIn', 'create')
   */
  const hasPermission = (module: string, feature: string): boolean => {
    if (!user) return false;

    // System roles have all permissions
    if (['superadmin', 'developer'].includes(user.role)) return true;

    // Admin has all permissions in their organization
    if (user.role === 'admin') return true;

    // Check granular permissions
    const modulePerms = user.permissions?.[module];
    return !!modulePerms?.[feature];
  };

  /**
   * Check if organization's subscription plan has a specific feature enabled
   * @param module - Module name
   * @param feature - Optional feature key (if not provided, just checks if module is enabled)
   */
  const isPlanFeatureEnabled = (module: string, feature?: string): boolean => {
    const userRole = user?.role?.toLowerCase() || '';

    // System roles bypass plan checks
    if (['superadmin', 'developer'].includes(userRole)) return true;

    // System modules bypass plan check for admin role (matches backend)
    const systemModules = ['organizations', 'systemUsers', 'subscriptions', 'settings'];
    if (userRole === 'admin' && systemModules.includes(module)) return true;

    // Check if subscription is active and module is enabled
    // FIX: Check organization status as fallback (user.organizationId is populated as object from backend)
    const org = typeof user?.organizationId === 'object' ? user.organizationId : undefined;
    const isOrgActive = org?.isSubscriptionActive === true || org?.isActive === true;

    // Primary check: Subscription object, Fallback: Organization object
    const planActive = user?.subscription?.isActive || isOrgActive;

    const moduleInPlan = user?.subscription?.enabledModules?.includes(module);

    if (!planActive) {
      // console.warn(`[AuthDebug] Access Denied: Plan inactive for module ${module}`);
      return false;
    }
    if (!moduleInPlan) {
      // console.warn(`[AuthDebug] Access Denied: Module ${module} not in plan`);
      return false;
    }

    // If checking specific feature, verify in moduleFeatures
    if (feature) {
      const moduleFeatures = user?.subscription?.moduleFeatures?.[module];
      return !!moduleFeatures?.[feature];
    }

    return true; // Module is enabled
  };

  /**
   * Composite access check: Checks BOTH plan feature AND role permission
   * This matches backend's checkAccess middleware (Plan ∩ Role)
   * @param module - Module name
   * @param feature - Feature key
   */
  const hasAccess = (module: string, feature: string): boolean => {
    // System roles always have access
    if (user && ['superadmin', 'developer'].includes(user.role)) return true;

    // Check both plan AND role (intersection logic)
    const planHasFeature = isPlanFeatureEnabled(module, feature);
    const roleHasPermission = hasPermission(module, feature);

    return planHasFeature && roleHasPermission;
  };

  // ============================================
  // LEGACY: Backward Compatibility Functions
  // ============================================

  /**
   * @deprecated Use hasPermission() instead
   * Legacy function for backward compatibility
   * Limited to view/create/update/delete actions only
   */
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
    // NEW: Granular permission functions
    hasPermission,
    isPlanFeatureEnabled,
    hasAccess,
    // LEGACY: Backward compatibility
    can,
    isFeatureEnabled,
    logout,
    refreshUser,
    isSuperAdmin: user?.role === 'superadmin',
    isDeveloper: user?.role === 'developer',
    isAdmin: user?.role === 'admin',
  };
};

export interface ContactAdminRequest {
  fullName: string;
  email: string;
  department: string;
  requestType: string;
  message: string;
}

export const contactAdmin = async (data: ContactAdminRequest) => {
  const response = await api.post('/auth/contact-admin', data);
  return response.data;
};

export const registerOrganization = async (data: RegisterOrganizationRequest) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

export interface RegisterSuperAdminRequest {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

export const registerSuperAdmin = async (data: RegisterSuperAdminRequest) => {
  const response = await api.post('/auth/register/superadmin', data);
  return response.data;
};