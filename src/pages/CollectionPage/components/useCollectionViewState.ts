import { useState, useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    CollectionRepository,
    type Collection,

} from "../../../api/collectionService";
import { useAuth } from "@/api/authService";
import { getParties } from "@/api/partyService";
import toast from "react-hot-toast";
import type { NewCollectionData } from "../../../api/collectionService";
import { useTableSelection } from "@/components/hooks/useTableSelection";

/**
 * Enterprise-grade Collection View State Hook
 * Follows the Facade Pattern: { state, actions, permissions }
 * Matches ExpensesPage architecture exactly
 */
export const useCollectionViewState = (itemsPerPage: number = 10) => {
    const queryClient = useQueryClient();
    const { hasPermission, user } = useAuth();

    // --- 1. UI State (Modals & Visuals) ---
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [idsToDelete, setIdsToDelete] = useState<string[]>([]);
    const [isFilterVisible, setIsFilterVisible] = useState(false);

    // --- 2. Filter State ---
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState(""); // Party name or collection number
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedMonth, setSelectedMonth] = useState<string[]>([]);
    const [selectedParty, setSelectedParty] = useState<string[]>([]);
    const [selectedCreatedBy, setSelectedCreatedBy] = useState<string[]>([]);
    const [selectedPaymentMode, setSelectedPaymentMode] = useState<string[]>([]);
    const [selectedChequeStatus, setSelectedChequeStatus] = useState<string[]>([]);

    // --- 3. Permissions (Granular) ---
    const permissions = useMemo(() => ({
        canView: hasPermission("collections", "view"),
        canCreate: hasPermission("collections", "create"),
        canUpdate: hasPermission("collections", "update"),
        canDelete: hasPermission("collections", "delete"),
        canBulkDelete: hasPermission("collections", "bulkDelete"),
        canUpdateChequeStatus: hasPermission("collections", "updateChequeStatus"),
        canExportPdf: hasPermission("collections", "exportPdf"),
        canExportExcel: hasPermission("collections", "exportExcel"),
        canViewDetail: hasPermission("collections", "viewDetails"),
    }), [hasPermission]);

    // --- 4. Data Fetching (Fetch ALL for client-side filtering) ---

    const collectionsQuery = useQuery<Collection[]>({
        queryKey: ['collections', 'list'],
        queryFn: async () => {
            return CollectionRepository.getCollections();
        },
        placeholderData: (prev) => prev,
    });

    const allCollections = useMemo(() => collectionsQuery.data || [], [collectionsQuery.data]);

    // --- 5. Logic: Client-Side Filtering ---
    const filteredCollections = useMemo(() => {
        return allCollections.filter((collection) => {
            // Search by party name or collection number
            const partyName = (collection.partyName || "").toLowerCase();
            const paymentMode = (collection.paymentMode || "").toLowerCase();
            const term = (searchTerm || "").toLowerCase();
            const matchesSearch = term === "" ||
                partyName.includes(term) ||
                paymentMode.includes(term);

            // Month filter
            let matchesMonth = true;
            if (selectedMonth.length > 0 && collection.receivedDate) {
                const date = new Date(collection.receivedDate);
                const monthName = date.toLocaleString('default', { month: 'long' });
                matchesMonth = selectedMonth.includes(monthName);
            }

            // Date filter
            let matchesDate = true;
            if (selectedDate && collection.receivedDate) {
                const d1 = new Date(collection.receivedDate);
                const d2 = selectedDate;
                matchesDate = d1.getFullYear() === d2.getFullYear() &&
                    d1.getMonth() === d2.getMonth() &&
                    d1.getDate() === d2.getDate();
            }

            // Party filter
            const matchesParty = selectedParty.length === 0 ||
                selectedParty.includes(collection.partyName);

            // Payment Mode filter
            const matchesPaymentMode = selectedPaymentMode.length === 0 ||
                selectedPaymentMode.includes(collection.paymentMode);

            // Cheque Status filter (only applies if payment mode is Cheque)
            let matchesChequeStatus = true;
            if (selectedChequeStatus.length > 0) {
                if (collection.paymentMode === 'Cheque' && collection.chequeStatus) {
                    matchesChequeStatus = selectedChequeStatus.includes(collection.chequeStatus);
                } else {
                    // If filtering by cheque status but this isn't a cheque, exclude it
                    matchesChequeStatus = false;
                }
            }

            // Created By filter
            const matchesCreatedBy = selectedCreatedBy.length === 0 ||
                (collection.createdBy?.name && selectedCreatedBy.includes(collection.createdBy.name));

            return matchesSearch && matchesMonth && matchesDate &&
                matchesParty && matchesPaymentMode && matchesChequeStatus && matchesCreatedBy;
        }).sort((a, b) => {
            // Sort by createdAt descending (LIFO - Newest created first)
            // This ensures that when a user creates a new record, it appears at the top regardless of the 'received date'
            const timeA = new Date(a.createdAt).getTime();
            const timeB = new Date(b.createdAt).getTime();
            return timeB - timeA;
        });
    }, [allCollections, searchTerm, selectedMonth, selectedDate, selectedParty,
        selectedPaymentMode, selectedChequeStatus, selectedCreatedBy]);

    // --- 6. Logic: Client-Side Pagination ---
    const totalItems = filteredCollections.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedCollections = filteredCollections.slice(startIndex, startIndex + itemsPerPage);

    // --- Auxiliary Data ---
    const partiesQuery = useQuery({
        queryKey: ["parties-list"],
        queryFn: () => getParties(),
        enabled: isCreateModalOpen
    });

    // --- Selection State ---
    const { selectedIds, toggleRow, clearSelection, selectMultiple } = useTableSelection(paginatedCollections);

    const selectAllFiltered = useCallback((ids: string[]) => {
        if (ids.length > 0) selectMultiple(ids);
        else clearSelection();
    }, [selectMultiple, clearSelection]);

    // --- Mutations ---
    const createMutation = useMutation({
        mutationFn: async ({ data, files }: { data: NewCollectionData, files: File[] }) => {
            // Merge files into data so the service handles sequential upload
            const collectionData = { ...data, images: files };

            // 1. Create Collection (Service handles creation + sequential images)
            const newCollection = await CollectionRepository.createCollection(collectionData);

            return newCollection;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['collections'] });
            toast.success("Collection recorded successfully");
            setCurrentPage(1);
            setIsCreateModalOpen(false);
        },
        onError: (err: Error) => toast.error(err.message || "Failed to record collection")
    });

    const chequeStatusMutation = useMutation({
        mutationFn: ({ id, status, depositDate }: {
            id: string;
            status: 'Pending' | 'Deposited' | 'Cleared' | 'Bounced';
            depositDate?: string;
        }) => CollectionRepository.updateChequeStatus(id, status, depositDate),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['collections'] });
            toast.success("Cheque status updated successfully");
        },
        onError: (err: Error) => toast.error(err.message || "Failed to update cheque status")
    });

    const bulkDeleteMutation = useMutation({
        mutationFn: (ids: string[]) => CollectionRepository.bulkDeleteCollections(ids),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['collections'] });
            toast.success("Selected records deleted");
            setIsDeleteModalOpen(false);
            setIdsToDelete([]);
            clearSelection();
        },
        onError: (err: Error) => toast.error(err.message || "Failed to delete collections")
    });

    const handleFilterReset = useCallback(() => {
        setSearchTerm("");
        setSelectedDate(null);
        setSelectedMonth([]);
        setSelectedParty([]);
        setSelectedCreatedBy([]);
        setSelectedPaymentMode([]);
        setSelectedChequeStatus([]);
        setCurrentPage(1);
    }, []);

    // --- 7. Return Facade ---
    const uniqueParties = useMemo(() =>
        Array.from(new Set(allCollections.map(c => c.partyName).filter(Boolean))),
        [allCollections]
    );

    const uniquePaymentModes = useMemo(() =>
        Array.from(new Set(allCollections.map(c => c.paymentMode).filter(Boolean))),
        [allCollections]
    );

    const uniqueCreators = useMemo(() =>
        Array.from(new Set(allCollections.map(c => c.createdBy?.name).filter(Boolean))),
        [allCollections]
    );

    const uniqueChequeStatuses = useMemo(() =>
        Array.from(new Set(
            allCollections
                .filter(c => c.paymentMode === 'Cheque' && c.chequeStatus)
                .map(c => c.chequeStatus)
        )) as string[],
        [allCollections]
    );

    return {
        state: {
            collections: paginatedCollections,
            allFilteredCollections: filteredCollections,
            isLoading: collectionsQuery.isFetching,
            isCreating: createMutation.isPending,
            isDeleting: bulkDeleteMutation.isPending,
            isUpdatingChequeStatus: chequeStatusMutation.isPending,
            isFilterVisible,

            // Selection
            selectedIds,

            // Modals
            isCreateModalOpen,
            isDeleteModalOpen,
            idsToDelete,

            // Filters
            currentPage,
            totalPages,
            itemsPerPage,
            totalItems,
            searchTerm,
            selectedDate,
            selectedMonth,
            selectedParty,
            selectedCreatedBy,
            selectedPaymentMode,
            selectedChequeStatus,

            // Filter Options
            parties: uniqueParties,
            creators: uniqueCreators,
            paymentModes: uniquePaymentModes,
            chequeStatuses: uniqueChequeStatuses,

            // Aux Data
            partiesData: partiesQuery.data || [],
            userProfile: user,
        },

        actions: {
            // Modals
            openCreateModal: () => {
                setIsCreateModalOpen(true);
            },
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
            setSelectedParty,
            setSelectedCreatedBy,
            setSelectedPaymentMode,
            setSelectedChequeStatus,
            resetFilters: handleFilterReset,

            // Operations
            createCollection: createMutation.mutate,
            updateChequeStatus: chequeStatusMutation.mutate,
            deleteCollections: bulkDeleteMutation.mutate,

            // Selection
            toggleSelection: toggleRow,
            selectAll: selectAllFiltered,
            clearSelection,

            // UI
            toggleFilterVisibility: () => setIsFilterVisible(prev => !prev),
        },

        permissions
    };
};
