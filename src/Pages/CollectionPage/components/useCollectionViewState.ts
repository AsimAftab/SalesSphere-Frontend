import { useState, useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    CollectionRepository,
    type Collection,
} from "../../../api/collectionService";
import { useAuth } from "../../../api/authService";
import { getParties } from "../../../api/partyService";
import toast from "react-hot-toast";
import { useTableSelection } from "../../../components/hooks/useTableSelection";

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

    const MOCK_COLLECTIONS: Collection[] = [
        {
            id: '507f1f77bcf86cd799439011',
            _id: '507f1f77bcf86cd799439011',
            collectionNumber: 'COL-001',
            partyId: 'p1',
            partyName: 'Tech Solutions Ltd',
            paidAmount: 25000,
            paymentMode: 'Cash',
            receivedDate: '2024-03-15',
            createdBy: { _id: 'u1', name: 'John Doe' },
            createdAt: '2024-03-15T10:00:00Z',
            updatedAt: '2024-03-15T10:00:00Z'
        },
        {
            id: '507f1f77bcf86cd799439012',
            _id: '507f1f77bcf86cd799439012',
            collectionNumber: 'COL-002',
            partyId: 'p2',
            partyName: 'Global Traders',
            paidAmount: 50000,
            paymentMode: 'Cheque',
            chequeStatus: 'Pending',
            chequeNumber: 'CHQ-789456',
            receivedDate: '2024-03-14',
            createdBy: { _id: 'u1', name: 'John Doe' },
            createdAt: '2024-03-14T14:30:00Z',
            updatedAt: '2024-03-14T14:30:00Z'
        },
        {
            id: '507f1f77bcf86cd799439013',
            _id: '507f1f77bcf86cd799439013',
            collectionNumber: 'COL-003',
            partyId: 'p3',
            partyName: 'Alpha Corp',
            paidAmount: 12500.50,
            paymentMode: 'Bank Transfer',
            transactionId: 'TXN-123456789',
            receivedDate: '2024-03-13',
            createdBy: { _id: 'u2', name: 'Jane Smith' },
            createdAt: '2024-03-13T09:15:00Z',
            updatedAt: '2024-03-13T09:15:00Z'
        },
        {
            id: '507f1f77bcf86cd799439014',
            _id: '507f1f77bcf86cd799439014',
            collectionNumber: 'COL-004',
            partyId: 'p4',
            partyName: 'Beta Industries',
            paidAmount: 7500,
            paymentMode: 'QR Pay',
            transactionId: 'UPI-987654321',
            receivedDate: '2024-03-12',
            createdBy: { _id: 'u1', name: 'John Doe' },
            createdAt: '2024-03-12T16:45:00Z',
            updatedAt: '2024-03-12T16:45:00Z'
        },
        {
            id: '507f1f77bcf86cd799439015',
            _id: '507f1f77bcf86cd799439015',
            collectionNumber: 'COL-005',
            partyId: 'p5',
            partyName: 'Gamma Services',
            paidAmount: 33000,
            paymentMode: 'Cheque',
            chequeStatus: 'Cleared',
            chequeNumber: 'CHQ-456123',
            receivedDate: '2024-03-10',
            createdBy: { _id: 'u2', name: 'Jane Smith' },
            createdAt: '2024-03-10T11:20:00Z',
            updatedAt: '2024-03-10T11:20:00Z'
        },
        {
            id: '507f1f77bcf86cd799439016',
            _id: '507f1f77bcf86cd799439016',
            collectionNumber: 'COL-006',
            partyId: 'p6',
            partyName: 'Omega Inc',
            paidAmount: 18000,
            paymentMode: 'Cash',
            receivedDate: '2024-03-09',
            createdBy: { _id: 'u1', name: 'John Doe' },
            createdAt: '2024-03-09T09:30:00Z',
            updatedAt: '2024-03-09T09:30:00Z'
        },
        {
            id: '507f1f77bcf86cd799439017',
            _id: '507f1f77bcf86cd799439017',
            collectionNumber: 'COL-007',
            partyId: 'p7',
            partyName: 'Delta Force',
            paidAmount: 42500,
            paymentMode: 'Bank Transfer',
            transactionId: 'TXN-99887766',
            receivedDate: '2024-03-08',
            createdBy: { _id: 'u2', name: 'Jane Smith' },
            createdAt: '2024-03-08T15:45:00Z',
            updatedAt: '2024-03-08T15:45:00Z'
        },
        {
            id: '507f1f77bcf86cd799439018',
            _id: '507f1f77bcf86cd799439018',
            collectionNumber: 'COL-008',
            partyId: 'p8',
            partyName: 'Sigma Solutions',
            paidAmount: 15000,
            paymentMode: 'Cheque',
            chequeStatus: 'Bounced',
            chequeNumber: 'CHQ-112233',
            receivedDate: '2024-03-07',
            createdBy: { _id: 'u1', name: 'John Doe' },
            createdAt: '2024-03-07T10:15:00Z',
            updatedAt: '2024-03-07T10:15:00Z'
        },
        {
            id: '507f1f77bcf86cd799439019',
            _id: '507f1f77bcf86cd799439019',
            collectionNumber: 'COL-009',
            partyId: 'p9',
            partyName: 'Zeta Corp',
            paidAmount: 9500,
            paymentMode: 'QR Pay',
            transactionId: 'UPI-55443322',
            receivedDate: '2024-03-06',
            createdBy: { _id: 'u2', name: 'Jane Smith' },
            createdAt: '2024-03-06T12:00:00Z',
            updatedAt: '2024-03-06T12:00:00Z'
        },
        {
            id: '507f1f77bcf86cd79943901a',
            _id: '507f1f77bcf86cd79943901a',
            collectionNumber: 'COL-010',
            partyId: 'p3',
            partyName: 'Alpha Corp',
            paidAmount: 55000,
            paymentMode: 'Cash',
            receivedDate: '2024-03-05',
            createdBy: { _id: 'u1', name: 'John Doe' },
            createdAt: '2024-03-05T14:20:00Z',
            updatedAt: '2024-03-05T14:20:00Z'
        },
        {
            id: '507f1f77bcf86cd79943901b',
            _id: '507f1f77bcf86cd79943901b',
            collectionNumber: 'COL-011',
            partyId: 'p2',
            partyName: 'Global Traders',
            paidAmount: 28000,
            paymentMode: 'Cheque',
            chequeStatus: 'Deposited',
            chequeNumber: 'CHQ-998877',
            receivedDate: '2024-03-04',
            createdBy: { _id: 'u2', name: 'Jane Smith' },
            createdAt: '2024-03-04T11:00:00Z',
            updatedAt: '2024-03-04T11:00:00Z'
        },
        {
            id: '507f1f77bcf86cd79943901c',
            _id: '507f1f77bcf86cd79943901c',
            collectionNumber: 'COL-012',
            partyId: 'p1',
            partyName: 'Tech Solutions Ltd',
            paidAmount: 62000,
            paymentMode: 'Bank Transfer',
            transactionId: 'TXN-44556677',
            receivedDate: '2024-03-03',
            createdBy: { _id: 'u1', name: 'John Doe' },
            createdAt: '2024-03-03T16:30:00Z',
            updatedAt: '2024-03-03T16:30:00Z'
        },
        {
            id: '507f1f77bcf86cd79943901d',
            _id: '507f1f77bcf86cd79943901d',
            collectionNumber: 'COL-013',
            partyId: 'p5',
            partyName: 'Gamma Services',
            paidAmount: 4700,
            paymentMode: 'QR Pay',
            transactionId: 'UPI-11223344',
            receivedDate: '2024-03-02',
            createdBy: { _id: 'u2', name: 'Jane Smith' },
            createdAt: '2024-03-02T13:45:00Z',
            updatedAt: '2024-03-02T13:45:00Z'
        },
        {
            id: '507f1f77bcf86cd79943901e',
            _id: '507f1f77bcf86cd79943901e',
            collectionNumber: 'COL-014',
            partyId: 'p10',
            partyName: 'New Horizon',
            paidAmount: 12000,
            paymentMode: 'Cash',
            receivedDate: '2024-03-01',
            createdBy: { _id: 'u1', name: 'John Doe' },
            createdAt: '2024-03-01T10:00:00Z',
            updatedAt: '2024-03-01T10:00:00Z'
        },
        {
            id: '507f1f77bcf86cd79943901f',
            _id: '507f1f77bcf86cd79943901f',
            collectionNumber: 'COL-015',
            partyId: 'p11',
            partyName: 'Future Systems',
            paidAmount: 85000,
            paymentMode: 'Cheque',
            chequeStatus: 'Pending',
            chequeNumber: 'CHQ-556677',
            receivedDate: '2024-02-29',
            createdBy: { _id: 'u2', name: 'Jane Smith' },
            createdAt: '2024-02-29T15:20:00Z',
            updatedAt: '2024-02-29T15:20:00Z'
        }
    ];

    const collectionsQuery = useQuery<Collection[]>({
        queryKey: ['collections', 'list'],
        queryFn: async () => {
            // return CollectionRepository.getCollections({ limit: 1000, page: 1 });
            return MOCK_COLLECTIONS;
        },
        placeholderData: (prev) => prev,
    });

    const allCollections = collectionsQuery.data || [];

    // --- 5. Logic: Client-Side Filtering ---
    const filteredCollections = useMemo(() => {
        return allCollections.filter((collection) => {
            // Search by party name or payment mode
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

            return matchesSearch && matchesMonth && matchesDate &&
                matchesParty && matchesPaymentMode && matchesChequeStatus;
        });
    }, [allCollections, searchTerm, selectedMonth, selectedDate, selectedParty,
        selectedPaymentMode, selectedChequeStatus]);

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
        mutationFn: (data: any) => CollectionRepository.createCollection(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['collections'] });
            toast.success("Collection recorded successfully");
            setIsCreateModalOpen(false);
        },
        onError: (err: any) => toast.error(err.message || "Failed to record collection")
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
        onError: (err: any) => toast.error(err.message || "Failed to update cheque status")
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
        onError: (err: any) => toast.error(err.message || "Failed to delete collections")
    });

    const handleFilterReset = useCallback(() => {
        setSearchTerm("");
        setSelectedDate(null);
        setSelectedMonth([]);
        setSelectedParty([]);
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
            selectedPaymentMode,
            selectedChequeStatus,

            // Filter Options
            parties: uniqueParties,
            paymentModes: uniquePaymentModes,
            chequeStatuses: uniqueChequeStatuses,

            // Aux Data
            partiesData: partiesQuery.data || [],
            userProfile: user,
        },

        actions: {
            // Modals
            openCreateModal: () => {
                console.log('useCollectionViewState: openCreateModal called');
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
