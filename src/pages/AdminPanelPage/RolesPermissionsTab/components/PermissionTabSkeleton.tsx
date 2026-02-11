import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

/** Skeleton for the Role Management Sidebar */
export const SidebarSkeleton: React.FC = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full">
        {/* Header */}
        <div className="px-4 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
                <Skeleton width={36} height={36} borderRadius={8} />
                <div>
                    <Skeleton width={140} height={18} />
                    <Skeleton width={180} height={12} className="mt-1" />
                </div>
            </div>
        </div>

        {/* Add Role Button */}
        <div className="px-4 py-2.5 space-y-2.5">
            <Skeleton width="100%" height={38} borderRadius={8} />
            {/* Dropdown */}
            <div>
                <Skeleton width={90} height={14} className="mb-1" />
                <Skeleton width="100%" height={38} borderRadius={8} />
            </div>
        </div>

        {/* Access Control */}
        <div className="border-t border-dashed border-gray-200 px-4 py-2 space-y-2">
            <Skeleton width={110} height={14} />
            <div className="flex items-center justify-between py-1.5">
                <div className="flex items-center gap-2.5">
                    <Skeleton width={28} height={28} borderRadius={6} />
                    <div>
                        <Skeleton width={80} height={14} />
                        <Skeleton width={150} height={10} className="mt-1" />
                    </div>
                </div>
                <Skeleton width={44} height={24} borderRadius={12} />
            </div>
            <div className="flex items-center justify-between py-1.5">
                <div className="flex items-center gap-2.5">
                    <Skeleton width={28} height={28} borderRadius={6} />
                    <div>
                        <Skeleton width={80} height={14} />
                        <Skeleton width={150} height={10} className="mt-1" />
                    </div>
                </div>
                <Skeleton width={44} height={24} borderRadius={12} />
            </div>
        </div>

        {/* Permission Actions */}
        <div className="border-t border-dashed border-gray-200 px-4 py-2.5 space-y-2">
            <Skeleton width={130} height={14} />
            <Skeleton width={220} height={10} />
            <div className="flex gap-2">
                <Skeleton width="50%" height={38} borderRadius={8} />
                <Skeleton width="50%" height={38} borderRadius={8} />
            </div>
        </div>
    </div>
);

/** Skeleton for a single Module Accordion row */
const ModuleAccordionSkeleton: React.FC = () => (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
        <div className="px-4 py-3.5">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                    <Skeleton width={28} height={28} borderRadius={6} />
                    <Skeleton width={120} height={14} />
                    <Skeleton width={32} height={18} borderRadius={10} />
                    <Skeleton width={70} height={20} borderRadius={10} />
                </div>
                <div className="flex items-center gap-2.5 ml-4">
                    <Skeleton width={60} height={12} />
                    <Skeleton width={40} height={22} borderRadius={11} />
                </div>
            </div>
            {/* Progress bar */}
            <div className="mt-2.5 ml-10">
                <Skeleton width="100%" height={6} borderRadius={3} />
            </div>
        </div>
    </div>
);

/** Skeleton for the Module Permissions panel */
export const ModulePermissionsSkeleton: React.FC = () => (
    <div className="flex-1 flex flex-col min-w-0 min-h-0 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
                <Skeleton width={36} height={36} borderRadius={8} />
                <div>
                    <Skeleton width={150} height={16} />
                    <Skeleton width={200} height={12} className="mt-1" />
                </div>
            </div>
            <Skeleton width={90} height={30} borderRadius={15} />
        </div>

        {/* Accordion List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {Array(6).fill(0).map((_, i) => (
                <ModuleAccordionSkeleton key={i} />
            ))}
        </div>

        {/* Footer */}
        <div className="bg-gray-50/80 border-t border-gray-200 px-6 py-4">
            <div className="flex items-center justify-end gap-3">
                <Skeleton width={80} height={38} borderRadius={8} />
                <Skeleton width={120} height={38} borderRadius={8} />
            </div>
        </div>
    </div>
);

/** Complete Permission Tab Skeleton (includes page header) */
export const PermissionTabSkeleton: React.FC = () => (
    <>
        {/* Page Header Skeleton */}
        <div className="px-4 sm:px-6 pt-4 sm:pt-6">
            <Skeleton width={260} height={30} className="mb-1" />
            <Skeleton width={420} height={14} />
        </div>

        {/* Content Skeleton */}
        <div className="flex flex-col lg:flex-row flex-1 min-h-0 overflow-hidden bg-gray-100 px-4 sm:px-6 py-4 sm:py-6 gap-4 sm:gap-6">
            {/* Sidebar */}
            <div className="w-full lg:w-96 flex-shrink-0 min-h-0 max-h-[40vh] lg:max-h-none">
                <SidebarSkeleton />
            </div>

            {/* Module Permissions */}
            <ModulePermissionsSkeleton />
        </div>
    </>
);
