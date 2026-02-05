import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { useOdometerPermissions } from '../../hooks/useOdometerPermissions';
import { MobileCardSkeleton, TableSkeleton } from '@/components/ui';

interface OdometerDetailsSkeletonProps {
    rows?: number;
    showSummary?: boolean;
}

const OdometerDetailsSkeleton: React.FC<OdometerDetailsSkeletonProps> = ({
    rows = 10,
    showSummary = true
}) => {
    const { canExport } = useOdometerPermissions();

    return (
        <div className="flex flex-col h-full anim-fade-in">
            {/* 1. Header & Summary Section - Fixed at top */}
            <div className="flex-shrink-0 space-y-4">
                {/* Header Actions */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 px-1">
                    <div className="flex items-center gap-4 text-left">
                        {/* Back Button */}
                        <Skeleton circle width={40} height={40} />
                        <div>
                            {/* Title & Subtitle */}
                            <Skeleton width={180} height={32} className="mb-2" />
                            <Skeleton width={300} height={16} />
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                        {/* Search Bar */}
                        <div className="w-full sm:w-80"><Skeleton height={42} borderRadius={8} /></div>

                        {/* Export Button */}
                        <div className="flex items-center gap-3 w-full sm:w-auto justify-start sm:justify-end">
                            {canExport && <Skeleton width={100} height={42} borderRadius={8} />}
                        </div>
                    </div>
                </div>

                {/* Blue Stats Card - Odometer Summary */}
                {showSummary && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 w-full lg:w-1/2">
                        {/* Card Header */}
                        <div className="flex items-center gap-3 mb-4">
                            <Skeleton width={40} height={40} borderRadius={12} />
                            <Skeleton width={180} height={24} />
                        </div>

                        <div className="border-b border-gray-200 -mx-8 mb-5" />

                        {/* Grid Content */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5">
                            {[
                                { labelW: 100, valueW: 140 },
                                { labelW: 60, valueW: 100 },
                                { labelW: 80, valueW: 200 },
                                { labelW: 150, valueW: 80 },
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <Skeleton width={36} height={36} borderRadius={8} />
                                    <div>
                                        <Skeleton width={item.labelW} height={12} />
                                        <Skeleton width={item.valueW} height={16} className="mt-1" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* 2. Scrollable Table Section */}
            <div className="flex-1 overflow-y-auto pb-6 pt-4">
                {/* Desktop Table View */}
                <TableSkeleton
                    rows={rows}
                    columns={[
                        { width: 120, type: 'text' },   // Date
                        { width: 60, type: 'badge' },   // Trips
                        { width: 50, type: 'badge' },   // Total KM
                        { width: 90, type: 'text' },    // View Details
                    ]}
                    showCheckbox={false}
                    showSerialNumber={true}
                    hideOnMobile={true}
                />

                {/* Mobile List View */}
                <MobileCardSkeleton
                    cards={5}
                    config={{
                        showCheckbox: false,
                        showAvatar: false,
                        detailRows: 1,
                        detailColumns: 2,
                        showAction: true,
                        actionCount: 1,
                        showBadge: true,
                        badgeCount: 1,
                    }}
                    showOnlyMobile={true}
                />
            </div>
        </div>
    );
};

export default OdometerDetailsSkeleton;
