import React, { useMemo } from 'react';
import type { DailyOdometerStat } from '@/api/odometerService';
import { formatDateToLocalISO } from '@/utils/dateUtils';
import { DataTable, viewDetailsColumn, type TableColumn } from '@/components/ui';

interface OdometerDetailsTableProps {
    data: DailyOdometerStat[];
    onViewDetails: (tripId: string, tripCount: number) => void;
}

const OdometerDetailsTable: React.FC<OdometerDetailsTableProps> = ({ data, onViewDetails }) => {

    const columns: TableColumn<DailyOdometerStat>[] = useMemo(() => [
        {
            key: 'date',
            label: 'Date',
            render: (_, item) => formatDateToLocalISO(new Date(item.date)),
            cellClassName: 'leading-tight',
        },
        {
            key: 'totalKm',
            label: 'Total Distance',
            align: 'center',
            headerClassName: 'text-center',
            render: (_, item) => (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-green-100 text-green-800">
                    {item.totalKm} KM
                </span>
            ),
        },
        {
            key: 'tripCount',
            label: 'No. of Trips',
            align: 'center',
            headerClassName: 'text-center',
            render: (_, item) => (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800">
                    {item.tripCount} Trips
                </span>
            ),
        },
        viewDetailsColumn<DailyOdometerStat>('', { onClick: (item) => onViewDetails(item.id, item.tripCount) }),
    ], [onViewDetails]);

    return (
        <DataTable<DailyOdometerStat>
            data={data}
            columns={columns}
            getRowId={(item) => item.id}
            showSerialNumber={true}
            hideOnMobile={true}
            rowClassName="hover:bg-gray-200 transition-colors duration-200"
            emptyMessage="No daily records found."
        />
    );
};

export default OdometerDetailsTable;
