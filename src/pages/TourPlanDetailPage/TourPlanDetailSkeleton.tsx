import { Skeleton } from '@/components/ui';
import { type TourDetailPermissions } from './hooks/useTourPlanDetail';

interface TourPlanDetailSkeletonProps {
  permissions?: TourDetailPermissions;
}

/**
 * TourPlanDetailSkeleton
 *
 * NOTE: This component has unique layout requirements that prevent using DetailPageSkeleton:
 * - Conditional button rendering based on permissions (canUpdate, canDelete, canApprove)
 * - Specific 3-column grid layout with only left 2 columns used
 * - Custom card structure with status badge and info blocks
 * - Purpose of visit section with specific styling
 */
export const TourPlanDetailSkeleton: React.FC<TourPlanDetailSkeletonProps> = ({
  permissions = { canUpdate: true, canDelete: true, canApprove: true }
}) => (
  <div className="space-y-6">
    {/* Header Skeleton - Matches DetailPageHeader layout */}
    <div className="w-full mb-4 sm:mb-6">
      {/* Back Button Row */}
      <div className="flex items-center gap-2 mb-4">
        <Skeleton className="h-5 w-5" />
        <Skeleton className="h-4 w-32" />
      </div>
      {/* Title and Actions Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Skeleton className="h-8 w-48" />
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {permissions.canUpdate && <Skeleton className="h-11 w-full sm:w-36 rounded-lg" />}
          {permissions.canDelete && <Skeleton className="h-11 w-full sm:w-36 rounded-lg" />}
        </div>
      </div>
    </div>

    {/* Main Content Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
      <div className="lg:col-span-2 flex flex-col h-full">
        <div className="bg-white rounded-xl border border-gray-200 p-8 flex-1">
          {/* Title and Status Badge */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <Skeleton className="h-6 w-40" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>

          <hr className="border-gray-200 -mx-8 mb-5" />

          {/* Grid of Info Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="w-9 h-9 rounded-lg shrink-0" />
                <div className="flex-1">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-4 w-40 mt-1" />
                </div>
              </div>
            ))}
          </div>

          <hr className="border-gray-200 -mx-8 mt-4 mb-4" />

          {/* Purpose of Visit Skeleton */}
          <div className="flex items-start gap-3">
            <Skeleton className="w-9 h-9 rounded-lg shrink-0" />
            <div className="flex-1">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-4 w-full mt-1" />
              <Skeleton className="h-4 w-3/4 mt-1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
