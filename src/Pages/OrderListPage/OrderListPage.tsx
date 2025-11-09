import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import OrderListContent from './OrderListContent';
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
                expectedDeliveryDate: updatedInvoice.expectedDeliveryDate,
                id: updatedInvoice._id,
                dateTime: new Date(updatedInvoice.createdAt).toLocaleString('en-US', {
                    /*... date options ...*/
                }),
            };

            // 1. Update the 'orders' cache locally (this is good)
            queryClient.setQueryData(ORDERS_QUERY_KEY, (oldData: Order[] | undefined) => {
                return oldData?.map(order => 
                    order.id === updatedOrder.id ? updatedOrder : order
                ) || [];
            });

            if (updatedInvoice.status === 'rejected') {
                queryClient.invalidateQueries({ queryKey: ['products'] });
            }
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
            />
        </Sidebar>
    );
};

export default OrderListPage;