import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { PageHeaderSkeleton } from '@/components/ui';

import { useAttendancePermissions } from '../hooks/useAttendancePermissions';

// Define this first so it can be used below
export const AttendanceActionSkeleton: React.FC = () => {
    return (
        <div className="flex items-center gap-3">
            {/* Time Window Message Skeleton */}
            <Skeleton width={160} height={34} borderRadius={20} />
            {/* Action Button Skeleton */}
            <Skeleton width={140} height={38} borderRadius={8} />
        </div>
    );
};

const AttendanceSkeleton: React.FC = () => {
    const permissions = useAttendancePermissions();

    const days = Array.from({ length: 30 }, (_, i) => i + 1);
    const employeeNameWidth = '200px';
    const workingDaysWidth = '110px';
    const minDayCellWidth = 35;
    const minDayContainerWidth = days.length * minDayCellWidth;
    const requiredMinWidth =
        parseInt(employeeNameWidth) +
        parseInt(workingDaysWidth) +
        minDayContainerWidth;

    return (
        <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
            <div className="p-6">
                {/* Header Skeleton using PageHeaderSkeleton */}
                <PageHeaderSkeleton
                    titleWidth={300}
                    subtitleWidth={250}
                    showSearch={true}
                    showFilter={false}
                    showExportPdf={permissions.canExportPdf}
                    showExportExcel={false}
                    showCreate={false}
                />

                <div className="w-full space-y-6">
                    {/* Controls Skeleton */}
                    <div className="bg-white p-4 rounded-xl shadow-md hidden md:flex items-center justify-between gap-4">
                        {/* Legends Placeholder */}
                        <div className="flex items-center gap-4">
                            <Skeleton width={60} />
                            <div className="flex gap-3">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <Skeleton width={20} height={20} borderRadius={4} />
                                        <Skeleton width={50} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Controls Placeholder */}
                        <div className="flex items-center gap-3">
                            <Skeleton width={110} height={38} borderRadius={8} /> {/* Month */}
                            <Skeleton width={60} height={38} borderRadius={8} /> {/* Year */}

                            {permissions.canWebCheckIn && (
                                <AttendanceActionSkeleton />
                            )}
                        </div>
                    </div>

                    {/* Table Skeleton */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-x-auto">
                        <div style={{ minWidth: `${requiredMinWidth}px` }}>
                            {/* Table Header */}
                            <div className="flex border-b-2 border-gray-200 sticky top-0 z-10">
                                <div className="p-3 bg-gray-200" style={{ width: employeeNameWidth, flexShrink: 0 }}>
                                    <Skeleton />
                                </div>
                                <div className="flex-1 grid" style={{ gridTemplateColumns: `repeat(${days.length}, 1fr)` }}>
                                    {days.map((day) => (
                                        <div key={day} className="p-1 text-center bg-gray-200 border-l border-white/20">
                                            <Skeleton />
                                        </div>
                                    ))}
                                </div>
                                <div className="p-3 bg-gray-200" style={{ width: workingDaysWidth, flexShrink: 0 }}>
                                    <Skeleton />
                                </div>
                            </div>
                            {/* Table Body */}
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className="flex border-b border-gray-200 items-stretch">
                                    <div className="p-3 border-r border-gray-200" style={{ width: employeeNameWidth, flexShrink: 0 }}>
                                        <Skeleton />
                                    </div>
                                    <div className="flex-1 grid" style={{ gridTemplateColumns: `repeat(${days.length}, 1fr)` }}>
                                        {days.map((day) => (
                                            <div key={day} className="h-12 border-l border-gray-200 p-2">
                                                <Skeleton height="100%" />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-3 border-l border-gray-200" style={{ width: workingDaysWidth, flexShrink: 0 }}>
                                        <Skeleton />
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

export default AttendanceSkeleton;
