// ExpensesPage Types
// Re-export domain types from the service
export type {
    Expense,
    UserInfo,
    CreateExpenseRequest,
    ExpenseFilters
} from '@/api/expenseService';

// Page-specific types
export interface ExpenseViewFilters {
    searchTerm: string;
    selectedDate: Date | null;
    selectedMonth: string[];
    selectedCategory: string[];
    selectedSubmittedBy: string[];
    selectedStatus: string[];
}

export interface ExpensePermissions {
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
