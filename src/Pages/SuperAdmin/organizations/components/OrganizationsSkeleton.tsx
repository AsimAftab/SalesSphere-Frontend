import Skeleton from '../../../../components/UI/Skeleton/Skeleton';
import { ITEMS_PER_PAGE } from '../constants';

export const OrganizationHeaderSkeleton = () => {
    return (
        <div className="w-full flex flex-col gap-0 mb-8 px-1">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                {/* Title Section Skeleton */}
                <div className="text-left shrink-0 gap-2 flex flex-col">
                    <Skeleton className="h-9 w-48 rounded" />
                    <Skeleton className="h-4 w-64 rounded" />
                </div>

                {/* Controls Skeleton */}
                <div className="flex flex-col lg:flex-row items-center gap-4 w-full lg:w-auto lg:flex-1 lg:justify-end">
                    {/* Search Bar Skeleton */}
                    <Skeleton className="h-10 w-full lg:w-72 xl:w-80 rounded-lg" />

                    <div className="flex items-center justify-between lg:justify-end gap-3 w-full lg:w-auto">
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            {/* Filter Button Skeleton */}
                            <Skeleton className="h-10 w-10 rounded-lg shrink-0" />

                            {/* Add Button Skeleton */}
                            <Skeleton className="h-10 w-32 rounded-lg shrink-0" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const OrganizationCardSkeleton = () => {
    return (
        <div className="border border-gray-200 bg-white flex flex-col rounded-2xl overflow-hidden h-full">
            {/* Header Section */}
            <div className="p-4 flex items-start justify-between gap-3 border-b border-gray-100">
                <div className="flex items-center gap-3 w-full">
                    {/* Avatar Skeleton */}
                    <Skeleton className="h-12 w-12 rounded-full shrink-0" />

                    {/* Name & Details Skeleton */}
                    <div className="flex flex-col flex-1 gap-2">
                        <Skeleton className="h-5 w-3/4 rounded-md" />
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-3 w-1/2 rounded-md" />
                            <Skeleton className="h-3 w-10 rounded-md" />
                        </div>
                    </div>
                </div>
                {/* Status Badge Skeleton */}
                <Skeleton className="h-6 w-16 rounded-xl shrink-0" />
            </div>

            {/* Details Body */}
            <div className="pt-3 px-4 pb-2 flex flex-col gap-4 flex-1">
                {/* 4 Rows of Data */}
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-start gap-3">
                        <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                        <div className="flex flex-col flex-1 gap-1.5 pt-1">
                            <Skeleton className="h-3 w-1/4 rounded-sm" />
                            <Skeleton className="h-4 w-2/3 rounded-md" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="px-4 py-3.5 border-t border-gray-100 flex items-center justify-between mt-auto">
                <Skeleton className="h-4 w-24 rounded-md" />
                <Skeleton className="h-4 w-4 rounded-md" />
            </div>
        </div>
    );
};

export const OrganizationListSkeleton = () => {
    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6">
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                <OrganizationCardSkeleton key={i} />
            ))}
        </div>
    );
};

export const OrganizationsSkeleton = () => {
    return (
        <div className="space-y-6">
            <OrganizationHeaderSkeleton />
            <OrganizationListSkeleton />
        </div>
    );
};

export default OrganizationsSkeleton;
