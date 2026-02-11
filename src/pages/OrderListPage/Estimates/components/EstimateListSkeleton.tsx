import React from 'react';
import { ListPageSkeleton } from '@/components/ui';

interface EstimateListSkeletonProps {
    canDelete?: boolean;
    canBulkDelete?: boolean;
    canCreate?: boolean;
    canExportPdf?: boolean;
}

/**
 * EstimateListSkeleton - Permission-aware skeleton that matches the actual table structure
 * Shows/hides columns based on user permissions to avoid visual jump when data loads
 */
const EstimateListSkeleton: React.FC<EstimateListSkeletonProps> = ({
    canDelete = true,
    canBulkDelete = true,
    canCreate = true,
    canExportPdf = true
}) => (
    <div className="w-full flex flex-col">
        <ListPageSkeleton
            header={{
                titleWidth: 160,
                showSearch: true,
                searchWidth: 280,
                showFilter: true,
                showExportPdf: canExportPdf,
                showExportExcel: false,
                showCreate: canCreate,
                createWidth: 130
            }}
            table={{
                rows: 10,
                columns: [
                    { width: 90, type: 'text' },   // Estimate Number
                    { width: 100, type: 'text' },  // Party Name
                    { width: 70, type: 'text' },   // Created By
                    { width: 65, type: 'text' },   // Total Amount
                    { width: 70, type: 'text' },   // View
                    ...(canDelete ? [{ width: 24, type: 'circle' as const }] : [])  // Delete action
                ],
                showCheckbox: canBulkDelete,
                showSerialNumber: true
            }}
            mobileCards={{
                cards: 4,
                config: {
                    showCheckbox: canBulkDelete,
                    showAvatar: false,
                    detailRows: 3,
                    detailColumns: 2,
                    fullWidthDetailRows: 1,
                    showAction: true,
                    actionCount: 1,
                    showBadge: false
                }
            }}
        />
    </div>
);

export default EstimateListSkeleton;
