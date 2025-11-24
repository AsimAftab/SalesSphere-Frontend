import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import OrderListContent, { statuses } from './OrderListContent';
import { 
    getOrders, 
    updateOrderStatus, 
    type Order, 
    type OrderStatus,
    type InvoiceData 
} from '../../api/orderService';


const ORDERS_QUERY_KEY = ['orders'];

const OrderListPage: React.FC = () => {
    const queryClient = useQueryClient();

    const [searchParams] = useSearchParams();
    const statusParam = searchParams.get('status');
    const filterParam = searchParams.get('filter');
    
    // This logic for 'status' is correct
    const initialStatusFilter = 
      statusParam && (statuses as string[]).includes(statusParam) 
        ? statusParam 
        : 'all';

    // --- ADDED ---
    // 1. Check for 'filter' param (e.g., 'today')
    const initialDateFilter = filterParam === 'today' ? 'today' : 'all';
    
    // 2. If filtering by "today", override the default month filter in OrderListContent
    const initialMonth = filterParam === 'today' ? 'all' : undefined;
    // --- END ADDED ---

    const { 
        data: orders, 
        isLoading, 
        error 
    } = useQuery<Order[], Error>({
        queryKey: ORDERS_QUERY_KEY,
        queryFn: getOrders,
    });

    
    const updateStatusMutation = useMutation({
        mutationFn: ({ orderId, newStatus }: { orderId: string, newStatus: OrderStatus }) => 
            updateOrderStatus(orderId, newStatus),
        
        onSuccess: (updatedInvoice: InvoiceData) => { 
            
            const updatedOrder: Order = {
                // ... (your existing object mapping)
                _id: updatedInvoice._id,
                invoiceNumber: updatedInvoice.invoiceNumber,
                partyName: updatedInvoice.partyName,
                totalAmount: updatedInvoice.totalAmount,
                status: updatedInvoice.status,
                createdAt: updatedInvoice.createdAt,
                createdBy: updatedInvoice.createdBy,
                expectedDeliveryDate: updatedInvoice.expectedDeliveryDate,
                id: updatedInvoice._id,
                dateTime: new Date(updatedInvoice.createdAt).toLocaleString('en-US', {
                    /*... date options ...*/
                }),
           };

            // ... (all your setQueryData and invalidateQueries logic) ...
            queryClient.setQueryData(ORDERS_QUERY_KEY, (oldData: Order[] | undefined) => {
                return oldData?.map(order => 
                    order.id === updatedOrder.id ? updatedOrder : order
          ) || [];
            });

            if (updatedInvoice.status === 'rejected') {
                queryClient.invalidateQueries({ queryKey: ['products'] });
            }
            
            queryClient.invalidateQueries({ queryKey: ['dashboardData'] });
            toast.success("Order status updated!");
        },
        onError: (err) => {
            console.error("Failed to update order status:", err);
            toast.error("Failed to update status. Please try again.");
        }
    });

    const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
        updateStatusMutation.mutate({ orderId, newStatus });
    };

    return (
        <Sidebar>
            <OrderListContent
                data={orders || null}
                loading={isLoading}
                error={error ? error.message : null}
                onUpdateStatus={handleUpdateStatus}
                isUpdatingStatus={updateStatusMutation.isPending}
                initialStatusFilter={initialStatusFilter}
                // --- ADDED ---
                initialDateFilter={initialDateFilter}
                initialMonth={initialMonth}
                // --- END ADDED ---
           />
        </Sidebar>
    );
};

export default OrderListPage;