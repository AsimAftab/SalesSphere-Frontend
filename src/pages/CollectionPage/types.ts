// CollectionPage Types
// Re-export domain types from the service
export type {
    Collection,
    NewCollectionData,
    BulkDeleteResult
} from '@/api/collectionService';

// Page-specific types
export interface CollectionFilters {
    searchTerm: string;
    selectedDate: Date | null;
    selectedMonth: string[];
    selectedParty: string[];
    selectedCreatedBy: string[];
    selectedPaymentMode: string[];
    selectedChequeStatus: string[];
}

export interface CollectionPermissions {
    canView: boolean;
    canCreate: boolean;
    canUpdate: boolean;
    canDelete: boolean;
    canBulkDelete: boolean;
    canUpdateChequeStatus: boolean;
    canExportPdf: boolean;
    canExportExcel: boolean;
    canViewDetail: boolean;
}
