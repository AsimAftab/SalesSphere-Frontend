/**
 * System User Details - Skeleton Loader
 *
 * NOTE: This component has unique layout requirements that prevent using DetailPageSkeleton:
 * - 3-column responsive grid layout
 * - Large avatar section with name and role badge
 * - Combined profile + info card with section header using actual icon
 * - Documents card on right side with specific structure
 * - Uses actual Lucide icons for visual consistency during loading
 */

import { Skeleton } from '@/components/ui';
import { User, ArrowLeft } from 'lucide-react';

export const SystemUserDetailsSkeleton = () => {
    return (
        <div className="space-y-6">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                            <ArrowLeft className="w-6 h-6" />
                        </div>
                        <Skeleton className="h-8 w-64 rounded" />
                    </div>

                    <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-40 rounded-lg" />
                        <Skeleton className="h-10 w-40 rounded-lg" />
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Profile + Info Card Skeleton */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-8 h-fit">
                        {/* Avatar + Name Row */}
                        <div className="flex items-center gap-6 mb-8">
                            <Skeleton className="h-24 w-24 rounded-full shrink-0" />
                            <div className="flex flex-col gap-2">
                                <Skeleton className="h-7 w-48 rounded" />
                                <Skeleton className="h-6 w-32 rounded-full" />
                            </div>
                        </div>

                        <hr className="border-gray-100 mb-8" />

                        {/* Section Header Avatar */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <User className="h-5 w-5 text-blue-600" />
                            </div>
                            <Skeleton className="h-6 w-48 rounded" />
                        </div>

                        {/* InfoBlock Grid - 9 fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
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

                    {/* Right: Documents Card Skeleton */}
                    <div className="flex flex-col gap-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            {/* Documents Header */}
                            <div className="flex items-center justify-between mb-4">
                                <Skeleton className="h-6 w-40 rounded" />
                                <Skeleton className="h-9 w-24 rounded-lg" />
                            </div>

                            {/* Empty state or document items */}
                            <div className="flex flex-col gap-3">
                                {[1, 2].map((i) => (
                                    <div key={i} className="p-3 border border-gray-200 rounded-lg">
                                        <Skeleton className="h-4 w-full rounded-md mb-2" />
                                        <Skeleton className="h-3 w-32 rounded-sm" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemUserDetailsSkeleton;
