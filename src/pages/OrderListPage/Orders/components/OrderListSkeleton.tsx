import React from 'react';
import { ListPageSkeleton } from '@/components/ui';

interface OrderListSkeletonProps {
    canCreate?: boolean;
    canExportPdf?: boolean;
}

/**
 * OrderListSkeleton - Permission-aware skeleton that matches the actual table structure
 * Shows/hides elements based on user permissions to avoid visual jump when data loads
 */
const OrderListSkeleton: React.FC<OrderListSkeletonProps> = ({
    canCreate = true,
    canExportPdf = true
}) => (
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
                { width: 100, type: 'text' },  // Invoice Number
                { width: 120, type: 'text' },  // Party Name
                { width: 80, type: 'text' },   // Created By
                { width: 90, type: 'text' },   // Delivery Date
                { width: 75, type: 'text' },   // Total Amount
                { width: 80, type: 'text' },   // View
                { width: 85, type: 'badge' }   // Status
            ],
            showCheckbox: false,
            showSerialNumber: true
        }}
        mobileCards={{
            cards: 4,
            config: {
                showCheckbox: false,
                showAvatar: false,
                detailRows: 4,
                detailColumns: 2,
                fullWidthDetailRows: 1,
                showAction: true,
                actionCount: 1,
                showBadge: true,
                badgeCount: 1
            }
        }}
    />
);

export default OrderListSkeleton;
