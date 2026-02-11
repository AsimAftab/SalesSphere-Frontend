/**
 * Auth Types - Single Responsibility: Type definitions only
 * This module contains all authentication-related interfaces and types.
 */

// --- Permission Interfaces ---

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
  create: boolean;
  update: boolean;
  delete: boolean;
}

// --- Subscription Interfaces ---

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

// --- User Interface ---

export interface User {
  _id: string;
  id?: string;
  name: string;
  email: string;
  role: 'superadmin' | 'developer' | 'admin' | 'user';
  isActive: boolean;
  organizationId?: string | { _id: string; name: string; isActive?: boolean; isSubscriptionActive?: boolean; latitude?: number; longitude?: number };
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

// --- Request/Response Interfaces ---

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
  subscriptionPlanId: string;
  checkInTime: string;
  checkOutTime: string;
  halfDayCheckOutTime?: string;
  weeklyOffDay: string;
  timezone?: string;
  country?: string;
}

export interface RegisterSuperAdminRequest {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

export interface ContactAdminRequest {
  fullName: string;
  email: string;
  department: string;
  requestType: string;
  message: string;
}

// --- Auth State Types ---

export type AuthStateListener = (user: User | null) => void;

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}
