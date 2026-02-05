import React from 'react';
import { ListPageSkeleton } from '@/components/ui';
import type { TableColumnSkeleton } from '@/components/ui';

interface ActiveBeatsSkeletonProps {
    canViewDetails?: boolean;
    canDelete?: boolean;
}

const ActiveBeatsSkeleton: React.FC<ActiveBeatsSkeletonProps> = ({
    canViewDetails = true,
    canDelete = true,
}) => {
    const tableColumns: TableColumnSkeleton[] = [
        { width: 200, type: 'text' }, // Beat Plan Name
        { width: 60, type: 'text' },  // Status
        { width: 140, type: 'text' }, // Assigned To
        { width: 100, type: 'text' }, // Start Date
        { width: 90, type: 'text' },  // End Date
        ...(canViewDetails ? [{ width: 80, type: 'badge' as const }] : []),
        ...(canDelete ? [{ width: 32, type: 'badge' as const }] : []),
    ];

    return (
        <ListPageSkeleton
            header={{
                titleWidth: 220,
                subtitleWidth: 280,
                showSearch: true,
                searchWidth: 288, // sm:w-72 = 18rem = 288px
                showFilter: true,
                showExportPdf: false,
                showExportExcel: false,
                showCreate: false,
            }}
            table={{
                rows: 8,
                columns: tableColumns,
                showCheckbox: false,
                showSerialNumber: true,
            }}
            mobileCards={{
                cards: 3,
                config: {
                    showCheckbox: false,
                    showAvatar: false,
                    detailRows: 2,
                    detailColumns: 2,
                    showAction: true,
                    actionCount: 2,
                    showBadge: true,
                    badgeCount: 1,
                },
            }}
        />
    );
};

export default ActiveBeatsSkeleton;
