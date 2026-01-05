
import { useState, useCallback } from 'react';
import { type ModulePermissions,type  PermissionAction } from './admin.types';

export const useAdminPermissions = (initialModules: string[]) => {
  const [permissions, setPermissions] = useState<Record<string, ModulePermissions>>(
    initialModules.reduce((acc, module) => {
      acc[module] = { all: false, add: true, update: false, view: false, delete: false };
      return acc;
    }, {} as Record<string, ModulePermissions>)
  );

  const togglePermission = useCallback((module: string, type: PermissionAction) => {
    setPermissions((prev) => {
      const current = prev[module];
      const newVal = !current[type];
      if (type === 'all') {
        return { ...prev, [module]: { all: newVal, add: newVal, update: newVal, view: newVal, delete: newVal } };
      }
      return { ...prev, [module]: { ...current, [type]: newVal } };
    });
  }, []);

  const revokeAll = useCallback(() => {
    setPermissions(prev => 
      Object.keys(prev).reduce((acc, key) => {
        acc[key] = { all: false, add: false, update: false, view: false, delete: false };
        return acc;
      }, {} as Record<string, ModulePermissions>)
    );
  }, []);

  const grantAll = useCallback(() => {
    setPermissions(prev => 
      Object.keys(prev).reduce((acc, key) => {
        acc[key] = { all: true, add: true, update: true, view: true, delete: true };
        return acc;
      }, {} as Record<string, ModulePermissions>)
    );
  }, []);

  return { 
    permissions, 
    togglePermission, 
    revokeAll, 
    grantAll, 
    isEverythingSelected: Object.values(permissions).every(p => p.all) 
  };
};