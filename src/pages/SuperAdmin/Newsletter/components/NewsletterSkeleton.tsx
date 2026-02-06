import React from 'react';
import { Skeleton, PageHeaderSkeleton } from '@/components/ui';

const StatsCardsSkeleton: React.FC = () => (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg border-2 border-gray-100 shadow-sm p-4 sm:p-6">
                <div className="flex items-start justify-between">
                    <div className="flex flex-col space-y-2">
                        <Skeleton className="h-3 w-24 rounded" />
                        <Skeleton className="h-7 w-12 rounded" />
                    </div>
                    <Skeleton className="h-11 w-11 rounded-full shrink-0" />
                </div>
            </div>
        ))}
    </div>
);

const TableHeaderSkeleton: React.FC = () => (
    <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-5 w-24 rounded" />
            </div>
            <Skeleton className="h-6 w-28 rounded-full" />
        </div>
    </div>
);

const DesktopTableSkeleton: React.FC = () => (
    <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
            {/* Table Header */}
            <thead className="bg-gray-100">
                <tr>
                    <th className="px-3 py-4 w-[50px]">
                        <Skeleton className="h-5 w-5 rounded" />
                    </th>
                    <th className="px-3 py-4 text-left w-[50px]">
                        <Skeleton className="h-4 w-10 rounded" />
                    </th>
                    <th className="px-3 py-4 text-left">
                        <Skeleton className="h-4 w-12 rounded" />
                    </th>
                    <th className="px-3 py-4 text-left">
                        <Skeleton className="h-4 w-14 rounded" />
                    </th>
                    <th className="px-3 py-4 text-left">
                        <Skeleton className="h-4 w-28 rounded" />
                    </th>
                    <th className="px-3 py-4 text-left">
                        <Skeleton className="h-4 w-14 rounded" />
                    </th>
                </tr>
            </thead>
            {/* Table Body */}
            <tbody className="divide-y divide-gray-100">
                {Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                        <td className="px-3 py-3">
                            <Skeleton className="h-5 w-5 rounded" />
                        </td>
                        <td className="px-3 py-3">
                            <Skeleton className="h-4 w-6 rounded" />
                        </td>
                        <td className="px-3 py-3">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                                <Skeleton className="h-4 w-40 rounded" />
                            </div>
                        </td>
                        <td className="px-3 py-3">
                            <Skeleton className="h-4 w-16 rounded" />
                        </td>
                        <td className="px-3 py-3">
                            <Skeleton className="h-4 w-28 rounded" />
                        </td>
                        <td className="px-3 py-3">
                            <Skeleton className="h-5 w-14 rounded-full" />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const MobileCardsSkeleton: React.FC = () => (
    <div className="md:hidden space-y-3 p-4">
        {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-4 rounded-2xl border border-gray-100 bg-white animate-pulse">
                {/* Header */}
                <div className="flex justify-between items-start gap-3 mb-3">
                    <div className="flex gap-3 items-center flex-1">
                        <Skeleton className="h-5 w-5 rounded" />
                        <div className="flex-1">
                            <Skeleton className="h-3 w-16 rounded mb-1" />
                            <Skeleton className="h-4 w-40 rounded" />
                        </div>
                    </div>
                    <Skeleton className="h-5 w-14 rounded-full" />
                </div>
                {/* Details */}
                <div className="border-t border-gray-100 pt-3 space-y-2">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-3 w-3 rounded" />
                        <Skeleton className="h-3 w-24 rounded" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-3 w-3 rounded" />
                        <Skeleton className="h-3 w-36 rounded" />
                    </div>
                </div>
            </div>
        ))}
    </div>
);

const SubscribersTableSkeleton: React.FC = () => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <TableHeaderSkeleton />
        {/* Desktop Table - visible on md and up */}
        <DesktopTableSkeleton />
        {/* Mobile Cards - visible below md */}
        <MobileCardsSkeleton />
    </div>
);

const NewsletterSkeleton: React.FC = () => (
    <div className="space-y-6">
        <PageHeaderSkeleton
            titleWidth={200}
            subtitleWidth={160}
            showSearch={true}
            showFilter={false}
            showExportPdf={false}
            showExportExcel={false}
            showCreate={true}
            createWidth={140}
        />
        <StatsCardsSkeleton />
        <SubscribersTableSkeleton />
    </div>
);

export default NewsletterSkeleton;
