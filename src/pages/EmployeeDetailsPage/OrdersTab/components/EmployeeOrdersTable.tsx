import React from 'react';
import { type Order } from '@/api/orderService';
import { DataTable, StatusBadge, currencyColumn, viewDetailsColumn, textColumn, type TableColumn } from '@/components/ui';
import { formatDateToLocalISO } from '@/utils/dateUtils';

interface EmployeeOrdersTableProps {
    orders: Order[];
    startIndex: number;
    onStatusClick: (order: Order) => void;
    canUpdateStatus?: boolean;
    employeeName?: string;
}

const EmployeeOrdersTable: React.FC<EmployeeOrdersTableProps> = ({
    orders,
    startIndex,
    onStatusClick,
    canUpdateStatus = true,
    employeeName
}) => {
    const columns: TableColumn<Order>[] = [
        textColumn('invoiceNumber', 'Invoice Number'),
        textColumn('partyName', 'Party Name'),
        textColumn<Order>('expectedDeliveryDate', 'Delivery Date', (order) =>
            order.expectedDeliveryDate
                ? formatDateToLocalISO(new Date(order.expectedDeliveryDate))
                : '-'
        ),
        currencyColumn('totalAmount', 'Total Amount', { prefix: 'RS ' }),
        viewDetailsColumn<Order>((order) => `/order/${order.id || order._id}`, {
            label: 'Details',
            state: (order) => ({
                from: 'employee-orders',
                employeeId: order.createdBy?._id || order.createdBy?.id,
                employeeName: employeeName
            })
        }),
        {
            key: 'status',
            label: 'Status',
            render: (_, order) => (
                <StatusBadge
                    status={order.status}
                    onClick={() => onStatusClick(order)}
                    disabled={!canUpdateStatus}
                />
            ),
        }
    ];

    return (
        <DataTable
            data={orders}
            columns={columns}
            keyExtractor={(order) => order.id || order._id || ''}
            startIndex={startIndex}
        />
    );
};

export default EmployeeOrdersTable;
