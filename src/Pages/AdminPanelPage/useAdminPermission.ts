import { useState, useCallback } from 'react';
import {
  type ModulePermissions,
  type PermissionAction,
  type BackendModulePermissions,
  MODULE_KEY_MAP,
  MODULES_LIST
} from './admin.types';

/**
 * Helper to determine if all standard actions are true for a module
 */
const checkIsAllSelected = (p: Omit<ModulePermissions, 'all'>) =>
  p.view && p.add && p.update && p.delete;

/**
 * Convert frontend permissions (display names) to backend format (camelCase keys)
 * Strips the 'all' key which is frontend-only
 */
export const toBackendPermissions = (
  permissions: Record<string, ModulePermissions>
): Record<string, BackendModulePermissions> => {
  return Object.entries(permissions).reduce((acc, [displayName, perms]) => {
    const backendKey = MODULE_KEY_MAP[displayName] || displayName;
    const { all, ...backendPerms } = perms;
    acc[backendKey] = backendPerms;
    return acc;
  }, {} as Record<string, BackendModulePermissions>);
};

/**
 * Convert backend permissions (camelCase keys) to frontend format (display names)
 * Adds the computed 'all' flag
 */
export const fromBackendPermissions = (
  backendPerms: Record<string, BackendModulePermissions>
): Record<string, ModulePermissions> => {
  // Start with all modules set to false
  const result: Record<string, ModulePermissions> = {};

  MODULES_LIST.forEach(displayName => {
    const backendKey = MODULE_KEY_MAP[displayName];
    const perms = backendPerms[backendKey] || { view: false, add: false, update: false, delete: false };

    result[displayName] = {
      ...perms,
      all: checkIsAllSelected(perms)
    };
  });

  return result;
};

/**
 * Custom hook for managing role permissions in the Admin Panel
 */
export const useAdminPermissions = (initialModules: string[]) => {
  // Initialize state with valid module keys from your list
  const [permissions, setPermissions] = useState<Record<string, ModulePermissions>>(() =>
    initialModules.reduce((acc, module) => {
      acc[module] = { all: false, add: false, update: false, view: false, delete: false };
      return acc;
    }, {} as Record<string, ModulePermissions>)
  );

  /**
   * Enhanced Toggle logic
   * Properly syncs the 'all' toggle with individual permissions
   */
  const togglePermission = useCallback((module: string, type: PermissionAction) => {
    setPermissions((prev) => {
      const current = { ...prev[module] };

      if (type === 'all') {
        const targetValue = !current.all;
        return {
          ...prev,
          [module]: {
            all: targetValue,
            add: targetValue,
            update: targetValue,
            view: targetValue,
            delete: targetValue,
          },
        };
      }

      // Toggle the specific action
      current[type] = !current[type];

      // Update the 'all' status based on new individual values
      current.all = checkIsAllSelected(current);

      return { ...prev, [module]: current };
    });
  }, []);

  /**
   * Reset all permissions to false
   */
  const revokeAll = useCallback(() => {
    setPermissions((prev) =>
      Object.keys(prev).reduce((acc, key) => {
        acc[key] = { all: false, add: false, update: false, view: false, delete: false };
        return acc;
      }, {} as Record<string, ModulePermissions>)
    );
  }, []);

  /**
   * Set all permissions to true
   */
  const grantAll = useCallback(() => {
    setPermissions((prev) =>
      Object.keys(prev).reduce((acc, key) => {
        acc[key] = { all: true, add: true, update: true, view: true, delete: true };
        return acc;
      }, {} as Record<string, ModulePermissions>)
    );
  }, []);

  /**
   * Load permissions from backend format
   * Used when a role is selected from the dropdown
   */
  const loadPermissions = useCallback((incomingPermissions: Record<string, BackendModulePermissions>) => {
    const updated = fromBackendPermissions(incomingPermissions);
    setPermissions(updated);
  }, []);

  /**
   * Get permissions in backend format for API calls
   */
  const getBackendPermissions = useCallback(() => {
    return toBackendPermissions(permissions);
  }, [permissions]);

  return {
    permissions,
    setPermissions: loadPermissions,
    togglePermission,
    revokeAll,
    grantAll,
    getBackendPermissions,
    isEverythingSelected:
      Object.values(permissions).length > 0 &&
      Object.values(permissions).every((p) => p.all),
  };
};