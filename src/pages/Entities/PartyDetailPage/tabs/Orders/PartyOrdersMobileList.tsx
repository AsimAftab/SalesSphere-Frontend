import React from 'react';
import type { Order } from '@/api/orderService';
import { formatDisplayDate } from '@/utils/dateUtils';
import { MobileCard, MobileCardList } from '@/components/ui';

interface PartyOrdersMobileListProps {
    orders: Order[];
    partyId: string;
}

const formatCurrency = (amount: number) => {
    return `₹ ${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const PartyOrdersMobileList: React.FC<PartyOrdersMobileListProps> = ({ orders, partyId }) => {
    return (
        <MobileCardList isEmpty={orders.length === 0} emptyMessage="No orders found">
            {orders.map((order, index) => (
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
                        },
                    }}
                    details={[
                        {
                            label: 'Amount',
                            value: formatCurrency(order.totalAmount),
                            valueClassName: 'font-bold text-secondary',
                        },
                        {
                            label: 'Delivery',
                            value: order.expectedDeliveryDate ? formatDisplayDate(order.expectedDeliveryDate) : 'N/A',
                        },
                    ]}
                    detailsLayout="grid"
                    actions={[
                        {
                            label: 'View Details',
                            href: `/order/${order.id || order._id}`,
                            linkState: { from: 'party-details', partyId },
                            variant: 'primary',
                        },
                    ]}
                    actionsFullWidth={true}
                />
            ))}
        </MobileCardList>
    );
};
