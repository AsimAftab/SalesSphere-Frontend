import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { type AnalyticsPermissions } from './useSalesViewState';

interface AnalyticsSkeletonProps {
    permissions: AnalyticsPermissions;
}

const SalesSkeleton: React.FC<AnalyticsSkeletonProps> = ({ permissions }) => {
    return (
        <div className="flex flex-col h-full w-full">

            {/* Page Header */}
            <div className="mb-6 flex-shrink-0">
                <Skeleton width={180} height={28} className="mb-2" />
                <Skeleton width={300} height={16} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Top Section: Sidebar + Main Chart */}
                <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* Left Sidebar (Date + Stats) */}
                    <div className="lg:col-span-3 flex flex-col justify-between h-full">

                        {/* Date Picker Card */}
                        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm mb-6">
                            <Skeleton width={120} height={12} className="mb-3" />
                            <div className="flex space-x-3">
                                <div className="w-1/3">
                                    <Skeleton height={40} borderRadius={8} />
                                </div>
                                <div className="flex-1">
                                    <Skeleton height={40} borderRadius={8} />
                                </div>
                            </div>
                        </div>

                        {/* Stat Cards Stack */}
                        {permissions.canViewMonthlyOverview && (
                            <div className="flex flex-col gap-6 flex-grow ">
                                {[...Array(2)].map((_, i) => (
                                    <div key={i} className="bg-white p-6 rounded-lg border-2 border-gray-100 shadow-sm flex items-center justify-between">
                                        <div className="flex flex-col space-y-2">
                                            <Skeleton width={100} height={12} />
                                            <Skeleton width={80} height={24} />
                                        </div>
                                        <Skeleton circle width={48} height={48} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Main Chart (Sales Order Performance) */}
                    {permissions.canViewSalesTrend && (
                        <div className="lg:col-span-9 bg-white rounded-lg border border-gray-100 shadow-sm p-6 flex flex-col" style={{ height: '396px' }}>
                            <div className="mb-6">
                                <Skeleton width={200} height={20} />
                            </div>

                            <div className="flex-1 flex gap-4 min-h-0">
                                {/* Y-Axis Labels - Alignment Fix */}
                                <div className="w-16 flex flex-col justify-between items-end pb-6 pt-0 text-right pr-2">
                                    {[...Array(5)].map((_, i) => (
                                        <Skeleton key={i} width={40} height={10} />
                                    ))}
                                </div>

                                {/* Chart Area */}
                                <div className="flex-1 flex flex-col min-w-0">
                                    {/* Bars Container - Relative for Grid Lines */}
                                    <div className="flex-1 flex items-end justify-between gap-4 border-l border-b border-gray-100 px-8 relative">

                                        {/* Horizontal Grid Lines */}
                                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-0">
                                            {[...Array(5)].map((_, i) => (
                                                <div key={i} className={`w-full border-t border-dashed border-gray-100 ${i === 4 ? 'border-transparent' : ''}`} style={{ height: '1px' }} />
                                            ))}
                                        </div>


                                    </div>

                                    {/* X-Axis Labels */}
                                    <div className="flex justify-between px-8 pt-3">
                                        {[...Array(5)].map((_, i) => (
                                            <div key={i} className="w-full text-center flex justify-center">
                                                <Skeleton width={40} height={10} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Bottom Section: 3 Columns */}
                <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Products By Category (Pie) */}
                    {permissions.canViewCategorySales && (
                        <div className="h-[23rem] bg-white rounded-lg border border-gray-100 shadow-sm p-4 flex flex-col">
                            <div className="mb-4">
                                <Skeleton width={180} height={16} className="mb-2" />
                                <Skeleton width={140} height={10} />
                            </div>
                            <div className="flex-1 flex flex-col md:flex-row items-center gap-4">
                                {/* Chart */}
                                <div className="w-full md:w-1/2 flex justify-center">
                                    <Skeleton circle width={130} height={130} />
                                </div>
                                {/* Legend */}
                                <div className="w-full md:w-1/2 flex flex-col justify-center space-y-3">
                                    <div className="flex justify-between border-b border-gray-100 pb-2 mb-1">
                                        <Skeleton width={50} height={10} />
                                        <Skeleton width={30} height={10} />
                                    </div>
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className="flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <Skeleton circle width={10} height={10} />
                                                <Skeleton width={60} height={10} />
                                            </div>
                                            <Skeleton width={20} height={10} />
                                        </div>
                                    ))}
                                    <div className="flex justify-between pt-2 border-t border-gray-100 mt-auto">
                                        <Skeleton width={40} height={12} />
                                        <Skeleton width={30} height={12} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Top Products (Pie) */}
                    {permissions.canViewTopProducts && (
                        <div className="h-[23rem] bg-white rounded-lg border border-gray-100 shadow-sm p-4 flex flex-col">
                            <div className="mb-4">
                                <Skeleton width={180} height={16} className="mb-2" />
                                <Skeleton width={140} height={10} />
                            </div>
                            <div className="flex-1 flex flex-col md:flex-row items-center gap-4">
                                {/* Chart */}
                                <div className="w-full md:w-1/2 flex justify-center">
                                    <Skeleton circle width={130} height={130} />
                                </div>
                                {/* Legend */}
                                <div className="w-full md:w-1/2 flex flex-col justify-center space-y-3">
                                    <div className="flex justify-between border-b border-gray-100 pb-2 mb-1">
                                        <Skeleton width={50} height={10} />
                                        <Skeleton width={30} height={10} />
                                    </div>
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className="flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <Skeleton circle width={10} height={10} />
                                                <Skeleton width={60} height={10} />
                                            </div>
                                            <Skeleton width={20} height={10} />
                                        </div>
                                    ))}
                                    <div className="flex justify-between pt-2 border-t border-gray-100 mt-auto">
                                        <Skeleton width={40} height={12} />
                                        <Skeleton width={30} height={12} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Top Parties (List) */}
                    {permissions.canViewTopParties && (
                        <div className="h-[23rem] bg-white rounded-lg border border-gray-100 shadow-sm p-4 flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                                <Skeleton width={180} height={16} />
                            </div>
                            <div className="flex-1 flex flex-col gap-3 overflow-hidden mt-2">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 border border-gray-50 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-x-3">
                                            <Skeleton circle width={40} height={40} />
                                            <div className="flex flex-col gap-1">
                                                <Skeleton width={100} height={14} />
                                            </div>
                                        </div>
                                        <div className="text-right flex flex-col items-end gap-1">
                                            <Skeleton width={60} height={14} />
                                            <Skeleton width={40} height={12} />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Scroll Indicator Skeleton */}
                            <div className="flex justify-center mt-2">
                                <Skeleton circle height={24} width={24} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SalesSkeleton;