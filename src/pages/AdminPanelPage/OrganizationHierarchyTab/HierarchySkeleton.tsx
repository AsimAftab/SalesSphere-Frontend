import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const HierarchySkeleton: React.FC = () => (
    <>
        {/* Page Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-6 pt-4 sm:pt-6">
            <div>
                <Skeleton width={280} height={30} className="mb-1" />
                <Skeleton width={380} height={14} />
            </div>
            <div className="flex items-center gap-2">
                <Skeleton width={110} height={38} borderRadius={8} />
                <Skeleton width={110} height={38} borderRadius={8} />
            </div>
        </div>

        {/* Content Skeleton */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden px-4 sm:px-6 py-4 sm:py-6 gap-4">
            {/* Info Bar Skeleton */}
            <div className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 px-4 py-3 shadow-sm">
                <Skeleton width={36} height={36} borderRadius={8} />
                <Skeleton width={150} height={16} />
                <div className="ml-auto">
                    <Skeleton width={120} height={28} borderRadius={14} />
                </div>
            </div>

            {/* Tree Container Skeleton */}
            <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="flex flex-col items-center p-10">
                    {/* Root Node */}
                    <Skeleton width={260} height={64} borderRadius={12} />
                    <div className="w-0.5 h-8 bg-gray-200 my-1"></div>

                    {/* Second Level */}
                    <div className="flex gap-10">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex flex-col items-center">
                                <div className="w-0.5 h-4 bg-gray-200"></div>
                                <Skeleton width={260} height={64} borderRadius={12} />
                                {i <= 2 && (
                                    <>
                                        <div className="w-0.5 h-6 bg-gray-200 mt-1"></div>
                                        {/* Third Level */}
                                        <div className="flex gap-6">
                                            {[1, 2].map((j) => (
                                                <div key={j} className="flex flex-col items-center">
                                                    <div className="w-0.5 h-4 bg-gray-200"></div>
                                                    <Skeleton width={260} height={64} borderRadius={12} />
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </>
);

export default HierarchySkeleton;
