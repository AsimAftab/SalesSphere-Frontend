import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { TableSkeleton, MobileCardSkeleton } from '@/components/ui';

/**
 * PartyCollectionsSkeleton - Uses generic skeleton components.
 */
export const PartyCollectionsSkeleton: React.FC = () => {
    return (
        <div className="flex flex-col h-full space-y-4">
            {/* Header Skeleton */}
            <div className="px-1">
                <Skeleton width={192} height={32} />
            </div>

            <div className="relative w-full space-y-4">
                {/* Desktop Table Skeleton using generic TableSkeleton */}
                <TableSkeleton
                    rows={10}
                    columns={[
                        { width: 100, type: 'text' },  // Date
                        { width: 100, type: 'text' },  // Payment Mode
                        { width: 80, type: 'text' },   // Amount
                        { width: 120, type: 'text' },  // Created By
                        { width: 80, type: 'text' },   // View Details
                    ]}
                    showSerialNumber={true}
                    showCheckbox={false}
                    hideOnMobile={true}
                />

                {/* Mobile Card Skeleton using generic MobileCardSkeleton */}
                <MobileCardSkeleton
                    cards={4}
                    config={{
                        showCheckbox: false,
                        showAvatar: false,
                        detailRows: 2,
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
