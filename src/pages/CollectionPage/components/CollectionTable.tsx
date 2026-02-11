import React, { useMemo } from 'react';
import type { Collection } from '@/api/collectionService';
import { DataTable, textColumn, viewDetailsColumn } from '@/components/ui';
import type { TableColumn } from '@/components/ui';

interface CollectionTableProps {
    collections: Collection[];
    selectedIds: string[];
    onToggleSelection: (id: string) => void;
    onSelectAll: (ids: string[]) => void;
    onViewDetails?: (collection: Collection) => void;
    permissions: {
        canBulkDelete: boolean;
    };
    currentPage: number;
    itemsPerPage: number;
}

export const CollectionTable: React.FC<CollectionTableProps> = ({
    collections,
    selectedIds,
    onToggleSelection,
    onSelectAll,
    onViewDetails,
    permissions,
    currentPage,
    itemsPerPage
}) => {
    const columns: TableColumn<Collection>[] = useMemo(() => [
        textColumn<Collection>('partyName', 'Party Name', 'partyName', {
            width: 'max-w-[180px]',
        }),
        {
            key: 'paidAmount',
            label: 'Amount Received',
            accessor: 'paidAmount',
            render: (value) => `Rs. ${Number(value).toLocaleString('en-IN')}`,
        },
        textColumn<Collection>('paymentMode', 'Payment Mode', 'paymentMode'),
        textColumn<Collection>('receivedDate', 'Received Date', 'receivedDate'),
        textColumn<Collection>('createdBy', 'Created By', (item) => item.createdBy.name),
        viewDetailsColumn<Collection>('', { onClick: (collection) => onViewDetails?.(collection) }),
    ], [onViewDetails]);

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            onSelectAll(collections.map(c => c.id));
        } else {
            onSelectAll([]);
        }
    };

    const startIndex = (currentPage - 1) * itemsPerPage;

    return (
        <DataTable<Collection>
            data={collections}
            columns={columns}
            getRowId={(collection) => collection.id}
            selectable={permissions.canBulkDelete}
            selectedIds={selectedIds}
            onToggleSelection={onToggleSelection}
            onSelectAll={handleSelectAll}
            showSerialNumber={true}
            startIndex={startIndex}
            emptyMessage="No collections found"
            hideOnMobile={false}
        />
    );
};
