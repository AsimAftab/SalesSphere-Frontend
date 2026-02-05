import React from 'react';
import { Skeleton } from '@/components/ui';

/**
 * OrganizationDetailSkeleton
 *
 * NOTE: This component has unique layout requirements that prevent using DetailPageSkeleton:
 * - Complex 5-column responsive grid (3:2) for main content
 * - Multiple specialized card sections (GeneralInfo, Location, Subscription, Users)
 * - Location card with map placeholder area
 * - Subscription card with special slate background styling
 * - Users table with avatar rows
 */

/** Header: back button + title + action buttons */
const HeaderSkeleton: React.FC = () => (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 px-1">
        <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-9 rounded-full shrink-0" />
            <Skeleton className="h-7 w-52 rounded-md" />
        </div>
        <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-28 rounded-lg" />
            <Skeleton className="h-9 w-36 rounded-lg" />
            <Skeleton className="h-9 w-28 rounded-lg" />
        </div>
    </div>
);

/** General Info Card: icon + name + plan badge + 2-col grid of fields */
const GeneralInfoCardSkeleton: React.FC = () => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm h-full flex flex-col">
        <div className="p-6 pb-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
                    <div className="flex flex-col gap-1.5">
                        <Skeleton className="h-6 w-48 rounded-md" />
                        <Skeleton className="h-3 w-28 rounded-sm" />
                    </div>
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <div className="h-px bg-gray-200 -mx-6 my-3" />
        </div>
        <div className="p-6 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                {Array.from({ length: 14 }).map((_, i) => (
                    <div key={i} className="flex items-start gap-3">
                        <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
                        <div className="flex flex-col gap-1">
                            <Skeleton className="h-3 w-24 rounded-sm" />
                            <Skeleton className="h-4 w-36 rounded-md" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

/** Location Card: icon + title + map area + address + coords */
const LocationCardSkeleton: React.FC = () => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm h-full flex flex-col">
        <div className="p-6 pb-0">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
                    <Skeleton className="h-7 w-24 rounded-md" />
                </div>
                <Skeleton className="h-9 w-44 rounded-lg" />
            </div>
            <div className="h-px bg-gray-200 -mx-6 my-3" />
        </div>
        <div className="p-6 pt-0 flex-1 flex flex-col space-y-5">
            <Skeleton className="flex-1 min-h-[240px] w-full rounded-xl" />
            <div className="flex items-start gap-3">
                <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
                <div className="flex flex-col gap-1">
                    <Skeleton className="h-3 w-20 rounded-sm" />
                    <Skeleton className="h-4 w-64 rounded-md" />
                </div>
            </div>
            <div className="grid grid-cols-2 pt-2 gap-4">
                {[1, 2].map((i) => (
                    <div key={i} className="flex items-start gap-3">
                        <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
                        <div className="flex flex-col gap-1">
                            <Skeleton className="h-3 w-16 rounded-sm" />
                            <Skeleton className="h-4 w-24 rounded-md" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

/** Subscription Card: title + manage button + 3 fields */
const SubscriptionCardSkeleton: React.FC = () => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6 pb-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5 rounded-sm" />
                    <Skeleton className="h-5 w-40 rounded-md" />
                </div>
                <Skeleton className="h-8 w-20 rounded-lg" />
            </div>
        </div>
        <div className="p-6 pt-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex-1 flex flex-col gap-1.5">
                        <Skeleton className="h-3 w-20 rounded-sm" />
                        <Skeleton className="h-5 w-24 rounded-md" />
                    </div>
                ))}
            </div>
        </div>
    </div>
);

/** Users Table: header + table rows */
const UsersTableSkeleton: React.FC = () => (
    <div className="p-4 rounded-xl border shadow-sm bg-white border-gray-200">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
                <Skeleton className="h-5 w-5 rounded-sm" />
                <Skeleton className="h-5 w-32 rounded-md" />
                <Skeleton className="h-5 w-8 rounded-full" />
            </div>
        </div>
        <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50">
                    <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                    <Skeleton className="h-4 w-32 rounded-md" />
                    <Skeleton className="h-4 w-44 rounded-md" />
                    <Skeleton className="h-4 w-20 rounded-md" />
                    <Skeleton className="h-4 w-16 rounded-full ml-auto" />
                </div>
            ))}
        </div>
    </div>
);

/** Full page skeleton matching OrganizationContentSection layout */
const OrganizationDetailSkeleton: React.FC = () => (
    <div className="space-y-6">
        <HeaderSkeleton />
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3">
                <GeneralInfoCardSkeleton />
            </div>
            <div className="lg:col-span-2">
                <LocationCardSkeleton />
            </div>
        </div>
        <SubscriptionCardSkeleton />
        <UsersTableSkeleton />
    </div>
);

export default OrganizationDetailSkeleton;
