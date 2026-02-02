import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

interface SiteDetailsSkeletonProps {
    canUpdate?: boolean;
    canDelete?: boolean;
}

const SiteDetailsSkeleton: React.FC<SiteDetailsSkeletonProps> = ({ canUpdate = true, canDelete = true }) => {
    return (
        <SkeletonTheme baseColor="#e6e6e6" highlightColor="#f0f0f0">
            <div className="relative">
                {/* Header Skeleton */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                    <div className="flex items-center gap-4">
                        <Skeleton circle width={40} height={40} />
                        <Skeleton width={180} height={32} />
                    </div>
                    <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                        {canUpdate && (
                            <Skeleton width={120} height={40} borderRadius={8} />
                        )}
                        {canDelete && (
                            <Skeleton width={130} height={40} borderRadius={8} />
                        )}
                    </div>
                </div>

                {/* Grid Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column Skeleton */}
                    <div className="lg:col-span-2 grid grid-cols-1 gap-6">
                        {/* Main Card Skeleton */}
                        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
                            <div className="flex items-start gap-6">
                                <Skeleton width={80} height={80} borderRadius={12} />
                                <div className="flex-1 pt-2">
                                    <Skeleton width="60%" height={28} />
                                    <Skeleton width="90%" height={20} className="mt-2" />
                                </div>
                            </div>
                        </div>

                        {/* Info Card Skeleton */}
                        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Skeleton circle width={32} height={32} />
                                <Skeleton width={200} height={24} />
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 mb-6">
                                {[...Array(9)].map((_, i) => (
                                    <div key={i} className={`flex items-start gap-3 ${i === 6 ? 'sm:col-span-2' : ''}`}>
                                        <Skeleton width={36} height={36} borderRadius={8} />
                                        <div className="flex-1">
                                            <Skeleton width={80} height={12} />
                                            <Skeleton width="70%" height={16} className="mt-1" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-gray-200 pt-5 mt-4">
                                <div className="flex items-start gap-3">
                                    <Skeleton width={36} height={36} borderRadius={8} />
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
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden flex flex-col h-full">
                            {/* Header */}
                            <div className="p-6 pb-0">
                                <div className="flex items-center gap-3">
                                    <Skeleton width={40} height={40} borderRadius={8} />
                                    <Skeleton width={100} height={28} />
                                </div>
                                <div className="h-px bg-gray-200 -mx-6 my-3" />
                            </div>

                            {/* Content */}
                            <div className="px-6 pb-6 flex-1 flex flex-col space-y-6">
                                {/* Map placeholder */}
                                <div className="flex-1 min-h-[240px] rounded-xl overflow-hidden">
                                    <Skeleton height={480} borderRadius={12} />
                                </div>

                                {/* Open in Google Maps button */}
                                <Skeleton height={48} borderRadius={8} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Interest Card Skeleton */}
                <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <Skeleton width={40} height={40} borderRadius={8} />
                            <div>
                                <Skeleton width={200} height={20} />
                                <Skeleton width={280} height={14} className="mt-1" />
                            </div>
                        </div>
                        <Skeleton width={110} height={28} borderRadius={20} />
                    </div>
                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                {/* Category Header */}
                                <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                                    <Skeleton width="70%" height={16} />
                                </div>
                                {/* Brands */}
                                <div className="p-4 space-y-3">
                                    <Skeleton width={60} height={14} />
                                    <div className="flex flex-wrap gap-2">
                                        <Skeleton width={70} height={30} borderRadius={6} />
                                        <Skeleton width={55} height={30} borderRadius={6} />
                                        <Skeleton width={80} height={30} borderRadius={6} />
                                    </div>
                                    {/* Contacts */}
                                    <div className="border-t border-gray-100 pt-3 mt-3">
                                        <Skeleton width={100} height={14} />
                                        <div className="mt-2.5 space-y-2">
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                <Skeleton circle width={32} height={32} />
                                                <div className="flex-1">
                                                    <Skeleton width="60%" height={14} />
                                                    <Skeleton width="50%" height={12} className="mt-1" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Image Card Skeleton */}
                <div className="mt-6 bg-white rounded-xl shadow-md border border-gray-200 p-6">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-3">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <Skeleton circle width={32} height={32} />
                            <Skeleton width={160} height={24} />
                        </h3>
                        <Skeleton width={160} height={40} borderRadius={8} />
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-4">
                        {[...Array(3)].map((_, i) => (
                            <Skeleton key={i}
                                className="aspect-square"
                                borderRadius={8}
                            />
                        ))}
                    </div>
                </div>

            </div>
        </SkeletonTheme>
    );
};

export default SiteDetailsSkeleton;
