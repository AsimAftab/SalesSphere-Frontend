import React from 'react';

interface EmployeeCardSkeletonProps {
    rowCount?: number; // Override if needed
    canViewLocation?: boolean;
}

/**
 * EmployeeCardSkeleton - Custom skeleton for employee tracking cards
 *
 * NOTE: This component has a specific card layout with avatar, name/role, status badge,
 * dynamic body rows (based on permissions), and a footer section. This structure
 * differs from the generic MobileCardSkeleton which is designed for list-style cards.
 * Keeping custom implementation to preserve the exact employee card structure.
 */
const EmployeeCardSkeleton: React.FC<EmployeeCardSkeletonProps> = ({
    rowCount,
    canViewLocation = true
}) => {
    // Default rows: Beat Plan (1) + Check In (1) = 2.
    // Location adds 1.
    // Check Out (Completed) adds 1.
    // If rowCount is manually provided, use it. Otherwise calculate.
    const effectiveRowCount = rowCount !== undefined
        ? rowCount
        : (2 + (canViewLocation ? 1 : 0));
    return (
        <div className="bg-white rounded-lg border border-gray-100 h-full flex flex-col overflow-hidden">
            {/* Header Skeleton */}
            <div className="p-5 pb-4 border-b border-gray-100 flex items-start justify-between">
                <div className="flex gap-4 w-full">
                    {/* Avatar Shimmer */}
                    <div className="shrink-0">
                        <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse" />
                    </div>
                    {/* Name/Role Shimmer */}
                    <div className="flex-1 max-w-[140px]">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse" />
                        <div className="h-3 bg-gray-100 rounded w-1/2 animate-pulse" />
                    </div>
                </div>
                {/* Status Badge Shimmer */}
                <div className="w-16 h-6 bg-gray-100 rounded-md animate-pulse" />
            </div>

            {/* Body Skeleton */}
            <div className="p-5 pt-4 space-y-4 flex-1">
                {Array.from({ length: effectiveRowCount }).map((_, i) => (
                    <div key={i} className="flex items-start gap-3.5">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 shrink-0 animate-pulse" />
                        <div className="flex-1">
                            <div className="h-3 bg-gray-100 rounded w-1/3 mb-1 animate-pulse" />
                            <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer Skeleton */}
            <div className="px-5 py-3.5 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                <div className="h-3 bg-gray-200 rounded w-1/3 animate-pulse" />
                <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
            </div>
        </div>
    );
};

export default EmployeeCardSkeleton;
