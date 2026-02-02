import React from 'react';
import { Skeleton } from '@/components/ui';

/** Skeleton for the greeting header */
const HeaderSkeleton: React.FC = () => (
    <div className="flex flex-col gap-1">
        <Skeleton className="h-8 w-72 rounded-md" />
        <Skeleton className="h-4 w-48 rounded-md" />
    </div>
);

/** Skeleton for a single stat card matching StatCard layout */
const StatCardSkeleton: React.FC = () => (
    <div className="rounded-lg bg-white border-2 border-gray-100 shadow-sm p-4 sm:p-6 flex items-start justify-between h-full">
        <div className="flex flex-col justify-between h-full space-y-2">
            <Skeleton className="h-3 w-28 rounded-sm" />
            <Skeleton className="h-8 w-14 rounded-md" />
        </div>
        <Skeleton className="h-11 w-11 rounded-full shrink-0" />
    </div>
);

/** Skeleton for the stats grid (4-col top + 3-col bottom) */
const StatsGridSkeleton: React.FC = () => (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
                <StatCardSkeleton key={i} />
            ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
                <StatCardSkeleton key={i} />
            ))}
        </div>
    </div>
);

/** Skeleton for the pie chart card */
const PieChartSkeleton: React.FC = () => (
    <div className="rounded-lg bg-white border-2 border-gray-100 shadow-sm p-6">
        <Skeleton className="h-4 w-40 rounded-sm mb-4" />
        <div className="flex flex-col items-center gap-6">
            <Skeleton className="h-44 w-44 rounded-full" />
            <div className="flex flex-col gap-2 w-full">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <Skeleton className="h-3 w-3 rounded-full shrink-0" />
                        <Skeleton className="h-3 w-40 rounded-sm" />
                    </div>
                ))}
            </div>
        </div>
    </div>
);

/** Skeleton for the bar chart card */
const BarChartSkeleton: React.FC = () => (
    <div className="rounded-lg bg-white border-2 border-gray-100 shadow-sm p-6">
        <Skeleton className="h-4 w-48 rounded-sm mb-4" />
        <div className="flex items-end justify-around gap-6 h-[250px] pt-4 pb-6 px-4">
            <Skeleton className="w-12 h-[65%] rounded-t-md" />
            <Skeleton className="w-12 h-[85%] rounded-t-md" />
            <Skeleton className="w-12 h-[50%] rounded-t-md" />
        </div>
        <div className="flex justify-around px-4">
            {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-3 w-16 rounded-sm" />
            ))}
        </div>
    </div>
);

/** Full dashboard skeleton combining all sections */
const DashboardSkeleton: React.FC = () => (
    <div className="space-y-8">
        <HeaderSkeleton />
        <StatsGridSkeleton />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PieChartSkeleton />
            <BarChartSkeleton />
        </div>
    </div>
);

export default DashboardSkeleton;
