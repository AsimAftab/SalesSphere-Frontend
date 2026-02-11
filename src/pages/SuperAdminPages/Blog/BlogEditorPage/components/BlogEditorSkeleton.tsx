import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const BlogEditorSkeleton: React.FC = () => {
    return (
        <div className="animate-pulse space-y-8">
            {/* Header Skeleton */}
            <div className="space-y-4">
                <Skeleton width={300} height={32} />
                <Skeleton width={200} height={16} />
            </div>

            <div className="flex flex-col xl:flex-row gap-8">
                {/* Main Content Column Skeleton */}
                <div className="flex-1 space-y-6 min-w-0">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
                        {/* Title Field */}
                        <div className="space-y-2">
                            <Skeleton width={50} height={16} />
                            <Skeleton height={48} borderRadius={12} />
                        </div>

                        {/* Editor Field */}
                        <div className="space-y-2">
                            <Skeleton width={70} height={16} />
                            <div className="rounded-lg border border-gray-200 overflow-hidden h-[600px] bg-gray-50">
                                <div className="border-b border-gray-200 p-2 flex gap-2">
                                    <Skeleton width={24} height={24} />
                                    <Skeleton width={24} height={24} />
                                    <Skeleton width={24} height={24} />
                                </div>
                            </div>
                        </div>

                        {/* Excerpt Field */}
                        <div className="space-y-2">
                            <Skeleton width={60} height={16} />
                            <Skeleton height={80} borderRadius={12} />
                        </div>
                    </div>
                </div>

                {/* Sidebar Column Skeleton */}
                <div className="w-full xl:w-96 space-y-6 shrink-0">

                    {/* Cover Image Card Skeleton */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-5">
                        <Skeleton width={120} height={24} />
                        <Skeleton height={192} borderRadius={8} className="w-full" />
                    </div>

                    {/* Settings Card Skeleton */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-5">
                        <Skeleton width={100} height={24} />
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Skeleton width={40} height={14} />
                                <Skeleton height={40} borderRadius={12} />
                            </div>
                            <div className="space-y-2">
                                <Skeleton width={40} height={14} />
                                <Skeleton height={40} borderRadius={12} />
                            </div>
                        </div>
                    </div>

                    {/* Publishing Card Skeleton */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-5">
                        <Skeleton width={100} height={24} />

                        <div className="grid grid-cols-2 gap-3">
                            <Skeleton height={60} borderRadius={12} />
                            <Skeleton height={60} borderRadius={12} />
                        </div>

                        <div className="flex gap-3 pt-2">
                            <Skeleton className="flex-1" height={40} borderRadius={8} />
                            <Skeleton className="flex-1" height={40} borderRadius={8} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogEditorSkeleton;
