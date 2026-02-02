/**
 * SkeletonPulse - Reusable skeleton loading animation component
 */
const SkeletonPulse = ({ className }: { className: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

/**
 * NoteDetailSkeleton - Loading skeleton matching the side-by-side layout
 * with information card on left and images card on right.
 */
export const NoteDetailSkeleton = () => (
  <div className="flex flex-col h-full">
    {/* Header Section */}
    <div className="flex-shrink-0 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <SkeletonPulse className="h-10 w-10 rounded-xl" />
          <SkeletonPulse className="h-7 w-40" />
        </div>
        <div className="flex gap-3">
          <SkeletonPulse className="h-10 w-28 rounded-lg" />
          <SkeletonPulse className="h-10 w-32 rounded-lg" />
        </div>
      </div>
    </div>

    {/* Main Content - Side by Side Layout */}
    <div className="flex-1 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {/* Left Column: Information Card */}
        <div className="lg:col-span-2 h-full">
          <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm h-full flex flex-col">
            {/* Card Header */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <SkeletonPulse className="h-5 w-5 rounded" />
                <SkeletonPulse className="h-6 w-28" />
              </div>
              <SkeletonPulse className="h-7 w-20 rounded-full" />
            </div>

            <div className="h-px bg-gray-100 -mx-8 mb-6" />

            {/* Info Grid (4 items) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex gap-3">
                  <SkeletonPulse className="h-11 w-11 rounded-xl flex-shrink-0" />
                  <div className="space-y-2 flex-1 pt-1">
                    <SkeletonPulse className="h-3 w-16" />
                    <SkeletonPulse className="h-4 w-3/4" />
                  </div>
                </div>
              ))}
            </div>

            {/* Description Section */}
            <div className="flex-1 pt-5 border-t border-gray-100">
              <div className="flex items-start gap-3">
                <SkeletonPulse className="w-9 h-9 rounded-lg shrink-0" />
                <div className="flex-1 space-y-1">
                  <SkeletonPulse className="h-3 w-20" />
                  <SkeletonPulse className="h-4 w-full" />
                  <SkeletonPulse className="h-4 w-2/3" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Images Card */}
        <div className="lg:col-span-1 h-full">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-8 pt-8 pb-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <SkeletonPulse className="h-10 w-10 rounded-xl flex-shrink-0" />
                <div className="space-y-1.5">
                  <SkeletonPulse className="h-5 w-36" />
                  <SkeletonPulse className="h-3 w-28" />
                </div>
              </div>
              {/* Upload Button Placeholder */}
              <SkeletonPulse className="h-9 w-24 rounded-lg" />
            </div>

            {/* Content - Image placeholders */}
            <div className="p-8 flex-1 flex flex-col">
              <div className="grid grid-cols-2 gap-4">
                {[...Array(2)].map((_, i) => (
                  <SkeletonPulse key={i} className="aspect-square w-full rounded-xl" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);