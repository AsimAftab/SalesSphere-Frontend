import React, { useMemo } from 'react';
import { type Order } from '@/api/orderService';

interface OrderListTableProps {
    orders: Order[];
    startIndex: number;
    onStatusClick: (order: Order) => void;
    canUpdateStatus?: boolean;
}

import { formatDateToLocalISO } from '@/utils/dateUtils';
import { StatusBadge, DataTable, textColumn, currencyColumn, viewDetailsColumn } from '@/components/ui';
import type { TableColumn } from '@/components/ui';

const OrderListTable: React.FC<OrderListTableProps> = ({ orders, startIndex, onStatusClick, canUpdateStatus = true }) => {
    const columns: TableColumn<Order>[] = useMemo(() => [
        textColumn<Order>('invoiceNumber', 'Invoice Number', 'invoiceNumber'),
        textColumn<Order>('partyName', 'Party Name', 'partyName'),
        textColumn<Order>('createdBy', 'Created By', (order) => order.createdBy?.name || '-'),
        {
            key: 'expectedDeliveryDate',
            label: 'Delivery Date',
            render: (_, order) => order.expectedDeliveryDate ? formatDateToLocalISO(new Date(order.expectedDeliveryDate)) : '-',
            cellClassName: 'py-4',
            headerClassName: 'py-4',
        },
        currencyColumn<Order>('totalAmount', 'Total Amount', 'totalAmount', {
            render: (value) => `RS ${value}`,
        }),
        viewDetailsColumn<Order>((order) => `/order/${order.id || order._id}`, {
            label: 'Details',
            cellClassName: 'py-4',
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
            cellClassName: 'py-4',
        },
    ], [onStatusClick, canUpdateStatus]);

    return (
        <DataTable<Order>
            data={orders}
            columns={columns}
            getRowId={(order) => order.id || order._id}
            showSerialNumber={true}
            startIndex={startIndex}
            hideOnMobile={true}
        />
    );
};

OrderListTable.displayName = 'OrderListTable';

export default OrderListTable;
