// MiscellaneousWorkPage Types
// Re-export domain types from the service
export type {
    MiscWork,
    GetMiscWorksOptions,
    GetMiscWorksResponse
} from '@/api/miscellaneousWorkService';

// Page-specific types
export interface MiscWorkFilters {
    searchTerm: string;
    selectedDate: Date | null;
    selectedMonth: string[];
    selectedEmployee: string[];
}

export interface MiscWorkPermissions {
    canView: boolean;
    canCreate: boolean;
    canUpdate: boolean;
    canDelete: boolean;
    canBulkDelete: boolean;
    canExportPdf: boolean;
    canExportExcel: boolean;
    canViewDetail: boolean;
}
