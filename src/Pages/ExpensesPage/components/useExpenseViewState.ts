import { useState, useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    ExpenseRepository,
    type ExpenseFilters,
    type Expense
} from "../../../api/expensesService";
import { useAuth } from "../../../api/authService";
import { getParties } from "../../../api/partyService"; // Needed for Create Modal
import toast from "react-hot-toast";
import { useTableSelection } from "../../../components/hooks/useTableSelection";

/**
 * Enterprise-grade Expense View State Hook
 * Follows the Pattern: { state, actions, permissions }
 */
export const useExpenseViewState = (itemsPerPage: number = 10) => {
    const queryClient = useQueryClient();
    const { hasPermission, user } = useAuth(); // Integrated Auth

    // --- 1. UI State (Modals & Visuals) ---
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [idsToDelete, setIdsToDelete] = useState<string[]>([]);

    // --- 2. Filter State ---
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedMonth, setSelectedMonth] = useState<string[]>([]);
    const [selectedUser, setSelectedUser] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
    const [selectedReviewer, setSelectedReviewer] = useState<string[]>([]);

    // --- 3. Permissions (Granular) ---
    const permissions = useMemo(() => ({
        canView: hasPermission("expenses", "view"),
        canCreate: hasPermission("expenses", "create"),
        canUpdate: hasPermission("expenses", "update"),
        canDelete: hasPermission("expenses", "delete"),
        canApprove: hasPermission("expenses", "approve"), // Special permission for status
        canExportPdf: hasPermission("expenses", "exportPdf"),
        canExportExcel: hasPermission("expenses", "exportExcel"),
        canViewDetail: hasPermission("expenses", "viewDetails"),
        isSuperAdmin: user?.role === 'superadmin' || user?.role === 'developer',
    }), [hasPermission, user?.role]);

    // --- 4. Data Fetching (Queries) ---

    // A. Filter Object Construction
    const filters = useMemo((): ExpenseFilters => ({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        date: selectedDate ? selectedDate.toISOString().split('T')[0] : undefined,
        month: selectedMonth.length > 0 ? selectedMonth[0] : undefined,
        submittedBy: selectedUser.length > 0 ? selectedUser[0] : undefined,
    }), [currentPage, itemsPerPage, searchTerm, selectedDate, selectedMonth, selectedUser]);

    // B. Main Data Query
    const expensesQuery = useQuery<Expense[]>({
        queryKey: ['expenses', 'list', filters],
        queryFn: () => ExpenseRepository.getExpenses(filters),
        placeholderData: (prev) => prev,
    });

    // C. Auxiliary Data (Categories & Parties for Modals)
    const categoriesQuery = useQuery({
        queryKey: ["expense-categories"],
        queryFn: () => ExpenseRepository.getExpenseCategories(),
        enabled: isCreateModalOpen // Lazy fetch
    });

    const partiesQuery = useQuery({
        queryKey: ["parties-list"],
        queryFn: () => getParties(),
        enabled: isCreateModalOpen // Lazy fetch
    });

    // --- Selection State ---
    const { selectedIds, toggleRow, clearSelection, selectMultiple } = useTableSelection(expensesQuery.data || []);

    // Wrapper for filtered selection
    const selectAllFiltered = useCallback((ids: string[]) => {
        if (ids.length > 0) selectMultiple(ids);
        else clearSelection();
    }, [selectMultiple, clearSelection]);

    // --- 5. Mutations ---

    const createMutation = useMutation({
        mutationFn: ({ data, file }: { data: any; file: File | null }) =>
            ExpenseRepository.createExpense(data, file),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses'] });
            toast.success("Expense recorded successfully");
            setIsCreateModalOpen(false);
        },
        onError: (err: any) => toast.error(err.message || "Failed to record expense")
    });

    const statusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string; status: 'approved' | 'rejected' | 'pending' }) =>
            ExpenseRepository.updateExpenseStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses'] });
            toast.success("Settlement status updated successfully");
        },
        onError: (err: any) => toast.error(err.message || "Failed to update status")
    });

    const bulkDeleteMutation = useMutation({
        mutationFn: (ids: string[]) => ExpenseRepository.bulkDeleteExpenses(ids),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses'] });
            toast.success("Selected records deleted");
            setIsDeleteModalOpen(false);
            setIdsToDelete([]);
            clearSelection();
        },
        onError: (err: any) => toast.error(err.message || "Failed to delete expenses")
    });

    const handleFilterReset = useCallback(() => {
        setSearchTerm("");
        setSelectedDate(null);
        setSelectedMonth([]);
        setSelectedUser([]);
        setSelectedCategory([]);
        setSelectedReviewer([]);
        setCurrentPage(1);
    }, []);

    // --- 7. Return Facade ---
    return {
        // State (Getters)
        state: {
            expenses: expensesQuery.data || [],
            isLoading: expensesQuery.isFetching,
            isCreating: createMutation.isPending,
            isDeleting: bulkDeleteMutation.isPending,
            isUpdatingStatus: statusMutation.isPending,

            // Selection
            selectedIds,

            // Modals
            isCreateModalOpen,
            isDeleteModalOpen,
            idsToDelete,

            // Filters
            currentPage,
            itemsPerPage,
            searchTerm,
            selectedDate,
            selectedMonth,
            selectedUser,
            selectedCategory,
            selectedReviewer,

            // Aux Data
            categories: categoriesQuery.data || [],
            parties: partiesQuery.data || [],
            userProfile: user, // For "My Submissions" vs "Others" checks
        },

        // Actions (Setters & Handlers)
        actions: {
            // Modals
            openCreateModal: () => setIsCreateModalOpen(true),
            closeCreateModal: () => setIsCreateModalOpen(false),
            openDeleteModal: (ids: string[]) => {
                setIdsToDelete(ids);
                setIsDeleteModalOpen(true);
            },
            closeDeleteModal: () => {
                setIsDeleteModalOpen(false);
                setIdsToDelete([]);
            },

            // Filters
            setSearchTerm: (val: string) => { setSearchTerm(val); setCurrentPage(1); },
            setCurrentPage,
            setSelectedDate,
            setSelectedMonth,
            setSelectedUser,
            setSelectedCategory,
            setSelectedReviewer,
            resetFilters: handleFilterReset,

            // Operations
            createExpense: createMutation.mutate,
            updateStatus: statusMutation.mutate,
            deleteExpenses: bulkDeleteMutation.mutate,

            // Selection
            toggleSelection: toggleRow,
            selectAll: selectAllFiltered,
        },

        // Permissions (Guards)
        permissions
    };
};
