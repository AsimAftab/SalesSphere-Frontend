import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface TripDetailsSkeletonProps {
    tabsCount?: number;
}

const TripDetailsSkeleton: React.FC<TripDetailsSkeletonProps> = ({ tabsCount = 3 }) => {
    return (
        <div className="w-full flex flex-col space-y-6">
            {/* 1. Page Header Skeleton */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-1">
                <div className="flex items-start gap-4">
                    <Skeleton circle width={40} height={40} /> {/* Back Button */}
                    <div className="space-y-1">
                        <Skeleton width={240} height={32} /> {/* Title */}
                        <Skeleton width={280} height={16} /> {/* Subtitle */}
                    </div>
                </div>
                <Skeleton width={110} height={42} borderRadius={24} /> {/* Delete Button */}
            </div>

            {/* 2. Tabs Skeleton */}
            <div className="flex gap-2 mb-2">
                {Array.from({ length: tabsCount }).map((_, i) => (
                    <Skeleton key={i} width={100} height={36} borderRadius={20} />
                ))}
            </div>

            {/* 3. Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Trip General Info Card */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl border border-gray-200 h-full flex flex-col overflow-hidden">

                        {/* Card Header */}
                        <div className="flex justify-between items-center px-8 pt-8 pb-4 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                <Skeleton width={40} height={40} borderRadius={12} /> {/* Icon Box */}
                                <Skeleton width={180} height={24} /> {/* Title */}
                            </div>
                            {/* Total Distance Badge (Pill) */}
                            <Skeleton width={220} height={36} borderRadius={20} />
                        </div>

                        {/* Split Columns Content */}
                        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2">

                            {/* Start Details Column */}
                            <div className="flex flex-col gap-8 p-8 border-b lg:border-b-0 lg:border-r border-gray-200">
                                {/* Section Header */}
                                <div className="flex items-center gap-3 mb-2">
                                    <Skeleton width={24} height={24} borderRadius={4} />
                                    <Skeleton width={160} height={14} />
                                </div>

                                {/* Info Blocks (4 items) */}
                                <div className="space-y-6">
                                    {/* Date */}
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2"><Skeleton circle width={16} height={16} /><Skeleton width={130} height={12} /></div>
                                        <Skeleton width={160} height={20} className="ml-6" />
                                    </div>
                                    {/* Reading */}
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2"><Skeleton circle width={16} height={16} /><Skeleton width={100} height={12} /></div>
                                        <Skeleton width={80} height={20} className="ml-6" />
                                    </div>
                                    {/* Location */}
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2"><Skeleton circle width={16} height={16} /><Skeleton width={110} height={12} /></div>
                                        <div className="ml-6 space-y-1">
                                            <Skeleton width="90%" height={18} />
                                            <Skeleton width="60%" height={18} />
                                        </div>
                                    </div>
                                    {/* Description */}
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2"><Skeleton circle width={16} height={16} /><Skeleton width={120} height={12} /></div>
                                        <Skeleton width={140} height={20} className="ml-6" />
                                    </div>
                                </div>
                            </div>

                            {/* End Details Column */}
                            <div className="flex flex-col gap-8 p-8">
                                {/* Section Header */}
                                <div className="flex items-center gap-3 mb-2">
                                    <Skeleton width={24} height={24} borderRadius={4} />
                                    <Skeleton width={160} height={14} />
                                </div>

                                {/* Info Blocks (4 items) */}
                                <div className="space-y-6">
                                    {/* Date */}
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2"><Skeleton circle width={16} height={16} /><Skeleton width={130} height={12} /></div>
                                        <Skeleton width={160} height={20} className="ml-6" />
                                    </div>
                                    {/* Reading */}
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2"><Skeleton circle width={16} height={16} /><Skeleton width={100} height={12} /></div>
                                        <Skeleton width={80} height={20} className="ml-6" />
                                    </div>
                                    {/* Location */}
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2"><Skeleton circle width={16} height={16} /><Skeleton width={110} height={12} /></div>
                                        <div className="ml-6 space-y-1">
                                            <Skeleton width="90%" height={18} />
                                            <Skeleton width="60%" height={18} />
                                        </div>
                                    </div>
                                    {/* Description */}
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2"><Skeleton circle width={16} height={16} /><Skeleton width={120} height={12} /></div>
                                        <Skeleton width={140} height={20} className="ml-6" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Images Card */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl border border-gray-200 flex flex-col h-full overflow-hidden">
                        {/* Header */}
                        <div className="px-8 pt-8 pb-4 border-b border-gray-200 flex items-center gap-3">
                            <Skeleton width={40} height={40} borderRadius={12} />
                            <div className="space-y-1">
                                <Skeleton width={140} height={20} /> {/* Title */}
                                <Skeleton width={100} height={12} /> {/* Count */}
                            </div>
                        </div>

                        {/* Images Content */}
                        <div className="p-8 flex-1 flex flex-col gap-4">
                            <Skeleton height={160} borderRadius={12} />
                            <Skeleton height={160} borderRadius={12} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TripDetailsSkeleton;
