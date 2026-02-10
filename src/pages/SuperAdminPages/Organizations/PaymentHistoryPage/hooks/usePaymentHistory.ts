import { useState, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { fetchOrgPayments, type OrganizationPayment } from '@/api/SuperAdmin';
import { getOrganizationById } from '@/api/SuperAdmin';
import { useQuery } from '@tanstack/react-query';
import type { PaymentFilters, PaymentSummary } from '../types';
import { INITIAL_FILTERS, PAYMENT_MODE_MAP } from '../types';

const ITEMS_PER_PAGE = 10;

const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

/**
 * Custom hook for managing Payment History page state and operations.
 * Follows the Manager Hook pattern with structured state/actions return.
 */
export const usePaymentHistory = () => {
    const { id: organizationId } = useParams<{ id: string }>();

    // --- 1. Basic UI State ---
    const [currentPage, setCurrentPage] = useState(1);
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [filters, setFilters] = useState<PaymentFilters>(INITIAL_FILTERS);

    // --- 1b. Modal State ---
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [imagesToView, setImagesToView] = useState<string[]>([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [paymentToEdit, setPaymentToEdit] = useState<OrganizationPayment | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [paymentToDelete, setPaymentToDelete] = useState<string | null>(null);

    // --- 2. Data Fetching ---
    const { data: paymentsData, isFetching: isLoadingPayments, refetch: refetchPayments } = useQuery({
        queryKey: ['org-payments', organizationId],
        queryFn: () => fetchOrgPayments(organizationId!),
        enabled: !!organizationId,
        staleTime: 1000 * 60 * 5,
    });

    const { data: orgData, isFetching: isLoadingOrg } = useQuery({
        queryKey: ['organization', organizationId],
        queryFn: () => getOrganizationById(organizationId!),
        enabled: !!organizationId,
        staleTime: 1000 * 60 * 5,
    });

    const allPayments = useMemo(() => paymentsData || [], [paymentsData]);
    const organizationName = orgData?.data?.name || 'Organization';
    const isFetching = isLoadingPayments || isLoadingOrg;

    // --- 3. Derived Options ---
    const receiverOptions = useMemo(() => {
        const receivers = new Set<string>();
        allPayments.forEach((payment) => {
            if (typeof payment.receivedBy === 'object' && payment.receivedBy?.name) {
                receivers.add(payment.receivedBy.name);
            }
        });
        return Array.from(receivers).sort();
    }, [allPayments]);

    // --- 4. Local Filtering Logic ---
    const filteredData = useMemo(() => {
        return allPayments.filter((payment) => {
            const paymentDate = new Date(payment.dateReceived);

            // Date From filter
            if (filters.dateFrom) {
                const fromDate = new Date(filters.dateFrom);
                fromDate.setHours(0, 0, 0, 0);
                if (paymentDate < fromDate) return false;
            }

            // Date To filter
            if (filters.dateTo) {
                const toDate = new Date(filters.dateTo);
                toDate.setHours(23, 59, 59, 999);
                if (paymentDate > toDate) return false;
            }

            // Month filter
            if (filters.months.length > 0) {
                const paymentMonth = MONTH_NAMES[paymentDate.getMonth()];
                if (!filters.months.includes(paymentMonth)) return false;
            }

            // Payment mode filter (multi-select)
            if (filters.paymentModes.length > 0) {
                const selectedModes = filters.paymentModes.map(mode => PAYMENT_MODE_MAP[mode]);
                if (!selectedModes.includes(payment.paymentMode)) return false;
            }

            // Received By filter (multi-select)
            if (filters.receivedBy.length > 0) {
                const receiverName = typeof payment.receivedBy === 'object'
                    ? payment.receivedBy.name
                    : '';
                if (!filters.receivedBy.includes(receiverName)) return false;
            }

            // Search query (received by name, description, or amount)
            if (filters.searchQuery) {
                const query = filters.searchQuery.toLowerCase();
                const receivedByName = typeof payment.receivedBy === 'object'
                    ? payment.receivedBy.name?.toLowerCase()
                    : '';
                const matchesReceivedBy = receivedByName?.includes(query);
                const matchesDescription = payment.description?.toLowerCase().includes(query);
                const matchesAmount = payment.amount.toString().includes(query);
                if (!matchesReceivedBy && !matchesDescription && !matchesAmount) return false;
            }

            return true;
        });
    }, [allPayments, filters]);

    // --- 5. Calculate Summary (from ALL payments, not filtered) ---
    const summary: PaymentSummary = useMemo(() => {
        const totalAmount = allPayments.reduce((sum, p) => sum + p.amount, 0);
        const sortedByDate = [...allPayments].sort(
            (a, b) => new Date(b.dateReceived).getTime() - new Date(a.dateReceived).getTime()
        );

        return {
            totalAmount,
            totalCount: allPayments.length,
            lastPaymentDate: sortedByDate[0]?.dateReceived || null,
        };
    }, [allPayments]);

    // --- 6. Pagination Logic ---
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedPayments = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    // --- 7. Reset Logic ---
    const handleResetFilters = useCallback(() => {
        setFilters(INITIAL_FILTERS);
        setCurrentPage(1);
    }, []);

    // Reset to page 1 when filters change
    const updateFilter = useCallback(<K extends keyof PaymentFilters>(key: K, value: PaymentFilters[K]) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setCurrentPage(1);
    }, []);

    return {
        state: {
            organizationId: organizationId || '',
            organizationName,
            payments: filteredData,           // Full filtered list
            paginatedPayments,                // Sliced data for table
            summary,
            isFetching,
            currentPage,
            isFilterVisible,
            filters,
            modals: {
                isImageModalOpen,
                imagesToView,
                isEditModalOpen,
                paymentToEdit,
                isDeleteModalOpen,
                paymentToDelete,
            },
            receiverOptions,
            totalItems,
            totalPages,
            itemsPerPage: ITEMS_PER_PAGE,
            startIndex,
        },
        actions: {
            setCurrentPage,
            setIsFilterVisible,
            updateFilter,
            setFilters,
            onResetFilters: handleResetFilters,
            refetch: refetchPayments,
            modals: {
                openImageModal: (images: string[]) => {
                    setImagesToView(images);
                    setIsImageModalOpen(true);
                },
                closeImageModal: () => setIsImageModalOpen(false),
                openEditModal: (payment: OrganizationPayment) => {
                    setPaymentToEdit(payment);
                    setIsEditModalOpen(true);
                },
                closeEditModal: () => {
                    setPaymentToEdit(null);
                    setIsEditModalOpen(false);
                },
                openDeleteModal: (id: string) => {
                    setPaymentToDelete(id);
                    setIsDeleteModalOpen(true);
                },
                closeDeleteModal: () => {
                    setPaymentToDelete(null);
                    setIsDeleteModalOpen(false);
                },
            },
        },
    };
};
