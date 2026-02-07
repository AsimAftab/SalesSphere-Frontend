/**
 * System User Details - Skeleton Loader
 *
 * NOTE: This component has unique layout requirements that prevent using DetailPageSkeleton:
 * - 3-column responsive grid layout
 * - Large avatar section with name and role badge
 * - Combined profile + info card with section header using actual icon
 * - Uses actual Lucide icons for visual consistency during loading
 */

import { Skeleton } from '@/components/ui';
import { User } from 'lucide-react';

export const SystemUserDetailsSkeleton = () => {
    return (
        <div className="space-y-6">
            <div className="space-y-6">
                {/* Header Skeleton - Matches DetailPageHeader layout */}
                <div className="w-full mb-4 sm:mb-6">
                    {/* Back Button Row */}
                    <div className="flex items-center gap-2 mb-4">
                        <Skeleton className="h-5 w-5" />
                        <Skeleton className="h-4 w-36" />
                    </div>
                    {/* Title and Actions Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <Skeleton className="h-8 w-48" />
                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                            <Skeleton className="h-11 w-full sm:w-40 rounded-lg" />
                            <Skeleton className="h-11 w-full sm:w-40 rounded-lg" />
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Profile + Info Card Skeleton */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 md:p-8 h-fit">
                        {/* Avatar + Name Row - Responsive */}
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-6">
                            <Skeleton className="h-20 w-20 sm:h-24 sm:w-24 rounded-full shrink-0" />
                            <div className="flex flex-col gap-2 items-center sm:items-start">
                                <Skeleton className="h-6 sm:h-7 w-40 sm:w-48 rounded" />
                                <Skeleton className="h-5 sm:h-6 w-24 sm:w-32 rounded-full" />
                            </div>
                        </div>

                        <hr className="border-gray-100 mb-6" />

                        {/* Section Header */}
                        <div className="flex items-center gap-3 mb-5">
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <User className="h-5 w-5 text-blue-600" />
                            </div>
                            <Skeleton className="h-5 sm:h-6 w-40 sm:w-48 rounded" />
                        </div>

                        {/* InfoBlock Grid - 9 fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-8">
                            {Array.from({ length: 9 }).map((_, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <Skeleton className="h-5 w-5 shrink-0" />
                                    <div className="flex flex-col gap-1.5 flex-1">
                                        <Skeleton className="h-3 w-24 rounded-sm" />
                                        <Skeleton className="h-4 w-full max-w-[200px] rounded-md" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemUserDetailsSkeleton;
