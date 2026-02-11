import { useMemo } from 'react';
import { useAuth } from '@/api/authService';

export interface EmployeePermissions {
    canCreate: boolean;
    canExport: boolean;
}

/**
 * Hook for managing employee-related permissions.
 * Separates permission logic from data and UI concerns.
 */
export const useEmployeePermissions = (): EmployeePermissions => {
    const { hasPermission } = useAuth();

    return useMemo(() => ({
        canCreate: hasPermission("employees", "create"),
        canExport: hasPermission("employees", "exportPdf") || hasPermission("employees", "exportExcel"),
    }), [hasPermission]);
};
