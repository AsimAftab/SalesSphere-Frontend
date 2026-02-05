import React from 'react';
import { Skeleton } from '@/components/ui';
import { useAuth } from '@/api/authService';

/**
 * EmployeeDetailsSkeleton
 *
 * NOTE: This component has unique layout requirements that prevent using DetailPageSkeleton:
 * - 3-column responsive grid layout with complex nesting
 * - Large avatar with name section in left card
 * - Combined Profile + Info Card with section header
 * - Stacked Documents and Attendance cards on right side
 * - Permission-based conditional rendering of action buttons
 * - Custom attendance progress bar and stats section
 */
const EmployeeDetailsSkeleton: React.FC = () => {
    const { hasPermission } = useAuth();
    const canUpdate = hasPermission('employees', 'update');
    const canDelete = hasPermission('employees', 'delete');

    return (
        <div className="relative animate-pulse space-y-6">

            {/* Header: Title + Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-8 w-[200px]" />
                </div>
                <div className="flex flex-col md:flex-row w-full md:w-auto gap-4 md:space-x-4">
                    {canUpdate && <Skeleton className="h-[42px] w-[180px] rounded-lg" />}
                    {canDelete && <Skeleton className="h-[42px] w-[160px] rounded-lg" />}
                </div>
            </div>

            {/* Main Content Grid: 3-col layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left: Combined Profile + Info Card */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                    {/* Avatar + Name */}
                    <div className="flex items-center gap-6 mb-6">
                        <Skeleton className="h-24 w-24 rounded-full" />
                        <div>
                            <Skeleton className="h-7 w-[200px] mb-2" />
                            <Skeleton className="h-[18px] w-[120px]" />
                        </div>
                    </div>

                    <hr className="border-gray-200 mb-6" />

                    {/* Section Header */}
                    <div className="flex items-center gap-3 mb-5">
                        <Skeleton className="h-9 w-9 rounded-lg" />
                        <Skeleton className="h-[22px] w-[180px]" />
                    </div>

                    {/* InfoBlock Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-8">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="flex items-start gap-3">
                                <Skeleton className="h-9 w-9 rounded-lg" />
                                <div>
                                    <Skeleton className="h-3 w-[80px] mb-1" />
                                    <Skeleton className="h-4 w-[140px]" />
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
                            <Skeleton className="h-[22px] w-[140px]" />
                            {canUpdate && <Skeleton className="h-[34px] w-[80px] rounded-md" />}
                        </div>
                        <div className="space-y-2.5">
                            {[1, 2].map((i) => (
                                <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100">
                                    <Skeleton className="h-10 w-10 rounded-xl" />
                                    <div className="flex-1 min-w-0">
                                        <Skeleton className="h-[14px] w-[70%] mb-1.5" />
                                        <Skeleton className="h-3 w-[40%]" />
                                    </div>
                                    <div className="flex gap-1">
                                        <Skeleton className="h-8 w-8 rounded-lg" />
                                        {canUpdate && <Skeleton className="h-8 w-8 rounded-lg" />}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Attendance Summary Card */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex-1">
                        <div className="flex justify-between items-center mb-4">
                            <Skeleton className="h-[22px] w-[160px]" />
                            <Skeleton className="h-6 w-[100px] rounded-full" />
                        </div>

                        {/* Percentage + Bar */}
                        <div className="mb-4">
                            <div className="flex items-end justify-between mb-1.5">
                                <Skeleton className="h-7 w-[80px]" />
                                <Skeleton className="h-[14px] w-[100px]" />
                            </div>
                            <Skeleton className="h-[10px] w-full rounded-full" />
                        </div>

                        {/* Stats */}
                        <div className="space-y-1 border-t border-gray-100 pt-3">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="flex items-center justify-between py-1.5 px-2">
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-[10px] w-[10px] rounded-full" />
                                        <Skeleton className="h-[14px] w-[60px]" />
                                    </div>
                                    <Skeleton className="h-[14px] w-[20px]" />
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default EmployeeDetailsSkeleton;
