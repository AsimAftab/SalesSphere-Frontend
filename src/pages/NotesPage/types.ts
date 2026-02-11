// NotesPage Types
// Re-export domain types from the service
export type {
    Note,
    NoteImage,
    UserInfo,
    CreateNoteRequest
} from '@/api/notesService';

// Page-specific types
export interface NoteFilters {
    searchTerm: string;
    selectedDate: Date | null;
    selectedMonth: string[];
    selectedCreatedBy: string[];
    selectedEntityType: string[];
}

export interface NotePermissions {
    canView: boolean;
    canCreate: boolean;
    canUpdate: boolean;
    canDelete: boolean;
    canBulkDelete: boolean;
    canExportPdf: boolean;
    canExportExcel: boolean;
    canViewDetail: boolean;
}
