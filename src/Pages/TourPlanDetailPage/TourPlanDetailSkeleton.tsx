import { type TourDetailPermissions } from './useTourPlanDetail';

interface TourPlanDetailSkeletonProps {
  permissions?: TourDetailPermissions;
}

const SkeletonPulse = ({ className }: { className: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

export const TourPlanDetailSkeleton: React.FC<TourPlanDetailSkeletonProps> = ({
  permissions = { canUpdate: true, canDelete: true, canApprove: true }
}) => (
  <div className="space-y-6">
    {/* Header Actions Skeleton */}
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
      <div className="flex items-center gap-4">
        <SkeletonPulse className="h-9 w-9 rounded-full" />
        <SkeletonPulse className="h-8 w-64" />
      </div>
      <div className="flex flex-row gap-3">
        {permissions.canUpdate && <SkeletonPulse className="h-11 w-36 rounded-lg" />}
        {permissions.canDelete && <SkeletonPulse className="h-11 w-36 rounded-lg" />}
      </div>
    </div>

    {/* Main Content Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
      <div className="lg:col-span-2 flex flex-col h-full">
        <div className="bg-white rounded-xl border border-gray-200 p-8 flex-1">
          {/* Title and Status Badge */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <SkeletonPulse className="w-10 h-10 rounded-xl" />
              <SkeletonPulse className="h-6 w-40" />
            </div>
            <SkeletonPulse className="h-6 w-20 rounded-full" />
          </div>

          <hr className="border-gray-200 -mx-8 mb-5" />

          {/* Grid of Info Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <SkeletonPulse className="h-3 w-20" />
                <SkeletonPulse className="h-4 w-40" />
              </div>
            ))}
          </div>

          <hr className="border-gray-200 -mx-8 mt-4 mb-4" />

          {/* Purpose of Visit Skeleton */}
          <div className="space-y-2">
            <SkeletonPulse className="h-3 w-28" />
            <SkeletonPulse className="h-4 w-full" />
            <SkeletonPulse className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    </div>
  </div>
);
