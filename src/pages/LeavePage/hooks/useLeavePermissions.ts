import { useMemo } from 'react';
import { useAuth } from '@/api/authService';

export interface LeavePermissions {
    canCreate: boolean;
    canUpdate: boolean;
    canDelete: boolean;
    canBulkDelete: boolean;
    canApprove: boolean;
    canExportPdf: boolean;
    canExportExcel: boolean;
}

/**
 * Hook for calculating leave permissions
 * Single Responsibility: Permission calculations only
 */
export const useLeavePermissions = (): LeavePermissions => {
    const { hasPermission } = useAuth();

    const permissions: LeavePermissions = useMemo(() => ({
        canCreate: hasPermission("leaves", "create"),
        canUpdate: hasPermission("leaves", "update"),
        canDelete: hasPermission("leaves", "delete"),
        canBulkDelete: hasPermission("leaves", "bulkDelete"),
        canApprove: hasPermission("leaves", "updateStatus"),
        canExportPdf: hasPermission("leaves", "exportPdf"),
        canExportExcel: hasPermission("leaves", "exportExcel"),
    }), [hasPermission]);

    return permissions;
};
