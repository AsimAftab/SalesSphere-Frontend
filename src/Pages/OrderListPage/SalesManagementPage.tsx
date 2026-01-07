import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import OrderListContent from './OrderListContent';
import EstimateListContent from './EstimateListContent';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrders, updateOrderStatus } from '../../api/orderService';
import { getEstimates } from '../../api/estimateService';
import toast from 'react-hot-toast';
import { useAuth } from '../../api/authService';
import { Navigate } from 'react-router-dom';

const SalesManagementPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = (searchParams.get('tab') as 'orders' | 'estimates') || 'orders';

    // ✅ FIX: Extract filter parameters from the URL
    // These keys ('status', 'filter', 'month') must match the keys used in your Dashboard links
    const statusFilter = searchParams.get('status') || 'all';
    const dateFilter = searchParams.get('filter') || 'all';
    const monthFilter = searchParams.get('month') || 'all';

    const queryClient = useQueryClient();

    const { can } = useAuth();

    // Permission Checks
    const canViewOrders = can('invoices', 'view');
    const canViewEstimates = can('estimates', 'view');

    // Redirect if trying to access unauthorized tab, or if neither is allowed
    // Note: If both false, this acts as a gate. If one true, it redirects.
    if (!canViewOrders && !canViewEstimates) {
        return <Navigate to="/dashboard" replace />;
    }

    // Force redirect to permitted tab if current choice is not allowed
    if (activeTab === 'orders' && !canViewOrders && canViewEstimates) {
        return <Navigate to="/order-lists?tab=estimates" replace />;
    }
    if (activeTab === 'estimates' && !canViewEstimates && canViewOrders) {
        return <Navigate to="/order-lists?tab=orders" replace />;
    }

    // 1. Fetch Orders
    const { data: orders, isLoading: oLoading, error: oError } = useQuery({
        queryKey: ['orders'],
        queryFn: getOrders
    });

    // 2. Fetch Estimates
    const { data: estimates, isLoading: eLoading, error: eError } = useQuery({
        queryKey: ['estimates'],
        queryFn: getEstimates
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ orderId, newStatus }: { orderId: string, newStatus: any }) =>
            updateOrderStatus(orderId, newStatus),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            toast.success("Status updated!");
        }
    });

    const refreshEstimates = () => {
        queryClient.invalidateQueries({ queryKey: ['estimates'] });
    };

    const handleTabChange = (tab: 'orders' | 'estimates') => {
        setSearchParams({ tab });
    };

    const tabBase = "px-6 py-2 text-sm font-medium transition-all duration-200 cursor-pointer outline-none border-b-2";
    const activeClass = "text-blue-600 border-blue-600 bg-white shadow-sm rounded-t-md";
    const inactiveClass = "text-gray-800  bg-gray-300 hover:text-gray-600 shadow-sm rounded-t-md";

    return (
        <Sidebar>
            <div className="inline-flex items-center gap-1 mb-4">
                {canViewOrders && (
                    <button
                        onClick={() => handleTabChange('orders')}
                        className={`${tabBase} ${activeTab === 'orders' ? activeClass : inactiveClass}`}
                    >
                        Order List
                    </button>
                )}
                {canViewEstimates && (
                    <button
                        onClick={() => handleTabChange('estimates')}
                        className={`${tabBase} ${activeTab === 'estimates' ? activeClass : inactiveClass}`}
                    >
                        Estimates
                    </button>
                )}
            </div>

            <div className="py-2">
                {activeTab === 'orders' ? (
                    <OrderListContent
                        data={orders || null}
                        loading={oLoading}
                        error={oError ? (oError as Error).message : null}
                        onUpdateStatus={(id, status) => updateStatusMutation.mutate({ orderId: id, newStatus: status })}
                        isUpdatingStatus={updateStatusMutation.isPending}
                        // ✅ FIX: Pass the dynamic filters from the URL instead of hardcoded "all"
                        initialStatusFilter={statusFilter}
                        initialDateFilter={dateFilter}
                        initialMonth={monthFilter}
                    />
                ) : (
                    <EstimateListContent
                        data={estimates || null}
                        loading={eLoading}
                        error={eError ? (eError as Error).message : null}
                        onRefresh={refreshEstimates}
                    />
                )}
            </div>
        </Sidebar>
    );
};

export default SalesManagementPage;