import { useAuth } from "@/api/authService";

export const useOdometerPermissions = () => {
    const { hasPermission, can } = useAuth();
    const MODULE = 'odometer';

    return {
        // "view" covers list and details
        canView: can(MODULE, 'view'),

        // "viewAllOdometer" allows viewing other employees' data
        canViewAll: hasPermission(MODULE, 'viewAllOdometer'),

        // "record" covers Create and Update (if implemented in UI)
        canRecord: hasPermission(MODULE, 'record'),

        // "delete" covers deletion
        canDelete: can(MODULE, 'delete'),

        // "exportPdf" covers exports
        canExport: hasPermission(MODULE, 'exportPdf')
    };
};