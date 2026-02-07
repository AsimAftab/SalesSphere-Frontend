import React, { useMemo } from 'react';
import { type Collection } from '@/api/collectionService';
import { DataTable, viewDetailsColumn, type TableColumn } from '@/components/ui';

interface PartyCollectionsTableProps {
    collections: Collection[];
    startIndex?: number;
    partyId: string;
}

const PartyCollectionsTable: React.FC<PartyCollectionsTableProps> = ({ collections, startIndex = 0, partyId }) => {

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-CA');
        } catch {
            return dateString;
        }
    };

    const columns: TableColumn<Collection>[] = useMemo(() => [
        {
            key: 'receivedDate',
            label: 'Date',
            render: (_, item) => formatDate(item.receivedDate),
        },
        {
            key: 'paymentMode',
            label: 'Payment Mode',
            accessor: 'paymentMode',
        },
        {
            key: 'paidAmount',
            label: 'Amount',
            render: (_, item) => `RS ${item.paidAmount.toLocaleString('en-IN')}`,
        },
        {
            key: 'createdBy',
            label: 'Created By',
            render: (_, item) => item.createdBy?.name || '-',
        },
        viewDetailsColumn<Collection>((item) => `/collection/${item.id}`, {
            state: () => ({ from: 'party-details', partyId: partyId }),
        }),
    ], [partyId]);

    return (
        <DataTable<Collection>
            data={collections}
            columns={columns}
            getRowId={(item) => item.id}
            showSerialNumber={true}
            startIndex={startIndex}
            hideOnMobile={true}
            className="lg:col-span-3 shadow-md border-gray-200"
            rowClassName="hover:bg-gray-100"
            emptyMessage="No collections found"
        />
    );
};

export default PartyCollectionsTable;
