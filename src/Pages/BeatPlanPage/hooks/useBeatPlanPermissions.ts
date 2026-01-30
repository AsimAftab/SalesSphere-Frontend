import { useMemo } from 'react';
import { useAuth } from '../../../api/authService';

export interface BeatPlanPermissions {
    // Template (BeatPlanList) permissions
    canViewTemplates: boolean;
    canCreateTemplate: boolean;
    canUpdateTemplate: boolean;
    canDeleteTemplate: boolean;
    canViewTemplateDetails: boolean;

    // Beat Plan permissions
    canViewList: boolean;
    canViewDetails: boolean;
    canAssign: boolean;
    canDelete: boolean;

    // Export
    canExportPdf: boolean;
}

export const useBeatPlanPermissions = (): BeatPlanPermissions => {
    const { hasPermission } = useAuth();

    const permissions: BeatPlanPermissions = useMemo(() => ({
        // Template permissions
        canViewTemplates: hasPermission("beatPlan", "viewListTemplates"),
        canCreateTemplate: hasPermission("beatPlan", "createList"),
        canUpdateTemplate: hasPermission("beatPlan", "updateList"),
        canDeleteTemplate: hasPermission("beatPlan", "deleteList"),
        canViewTemplateDetails: hasPermission("beatPlan", "viewDetailsTemplate"),
        canAssign: hasPermission("beatPlan", "assign"),
        
        // Beat Plan permissions
        canViewList: hasPermission("beatPlan", "viewList"),
        canViewDetails: hasPermission("beatPlan", "viewDetails"),

        canDelete: hasPermission("beatPlan", "delete"),

        // Export
        canExportPdf: hasPermission("beatPlan", "exportPdf"),
    }), [hasPermission]);

    return permissions;
};
