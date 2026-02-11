/**
 * Auth Module - Barrel Export
 * Maintains backward compatibility with existing imports from '@/api/authService'
 */

// Types
export type {
  GranularPermissions,
  UserPermissions,
  Permission,
  SubscriptionInfo,
  User,
  LoginResponse,
  RegisterOrganizationRequest,
  RegisterSuperAdminRequest,
  ContactAdminRequest,
  AuthStateListener,
  AuthState,
} from './types';

// Auth State
export {
  subscribeToAuthChanges,
  notifyAuthChange,
  getCachedUser,
  hasActiveSession,
  LOGIN_TIME_KEY,
} from './authState';

// Auth API
export {
  fetchCsrfToken,
  checkAuthStatus,
  loginUser,
  getCurrentUser,
  logout,
  forgotPassword,
  resetPassword,
  contactAdmin,
  registerOrganization,
  registerSuperAdmin,
} from './authApi';

// Permission Utils
export {
  hasPermission,
  isPlanFeatureEnabled,
  hasAccess,
  can,
  isFeatureEnabled,
  isSuperAdmin,
  isDeveloper,
  isAdmin,
  isSystemRole,
} from './permissionUtils';

// Hook
export { useAuth } from './useAuth';
export type { UseAuthReturn } from './useAuth';
