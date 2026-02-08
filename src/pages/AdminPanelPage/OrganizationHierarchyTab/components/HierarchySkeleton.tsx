import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

/** A single skeleton node row (card + toggle button placeholder) */
const SkeletonNode: React.FC<{ showToggle?: boolean; showBadge?: boolean }> = ({ showToggle, showBadge }) => (
    <div className="flex items-center gap-3">
        <Skeleton width={320} height={78} borderRadius={16} />
        {showToggle && <Skeleton width={32} height={32} circle />}
        {showBadge && <Skeleton width={90} height={26} borderRadius={16} />}
    </div>
);

/** A child row with connector lines matching TreeBranch */
const SkeletonChild: React.FC<{ isLast?: boolean; children: React.ReactNode }> = ({ isLast, children }) => (
    <div className="relative flex">
        {/* Connector lines */}
        <div className="relative flex-shrink-0 w-7">
            {/* Vertical trunk line */}
            <div
                className="absolute left-0 top-0 w-[2px] rounded-full bg-gray-100"
                style={{ height: isLast ? '32px' : '100%' }}
            />
            {/* Horizontal branch to card */}
            <div className="absolute left-0 top-8 h-[2px] w-full rounded-full bg-gray-100" />
        </div>
        {/* Child content */}
        <div className="pt-3 pb-3 flex-1">{children}</div>
    </div>
);

const HierarchySkeleton: React.FC = () => (
    <>
        {/* Page Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-6 pt-4 sm:pt-6">
            <div>
                <Skeleton width={280} height={30} className="mb-1" />
                <Skeleton width={380} height={14} />
            </div>
            <div className="flex items-center gap-2">
                <Skeleton width={110} height={38} borderRadius={8} />
                <Skeleton width={110} height={38} borderRadius={8} />
            </div>
        </div>

        {/* Content Skeleton */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden px-4 sm:px-6 py-4 sm:py-6 gap-4">
            {/* Info Bar Skeleton */}
            <div className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 px-5 py-3.5 shadow-sm">
                <Skeleton width={40} height={40} borderRadius={8} />
                <Skeleton width={160} height={16} />
                <div className="ml-auto">
                    <Skeleton width={130} height={30} borderRadius={16} />
                </div>
            </div>

            {/* Tree Container Skeleton — vertical layout matching TreeBranch */}
            <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-auto">
                <div className="min-w-max min-h-full p-8 flex justify-center">
                    {/* Root Node */}
                    <div className="flex flex-col items-center">
                        <SkeletonNode showToggle />

                        {/* Level 1 children */}
                        <div className="ml-10 mt-1">
                            {/* Child 1 — with sub-children */}
                            <SkeletonChild>
                                <div className="flex flex-col">
                                    <SkeletonNode showToggle />
                                    {/* Level 2 children */}
                                    <div className="ml-10 mt-1">
                                        <SkeletonChild>
                                            <SkeletonNode />
                                        </SkeletonChild>
                                        <SkeletonChild isLast>
                                            <SkeletonNode />
                                        </SkeletonChild>
                                    </div>
                                </div>
                            </SkeletonChild>

                            {/* Child 2 — with sub-children */}
                            <SkeletonChild>
                                <div className="flex flex-col">
                                    <SkeletonNode showToggle />
                                    <div className="ml-10 mt-1">
                                        <SkeletonChild isLast>
                                            <SkeletonNode />
                                        </SkeletonChild>
                                    </div>
                                </div>
                            </SkeletonChild>

                            {/* Child 3 — leaf node, collapsed with badge */}
                            <SkeletonChild isLast>
                                <SkeletonNode showToggle showBadge />
                            </SkeletonChild>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
);

export default HierarchySkeleton;
