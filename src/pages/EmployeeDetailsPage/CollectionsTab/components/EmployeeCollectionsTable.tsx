import React, { useMemo } from 'react';
import { type Collection } from '@/api/collectionService';
import { DataTable, viewDetailsColumn, type TableColumn } from '@/components/ui';

interface EmployeeCollectionsTableProps {
    collections: Collection[];
    startIndex?: number;
    employeeId?: string;
    employeeName?: string;
}

const EmployeeCollectionsTable: React.FC<EmployeeCollectionsTableProps> = ({
    collections,
    startIndex = 0,
    employeeId,
    employeeName
}) => {
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
            key: 'partyName',
            label: 'Party Name',
            render: (_, item) => item.partyName || '-',
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
        viewDetailsColumn<Collection>((item) => `/collection/${item.id}`, {
            state: () => ({ from: 'employee-collections', employeeId, employeeName }),
        }),
    ], [employeeId, employeeName]);

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

export default EmployeeCollectionsTable;
