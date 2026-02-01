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

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Row 1, Col 1: Profile Header Card */}
                    <div className="bg-white p-4 md:p-6 rounded-lg shadow-md flex flex-col items-center justify-center min-h-[250px]">
                        <Skeleton circle width={96} height={96} className="mb-4" /> {/* Avatar */}
                        <Skeleton width={180} height={28} className="mb-2" /> {/* Name */}
                        <Skeleton width={120} height={20} /> {/* Role */}
                    </div>

                    {/* Row 1, Col 2: Documents Card */}
                    <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm min-h-[250px]">
                        <div className="flex justify-between items-center mb-6">
                            <Skeleton width={140} height={24} /> {/* Title */}
                            <Skeleton circle width={32} height={32} /> {/* Add Button */}
                        </div>
                        <div className="space-y-4">
                            {[1, 2].map((i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <Skeleton width={24} height={24} /> {/* Icon */}
                                    <div className="flex-1 min-w-0">
                                        <Skeleton width="60%" height={16} className="mb-1" />
                                        <Skeleton width="40%" height={12} />
                                    </div>
                                    {canUpdate && <Skeleton width={20} height={20} />} {/* Actions */}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Row 2, Col 1: Employee Info Card */}
                    <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                            {[...Array(8)].map((_, i) => (
                                <div key={i}>
                                    <Skeleton width={80} height={14} className="mb-2" />
                                    <Skeleton width={120} height={18} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Row 2, Col 2: Attendance Summary Card */}
                    <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border">
                        <Skeleton width={220} height={24} className="mb-6" /> {/* Title */}

                        {/* Responsive Flex Header: Matches 'flex flex-col sm:flex-row' */}
                        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4 sm:gap-0">
                            {/* Left Spacer (hidden on mobile) */}
                            <div className="w-full sm:w-1/3 hidden sm:block"></div>

                            {/* Center: Percentage */}
                            <div className="w-full sm:w-1/3 text-center">
                                <Skeleton width={100} height={36} className="mb-1 mx-auto" />
                                <Skeleton width={80} height={12} className="mx-auto" />
                            </div>

                            {/* Right: Working Days (Border top on mobile) */}
                            <div className="w-full sm:w-1/3 flex flex-col items-center sm:items-end border-t sm:border-t-0 pt-3 sm:pt-0">
                                <Skeleton width={40} height={24} className="mb-1" />
                                <Skeleton width={100} height={12} />
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full mb-6">
                            <Skeleton height={8} borderRadius={999} />
                        </div>

                        {/* Stats Grid: Matches 'grid-cols-2 lg:grid-cols-3' */}
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <Skeleton circle width={10} height={10} />
                                    <div>
                                        <Skeleton width={30} height={14} className="mb-1" />
                                        <Skeleton width={40} height={10} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </SkeletonTheme>
    );
};

export default EmployeeDetailsSkeleton;
