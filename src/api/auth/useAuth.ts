/**
 * useAuth Hook - Single Responsibility: React state management
 * Provides authentication state and actions to React components.
 */

import { useState, useEffect, useCallback } from 'react';
import type { User, Permission } from './types';
import { getCachedUser, subscribeToAuthChanges, hasActiveSession, clearLoginTime } from './authState';
import { getCurrentUser, logout } from './authApi';
import {
  hasPermission as checkPermission,
  isPlanFeatureEnabled as checkPlanFeature,
  hasAccess as checkAccess,
  can as checkCan,
  isFeatureEnabled as checkFeatureEnabled,
  isSuperAdmin,
  isDeveloper,
  isAdmin,
} from './permissionUtils';

export interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  // Granular permission functions
  hasPermission: (module: string, feature: string) => boolean;
  isPlanFeatureEnabled: (module: string, feature?: string) => boolean;
  hasAccess: (module: string, feature: string) => boolean;
  // Legacy functions
  can: (module: string, action?: keyof Permission) => boolean;
  isFeatureEnabled: (module: string) => boolean;
  // Actions
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  // Role helpers
  isSuperAdmin: boolean;
  isDeveloper: boolean;
  isAdmin: boolean;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(getCachedUser());
  const [isLoading, setIsLoading] = useState(!getCachedUser());

  const initAuth = useCallback(async () => {
    // Skip API call if no login session exists (avoids unnecessary 401s on public pages)
    if (!hasActiveSession()) {
      setIsLoading(false);
      return;
    }

    try {
      const freshUser = await getCurrentUser();
      setUser(freshUser);
    } catch (error: unknown) {
      const axiosErr = error as { status?: number; response?: { status?: number } };
      const status = axiosErr.status || axiosErr.response?.status;

      if (status === 401) {
        // Session expired - clear the indicator
        clearLoginTime();
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
    if (!getCachedUser()) initAuth();

    const unsubscribe = subscribeToAuthChanges((updatedUser) => {
      setUser(updatedUser);
    });
    return () => unsubscribe();
  }, [initAuth]);

  const refreshUser = useCallback(async () => {
    setIsLoading(true);
    await initAuth();
  }, [initAuth]);

  // Permission functions bound to current user
  const hasPermission = useCallback(
    (module: string, feature: string) => checkPermission(user, module, feature),
    [user]
  );

  const isPlanFeatureEnabled = useCallback(
    (module: string, feature?: string) => checkPlanFeature(user, module, feature),
    [user]
  );

  const hasAccess = useCallback(
    (module: string, feature: string) => checkAccess(user, module, feature),
    [user]
  );

  const can = useCallback(
    (module: string, action: keyof Permission = 'view') => checkCan(user, module, action),
    [user]
  );

  const isFeatureEnabled = useCallback(
    (module: string) => checkFeatureEnabled(user, module),
    [user]
  );

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    // Granular permission functions
    hasPermission,
    isPlanFeatureEnabled,
    hasAccess,
    // Legacy functions
    can,
    isFeatureEnabled,
    // Actions
    logout,
    refreshUser,
    // Role helpers
    isSuperAdmin: isSuperAdmin(user),
    isDeveloper: isDeveloper(user),
    isAdmin: isAdmin(user),
  };
};
