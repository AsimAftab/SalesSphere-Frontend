import React from 'react';
import { type Order } from '@/api/orderService';
import { MobileCard, MobileCardList } from '@/components/ui';
import { formatDateToLocalISO } from '@/utils/dateUtils';

interface EmployeeOrdersMobileListProps {
    orders: Order[];
    onStatusClick: (order: Order) => void;
    canUpdateStatus?: boolean;
    employeeName?: string;
}

const formatCurrency = (amount: number) => {
    return `RS ${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '-';
    return formatDateToLocalISO(new Date(dateString));
};

const EmployeeOrdersMobileList: React.FC<EmployeeOrdersMobileListProps> = ({ orders, onStatusClick, canUpdateStatus = true, employeeName }) => {
    return (
        <MobileCardList isEmpty={orders.length === 0} emptyMessage="No orders found">
            {orders.map((order, index) => {
                const orderId = order.id || order._id;

                return (
                    <MobileCard
                        key={orderId}
                        id={orderId || ''}
                        header={{
                            serialNumber: index + 1,
                            titleLabel: 'Invoice',
                            title: order.invoiceNumber,
                            badge: {
                                type: 'status',
                                status: order.status,
                                onClick: canUpdateStatus ? () => onStatusClick(order) : undefined,
                            },
                        }}
                        details={[
                            {
                                label: 'Party Name',
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
                        ]}
                        detailsLayout="grid"
                        actions={[
                            {
                                label: 'View Details',
                                href: `/order/${orderId}`,
                                linkState: {
                                    from: 'employee-orders',
                                    employeeId: order.createdBy?._id || order.createdBy?.id,
                                    employeeName: employeeName
                                },
                                variant: 'primary',
                            },
                        ]}
                        actionsFullWidth={true}
                    />
                );
            })}
        </MobileCardList>
    );
};

export default EmployeeOrdersMobileList;
