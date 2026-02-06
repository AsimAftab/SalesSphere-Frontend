import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { ITEMS_PER_PAGE } from '../constants';
import { PageHeaderSkeleton } from '@/components/ui';

export const OrganizationHeaderSkeleton: React.FC = () => (
    <PageHeaderSkeleton
        titleWidth={150}
        subtitleWidth={200}
        showSearch={true}
        showFilter={true}
        showExportPdf={false}
        showExportExcel={false}
        showCreate={true}
        createWidth={160}
    />
);

export const OrganizationCardSkeleton: React.FC = () => (
    <div className="border border-gray-200 bg-white flex flex-col rounded-2xl overflow-hidden h-full">
        {/* Header Section */}
        <div className="p-4 flex items-start justify-between gap-3 border-b border-gray-100">
            <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Avatar */}
                <Skeleton circle width={48} height={48} />
                {/* Name & Owner */}
                <div className="flex flex-col flex-1 gap-1.5">
                    <Skeleton width="70%" height={20} />
                    <Skeleton width="50%" height={12} />
                </div>
            </div>
            {/* Status & Users Badges */}
            <div className="flex flex-col items-end gap-1.5 shrink-0">
                <Skeleton width={60} height={22} borderRadius={12} />
                <Skeleton width={70} height={20} borderRadius={12} />
            </div>
        </div>

        {/* Details Body - 4 Info Rows */}
        <div className="pt-3 px-4 pb-2 flex flex-col gap-3 flex-1">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-start gap-3">
                    <Skeleton width={40} height={40} borderRadius={8} />
                    <div className="flex flex-col flex-1 gap-1 pt-1">
                        <Skeleton width={60} height={10} />
                        <Skeleton width="65%" height={14} />
                    </div>
                </div>
            ))}
        </div>

        {/* Footer */}
        <div className="px-4 py-3.5 border-t border-gray-100 flex items-center justify-between mt-auto">
            <Skeleton width={80} height={14} />
            <Skeleton width={16} height={16} />
        </div>
    </div>
);

export const OrganizationListSkeleton: React.FC = () => (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6">
        {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
            <OrganizationCardSkeleton key={i} />
        ))}
    </div>
);

export const OrganizationsSkeleton: React.FC = () => (
    <div className="space-y-6">
        <OrganizationHeaderSkeleton />
        <OrganizationListSkeleton />
    </div>
);

export default OrganizationsSkeleton;
