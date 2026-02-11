/**
 * Permission Utilities - Single Responsibility: Permission checking only
 * Contains all permission and access control logic.
 */

import type { User, Permission } from './types';

// --- System Roles ---
const SYSTEM_ROLES = ['superadmin', 'developer'] as const;
const SYSTEM_MODULES = ['organizations', 'systemUsers', 'subscriptions', 'settings'] as const;

// --- Permission Checking Functions ---

/**
 * Check if user's role has a specific feature permission
 * Supports any feature key (not limited to view/create/update/delete)
 * @param user - Current user object
 * @param module - Module name (e.g., 'products', 'attendance')
 * @param feature - Feature key (e.g., 'exportPdf', 'webCheckIn', 'create')
 */
export const hasPermission = (user: User | null, module: string, feature: string): boolean => {
  if (!user) return false;

  // System roles have all permissions
  if (SYSTEM_ROLES.includes(user.role as typeof SYSTEM_ROLES[number])) return true;

  // Admin has all permissions in their organization
  if (user.role === 'admin') return true;

  // Check granular permissions
  const modulePerms = user.permissions?.[module];
  return !!modulePerms?.[feature];
};

/**
 * Check if organization's subscription plan has a specific feature enabled
 * @param user - Current user object
 * @param module - Module name
 * @param feature - Optional feature key (if not provided, just checks if module is enabled)
 */
export const isPlanFeatureEnabled = (user: User | null, module: string, feature?: string): boolean => {
  const userRole = user?.role?.toLowerCase() || '';

  // System roles bypass plan checks
  if (SYSTEM_ROLES.includes(userRole as typeof SYSTEM_ROLES[number])) return true;

  // System modules bypass plan check for admin role (matches backend)
  if (userRole === 'admin' && SYSTEM_MODULES.includes(module as typeof SYSTEM_MODULES[number])) {
    return true;
  }

  // Check organization status as fallback
  const org = typeof user?.organizationId === 'object' ? user.organizationId : undefined;
  const isOrgActive = org?.isSubscriptionActive === true || org?.isActive === true;

  // Primary check: Subscription object, Fallback: Organization object
  const planActive = user?.subscription?.isActive || isOrgActive;
  const moduleInPlan = user?.subscription?.enabledModules?.includes(module);

  if (!planActive || !moduleInPlan) {
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
 * @param user - Current user object
 * @param module - Module name
 * @param feature - Feature key
 */
export const hasAccess = (user: User | null, module: string, feature: string): boolean => {
  // System roles always have access
  if (user && SYSTEM_ROLES.includes(user.role as typeof SYSTEM_ROLES[number])) {
    return true;
  }

  // Check both plan AND role (intersection logic)
  const planHasFeature = isPlanFeatureEnabled(user, module, feature);
  const roleHasPermission = hasPermission(user, module, feature);

  return planHasFeature && roleHasPermission;
};

/**
 * @deprecated Use hasPermission() instead
 * Legacy function for backward compatibility
 * Limited to view/create/update/delete actions only
 */
export const can = (user: User | null, module: string, action: keyof Permission = 'view'): boolean => {
  if (!user) return false;

  // Strict Separation: System roles cannot access standard org modules via this check
  if (SYSTEM_ROLES.includes(user.role as typeof SYSTEM_ROLES[number])) {
    return false;
  }

  if (user.role === 'admin') return true;
  const modulePerms = user.permissions?.[module];
  return !!modulePerms?.[action];
};

/**
 * Check if a feature/module is enabled for the user
 * @param user - Current user object
 * @param module - Module name
 */
export const isFeatureEnabled = (user: User | null, module: string): boolean => {
  const userRole = user?.role?.toLowerCase() || '';

  // System roles restricted to System Admin pages only
  if (SYSTEM_ROLES.includes(userRole as typeof SYSTEM_ROLES[number])) {
    return false;
  }

  // System modules bypass plan check for admin role
  if (userRole === 'admin' && SYSTEM_MODULES.includes(module as typeof SYSTEM_MODULES[number])) {
    return true;
  }

  // For other modules, check the subscription plan
  const planActive = user?.subscription?.isActive;
  const moduleInPlan = user?.subscription?.enabledModules?.includes(module);
  return !!(planActive && moduleInPlan);
};

// --- Role Helpers ---

export const isSuperAdmin = (user: User | null): boolean => user?.role === 'superadmin';
export const isDeveloper = (user: User | null): boolean => user?.role === 'developer';
export const isAdmin = (user: User | null): boolean => user?.role === 'admin';
export const isSystemRole = (user: User | null): boolean => {
  return !!user && SYSTEM_ROLES.includes(user.role as typeof SYSTEM_ROLES[number]);
};
