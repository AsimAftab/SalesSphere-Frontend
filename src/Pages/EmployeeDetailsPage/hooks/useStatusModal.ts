import { useState } from 'react';
import { type Order, type OrderStatus } from '../../../api/orderService';
import { type StatusOption as OrderStatusOption } from '../../../components/modals/CommonModals/StatusUpdateModal';

// Shared status options
export const ORDER_STATUS_OPTIONS: OrderStatusOption[] = [
    { value: 'pending', label: 'Pending', colorClass: 'blue' },
    { value: 'in progress', label: 'In Progress', colorClass: 'violet' },
    { value: 'in transit', label: 'In Transit', colorClass: 'orange' },
    { value: 'completed', label: 'Completed', colorClass: 'green' },
    { value: 'rejected', label: 'Rejected', colorClass: 'red' },
];

interface UseStatusModalProps {
    updateStatus: (orderId: string, status: OrderStatus) => Promise<void>;
}

export const useStatusModal = ({ updateStatus }: UseStatusModalProps) => {
    const [editingOrder, setEditingOrder] = useState<Order | null>(null);

    const openModal = (order: Order) => {
        setEditingOrder(order);
    };

    const closeModal = () => {
        setEditingOrder(null);
    };

    const handleSave = async (newStatus: string) => {
        if (!editingOrder) return;

        // Ensure ID presence (handling both _id and id)
        const orderId = editingOrder.id || editingOrder._id;
        if (!orderId) {
            console.error("Order ID missing");
            return;
        }

        await updateStatus(orderId, newStatus as OrderStatus);
        // Modal closes automatically or can be closed here if needed, 
        // usually StatusUpdateModal handles closing on success or we close it:
        // For this specific modal component, parent controls open state.
        closeModal();
    };

    return {
        isOpen: !!editingOrder,
        editingOrder,
        orderStatusOptions: ORDER_STATUS_OPTIONS,
        openModal,
        closeModal,
        handleSave,
    };
};
