import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import OrderListContent from './OrderListContent';
import { getOrders, updateOrderStatus, type Order, type OrderStatus } from '../../api/services/sales/orderService';

const OrderListPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getOrders();
            setOrders(data);
        } catch (err) {
            setError('Failed to load order data. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);
    
    // --- Handler to update order status ---
    const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
        try {
            const updatedOrder = await updateOrderStatus(orderId, newStatus);
            // Update the local state to reflect the change immediately
            setOrders(prevOrders => 
                prevOrders?.map(order => 
                    order.id === updatedOrder.id ? updatedOrder : order
                ) || null
            );
        } catch (error) {
            console.error("Failed to update order status:", error);
            // Optionally set an error state to show a notification to the user
        }
    };

    return (
        <Sidebar>
            <OrderListContent
                data={orders}
                loading={loading}
                error={error}
                onUpdateStatus={handleUpdateStatus}
            />
        </Sidebar>
    );
};

export default OrderListPage;

