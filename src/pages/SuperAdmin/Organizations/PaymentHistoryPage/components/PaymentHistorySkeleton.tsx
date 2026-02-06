import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import {
    PageHeaderSkeleton,
    TableSkeleton,
    MobileCardSkeleton,
    type TableColumnSkeleton,
} from '@/components/ui';

interface PaymentHistorySkeletonProps {
    rows?: number;
    isFilterVisible?: boolean;
}

export const PaymentHistorySkeleton: React.FC<PaymentHistorySkeletonProps> = ({
    rows = 10,
    isFilterVisible = false,
}) => {
    // Define table columns based on PaymentHistoryTable structure
    const tableColumns: TableColumnSkeleton[] = [
        { width: 100, type: 'text' },   // Date Received
        { width: 100, type: 'text' },   // Amount Received
        { width: 90, type: 'badge' },   // Payment Mode
        { width: 150, type: 'text' },   // Description
        { width: 100, type: 'text' },   // Received By
        { width: 70, type: 'text' },    // Proof (View button)
        { width: 60, type: 'actions' }, // Actions (Edit/Delete)
    ];

    return (
        <div className="w-full flex flex-col">
            {/* 1. Page Header */}
            <PageHeaderSkeleton
                titleWidth={200}
                subtitleWidth={280}
                showSearch={true}
                showFilter={true}
                showExportPdf={false}
                showExportExcel={false}
                showCreate={true}
                createWidth={140}
            />

            {/* 2. Filter Bar (Optional) */}
            {isFilterVisible && (
                <div className="mb-4 flex flex-wrap gap-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex-1 min-w-[140px] max-w-[200px]">
                            <Skeleton height={40} borderRadius={8} />
                        </div>
                    ))}
                </div>
            )}

            {/* 3. Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4"
                    >
                        <Skeleton width={48} height={48} borderRadius={12} />
                        <div className="flex-1">
                            <Skeleton width={140} height={14} className="mb-2" />
                            <Skeleton width={100} height={28} />
                        </div>
                    </div>
                ))}
            </div>

            {/* 4. Desktop Table */}
            <TableSkeleton
                rows={rows}
                columns={tableColumns}
                showCheckbox={false}
                showSerialNumber={true}
                hideOnMobile={true}
            />

            {/* 5. Mobile Cards */}
            <MobileCardSkeleton
                cards={3}
                config={{
                    showCheckbox: false,
                    showAvatar: false,
                    detailRows: 4,
                    detailColumns: 2,
                    fullWidthDetailRows: 1,
                    showAction: true,
                    actionCount: 3,
                    showBadge: true,
                    badgeCount: 1,
                }}
                showOnlyMobile={true}
            />
        </div>
    );
};

export default PaymentHistorySkeleton;
