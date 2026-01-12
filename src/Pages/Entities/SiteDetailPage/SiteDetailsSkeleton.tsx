import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

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
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mb-6">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i}>
                                        <Skeleton width="40%" height={16} />
                                        <Skeleton width="70%" height={20} className="mt-1" />
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-gray-200 pt-4 mt-4">
                                <Skeleton width={100} height={20} className="mb-2" />
                                <Skeleton count={2} height={16} />
                            </div>
                        </div>
                    </div>

                    {/* Right Column Skeleton */}
                    <div className="lg:col-span-1 bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <Skeleton circle width={32} height={32} />
                                <Skeleton width={150} height={24} />
                            </h3>
                        </div>
                        <div className="flex-1 relative z-0" style={{ minHeight: '400px' }}>
                            <Skeleton height={400} />
                        </div>
                        <div className="p-4 bg-gray-50 border-t border-gray-200">
                            <Skeleton height={40} borderRadius={8} />
                        </div>
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
