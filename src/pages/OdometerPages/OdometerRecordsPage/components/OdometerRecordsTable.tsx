import React, { useMemo } from 'react';
import { formatDateToLocalISO } from '@/utils/dateUtils';
import type { OdometerStat } from '@/api/odometerService';
import { DataTable, viewDetailsColumn, type TableColumn } from '@/components/ui';

interface OdometerRecordsTableProps {
    data: OdometerStat[];
    startIndex: number;
    onViewDetails: (employeeId: string) => void;
}

/**
 * SRP: This component is strictly responsible for rendering the Desktop Table view.
 * It uses standardized design tokens to maintain consistency with MiscellaneousWork page,
 * but without checkboxes as requested.
 */
const OdometerRecordsTable: React.FC<OdometerRecordsTableProps> = ({ data, startIndex, onViewDetails }) => {

    const columns: TableColumn<OdometerStat>[] = useMemo(() => [
        {
            key: 'employee',
            label: 'Employee',
            render: (_, item) => (
                <div className="flex items-center gap-3">
                    {item.employee?.avatarUrl ? (
                        <img
                            src={item.employee.avatarUrl}
                            className="h-10 w-10 rounded-full object-cover border border-gray-200 shadow-sm"
                            alt={item.employee.name}
                        />
                    ) : (
                        <div className="h-10 w-10 rounded-full bg-secondary text-white font-black flex items-center justify-center border border-secondary shrink-0 text-xs shadow-sm">
                            {item.employee?.name?.trim().charAt(0).toUpperCase() || "?"}
                        </div>
                    )}
                    <div className="min-w-0">
                        <p className="text-sm font-black text-black leading-tight">
                            {item.employee?.name || "Unknown User"}
                        </p>
                        <p className="text-sm text-gray-500 tracking-tight">
                            {item.employee?.role || "Staff"}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            key: 'dateRange',
            label: 'Date Range',
            render: (_, item) => {
                const startDate = formatDateToLocalISO(new Date(item.dateRange.start));
                const endDate = formatDateToLocalISO(new Date(item.dateRange.end));
                return `${startDate} to ${endDate}`;
            },
        },
        {
            key: 'totalDistance',
            label: 'Total Distance',
            align: 'center',
            headerClassName: 'text-center',
            render: (_, item) => (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-green-100 text-green-800">
                    {item.totalDistance.toLocaleString()} KM
                </span>
            ),
        },
        viewDetailsColumn<OdometerStat>('', { onClick: (item) => onViewDetails(item._id) }),
    ], [onViewDetails]);

    return (
        <DataTable<OdometerStat>
            data={data}
            columns={columns}
            getRowId={(item) => item._id}
            showSerialNumber={true}
            startIndex={startIndex}
            hideOnMobile={true}
            rowClassName="hover:bg-gray-200 transition-colors duration-200"
            emptyMessage="No odometer records found"
        />
    );
};

export default OdometerRecordsTable;
