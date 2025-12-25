import React from 'react';
import { useSearchParams } from 'react-router-dom'; // Use search params for persistence
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import OrderListContent from './OrderListContent';
import EstimateListContent from './EstimateListContent';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrders, updateOrderStatus } from '../../api/orderService';
import { getEstimates } from '../../api/estimateService'; 
import toast from 'react-hot-toast';

const SalesManagementPage: React.FC = () => {
    // searchParams allows the tab state to live in the URL (?tab=estimates)
    const [searchParams, setSearchParams] = useSearchParams();
    
    // Default to 'orders' if no tab is specified in the URL
    const activeTab = (searchParams.get('tab') as 'orders' | 'estimates') || 'orders';

    const queryClient = useQueryClient();

    const { data: orders, isLoading: oLoading, error: oError } = useQuery({
        queryKey: ['orders'],
        queryFn: getOrders
    });

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

    // Function to change tabs by updating the URL
    const handleTabChange = (tab: 'orders' | 'estimates') => {
        setSearchParams({ tab });
    };

    const tabBase = "px-6 py-2 text-sm font-medium transition-all duration-200 cursor-pointer outline-none border-b-2";
    const activeClass = "text-blue-600 border-blue-600 bg-white shadow-sm rounded-t-md";
    const inactiveClass = "text-gray-400 border-transparent hover:text-gray-600";

    return (
        <Sidebar>
            <div className="inline-flex items-center gap-1">
                <button 
                    onClick={() => handleTabChange('orders')}
                    className={`${tabBase} ${activeTab === 'orders' ? activeClass : inactiveClass}`}
                >
                    Order List
                </button>
                <button 
                    onClick={() => handleTabChange('estimates')}
                    className={`${tabBase} ${activeTab === 'estimates' ? activeClass : inactiveClass}`}
                >
                    Estimates
                </button>
            </div>

            <div className="py-2">
                {activeTab === 'orders' ? (
                    <OrderListContent 
                        data={orders || null} 
                        loading={oLoading}
                        error={oError ? (oError as Error).message : null}
                        onUpdateStatus={(id, status) => updateStatusMutation.mutate({ orderId: id, newStatus: status })}
                        isUpdatingStatus={updateStatusMutation.isPending}
                        initialStatusFilter="all"
                        initialDateFilter="all"
                        initialMonth="all"
                    />
                ) : (
                    <EstimateListContent 
                        data={estimates || null}
                        loading={eLoading}
                        error={eError ? (eError as Error).message : null}
                        initialDateFilter="all"
                        initialMonth="all"
                    />
                )}
            </div>
        </Sidebar>
    );
};

export default SalesManagementPage;