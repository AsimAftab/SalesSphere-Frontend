import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { FormSkeleton } from '@/components/ui';

interface PartyInfoSkeletonProps {
    canUpdate?: boolean;
    canDelete?: boolean;
}

/**
 * PartyInfoSkeleton - Uses generic skeleton components where applicable.
 * Maintains specific layout for detail page structure.
 */
export const PartyInfoSkeleton: React.FC<PartyInfoSkeletonProps> = ({
    canUpdate = false,
    canDelete = false,
}) => (
    <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <Skeleton circle width={40} height={40} />
                <Skeleton width={192} height={32} />
            </div>
            <div className="flex gap-4">
                {canUpdate && <Skeleton width={128} height={40} borderRadius={8} />}
                {canDelete && <Skeleton width={128} height={40} borderRadius={8} />}
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {/* Left Column */}
            <div className="lg:col-span-2 flex flex-col gap-6">
                {/* Main Card Skeleton */}
                <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
                    <div className="flex items-start gap-6">
                        <Skeleton width={96} height={96} borderRadius={12} className="shrink-0" />
                        <div className="flex-1 space-y-3 py-1">
                            <Skeleton width="50%" height={32} />
                            <Skeleton width="66%" height={16} />
                        </div>
                    </div>
                </div>

                {/* Info Grid Card Skeleton - using generic FormSkeleton pattern */}
                <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 space-y-6">
                    <div className="flex items-center gap-2">
                        <Skeleton width={32} height={32} borderRadius={8} />
                        <Skeleton width={160} height={24} />
                    </div>
                    <FormSkeleton rows={4} fieldsPerRow={2} showSubmit={false} />
                    {/* Description Section */}
                    <div className="border-t border-gray-100 pt-5 mt-6">
                        <div className="flex items-start gap-3">
                            <Skeleton width={36} height={36} borderRadius={8} className="shrink-0" />
                            <div className="flex-1">
                                <Skeleton width={80} height={12} />
                                <Skeleton width="100%" height={16} className="mt-1" />
                                <Skeleton width="75%" height={16} className="mt-1" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column - Map Block Skeleton */}
            <div className="lg:col-span-1 flex flex-col gap-6 h-full">
                <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden flex flex-col flex-1 h-full">
                    {/* Header */}
                    <div className="p-6 pb-0">
                        <div className="flex items-center gap-3">
                            <Skeleton width={40} height={40} borderRadius={8} />
                            <Skeleton width={96} height={28} />
                        </div>
                        <div className="h-px bg-gray-200 -mx-6 my-3" />
                    </div>

                    {/* Content */}
                    <div className="px-6 pb-6 flex-1 flex flex-col space-y-6">
                        {/* Map placeholder */}
                        <div className="flex-1 min-h-[480px]">
                            <Skeleton height="100%" borderRadius={12} />
                        </div>

                        {/* Open in Google Maps button */}
                        <Skeleton width="100%" height={48} borderRadius={8} />
                    </div>
                </div>
            </div>
        </div>
    </div>
);
