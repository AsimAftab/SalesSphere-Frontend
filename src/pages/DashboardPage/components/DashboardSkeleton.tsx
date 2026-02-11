import React from 'react';
import Skeleton from 'react-loading-skeleton';
import type { DashboardPermissions } from '../hooks/useDashboardViewState';

interface DashboardSkeletonProps {
    permissions: DashboardPermissions;
}

/**
 * DashboardSkeleton - Custom skeleton for the dashboard page
 *
 * NOTE: This component has a unique, complex layout with permission-based conditional rendering
 * for stat cards, team performance, attendance, live activities, party distribution,
 * collection trends, and sales trends. This structure doesn't fit the generic skeleton
 * patterns (CardGridSkeleton, ListPageSkeleton, etc.) which are designed for simpler layouts.
 * Keeping custom implementation to preserve the exact dashboard structure.
 */
const DashboardSkeleton: React.FC<DashboardSkeletonProps> = ({ permissions }) => {
    return (
        <div className="w-full flex flex-col p-1 md:p-0 space-y-8 pb-10">
            {/* 1. HEADER SECTION (Greeting + Date) */}
            <div className="w-full flex flex-col space-y-1 mb-2">
                <Skeleton width={300} height={32} />
                <Skeleton width={200} height={16} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
                {/* 2. STAT CARDS (Row 1 - 5 Columns) 
                   Each card: Title (sm), Value (lg), Icon (right)
                */}
                <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    {permissions.canViewStats && [...Array(5)].map((_, i) => (
                        <div key={i} className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm flex items-start justify-between h-32">
                            <div className="flex flex-col justify-between h-full space-y-2">
                                <Skeleton width={100} height={12} /> {/* Title */}
                                <Skeleton width={60} height={32} />  {/* Value */}
                            </div>
                            <div className="rounded-full p-3 flex-shrink-0">
                                <Skeleton circle width={48} height={48} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* 3. ROW 2: Team, Attendance, Live */}

                {/* Team Performance Today */}
                {permissions.canViewTeam && (
                    <div className="lg:col-span-4 h-96 bg-white rounded-lg border border-gray-100 shadow-sm p-4 flex flex-col">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
                            <Skeleton width={180} height={20} />
                        </div>
                        {/* List Content */}
                        <div className="flex-1 space-y-4 overflow-hidden">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="flex items-center justify-between p-2">
                                    <div className="flex items-center gap-x-3">
                                        <Skeleton circle width={40} height={40} />
                                        <div>
                                            <Skeleton width={100} height={14} className="mb-1" />
                                            <Skeleton width={60} height={12} />
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <Skeleton width={50} height={14} className="mb-1" />
                                        <Skeleton width={70} height={12} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Attendance Summary */}
                {permissions.canViewAttendance && (
                    <div className="lg:col-span-4 h-96 bg-white rounded-lg border border-gray-100 shadow-sm p-4 flex flex-col">
                        <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
                            <Skeleton width={160} height={20} />
                        </div>
                        <div className="flex-1 space-y-3">
                            {/* Rows: Label ... Value */}
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="flex justify-between text-sm">
                                    <Skeleton width={100} height={14} />
                                    <Skeleton width={30} height={14} />
                                </div>
                            ))}
                            {/* Progress Bar Area */}
                            <div className="pt-4">
                                <div className="flex justify-between mb-1">
                                    <Skeleton width={100} height={14} />
                                    <Skeleton width={40} height={14} />
                                </div>
                                <Skeleton width="100%" height={8} borderRadius={4} />
                            </div>
                        </div>
                    </div>
                )}

                {/* Live Field Activities */}
                {permissions.canViewLive && (
                    <div className="lg:col-span-4 h-96 bg-white rounded-lg border border-gray-100 shadow-sm p-4 flex flex-col">
                        <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
                            <Skeleton width={150} height={20} />
                            <Skeleton width={60} height={16} /> {/* "3 Active" placeholder */}
                        </div>
                        <div className="flex-1 space-y-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="flex items-center justify-between p-2">
                                    <div className="flex items-center gap-x-3 w-1/2">
                                        <Skeleton circle width={40} height={40} />
                                        <div className="flex-1">
                                            <Skeleton width={80} height={14} className="mb-1" />
                                            <Skeleton width={50} height={12} />
                                        </div>
                                    </div>
                                    <div className="w-1/2 text-right">
                                        <Skeleton width={80} height={14} />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-auto text-center border-t border-gray-100 pt-2">
                            <Skeleton width={150} height={16} />
                        </div>
                    </div>
                )}

                {/* 4. ROW 3: Party Distribution + Recent Collections */}

                {/* Party Distribution */}
                {permissions.canViewPartyDistribution && (
                    <div className="lg:col-span-4 h-96 bg-white rounded-lg border border-gray-100 shadow-sm p-4 flex flex-col">
                        <div className="mb-4 text-xs font-semibold uppercase border-b border-gray-200 pb-2 flex justify-between">
                            <Skeleton width={120} height={14} />
                        </div>
                        {/* Header Row */}
                        <div className="flex justify-between items-center py-2 px-2 border-b border-gray-100 mb-2">
                            <Skeleton width={80} height={12} />
                            <Skeleton width={30} height={12} />
                        </div>
                        {/* List */}
                        <div className="flex-1 flex flex-col gap-3">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="flex justify-between items-center px-2 py-1">
                                    <Skeleton width={100} height={14} />
                                    <Skeleton width={20} height={14} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Recent Collections (Last 10 Days) */}
                {permissions.canViewCollectionTrend && (
                    <div className="lg:col-span-8 h-96 bg-white rounded-lg border border-gray-100 shadow-sm p-4 flex flex-col">
                        <div className="mb-4 border-b border-gray-100 pb-3 flex justify-between items-center">
                            <Skeleton width={220} height={20} />
                        </div>
                        <div className="flex-1 space-y-4 overflow-hidden">
                            {/* Table Header */}
                            <div className="flex justify-between px-2 bg-white pb-2 border-b border-gray-200">
                                <Skeleton width={80} height={14} />
                                <Skeleton width={100} height={14} />
                                <Skeleton width={120} height={14} />
                                <Skeleton width={80} height={14} />
                            </div>
                            {/* Rows */}
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="flex justify-between px-2 py-3 border-b border-gray-50 last:border-0">
                                    <Skeleton width={80} height={14} />
                                    <Skeleton width={100} height={14} />
                                    <Skeleton width={120} height={14} />
                                    <Skeleton width={80} height={14} />
                                </div>
                            ))}
                        </div>
                        <div className="mt-auto text-center pt-2">
                            <Skeleton width={150} height={16} />
                        </div>
                    </div>
                )}

                {/* 5. ROW 4: Sales Trend (Last 7 Days) */}
                {permissions.canViewTrend && (
                    <div className="lg:col-span-12 h-80 bg-white rounded-lg border border-gray-100 shadow-sm p-4 flex flex-col">
                        <div className="mb-6"><Skeleton width={200} height={20} /></div>
                        <div className="flex-1 flex items-end justify-between gap-4 pl-4 pb-2 border-l border-b border-gray-100">
                            {[...Array(7)].map((_, i) => (
                                <div key={i} className="w-full flex items-end h-full">
                                    <Skeleton height={`${Math.floor(Math.random() * 60) + 30}%`} width="100%" borderRadius={4} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardSkeleton;
