import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useOdometerPermissions } from '../../hooks/useOdometerPermissions';

interface OdometerDetailsSkeletonProps {
    rows?: number;
    showSummary?: boolean;
}

const OdometerDetailsSkeleton: React.FC<OdometerDetailsSkeletonProps> = ({
    rows = 10,
    showSummary = true
}) => {
    const { canExport } = useOdometerPermissions();

    return (
        <div className="flex flex-col h-full anim-fade-in">
            {/* 1. Header & Summary Section - Fixed at top */}
            <div className="flex-shrink-0 space-y-4">
                {/* Header Actions */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 px-1">
                    <div className="flex items-center gap-4 text-left">
                        {/* Back Button */}
                        <Skeleton circle width={40} height={40} />
                        <div>
                            {/* Title & Subtitle */}
                            <Skeleton width={180} height={32} className="mb-2" />
                            <Skeleton width={300} height={16} />
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                        {/* Search Bar */}
                        <div className="w-full sm:w-80"><Skeleton height={42} borderRadius={8} /></div>

                        {/* Export Button */}
                        <div className="flex items-center gap-3 w-full sm:w-auto justify-start sm:justify-end">
                            {canExport && <Skeleton width={100} height={42} borderRadius={8} />}
                        </div>
                    </div>
                </div>

                {/* Blue Stats Card - Odometer Summary */}
                {showSummary && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 w-full lg:w-1/2">
                        {/* Card Header */}
                        <div className="flex items-center gap-3 mb-4">
                            <Skeleton width={40} height={40} borderRadius={12} />
                            <Skeleton width={180} height={24} />
                        </div>

                        <div className="border-b border-gray-200 -mx-8 mb-5" />

                        {/* Grid Content */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5">
                            {/* Employee Name */}
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <Skeleton circle width={16} height={16} />
                                    <Skeleton width={100} height={12} />
                                </div>
                                <Skeleton width={140} height={20} className="ml-6" />
                            </div>
                            {/* Role */}
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <Skeleton circle width={16} height={16} />
                                    <Skeleton width={60} height={12} />
                                </div>
                                <Skeleton width={100} height={20} className="ml-6" />
                            </div>
                            {/* Date Range */}
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <Skeleton circle width={16} height={16} />
                                    <Skeleton width={80} height={12} />
                                </div>
                                <Skeleton width={200} height={20} className="ml-6" />
                            </div>
                            {/* Total Distance */}
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <Skeleton circle width={16} height={16} />
                                    <Skeleton width={150} height={12} />
                                </div>
                                <Skeleton width={80} height={20} className="ml-6" />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* 2. Scrollable Table Section */}
            <div className="flex-1 overflow-y-auto pb-6 pt-4">
                {/* Desktop Table View */}
                <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-5 py-4 text-left"><Skeleton width={30} height={14} /></th>
                                <th className="px-5 py-4 text-left"><Skeleton width={100} height={14} /></th>
                                <th className="px-5 py-4 text-center"><Skeleton width={100} height={14} /></th>
                                <th className="px-5 py-4 text-center"><Skeleton width={80} height={14} /></th>
                                <th className="px-5 py-4 text-left"><Skeleton width={90} height={14} /></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {Array(rows).fill(0).map((_, i) => (
                                <tr key={i} className="h-16">
                                    <td className="px-5 py-4"><Skeleton width={20} /></td>
                                    <td className="px-5 py-4"><Skeleton width={120} /></td>
                                    <td className="px-5 py-4 text-center">
                                        <Skeleton width={60} height={16} borderRadius={4} />
                                    </td>
                                    <td className="px-5 py-4 text-center">
                                        <Skeleton width={50} height={16} borderRadius={4} />
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2">
                                            <Skeleton circle width={16} height={16} />
                                            <Skeleton width={70} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile List View */}
                <div className="md:hidden w-full space-y-4 pb-10">
                    {Array(5).fill(0).map((_, i) => (
                        <div key={i} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                            <div className="flex justify-between items-center mb-3">
                                <Skeleton width={100} height={16} />
                                <Skeleton width={60} height={14} />
                            </div>
                            <div className="flex justify-between items-center gap-4">
                                <Skeleton width={80} height={14} />
                                <Skeleton width={90} height={24} borderRadius={4} />
                            </div>
                            <div className="mt-4">
                                <Skeleton width="100%" height={36} borderRadius={8} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OdometerDetailsSkeleton;
