import { useState, useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    ExpenseRepository,
    type Expense,
    type CreateExpenseRequest,
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
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [reviewingExpense, setReviewingExpense] = useState<Expense | null>(null); // Moved from View

    // --- 2. Filter State ---
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedMonth, setSelectedMonth] = useState<string[]>([]);
    const [selectedUser, setSelectedUser] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
    const [selectedReviewer, setSelectedReviewer] = useState<string[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<string[]>([]);

    // --- 3. Permissions (Granular) ---
    const permissions = useMemo(() => ({
        canView: hasPermission("expenses", "viewList"),
        canCreate: hasPermission("expenses", "create"),
        canUpdate: hasPermission("expenses", "update"),
        canDelete: hasPermission("expenses", "delete"),
        canBulkDelete: hasPermission("expenses", "bulkDelete"),
        canApprove: hasPermission("expenses", "updateStatus"),
        canExportPdf: hasPermission("expenses", "exportPdf"),
        canExportExcel: hasPermission("expenses", "exportExcel"),
        canViewDetail: hasPermission("expenses", "viewDetails"),
    }), [hasPermission]);

    // --- 4. Data Fetching (Fetch ALL for client-side filtering consistency) ---
    // Note: API doesn't support category/reviewer filters, so we fetch all and filter locally to avoid broken pagination.
    const expensesQuery = useQuery<Expense[]>({
        queryKey: ['expenses', 'list'],
        queryFn: () => ExpenseRepository.getExpenses({}),
        placeholderData: (prev) => prev,
    });

    const allExpenses = expensesQuery.data || [];

    // --- 5. Logic: Client-Side Filtering ---
    const filteredExpenses = useMemo(() => {
        return allExpenses.filter((exp) => {
            // Search
            const title = (exp.title || "").toLowerCase();
            const category = (exp.category || "").toLowerCase();
            const term = (searchTerm || "").toLowerCase();
            const matchesSearch = term === "" || title.includes(term) || category.includes(term);

            // Month
            let matchesMonth = true;
            if (selectedMonth.length > 0 && exp.incurredDate) {
                const date = new Date(exp.incurredDate);
                const monthName = date.toLocaleString('default', { month: 'long' });
                matchesMonth = selectedMonth.includes(monthName);
            }

            // Date
            let matchesDate = true;
            if (selectedDate && exp.incurredDate) {
                const d1 = new Date(exp.incurredDate);
                const d2 = selectedDate;
                matchesDate = d1.getFullYear() === d2.getFullYear() &&
                    d1.getMonth() === d2.getMonth() &&
                    d1.getDate() === d2.getDate();
            }

            // User
            const matchesUser = selectedUser.length === 0 ||
                (exp.createdBy?.name && selectedUser.includes(exp.createdBy.name));

            // Category
            const matchesCategory = selectedCategory.length === 0 ||
                selectedCategory.includes(exp.category);

            // Reviewer
            const reviewerName = exp.approvedBy?.name || "None";
            const matchesReviewer = selectedReviewer.length === 0 ||
                selectedReviewer.includes(reviewerName);

            // Status
            const matchesStatus = selectedStatus.length === 0 ||
                selectedStatus.includes(exp.status);

            return matchesSearch && matchesMonth && matchesDate && matchesUser && matchesCategory && matchesReviewer && matchesStatus;
        });
    }, [allExpenses, searchTerm, selectedMonth, selectedDate, selectedUser, selectedCategory, selectedReviewer, selectedStatus]);

    // --- 6. Logic: Client-Side Pagination ---
    const totalItems = filteredExpenses.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedExpenses = filteredExpenses.slice(startIndex, startIndex + itemsPerPage);

    // --- Auxiliary Data ---
    const categoriesQuery = useQuery({
        queryKey: ["expense-categories"],
        queryFn: () => ExpenseRepository.getExpenseCategories(),
        enabled: isCreateModalOpen
    });

    const partiesQuery = useQuery({
        queryKey: ["parties-list"],
        queryFn: () => getParties(),
        enabled: isCreateModalOpen
    });

    // --- Selection State ---
    const { selectedIds, toggleRow, clearSelection, selectMultiple } = useTableSelection(paginatedExpenses);

    const selectAllFiltered = useCallback((ids: string[]) => {
        if (ids.length > 0) selectMultiple(ids);
        else clearSelection();
    }, [selectMultiple, clearSelection]);

    // --- Mutations ---
    const createMutation = useMutation({
        mutationFn: ({ data, file }: { data: CreateExpenseRequest; file: File | null }) =>
            ExpenseRepository.createExpense(data, file),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses'] });
            toast.success("Expense recorded successfully");
            setIsCreateModalOpen(false);
        },
        onError: (err: Error) => toast.error(err.message || "Failed to record expense")
    });

    const statusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string; status: 'approved' | 'rejected' | 'pending' }) =>
            ExpenseRepository.updateExpenseStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses'] });
            toast.success("Settlement status updated successfully");
            setReviewingExpense(null); // Close modal on success
        },
        onError: (err: Error) => toast.error(err.message || "Failed to update status")
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
        onError: (err: Error) => toast.error(err.message || "Failed to delete expenses")
    });

    const handleFilterReset = useCallback(() => {
        setSearchTerm("");
        setSelectedDate(null);
        setSelectedMonth([]);
        setSelectedUser([]);
        setSelectedCategory([]);
        setSelectedReviewer([]);
        setSelectedStatus([]);
        setCurrentPage(1);
    }, []);

    // --- 7. Business Logic Actions ---
    const initiateStatusUpdate = useCallback((expense: Expense) => {
        // 1. Status Lock Check
        if (expense.status !== 'pending') {
            toast.error(`Cannot change status of a ${expense.status} expense claim`);
            return;
        }

        // 2. Permission Check
        if (!permissions.canApprove) {
            toast.error("You do not have permission to update status");
            return;
        }

        // 3. Creator Check (Self-Approval Restriction)
        const userId = user?.id || user?._id;
        const creatorId = typeof expense.createdBy === 'object' ? (expense.createdBy.id) : expense.createdBy;
        const isCreator = userId === creatorId;
        const isAdmin = user?.role === 'admin';

        if (isCreator && !isAdmin) {
            toast.error("You cannot update the status of your own expense");
            return;
        }

        setReviewingExpense(expense);
    }, [permissions.canApprove, user]);

    // --- 8. Return Facade ---
    const uniqueSubmitters = useMemo(() => Array.from(new Set(allExpenses.map(e => e.createdBy.name).filter(Boolean))), [allExpenses]);
    const uniqueReviewers = useMemo(() => Array.from(new Set(allExpenses.map(e => e.approvedBy?.name).filter(Boolean))) as string[], [allExpenses]);
    const uniqueCategories = useMemo(() => Array.from(new Set(allExpenses.map(e => e.category).filter(Boolean))), [allExpenses]);

    return {
        state: {
            expenses: paginatedExpenses, // Render ONLY paginated data
            allFilteredExpenses: filteredExpenses, // For Exports
            isLoading: expensesQuery.isFetching,
            isCreating: createMutation.isPending,
            isDeleting: bulkDeleteMutation.isPending,
            isUpdatingStatus: statusMutation.isPending,
            isFilterVisible,

            // Selection
            selectedIds,

            // Modals
            isCreateModalOpen,
            isDeleteModalOpen,
            idsToDelete,
            reviewingExpense, // Expose for StatusUpdateModal

            // Filters
            currentPage,
            totalPages,
            itemsPerPage,
            totalItems,
            searchTerm,
            selectedDate,
            selectedMonth,
            selectedUser,
            selectedCategory,
            selectedReviewer,
            selectedStatus,

            // Filter Options
            submitters: uniqueSubmitters,
            reviewers: uniqueReviewers,
            uniqueCategories,

            // Aux Data
            categories: categoriesQuery.data || [],
            parties: partiesQuery.data || [],
            userProfile: user,
        },

        actions: {
            // Modals
            openCreateModal: () => setIsCreateModalOpen(true),
            closeCreateModal: () => setIsCreateModalOpen(false),
            openDeleteModal: (ids: string[]) => {
                // Filter out approved expenses — same rule as the detail page
                const deletableIds = ids.filter(id => {
                    const expense = allExpenses.find(e => e.id === id);
                    return expense?.status !== 'approved';
                });

                if (deletableIds.length === 0) {
                    toast.error('None of the selected expenses can be deleted. Approved expenses cannot be deleted.');
                    return;
                }

                const skippedCount = ids.length - deletableIds.length;
                if (skippedCount > 0) {
                    toast(`${skippedCount} approved expense(s) were excluded from deletion.`, { icon: '⚠️' });
                }

                setIdsToDelete(deletableIds);
                setIsDeleteModalOpen(true);
            },
            closeDeleteModal: () => {
                setIsDeleteModalOpen(false);
                setIdsToDelete([]);
            },

            // Status Logic
            initiateStatusUpdate,
            closeStatusModal: () => setReviewingExpense(null),

            // Filters
            setSearchTerm: (val: string) => { setSearchTerm(val); setCurrentPage(1); },
            setCurrentPage,
            setSelectedDate,
            setSelectedMonth,
            setSelectedUser,
            setSelectedCategory,
            setSelectedReviewer,
            setSelectedStatus,
            resetFilters: handleFilterReset,

            // Operations
            createExpense: createMutation.mutate,
            updateStatus: statusMutation.mutate,
            deleteExpenses: bulkDeleteMutation.mutate,

            // Selection
            toggleSelection: toggleRow,
            selectAll: selectAllFiltered,

            // UI
            toggleFilterVisibility: () => setIsFilterVisible(prev => !prev),
        },

        permissions
    };
};
