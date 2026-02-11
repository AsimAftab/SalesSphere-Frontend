import React from 'react';
import Skeleton from 'react-loading-skeleton';

const BlogPostCardSkeleton: React.FC = () => (
  <div className="h-full">
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="relative w-full aspect-[16/9] bg-gray-100 overflow-hidden">
        <Skeleton className="absolute inset-0" height="100%" />
      </div>

      <div className="p-6 flex flex-col flex-grow space-y-4">
        <div className="space-y-3">
          <Skeleton width="60%" height={28} />
          <Skeleton width="100%" height={12} />
          <Skeleton width="90%" height={12} />
        </div>

        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
          <Skeleton width={80} height={14} />
          <Skeleton width={60} height={12} />
        </div>
      </div>
    </div>
  </div>
);

export default BlogPostCardSkeleton;
