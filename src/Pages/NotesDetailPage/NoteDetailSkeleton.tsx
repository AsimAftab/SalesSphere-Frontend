import React from 'react';

const SkeletonPulse = ({ className }: { className: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

export const NoteDetailSkeleton = () => (
  <div className="space-y-6">
    {/* Header Section: Back Button + Title and Action Buttons */}
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
      <div className="flex items-center gap-4">
        <SkeletonPulse className="h-9 w-9 rounded-full" /> {/* Back button */}
        <SkeletonPulse className="h-8 w-48" />             {/* Page Title */}
      </div>
      <div className="flex gap-3">
        <SkeletonPulse className="h-10 w-28 rounded-lg" /> {/* Edit Button */}
        <SkeletonPulse className="h-10 w-24 rounded-lg" /> {/* Delete Button */}
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Information Card (Left/Main Column) */}
      <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
        {/* Card Header: Information Title + Type Badge */}
        <div className="flex justify-between items-center mb-6">
           <div className="flex items-center gap-2">
             <SkeletonPulse className="h-5 w-5 rounded" /> 
             <SkeletonPulse className="h-6 w-32" />
           </div>
           <SkeletonPulse className="h-6 w-16 rounded-full" /> {/* Badge */}
        </div>

        <div className="h-px bg-gray-100 -mx-8 mb-8" />

        {/* InfoRow Grid (4 items) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8 mb-10">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-3">
              <SkeletonPulse className="h-10 w-10 rounded-lg" /> {/* Icon box */}
              <div className="space-y-2 flex-1 pt-1">
                <SkeletonPulse className="h-3 w-16" />        {/* Label */}
                <SkeletonPulse className="h-4 w-3/4" />       {/* Value */}
              </div>
            </div>
          ))}
        </div>

        {/* Description Section */}
        <div className="pt-8 border-t border-gray-100">
          <SkeletonPulse className="h-3 w-24 mb-3" />        {/* Description Label */}
          <div className="space-y-2">
            <SkeletonPulse className="h-4 w-full" />
            <SkeletonPulse className="h-4 w-full" />
            <SkeletonPulse className="h-4 w-2/3" />
          </div>
        </div>
      </div>
      
      {/* Sidebar / Empty space matching lg:grid-cols-5 if needed, 
          or leave empty as per your current layout logic */}
      <div className="lg:col-span-2 hidden lg:block" />
    </div>

    {/* Gallery Section Skeleton */}
    <div className="pt-6">
      <SkeletonPulse className="h-4 w-20 mb-4" /> {/* "IMAGES" label */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <SkeletonPulse key={i} className="aspect-square rounded-xl" />
        ))}
      </div>
    </div>
  </div>
);