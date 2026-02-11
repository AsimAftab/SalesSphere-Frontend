import React from 'react';
import { ListPageSkeleton } from '@/components/ui';
import type { TableColumnSkeleton } from '@/components/ui';

interface CompletedBeatsSkeletonProps {
    canViewDetails?: boolean;
}

const CompletedBeatsSkeleton: React.FC<CompletedBeatsSkeletonProps> = ({
    canViewDetails = true,
}) => {
    const tableColumns: TableColumnSkeleton[] = [
        { width: 150, type: 'text' }, // Beat Plan Name
        { width: 80, type: 'text' },  // Status
        { width: 120, type: 'text' }, // Completed By
        { width: 100, type: 'text' }, // Completed Date
        ...(canViewDetails ? [{ width: 100, type: 'text' as const }] : []),
        { width: 80, type: 'badge' as const }, // View
    ];

    return (
        <ListPageSkeleton
            header={{
                titleWidth: 250,
                subtitleWidth: 300,
                showSearch: true,
                searchWidth: 320,
                showFilter: false,
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
                cards: 4,
                config: {
                    showCheckbox: false,
                    showAvatar: false,
                    detailRows: 3,
                    detailColumns: 2,
                    fullWidthDetailRows: 1,
                    showAction: true,
                    actionCount: 1,
                    showBadge: true,
                    badgeCount: 1,
                },
            }}
        />
    );
};

export default CompletedBeatsSkeleton;
