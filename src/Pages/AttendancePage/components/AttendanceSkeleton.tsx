import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import { useAuth } from '../../../api/authService';

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
    const { hasPermission } = useAuth();
    const canExportPdf = hasPermission('attendance', 'exportPdf');
    const canWebCheckIn = hasPermission('attendance', 'webCheckIn');
    // const canExportExcel = hasPermission('attendance', 'exportExcel');

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
                {/* Header Skeleton */}
                <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                        <h1 className="text-3xl font-bold">
                            <Skeleton width={300} height={36} />
                        </h1>
                        <h2 className="text-xl">
                            <Skeleton width={250} />
                        </h2>
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
                        <Skeleton width={250} height={40} borderRadius={999} />
                        <div className="flex gap-2">
                            {canExportPdf && (
                                <Skeleton width={80} height={40} borderRadius={8} />
                            )}
                            {/* {canExportExcel && <Skeleton width={80} height={40} borderRadius={8} />} */}
                        </div>
                    </div>
                </div>

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

                            {canWebCheckIn && (
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
