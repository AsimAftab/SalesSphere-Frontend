// TourPlanPage Types
// Re-export domain types from the service
export type {
    TourPlan,
    TourStatus,
    UserInfo,
    CreateTourRequest,
    TourPlanFilters
} from '@/api/tourPlanService';

// Page-specific types
export interface TourPlanPermissions {
    canView: boolean;
    canCreate: boolean;
    canUpdate: boolean;
    canDelete: boolean;
    canApprove: boolean;
    canReject: boolean;
    canBulkDelete: boolean;
    canExportPdf: boolean;
    canExportExcel: boolean;
    canViewDetail: boolean;
}
