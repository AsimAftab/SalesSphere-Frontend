// BeatPlanPage Types
// Re-export domain types from the service
export type {
    BeatPlan,
    AssignedEmployee,
    AssignedParty,
    AssignedSite,
    AssignedProspect,
    DirectoryLocation,
    SimpleDirectory
} from '@/api/beatPlanService';

// Page-specific types
export interface BeatPlanFilters {
    searchTerm: string;
    selectedDate: Date | null;
    selectedMonth: string[];
    selectedEmployee: string[];
    selectedStatus: string[];
}

export interface BeatPlanPermissions {
    canView: boolean;
    canCreate: boolean;
    canUpdate: boolean;
    canDelete: boolean;
    canAssign: boolean;
    canStart: boolean;
    canComplete: boolean;
    canBulkDelete: boolean;
    canExportPdf: boolean;
    canExportExcel: boolean;
    canViewDetail: boolean;
}

export type BeatPlanTabType = 'templates' | 'active' | 'completed';
