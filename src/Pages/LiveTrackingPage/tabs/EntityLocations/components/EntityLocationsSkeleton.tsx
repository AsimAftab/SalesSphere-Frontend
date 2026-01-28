import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const EntityLocationsSkeleton: React.FC = () => {
    return (
        <div className="flex flex-col h-full space-y-4 pb-4">
            {/* Header */}
            <div className="flex-shrink-0">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <div>
                        {/* Title */}
                        <Skeleton width={200} height={32} className="mb-1" />
                        {/* Subtitle */}
                        <Skeleton width={300} height={20} />
                    </div>
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col flex-1 min-h-0">

                {/* Full Width Toolbar Wrapper */}
                <div className="flex-shrink-0 mb-4 border-b border-gray-100 pb-2">
                    {/* EntityFilterBar Skeleton */}
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-4 p-1 mb-2 bg-white rounded-lg">
                        {/* Left Side */}
                        <div className="flex flex-col lg:flex-row items-center gap-4 w-full lg:w-auto">
                            {/* Mobile Count Pill */}
                            <div className="lg:hidden w-full">
                                <Skeleton height={32} borderRadius={999} className="w-full" />
                            </div>
                            {/* Desktop Count Text */}
                            <div className="hidden lg:block">
                                <Skeleton width={180} height={24} />
                            </div>

                            {/* Divider Placeholder */}
                            <div className="hidden xl:block w-px h-6 bg-gray-200"></div>

                            {/* Filters */}
                            <div className="flex flex-wrap lg:flex-nowrap items-center justify-center lg:justify-start gap-3 w-full lg:w-auto">
                                {[1, 2, 3].map(i => (
                                    <Skeleton key={i} width={120} height={32} borderRadius={999} />
                                ))}
                            </div>
                        </div>

                        {/* Right Side: Search */}
                        <div className="flex items-center gap-4 w-full lg:w-auto">
                            <div className="flex-1 w-full lg:w-[300px]">
                                <Skeleton height={42} borderRadius={8} className="w-full" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0 overflow-hidden">

                    {/* Left Panel: Map (Desktop order-1, Mobile order-2) */}
                    <div className="order-2 lg:order-1 lg:col-span-2 rounded-xl border border-gray-200 h-full min-h-[300px] bg-slate-50 relative overflow-hidden">
                        <Skeleton className="h-full w-full" style={{ lineHeight: 'unset', display: 'block' }} />
                    </div>

                    {/* Right Panel: Location List (Desktop order-2, Mobile order-1) */}
                    <div className="order-1 lg:order-2 flex flex-col min-h-0">
                        {/* Desktop List Wrapper (Hidden on Mobile) */}
                        <div className="hidden lg:flex h-[560px] bg-gray-50 rounded-lg p-3 overflow-hidden">
                            <div className="space-y-2 w-full">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                                        <div className="flex justify-between items-center mb-2">
                                            <Skeleton width={100} height={16} />
                                            <Skeleton width={50} height={20} borderRadius={12} />
                                        </div>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Skeleton circle width={12} height={12} />
                                            <div className="flex-1">
                                                <Skeleton height={12} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Mobile List Wrapper (Hidden on Desktop) */}
                        <div className="lg:hidden h-[400px] bg-gray-50 rounded-lg p-3 overflow-hidden mb-4">
                            <div className="space-y-2 w-full">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                                        <div className="flex justify-between items-center mb-2">
                                            <Skeleton width={100} height={16} />
                                            <Skeleton width={50} height={20} borderRadius={12} />
                                        </div>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Skeleton circle width={12} height={12} />
                                            <div className="flex-1">
                                                <Skeleton height={12} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EntityLocationsSkeleton;
