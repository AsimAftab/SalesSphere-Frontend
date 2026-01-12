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
    // Determine layout based on payment mode
    // Default to Cash (simplest) when payment mode is unknown (null)
    const showRightColumn = paymentMode === 'Cheque' || paymentMode === 'Bank Transfer' || paymentMode === 'QR Pay';
    const showBottomImages = paymentMode === 'Cheque';
    const isChequeDetails = paymentMode === 'Cheque';

    return (
        <div className="relative space-y-6">
            {/* Header Actions Skeleton */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
                <div className="flex items-center gap-4">
                    <SkeletonPulse className="h-5 w-5" />
                    <SkeletonPulse className="h-8 w-48" />
                </div>
                <div className="flex flex-row gap-3">
                    {permissions.canUpdate && <SkeletonPulse className="h-11 w-36 rounded-lg" />}
                    {permissions.canDelete && <SkeletonPulse className="h-11 w-40 rounded-lg" />}
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Collection Information Card */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-4">
                            <SkeletonPulse className="w-10 h-10 rounded-xl" />
                            <SkeletonPulse className="h-6 w-56" />
                        </div>

                        <hr className="border-gray-200 -mx-8 mb-5" />

                        {/* Info Blocks Grid (2 columns, 6 items) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <SkeletonPulse className="w-5 h-5 mt-0.5 shrink-0" />
                                    <div className="space-y-1.5 flex-1">
                                        <SkeletonPulse className="h-3 w-24" />
                                        <SkeletonPulse className="h-4 w-full" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <hr className="border-gray-200 -mx-8 mt-4 mb-4" />

                        {/* Description */}
                        <div className="flex items-start gap-3">
                            <SkeletonPulse className="w-5 h-5 mt-0.5 shrink-0" />
                            <div className="space-y-1.5 flex-1">
                                <SkeletonPulse className="h-3 w-20" />
                                <SkeletonPulse className="h-4 w-full" />
                            </div>
                        </div>

                        {/* Bank Transfer Highlight Box */}
                        {paymentMode === 'Bank Transfer' && (
                            <div className="mt-2 pt-2 border-t border-gray-100 -mx-8 px-8">
                                <div className="bg-purple-100 rounded-xl p-3 border border-purple-100 flex items-center gap-4">
                                    <SkeletonPulse className="w-10 h-10 rounded-lg shrink-0" />
                                    <div className="flex-1 space-y-2">
                                        <SkeletonPulse className="h-2.5 w-40" />
                                        <SkeletonPulse className="h-4 w-32" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Payment Mode Specific Details */}
                {showRightColumn && (
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            {isChequeDetails ? (
                                <>
                                    {/* Cheque Details Header */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <SkeletonPulse className="w-10 h-10 rounded-xl" />
                                            <SkeletonPulse className="h-6 w-32" />
                                        </div>
                                        <SkeletonPulse className="h-6 w-16 rounded-full" />
                                    </div>

                                    <hr className="border-gray-200 -mx-8 mb-5" />

                                    {/* Cheque Info Blocks (4 items) */}
                                    <div className="grid grid-cols-1 gap-y-5">
                                        {[...Array(4)].map((_, i) => (
                                            <div key={i} className="flex items-start gap-3">
                                                <SkeletonPulse className="w-5 h-5 mt-0.5 shrink-0" />
                                                <div className="space-y-1.5 flex-1">
                                                    <SkeletonPulse className="h-3 w-20" />
                                                    <SkeletonPulse className="h-4 w-full" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* Image Card for Bank Transfer / QR Pay */}
                                    <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-3">
                                        <div className="flex items-center gap-2">
                                            <SkeletonPulse className="w-8 h-8 rounded-lg" />
                                            <SkeletonPulse className="h-5 w-40" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        {[...Array(2)].map((_, i) => (
                                            <SkeletonPulse key={i} className="aspect-square rounded-lg" />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Image Section (for Cheque) */}
            {showBottomImages && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-3">
                                <div className="flex items-center gap-2">
                                    <SkeletonPulse className="w-8 h-8 rounded-lg" />
                                    <SkeletonPulse className="h-5 w-36" />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-4">
                                {[...Array(2)].map((_, i) => (
                                    <SkeletonPulse key={i} className="aspect-square rounded-lg" />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CollectionDetailSkeleton;
