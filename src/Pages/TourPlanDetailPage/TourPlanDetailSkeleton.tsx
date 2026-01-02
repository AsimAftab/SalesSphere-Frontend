const SkeletonPulse = ({ className }: { className: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

export const TourPlanDetailSkeleton = () => (
  <div className="space-y-6">
    {/* Header Actions Skeleton */}
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
      <div className="flex items-center gap-4">
        <SkeletonPulse className="h-6 w-6 rounded-full" />
        <SkeletonPulse className="h-8 w-64" />
      </div>
      <div className="flex flex-row gap-3">
        <SkeletonPulse className="h-11 w-32 rounded-lg" />
        <SkeletonPulse className="h-11 w-32 rounded-lg" />
      </div>
    </div>

    <div className="bg-white rounded-xl border border-gray-200 p-8">
      {/* Title and Status Badge */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <SkeletonPulse className="w-10 h-10 rounded-xl" />
          <SkeletonPulse className="h-6 w-40" />
        </div>
        <SkeletonPulse className="h-6 w-20 rounded-full" />
      </div>

      <hr className="border-gray-100 -mx-8 mb-8" />

      {/* Grid of Info Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-2">
            <SkeletonPulse className="h-3 w-16" />
            <SkeletonPulse className="h-4 w-full" />
          </div>
        ))}
      </div>

      {/* ADDED: Purpose of Visit Skeleton */}
      <div className="mt-10 pt-8 border-t border-gray-100 space-y-4">
        <div className="flex items-center gap-2">
          <SkeletonPulse className="w-4 h-4" />
          <SkeletonPulse className="h-4 w-32" />
        </div>
        <SkeletonPulse className="h-20 w-full rounded-xl" />
      </div>
    </div>
  </div>
);