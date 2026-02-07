import React from 'react';
import { useOdometerPermissions } from '../../hooks/useOdometerPermissions';
import { ListPageSkeleton } from '@/components/ui';

interface OdometerSkeletonProps {
    rows?: number;
}

const OdometerSkeleton: React.FC<OdometerSkeletonProps> = ({ rows = 10 }) => {
    const { canExport } = useOdometerPermissions();

    return (
        <ListPageSkeleton
            header={{
                titleWidth: 180,
                subtitleWidth: 340,
                showSearch: true,
                searchWidth: 320,
                showFilter: false,
                showExportPdf: canExport,
                showExportExcel: false,
                showCreate: false,
            }}
            table={{
                rows,
                columns: [
                    { width: 120, type: 'text' },   // Employee name with avatar
                    { width: 150, type: 'text' },   // Date Range
                    { width: 80, type: 'badge' },   // Total Distance
                    { width: 70, type: 'text' },    // View Details
                ],
                showCheckbox: false,
                showSerialNumber: true,
            }}
            mobileCards={{
                cards: 3,
                config: {
                    showCheckbox: false,
                    showAvatar: false,
                    detailRows: 3,
                    detailColumns: 2,
                    showAction: true,
                    actionCount: 1,
                    showBadge: true,
                    badgeCount: 1,
                },
            }}
        />
    );
};

export default OdometerSkeleton;
