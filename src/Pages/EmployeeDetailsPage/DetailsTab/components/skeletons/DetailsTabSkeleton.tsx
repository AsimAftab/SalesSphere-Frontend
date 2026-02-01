import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { useAuth } from '../../../../../api/authService';

const EmployeeDetailsSkeleton: React.FC = () => {
    const { hasPermission } = useAuth();
    const canUpdate = hasPermission('employees', 'update');
    const canDelete = hasPermission('employees', 'delete');

    return (
        <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
            <div className="relative animate-pulse space-y-6">

                {/* Header: Title + Actions */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Skeleton circle width={40} height={40} />
                        <Skeleton width={200} height={32} />
                    </div>
                    <div className="flex flex-col md:flex-row w-full md:w-auto gap-4 md:space-x-4">
                        {canUpdate && <Skeleton height={42} width={180} borderRadius={8} />}
                        {canDelete && <Skeleton height={42} width={160} borderRadius={8} />}
                    </div>
                </div>

                {/* Main Content Grid: 3-col layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left: Combined Profile + Info Card */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                        {/* Avatar + Name */}
                        <div className="flex items-center gap-6 mb-6">
                            <Skeleton circle width={96} height={96} />
                            <div>
                                <Skeleton width={200} height={28} className="mb-2" />
                                <Skeleton width={120} height={18} />
                            </div>
                        </div>

                        <hr className="border-gray-200 mb-6" />

                        {/* Section Header */}
                        <div className="flex items-center gap-3 mb-5">
                            <Skeleton width={36} height={36} borderRadius={8} />
                            <Skeleton width={180} height={22} />
                        </div>

                        {/* InfoBlock Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-8">
                            {[...Array(10)].map((_, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <Skeleton circle width={20} height={20} />
                                    <div>
                                        <Skeleton width={80} height={12} className="mb-2" />
                                        <Skeleton width={140} height={16} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Documents + Attendance stacked */}
                    <div className="flex flex-col gap-6">

                        {/* Documents Card */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <div className="flex justify-between items-center mb-4">
                                <Skeleton width={140} height={22} />
                                {canUpdate && <Skeleton width={80} height={34} borderRadius={6} />}
                            </div>
                            <div className="space-y-2.5">
                                {[1, 2].map((i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100">
                                        <Skeleton width={40} height={40} borderRadius={12} />
                                        <div className="flex-1 min-w-0">
                                            <Skeleton width="70%" height={14} className="mb-1.5" />
                                            <Skeleton width="40%" height={12} />
                                        </div>
                                        <div className="flex gap-1">
                                            <Skeleton width={32} height={32} borderRadius={8} />
                                            {canUpdate && <Skeleton width={32} height={32} borderRadius={8} />}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Attendance Summary Card */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex-1">
                            <div className="flex justify-between items-center mb-4">
                                <Skeleton width={160} height={22} />
                                <Skeleton width={100} height={24} borderRadius={999} />
                            </div>

                            {/* Percentage + Bar */}
                            <div className="mb-4">
                                <div className="flex items-end justify-between mb-1.5">
                                    <Skeleton width={80} height={28} />
                                    <Skeleton width={100} height={14} />
                                </div>
                                <Skeleton height={10} borderRadius={999} />
                            </div>

                            {/* Stats */}
                            <div className="space-y-1 border-t border-gray-100 pt-3">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="flex items-center justify-between py-1.5 px-2">
                                        <div className="flex items-center gap-2">
                                            <Skeleton circle width={10} height={10} />
                                            <Skeleton width={60} height={14} />
                                        </div>
                                        <Skeleton width={20} height={14} />
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </SkeletonTheme>
    );
};

export default EmployeeDetailsSkeleton;
