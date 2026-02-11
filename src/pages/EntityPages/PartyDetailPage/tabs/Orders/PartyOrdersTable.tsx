import React, { useMemo } from 'react';
import type { Order } from '@/api/orderService';
import { DataTable, StatusBadge, currencyColumn, viewDetailsColumn, textColumn, type TableColumn } from '@/components/ui';
import { formatDateToLocalISO } from '@/utils/dateUtils';

interface PartyOrdersTableProps {
    orders: Order[];
    startIndex: number;
    partyId: string;
}

const PartyOrdersTable: React.FC<PartyOrdersTableProps> = ({ orders, startIndex, partyId }) => {

    const columns: TableColumn<Order>[] = useMemo(() => [
        textColumn('invoiceNumber', 'Invoice Number'),
        textColumn<Order>('expectedDeliveryDate', 'Expected Delivery Date', (_) =>
            _.expectedDeliveryDate
                ? formatDateToLocalISO(new Date(_.expectedDeliveryDate))
                : '-'
        ),
        currencyColumn('totalAmount', 'Total Amount', { prefix: 'RS ' }),
        viewDetailsColumn<Order>((_) => `/order/${_.id || _._id}`, {
            label: 'Details',
            state: () => ({ from: 'party-details', partyId: partyId }),
        }),
        {
            key: 'status',
            label: 'Status',
            render: (_, order) => (
                <StatusBadge status={order.status} />
            ),
        }
    ], [partyId]);

    return (
        <DataTable<Order>
            data={orders}
            columns={columns}
            keyExtractor={(order) => order.id || order._id || ''}
            showSerialNumber={true}
            startIndex={startIndex}
            hideOnMobile={true}
            className="lg:col-span-3 shadow-md border-gray-200"
            rowClassName="hover:bg-gray-100"
            emptyMessage="No orders found"
        />
    );
};

export default PartyOrdersTable;
