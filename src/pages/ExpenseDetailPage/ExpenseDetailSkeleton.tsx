interface ExpenseDetailSkeletonProps {
  permissions?: {
    canUpdate: boolean;
    canDelete: boolean;
  };
}

const SkeletonPulse = ({ className }: { className: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);


export const ExpenseDetailSkeleton: React.FC<ExpenseDetailSkeletonProps> = ({
  permissions = { canUpdate: true, canDelete: true }
}) => (
  <div className="space-y-6">
    {/* Header Actions Skeleton */}
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
      <div className="flex items-center gap-4">
        <SkeletonPulse className="h-6 w-6 rounded-full" />
        <SkeletonPulse className="h-8 w-64" />
      </div>
      <div className="flex flex-row gap-3">
        {permissions.canUpdate && <SkeletonPulse className="h-11 w-32 rounded-lg" />}
        {permissions.canDelete && <SkeletonPulse className="h-11 w-32 rounded-lg" />}
      </div>
    </div>

    {/* Main Content Grid Skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

      {/* Left Card: Info (60%) */}
      <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200 p-8">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <SkeletonPulse className="w-10 h-10 rounded-xl" />
            <SkeletonPulse className="h-6 w-40" />
          </div>
          <SkeletonPulse className="h-6 w-20 rounded-full" />
        </div>

        <hr className="border-gray-100 -mx-8 mb-8" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8 mb-10">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <SkeletonPulse className="p-5 rounded-lg shrink-0" />
              <div className="space-y-2 flex-1">
                <SkeletonPulse className="h-3 w-16" />
                <SkeletonPulse className="h-4 w-full" />
              </div>
            </div>
          ))}
        </div>

        <hr className="border-gray-100 -mx-8 mt-4" />

        <div className="pt-8 space-y-4">
          <div className="flex items-center gap-2">
            <SkeletonPulse className="w-4 h-4" />
            <SkeletonPulse className="h-4 w-24" />
          </div>
          <SkeletonPulse className="h-16 w-full" />
        </div>
      </div>

      {/* Right Card: Receipt (40%) */}
      <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 flex flex-col h-full">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 mb-2">
          <div className="flex items-center gap-3">
            <SkeletonPulse className="w-10 h-10 rounded-xl" />
            <div className="space-y-2">
              <SkeletonPulse className="h-4 w-32" />
              <SkeletonPulse className="h-3 w-20" />
            </div>
          </div>
          {permissions.canUpdate && <SkeletonPulse className="h-8 w-24 rounded-lg" />}
        </div>

        <div className="flex-1 px-6 pb-6">
          <div className="grid grid-cols-2 gap-4">
            <SkeletonPulse className="aspect-square rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  </div>
);