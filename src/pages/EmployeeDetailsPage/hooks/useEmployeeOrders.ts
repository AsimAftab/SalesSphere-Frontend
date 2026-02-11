import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrders, updateOrderStatus, type OrderStatus } from '@/api/orderService';
import toast from 'react-hot-toast';

export const useEmployeeOrders = (employeeId: string | undefined, searchQuery: string = '') => {
    const queryClient = useQueryClient();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Fetch all orders - Query key matches OrderListPage for cache sharing
    const { data: allOrders, isLoading, error } = useQuery({
        queryKey: ['orders'],
        queryFn: getOrders,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    // Client-side filtering for this employee
    const employeeOrders = useMemo(() => {
        if (!allOrders || !employeeId) return [];

        let filtered = allOrders.filter(order =>
            (order.createdBy?.id === employeeId || order.createdBy?._id === employeeId)
        );

        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            filtered = filtered.filter(order =>
                order.invoiceNumber.toLowerCase().includes(lowerQuery) ||
                order.partyName.toLowerCase().includes(lowerQuery)
            );
        }

        return filtered.sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
    }, [allOrders, employeeId, searchQuery]);

    // Pagination Logic
    const paginatedOrders = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return employeeOrders.slice(startIndex, startIndex + itemsPerPage);
    }, [employeeOrders, currentPage, itemsPerPage]);

    // Status Update Mutation (Reused logic)
    const updateStatusMutation = useMutation({
        mutationFn: ({ orderId, newStatus }: { orderId: string, newStatus: OrderStatus }) =>
            updateOrderStatus(orderId, newStatus),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            toast.success("Order status updated");
        },
        onError: (err: Error) => toast.error(err.message || "Failed to update status")
    });

    return {
        orders: paginatedOrders,
        totalOrders: employeeOrders.length,
        isLoading,
        error: error ? (error as Error).message : null,
        currentPage,
        itemsPerPage,
        setCurrentPage,
        updateStatus: (orderId: string, newStatus: OrderStatus) => updateStatusMutation.mutateAsync({ orderId, newStatus }),
        isUpdating: updateStatusMutation.isPending
    };
};
