import { useMemo } from 'react';
import { useAuth } from '@/api/authService';

export interface AttendancePermissions {
    canExportPdf: boolean;
    canExportExcel: boolean;
    canUpdateAttendance: boolean;
    canMarkLeave: boolean;
    canWebCheckIn: boolean;
}

/**
 * Hook for calculating attendance permissions
 * Single Responsibility: Permission calculations only
 */
export const useAttendancePermissions = (): AttendancePermissions => {
    const { hasPermission, user } = useAuth();

    const permissions: AttendancePermissions = useMemo(() => ({
        canExportPdf: hasPermission('attendance', 'exportPdf'),
        canExportExcel: hasPermission('attendance', 'exportExcel'),
        canUpdateAttendance: hasPermission('attendance', 'updateAttendance'),
        canMarkLeave: hasPermission('attendance', 'markLeave'),
        // Web check-in requires permission AND user must NOT be admin
        canWebCheckIn: hasPermission('attendance', 'webCheckIn') && user?.role !== 'admin',
    }), [hasPermission, user]);

    return permissions;
};
