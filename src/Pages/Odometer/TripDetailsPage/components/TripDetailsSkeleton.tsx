import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const TripDetailsSkeleton: React.FC = () => {
    return (
        <div className="w-full flex flex-col space-y-6">
            {/* Header Skeleton */}
            <div className="flex justify-between items-center px-1">
                <div className="flex items-center gap-4">
                    <Skeleton circle width={40} height={40} />
                    <div>
                        <Skeleton width={180} height={28} />
                        <Skeleton width={250} height={14} />
                    </div>
                </div>
                <Skeleton width={150} height={40} borderRadius={20} />
            </div>

            {/* Tabs Skeleton */}
            <div className="flex gap-2">
                <Skeleton width={120} height={48} borderRadius={12} />
                <Skeleton width={120} height={48} borderRadius={12} />
                <Skeleton width={120} height={48} borderRadius={12} />
            </div>

            {/* Cards Skeleton */}
            <div className="space-y-6">
                <Skeleton height={120} borderRadius={16} />
                <div className="grid grid-cols-3 gap-6">
                    <Skeleton height={100} borderRadius={16} />
                    <Skeleton height={100} borderRadius={16} />
                    <Skeleton height={100} borderRadius={16} />
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <Skeleton height={100} borderRadius={16} />
                    <Skeleton height={100} borderRadius={16} />
                </div>
                <Skeleton height={200} borderRadius={16} />
            </div>
        </div>
    );
};

export default TripDetailsSkeleton;
