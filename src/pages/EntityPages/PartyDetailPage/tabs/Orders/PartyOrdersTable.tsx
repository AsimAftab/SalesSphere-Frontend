import React, { useMemo } from 'react';
import type { Order } from '@/api/orderService';
import { StatusBadge, DataTable, viewDetailsColumn, type TableColumn } from '@/components/ui';

interface PartyOrdersTableProps {
    orders: Order[];
    startIndex?: number;
    partyId: string;
}

const PartyOrdersTable: React.FC<PartyOrdersTableProps> = ({ orders, startIndex = 0, partyId }) => {

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-CA');
        } catch {
            return dateString;
        }
    };

    const columns: TableColumn<Order>[] = useMemo(() => [
        {
            key: 'invoiceNumber',
            label: 'Invoice Number',
            accessor: 'invoiceNumber',
        },
        {
            key: 'expectedDeliveryDate',
            label: 'Expected Delivery Date',
            render: (_, item) => formatDate(item.expectedDeliveryDate),
        },
        {
            key: 'totalAmount',
            label: 'Total Amount',
            render: (_, item) => `RS ${item.totalAmount.toLocaleString('en-IN')}`,
        },
        viewDetailsColumn<Order>((item) => `/order/${item.id || item._id}`, {
            getText: () => 'Order Details',
            state: () => ({ from: 'party-details', partyId: partyId }),
        }),
        {
            key: 'status',
            label: 'Status',
            render: (_, item) => <StatusBadge status={item.status} />,
        },
    ], [partyId]);

    return (
        <DataTable<Order>
            data={orders}
            columns={columns}
            getRowId={(item) => item.id || item._id}
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
