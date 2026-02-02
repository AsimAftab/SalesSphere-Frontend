import React from 'react';
import { Skeleton } from '@/components/ui';

const HeaderSkeleton: React.FC = () => (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 px-1">
        <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-9 rounded-full shrink-0" />
            <Skeleton className="h-7 w-40 rounded-md" />
        </div>
        <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-24 rounded-full" />
            <Skeleton className="h-9 w-28 rounded-full" />
        </div>
    </div>
);

const GeneralInfoSkeleton: React.FC = () => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm h-full flex flex-col">
        <div className="p-6 pb-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
                    <Skeleton className="h-6 w-44 rounded-md" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full mt-2 md:mt-0" />
            </div>
            <div className="h-px bg-gray-200 -mx-6 my-3" />
        </div>
        <div className="p-6 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex items-start gap-3">
                        <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
                        <div className="flex flex-col gap-1.5">
                            <Skeleton className="h-3 w-24 rounded-sm" />
                            <Skeleton className="h-4 w-36 rounded-md" />
                        </div>
                    </div>
                ))}
            </div>
            {/* Description skeleton */}
            <div className="mt-5 pt-5 border-t border-gray-100">
                <div className="flex items-start gap-3">
                    <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
                    <div className="flex flex-col gap-1.5 flex-1">
                        <Skeleton className="h-3 w-24 rounded-sm" />
                        <Skeleton className="h-4 w-full rounded-md" />
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const ModulesSkeleton: React.FC = () => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm h-full flex flex-col overflow-hidden">
        {/* Header matching PlanModulesCard */}
        <div className="px-5 pt-5 pb-4 border-b border-gray-100 bg-gradient-to-b from-gray-50/80 to-white">
            <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-32 rounded-md" />
                        <Skeleton className="h-5 w-8 rounded-full" />
                    </div>
                    <Skeleton className="h-3.5 w-44 rounded-sm" />
                </div>
            </div>
        </div>
        {/* Module rows */}
        <div className="flex-1 px-4 py-3 bg-gray-50/60 space-y-2.5">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-gray-200 bg-white px-3.5 py-3 flex items-center gap-3.5">
                    <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
                    <div className="flex-1 flex flex-col gap-1.5">
                        <Skeleton className="h-4 w-28 rounded-md" />
                        <Skeleton className="h-3 w-40 rounded-sm" />
                    </div>
                    <Skeleton className="w-5 h-5 rounded-full shrink-0" />
                </div>
            ))}
        </div>
        {/* Pagination */}
        <div className="border-t border-gray-100 bg-gray-50/30 px-4 py-2.5 flex items-center justify-between">
            <Skeleton className="h-4 w-36 rounded-sm" />
            <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-10 rounded-sm" />
                <Skeleton className="h-8 w-16 rounded-lg" />
            </div>
        </div>
    </div>
);

const SubscriptionPlanDetailSkeleton: React.FC = () => (
    <div className="space-y-6">
        <HeaderSkeleton />
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3">
                <GeneralInfoSkeleton />
            </div>
            <div className="lg:col-span-2">
                <ModulesSkeleton />
            </div>
        </div>
    </div>
);

export default SubscriptionPlanDetailSkeleton;
