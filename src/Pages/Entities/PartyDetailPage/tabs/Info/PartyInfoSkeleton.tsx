import React from 'react';

interface PartyInfoSkeletonProps {
    canUpdate?: boolean;
    canDelete?: boolean;
}

export const PartyInfoSkeleton: React.FC<PartyInfoSkeletonProps> = ({
    canUpdate = false,
    canDelete = false
}) => (
    <div className="space-y-6">
        {/* Header Skeleton (Matched DetailsHeader) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
                <div className="w-48 h-8 bg-gray-200 rounded-md animate-pulse" />
            </div>
            <div className="flex gap-4">
                {canUpdate && <div className="w-32 h-10 bg-gray-200 rounded-lg animate-pulse" />}
                {canDelete && <div className="w-32 h-10 bg-gray-200 rounded-lg animate-pulse" />}
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {/* Left Column (Matched DetailsMainCard + InfoGrid) */}
            <div className="lg:col-span-2 flex flex-col gap-6">
                {/* Main Details Card Skeleton (MATCHED INTERNAL STRUCTURE) */}
                <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
                    <div className="flex items-start gap-6">
                        {/* Avatar Placeholder */}
                        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-200 rounded-xl flex-shrink-0 animate-pulse" />

                        {/* Text Placeholder */}
                        <div className="flex-1 space-y-3 py-1">
                            <div className="w-1/2 h-8 bg-gray-200 rounded animate-pulse" /> {/* Title */}
                            <div className="w-2/3 h-4 bg-gray-100 rounded animate-pulse" /> {/* Address */}
                        </div>
                    </div>
                </div>

                {/* Info Grid Card Skeleton */}
                <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 space-y-6">
                    <div className="w-40 h-6 bg-gray-200 rounded animate-pulse mb-6" /> {/* Section Title */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                        {/* 8 Grid Items Skeleton */}
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="space-y-2">
                                <div className="w-24 h-4 bg-gray-100 rounded animate-pulse" />
                                <div className="w-32 h-5 bg-gray-200 rounded animate-pulse" />
                            </div>
                        ))}
                    </div>
                    {/* Description Section */}
                    <div className="border-t border-gray-100 pt-4 mt-6 space-y-2">
                        <div className="w-24 h-4 bg-gray-100 rounded animate-pulse" />
                        <div className="w-full h-4 bg-gray-100 rounded animate-pulse" />
                        <div className="w-3/4 h-4 bg-gray-100 rounded animate-pulse" />
                    </div>
                </div>
            </div>

            {/* Right Column (Matched Map Block) */}
            <div className="lg:col-span-1 flex flex-col gap-6 h-full">
                {/* Map Block Skeleton - Set to h-full to stretch with content */}
                <div className="bg-gray-200 rounded-xl shadow-md w-full h-full min-h-[350px] animate-pulse" />
            </div>
        </div>
    </div>
);
