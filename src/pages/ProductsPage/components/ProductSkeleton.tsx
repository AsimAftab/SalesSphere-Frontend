import React from 'react';
import { ListPageSkeleton, type TableColumnSkeleton } from '@/components/ui';

interface ProductSkeletonProps {
    rows?: number;
    isFilterVisible?: boolean;
    canBulkDelete?: boolean;
    canUpdate?: boolean;
    canDelete?: boolean;
    canCreate?: boolean;
    canBulkUpload?: boolean;
    canExport?: boolean;
}

/**
 * ProductSkeleton - Loading skeleton for the Products page.
 * Matches the actual ProductTable layout with header and table structure.
 */
const ProductSkeleton: React.FC<ProductSkeletonProps> = ({
    rows = 10,
    isFilterVisible = false,
    canBulkDelete = true,
    canUpdate = true,
    canDelete = true,
    canCreate = true,
    canBulkUpload = false,
    canExport = true
}) => {
    // Define table columns matching the original ProductTable structure
    const tableColumns: TableColumnSkeleton[] = [
        { width: 40, type: 'circle' },    // Image
        { width: 100, type: 'text' },     // Serial No
        { width: 180, type: 'text' },     // Description
        { width: 100, type: 'text' },     // Category
        { width: 70, type: 'text' },      // Price
        { width: 50, type: 'text' },      // Qty
    ];

    // Add actions column if user has update or delete permissions
    if (canUpdate || canDelete) {
        tableColumns.push({ width: 60, type: 'actions' });
    }

    return (
        <ListPageSkeleton
            header={{
                titleWidth: 180,
                subtitleWidth: 220,
                showSearch: true,
                searchWidth: 320,
                showFilter: true,
                showExportPdf: canExport,
                showExportExcel: canExport,
                showCreate: canCreate,
                showBulkUpload: canBulkUpload,
                createWidth: 150,
            }}
            table={{
                rows,
                columns: tableColumns,
                showCheckbox: canBulkDelete,
                showSerialNumber: true,
            }}
            mobileCards={{
                cards: 4,
                config: {
                    showCheckbox: canBulkDelete,
                    showAvatar: true,
                    avatarSize: 44,
                    detailRows: 4,
                    detailColumns: 2,
                    showAction: true,
                    actionCount: 2,
                    showBadge: true,
                    badgeCount: 1,
                },
            }}
            showFilterBar={isFilterVisible}
        />
    );
};

export default ProductSkeleton;
