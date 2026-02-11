import React from 'react';
import { type Order } from '@/api/orderService';
import { MobileCard, MobileCardList } from '@/components/ui';

interface OrderListMobileProps {
    orders: Order[];
    onStatusClick: (order: Order) => void;
    canUpdateStatus?: boolean;
}

const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const formatCurrency = (amount: number) => {
    return `₹ ${amount.toLocaleString('en-IN')}`;
};

const OrderListMobile: React.FC<OrderListMobileProps> = ({ orders, onStatusClick, canUpdateStatus = true }) => {
    return (
        <MobileCardList isEmpty={orders.length === 0} emptyMessage="No orders found">
            {orders.map((order: Order, index: number) => (
                <MobileCard
                    key={order.id || order._id}
                    id={order.id || order._id}
                    header={{
                        serialNumber: index + 1,
                        titleLabel: 'Invoice',
                        title: order.invoiceNumber,
                        badge: {
                            type: 'status',
                            status: order.status,
                            onClick: canUpdateStatus ? () => onStatusClick(order) : undefined
                        }
                    }}
                    details={[
                        {
                            label: 'Party',
                            value: order.partyName,
                            valueClassName: 'font-semibold text-gray-800',
                            fullWidth: true,
                        },
                        {
                            label: 'Amount',
                            value: formatCurrency(order.totalAmount),
                            valueClassName: 'font-bold text-secondary',
                        },
                        {
                            label: 'Delivery',
                            value: formatDate(order.expectedDeliveryDate),
                        },
                        {
                            label: 'Created By',
                            value: order.createdBy?.name || '-',
                        },
                    ]}
                    detailsLayout="grid"
                    actions={[
                        {
                            label: 'View Details',
                            href: `/order/${order.id || order._id}`,
                            variant: 'primary',
                        }
                    ]}
                    actionsFullWidth={true}
                />
            ))}
        </MobileCardList>
    );
};

OrderListMobile.displayName = 'OrderListMobile';

export default OrderListMobile;
