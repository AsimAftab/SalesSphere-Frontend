import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ProspectsSkeleton: React.FC = () => {
    return (
        <div className="w-full flex flex-col p-1 md:p-0 space-y-8 pb-10">
            {/* Header Section */}
            <div className="w-full flex flex-col space-y-1 mb-2">
                <Skeleton width={250} height={32} />
                <Skeleton width={260} height={16} />
            </div>

            {/* Stat Cards Grid (4 columns) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={`stat-skeleton-${i}`} className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm flex items-start justify-between h-32">
                        <div className="flex flex-col justify-between h-full space-y-2">
                            <Skeleton width={100} height={12} />
                            <Skeleton width={60} height={32} />
                        </div>
                        <div className="rounded-full p-3 flex-shrink-0">
                            <Skeleton circle width={48} height={48} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Category Cards Grid (3 columns, 9 items requested) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(9)].map((_, i) => (
                    <div key={`cat-skeleton-${i}`} className="h-96 bg-white rounded-lg shadow-sm border border-gray-100 p-6 flex flex-col">
                        {/* Card Header */}
                        <div className="flex justify-between items-center mb-4">
                            <Skeleton height={20} width={120} />
                            <Skeleton height={16} width={80} />
                        </div>

                        {/* Table Header */}
                        <div className="flex justify-between mb-3 pb-2 border-b border-gray-100">
                            <Skeleton height={12} width={80} />
                            <Skeleton height={12} width={80} />
                        </div>

                        {/* List Rows */}
                        <div className="flex-1 space-y-4">
                            {[...Array(5)].map((_, rowI) => (
                                <div key={rowI} className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <Skeleton circle height={8} width={8} />
                                        <Skeleton height={14} width={100} />
                                    </div>
                                    <Skeleton height={20} width={30} borderRadius={12} />
                                </div>
                            ))}
                        </div>

                        {/* Scroll Indicator Skeleton */}
                        <div className="flex justify-center mt-2">
                            <Skeleton circle height={24} width={24} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProspectsSkeleton;
