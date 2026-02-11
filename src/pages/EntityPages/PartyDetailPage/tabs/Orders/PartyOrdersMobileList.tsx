import React from 'react';
import type { Order } from '@/api/orderService';
import { MobileCard, MobileCardList } from '@/components/ui';
import { formatDateToLocalISO } from '@/utils/dateUtils';

interface PartyOrdersMobileListProps {
    orders: Order[];
    partyId: string;
}

const formatCurrency = (amount: number) => {
    return `RS ${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '-';
    return formatDateToLocalISO(new Date(dateString));
};

export const PartyOrdersMobileList: React.FC<PartyOrdersMobileListProps> = ({ orders, partyId }) => {
    return (
        <MobileCardList isEmpty={orders.length === 0} emptyMessage="No orders found">
            {orders.map((order, index) => (
                <MobileCard
                    key={order.id || order._id}
                    id={order.id || order._id || ''}
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
                            valueClassName: 'font-bold text-gray-900',
                        },
                        {
                            label: 'Delivery Date',
                            value: formatDate(order.expectedDeliveryDate),
                        },
                    ]}
                    actions={[
                        {
                            label: 'View Details',
                            href: `/order/${order.id || order._id}`,
                            linkState: { from: 'party-details', partyId: partyId },
                            variant: 'secondary',
                        },
                    ]}
                />
            ))}
        </MobileCardList>
    );
};
