import React from 'react';

const EmployeeTrackingHeaderSkeleton: React.FC = () => {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
            <div className="w-full sm:w-auto">
                {/* Title Skeleton */}
                <div className="h-8 w-48 bg-gray-200 rounded-md animate-pulse mb-2" />
                {/* Subtitle Skeleton */}
                <div className="h-6 w-32 bg-gray-200 rounded-md animate-pulse" />
            </div>
            {/* Search Bar Skeleton */}
            <div className="hidden sm:block w-full md:w-72 h-10 bg-gray-200 rounded-xl animate-pulse" />
            <div className="sm:hidden w-full h-10 bg-gray-200 rounded-xl animate-pulse" />
        </div>
    );
};

export default EmployeeTrackingHeaderSkeleton;
