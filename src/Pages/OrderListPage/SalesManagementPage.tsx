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

import { ClipboardList, FileText } from 'lucide-react';


const SalesManagementPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = (searchParams.get('tab') as 'orders' | 'estimates') || 'orders';

    // ✅ FIX: Extract filter parameters from the URL
    // These keys ('status', 'filter', 'month') must match the keys used in your Dashboard links
    const statusFilter = searchParams.get('status') || 'all';
    const dateFilter = searchParams.get('filter') || 'all';
    const monthFilter = searchParams.get('month') || 'all';

    const queryClient = useQueryClient();

    const { hasPermission } = useAuth();

    // Permission Checks
    const canViewOrders = hasPermission('invoices', 'viewList');
    const canViewEstimates = hasPermission('estimates', 'viewList');

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

    const handleTabChange = (tabId: string) => {
        setSearchParams({ tab: tabId });
    };

    const salesTabs = [
        ...(canViewOrders ? [{ id: 'orders', label: 'Order List', icon: <ClipboardList className="w-4 h-4" /> }] : []),
        ...(canViewEstimates ? [{ id: 'estimates', label: 'Estimates', icon: <FileText className="w-4 h-4" /> }] : [])
    ];

    return (
        <Sidebar>
            <div className="-mx-4 sm:-mx-6 lg:-mx-8 -my-10 h-[calc(100vh-4rem)]">
                <div className="flex flex-col h-full overflow-hidden pt-6">
                    <div className="bg-gray-100">
                        <div className="flex gap-2 px-6 py-3">
                            {salesTabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => handleTabChange(tab.id as 'orders' | 'estimates')}
                                    className={`
                                        flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all
                                        ${tab.id === activeTab
                                            ? 'bg-secondary text-white shadow-sm'
                                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                                        }
                                    `}
                                >
                                    {tab.icon}
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="py-2 px-6 flex-1 overflow-y-auto">
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
                </div>
            </div>
        </Sidebar>
    );
};

export default SalesManagementPage;