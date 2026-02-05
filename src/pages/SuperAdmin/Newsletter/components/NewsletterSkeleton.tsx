import React from 'react';
import { Skeleton, PageHeaderSkeleton } from '@/components/ui';

const StatsCardsSkeleton: React.FC = () => (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-xl shrink-0" />
                    <div className="flex flex-col gap-2">
                        <Skeleton className="h-4 w-28 rounded" />
                        <Skeleton className="h-7 w-16 rounded" />
                    </div>
                </div>
            </div>
        ))}
    </div>
);

const TableSkeleton: React.FC = () => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
            <div className="flex items-center gap-8">
                <Skeleton className="h-4 w-24 rounded" />
                <Skeleton className="h-4 w-16 rounded" />
                <Skeleton className="h-4 w-16 rounded" />
                <Skeleton className="h-4 w-28 rounded" />
                <Skeleton className="h-4 w-16 rounded ml-auto" />
            </div>
        </div>

        {/* Table Rows */}
        {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="px-6 py-4 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-9 w-9 rounded-full shrink-0" />
                        <Skeleton className="h-4 w-48 rounded" />
                    </div>
                    <Skeleton className="h-5 w-20 rounded-full" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-4 w-28 rounded" />
                    <Skeleton className="h-8 w-8 rounded-lg ml-auto" />
                </div>
            </div>
        ))}

        {/* Pagination */}
        <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
            <Skeleton className="h-4 w-36 rounded" />
            <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-20 rounded-lg" />
            </div>
        </div>
    </div>
);

const NewsletterSkeleton: React.FC = () => (
    <div className="space-y-6">
        <PageHeaderSkeleton
            titleWidth={200}
            subtitleWidth={320}
            showSearch={true}
            showFilter={false}
            showExportPdf={false}
            showExportExcel={false}
            showCreate={true}
            createWidth={140}
        />
        <StatsCardsSkeleton />
        <TableSkeleton />
    </div>
);

export default NewsletterSkeleton;
