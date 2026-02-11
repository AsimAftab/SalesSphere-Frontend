import React, { useMemo } from 'react';
import { type Collection } from '@/api/collectionService';
import { DataTable, currencyColumn, viewDetailsColumn, textColumn, type TableColumn } from '@/components/ui';
import { formatDateToLocalISO } from '@/utils/dateUtils';

interface PartyCollectionsTableProps {
    collections: Collection[];
    startIndex: number;
    partyId: string;
}

const PartyCollectionsTable: React.FC<PartyCollectionsTableProps> = ({ collections, startIndex, partyId }) => {

    const columns: TableColumn<Collection>[] = useMemo(() => [
        textColumn<Collection>('receivedDate', 'Date', (col) =>
            col.receivedDate
                ? formatDateToLocalISO(new Date(col.receivedDate))
                : '-'
        ),
        textColumn('paymentMode', 'Payment Mode'),
        currencyColumn('paidAmount', 'Amount', { prefix: 'RS ' }),
        textColumn<Collection>('createdBy', 'Created By', (col) => col.createdBy?.name || '-'),
        viewDetailsColumn<Collection>((col) => `/collection/${col.id || col._id}`, {
            state: () => ({ from: 'party-details', partyId: partyId }),
        }),
    ], [partyId]);

    return (
        <DataTable<Collection>
            data={collections}
            columns={columns}
            keyExtractor={(col) => col.id || col._id}
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
