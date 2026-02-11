import React from 'react';
import { ListPageSkeleton } from '@/components/ui';
import type { TableColumnSkeleton } from '@/components/ui';

interface CollectionSkeletonProps {
    rows?: number;
    permissions?: {
        canCreate?: boolean;
        canBulkDelete?: boolean;
        canExportPdf?: boolean;
        canExportExcel?: boolean;
    };
}

export const CollectionsSkeleton: React.FC<CollectionSkeletonProps> = ({
    rows = 10,
    permissions = {
        canCreate: true,
        canBulkDelete: true,
        canExportPdf: true,
        canExportExcel: true
    }
}) => {
    // Define table columns matching Collections table structure
    const tableColumns: TableColumnSkeleton[] = [
        { width: 100, type: 'text' },  // Party Name
        { width: 80, type: 'text' },   // Payment Mode
        { width: 100, type: 'text' },  // Amount
        { width: 100, type: 'text' },  // Received Date
        { width: 80, type: 'text' },   // Created By
        { width: 60, type: 'text' },   // Actions
    ];

    return (
        <ListPageSkeleton
            header={{
                titleWidth: 180,
                subtitleWidth: 220,
                showSearch: true,
                searchWidth: 320,
                showFilter: true,
                showExportPdf: permissions.canExportPdf,
                showExportExcel: permissions.canExportExcel,
                showCreate: permissions.canCreate,
                createWidth: 150,
            }}
            table={{
                rows,
                columns: tableColumns,
                showCheckbox: permissions.canBulkDelete,
                showSerialNumber: true,
            }}
            mobileCards={{
                cards: 4,
                config: {
                    showCheckbox: permissions.canBulkDelete,
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

export default CollectionsSkeleton;
