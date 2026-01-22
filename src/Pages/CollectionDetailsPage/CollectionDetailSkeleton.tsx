import React from 'react';

interface CollectionDetailSkeletonProps {
    paymentMode?: 'Cash' | 'Cheque' | 'Bank Transfer' | 'QR Pay' | null;
    permissions?: {
        canUpdate: boolean;
        canDelete: boolean;
    };
}

const SkeletonPulse = ({ className }: { className: string }) => (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

export const CollectionDetailSkeleton: React.FC<CollectionDetailSkeletonProps> = ({
    paymentMode = null,
    permissions = { canUpdate: true, canDelete: true }
}) => {
    /* -------------------------------------------------
       Layout rules based on ACTUAL UI behavior
    ------------------------------------------------- */

    const showRightColumn =
        paymentMode === 'Cheque' ||
        paymentMode === 'Bank Transfer' ||
        paymentMode === 'QR Pay' ||
        paymentMode === null;

    const getRowCount = () => {
        switch (paymentMode) {
            case 'Cash':
                return 6;
            case 'QR Pay':
                return 6;
            case 'Bank Transfer':
                return 7;
            case 'Cheque':
                return 10;
            default:
                return 10; // unknown → max rows to avoid layout shift
        }
    };

    const rowCount = getRowCount();

    /* -------------------------------------------------
       Render
    ------------------------------------------------- */

    return (
        <div className="relative space-y-6">
            {/* Header Skeleton */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
                <div className="flex items-center gap-4">
                    <SkeletonPulse className="h-5 w-5" />
                    <SkeletonPulse className="h-8 w-48" />
                </div>
                <div className="flex flex-row gap-3">
                    {permissions.canUpdate && (
                        <SkeletonPulse className="h-11 w-36 rounded-lg" />
                    )}
                    {permissions.canDelete && (
                        <SkeletonPulse className="h-11 w-40 rounded-lg" />
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6 flex flex-col h-full">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 flex-1">
                        {/* Card Header */}
                        <div className="flex items-center gap-3 mb-4">
                            <SkeletonPulse className="w-10 h-10 rounded-xl" />
                            <SkeletonPulse className="h-6 w-44" />
                        </div>

                        <hr className="border-gray-200 -mx-8 mb-5" />

                        {/* Info Rows */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5">
                            {[...Array(rowCount)].map((_, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <SkeletonPulse className="w-5 h-5 mt-0.5 shrink-0" />
                                    <div className="space-y-1.5 flex-1">
                                        <SkeletonPulse className="h-3 w-24" />
                                        <SkeletonPulse className="h-4 w-3/4" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <hr className="border-gray-200 -mx-8 mt-5 mb-4" />

                        {/* Description */}
                        <div className="flex items-start gap-3">
                            <SkeletonPulse className="w-5 h-5 mt-0.5 shrink-0" />
                            <div className="space-y-1.5 flex-1">
                                <SkeletonPulse className="h-3 w-20" />
                                <SkeletonPulse className="h-4 w-full" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column (Images) */}
                {showRightColumn && (
                    <div className="lg:col-span-1 flex flex-col h-full">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col h-full">
                            {/* Header */}
                            <div className="flex flex-col gap-4 mb-6">
                                <div className="flex items-center gap-3">
                                    <SkeletonPulse className="w-10 h-10 rounded-xl shrink-0" />
                                    <div>
                                        <SkeletonPulse className="h-4 w-36 mb-1" />
                                        <SkeletonPulse className="h-3 w-24" />
                                    </div>
                                </div>
                                <SkeletonPulse className="h-10 w-full rounded-lg" />
                            </div>

                            {/* Image Grid */}
                            <div className="grid grid-cols-2 gap-4 flex-grow">
                                <SkeletonPulse className="aspect-square rounded-lg w-full" />
                                <SkeletonPulse className="aspect-square rounded-lg w-full" />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CollectionDetailSkeleton;
