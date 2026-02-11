import React, { useMemo } from 'react';
import { Trash2 } from 'lucide-react';

interface Estimate {
    id: string;
    _id: string;
    estimateNumber: string;
    partyName: string;
    totalAmount: number;
    dateTime: string;
    createdBy: { name: string };
}

interface EstimateListTableProps {
    estimates: Estimate[];
    startIndex: number;
    selection: {
        selectedIds: string[];
        isAllSelected: boolean;
    };
    onToggleSelect: (id: string) => void;
    onToggleSelectAll: () => void;
    onDelete: (id: string) => void;
    canDelete?: boolean;
    canBulkDelete?: boolean;
}

import { DataTable, textColumn, currencyColumn, viewDetailsColumn } from '@/components/ui';
import type { TableColumn, TableAction } from '@/components/ui';

const EstimateListTable: React.FC<EstimateListTableProps> = ({
    estimates,
    startIndex,
    selection,
    onToggleSelect,
    onToggleSelectAll,
    onDelete,
    canDelete = true,
    canBulkDelete = true
}) => {
    const columns: TableColumn<Estimate>[] = useMemo(() => [
        textColumn<Estimate>('estimateNumber', 'Estimate Number', 'estimateNumber'),
        textColumn<Estimate>('partyName', 'Party Name', 'partyName'),
        textColumn<Estimate>('createdBy', 'Created By', (est) => est.createdBy?.name || '-'),
        currencyColumn<Estimate>('totalAmount', 'Total Amount', 'totalAmount', {
            render: (value) => `RS ${Number(value).toLocaleString()}`,
        }),
        viewDetailsColumn<Estimate>((est) => `/estimate/${est.id || est._id}`, {
            label: 'Details',
            cellClassName: 'py-4',
        }),
    ], []);

    const actions: TableAction<Estimate>[] = useMemo(() => {
        if (!canDelete) return [];
        return [
            {
                type: 'delete',
                label: 'Delete',
                icon: Trash2,
                onClick: (est) => onDelete(est.id || est._id),
                className: 'p-2 text-red-600 hover:bg-red-50 rounded-full',
            },
        ];
    }, [canDelete, onDelete]);

    return (
        <DataTable<Estimate>
            data={estimates}
            columns={columns}
            getRowId={(est) => est.id || est._id}
            showSerialNumber={true}
            startIndex={startIndex}
            selectable={canBulkDelete}
            selectedIds={selection.selectedIds}
            onToggleSelection={onToggleSelect}
            onSelectAll={onToggleSelectAll}
            actions={actions}
            actionsLabel="Action"
            hideOnMobile={true}
        />
    );
};

export default EstimateListTable;
