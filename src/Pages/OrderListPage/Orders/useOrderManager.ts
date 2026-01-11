import { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getOrders, updateOrderStatus, type Order, type OrderStatus } from '../../../api/orderService';
import { useSearchParams } from 'react-router-dom';

const MONTH_OPTIONS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const STATUS_OPTIONS: OrderStatus[] = ['completed', 'in progress', 'in transit', 'pending', 'rejected'];

export interface OrderManagerPermissions {
    canViewList: boolean;
    canUpdateStatus: boolean;
}

const useOrderManager = () => {
    const queryClient = useQueryClient();
    const [searchParams] = useSearchParams();

    // --- State ---
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [editingOrder, setEditingOrder] = useState<Order | null>(null);

    // Initial Filters from URL
    const initialStatusFilter = searchParams.get('status');
    const initialDateFilter = searchParams.get('filter');
    const initialMonth = searchParams.get('month');

    // Filter Helper
    const getInitialFilters = () => ({
        status: (initialStatusFilter && initialStatusFilter !== 'all') ? [initialStatusFilter.toLowerCase()] : [] as string[],
        month: (initialMonth && initialMonth !== 'all') ? [initialMonth] : [] as string[],
        creators: [] as string[],
        parties: [] as string[],
        date: initialDateFilter === 'today' ? new Date() : null as Date | null,
    });

    const [filters, setFilters] = useState(getInitialFilters());

    // Sync filters on mount/URL change
    useEffect(() => {
        const newFilters = getInitialFilters();
        setFilters(newFilters);
        setCurrentPage(1);
        if ((initialStatusFilter && initialStatusFilter !== 'all') || initialDateFilter === 'today' || (initialMonth && initialMonth !== 'all')) {
            setIsFilterVisible(true);
        }
    }, [initialStatusFilter, initialDateFilter, initialMonth]);


    // --- Data Fetching ---
    const { data: orders, isLoading, error } = useQuery({
        queryKey: ['orders'],
        queryFn: getOrders,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    // --- Mutations ---
    const updateStatusMutation = useMutation({
        mutationFn: ({ orderId, newStatus }: { orderId: string, newStatus: OrderStatus }) =>
            updateOrderStatus(orderId, newStatus),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            toast.success("Status updated!");
            setEditingOrder(null);
        },
        onError: (err: any) => toast.error(err.message || "Failed to update status")
    });

    // --- Local Filtering Logic ---
    const filteredOrders = useMemo(() => {
        if (!orders) return [];

        // Helper
        const toLocalDateString = (date: string | Date) => {
            const d = new Date(date);
            return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
        };

        return orders.filter(order => {
            const orderDate = new Date(order.dateTime);
            const matchesSearch = (order.partyName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (order.invoiceNumber || '').toLowerCase().includes(searchTerm.toLowerCase());
            const matchesDate = !filters.date || toLocalDateString(order.dateTime) === toLocalDateString(filters.date);
            const matchesMonth = filters.month.length === 0 || filters.month.includes(MONTH_OPTIONS[orderDate.getMonth()]);
            const matchesStatus = filters.status.length === 0 || filters.status.includes(order.status.toLowerCase());
            const matchesCreator = filters.creators.length === 0 || (order.createdBy?.name && filters.creators.includes(order.createdBy.name));
            const matchesParty = filters.parties.length === 0 || (order.partyName && filters.parties.includes(order.partyName));

            return matchesSearch && matchesDate && matchesMonth && matchesStatus && matchesCreator && matchesParty;
        }).sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
    }, [orders, searchTerm, filters]);

    // --- Derived Options ---
    const availableCreators = useMemo(() => {
        if (!orders) return [];
        const names = orders.map(o => o.createdBy?.name).filter(Boolean);
        return Array.from(new Set(names)).sort() as string[];
    }, [orders]);

    const availableParties = useMemo(() => {
        if (!orders) return [];
        const names = orders.map(o => o.partyName).filter(Boolean);
        return Array.from(new Set(names)).sort() as string[];
    }, [orders]);

    const calendarOpenToDate = useMemo(() => {
        if (filters.month.length > 0) {
            const monthIdx = MONTH_OPTIONS.indexOf(filters.month[0]);
            if (monthIdx !== -1) return new Date(new Date().getFullYear(), monthIdx, 1);
        }
        return undefined;
    }, [filters.month]);

    // --- Actions ---
    const resetFilters = () => {
        setFilters({ status: [], month: [], creators: [], date: null, parties: [] });
        setSearchTerm('');
    };

    return {
        state: {
            orders: filteredOrders,
            allOrders: orders, // For ref, if needed
            isLoading,
            error: error ? (error as Error).message : null,
            currentPage,
            searchTerm,
            isFilterVisible,
            filters,
            editingOrder,
            isUpdatingStatus: updateStatusMutation.isPending,
            options: {
                creators: availableCreators,
                parties: availableParties,
                months: MONTH_OPTIONS,
                statuses: STATUS_OPTIONS,
                calendarOpenToDate
            },
            totalItems: filteredOrders.length
        },
        actions: {
            setCurrentPage,
            setSearchTerm,
            setIsFilterVisible,
            setFilters,
            setEditingOrder,
            onResetFilters: resetFilters,
            updateStatus: (orderId: string, newStatus: OrderStatus) => updateStatusMutation.mutateAsync({ orderId, newStatus })
        }
    };
};

export default useOrderManager;
