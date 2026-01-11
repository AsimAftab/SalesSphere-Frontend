import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

/**
 * FeatureSkeleton - Visual placeholder for the FeaturesSection.
 * Matches the Tabbed Navigator + Card Display layout.
 */
export const FeatureSkeleton: React.FC = () => {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* 1. Header Area Skeleton */}
        <div className="text-center mb-12 flex flex-col items-center">
          {/* Section Title "Features" */}
          <Skeleton width={100} height={20} className="mb-4" />
          {/* Underline Stroke */}
          <Skeleton width={120} height={12} className="mb-6" />
          {/* Main Heading */}
          <Skeleton width={400} height={40} className="mb-4 max-w-full" />
          {/* Subtext */}
          <Skeleton width={600} height={16} count={2} className="max-w-full" />
        </div>

        {/* 2. Navigation Tabs Skeleton (Desktop & Scrollable Mobile) */}
        <div className="flex overflow-x-auto md:justify-center gap-4 md:gap-8 pb-6 mb-10 no-scrollbar">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="flex flex-col items-center min-w-[120px] p-4">
              {/* Icon Circle */}
              <Skeleton circle width={56} height={56} className="mb-3" />
              {/* Tab Label */}
              <Skeleton width={80} height={12} />
            </div>
          ))}
        </div>

        {/* 3. Main Display Card Skeleton */}
        <div className="bg-white rounded-[32px] p-8 md:p-12 border border-gray-100 flex flex-col lg:flex-row gap-12 items-center shadow-sm">
          
          {/* Mockup Image Area */}
          <div className="w-full lg:w-3/5">
            <Skeleton height={420} borderRadius={24} />
          </div>

          {/* Text Content Area */}
          <div className="w-full lg:w-2/5 text-left">
            {/* Badge */}
            <Skeleton width={100} height={24} borderRadius={12} className="mb-6" />
            {/* Feature Title */}
            <Skeleton width="90%" height={32} className="mb-6" />
            {/* Description Paragraph */}
            <Skeleton width="100%" height={14} count={3} className="mb-8" />
            
            {/* Points List */}
            <div className="space-y-4">
              {Array(3).fill(0).map((_, j) => (
                <div key={j} className="flex items-center gap-3">
                  <Skeleton circle width={20} height={20} />
                  <Skeleton width={180} height={14} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Pagination Dots Skeleton */}
        <div className="flex justify-center gap-2 mt-12">
          <Skeleton width={32} height={6} borderRadius={3} />
          <Skeleton width={8} height={6} borderRadius={3} />
          <Skeleton width={8} height={6} borderRadius={3} />
          <Skeleton width={8} height={6} borderRadius={3} />
        </div>
      </div>
    </section>
  );
};

export default FeatureSkeleton;