import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface OdometerDetailsSkeletonProps {
    rows?: number;
}

const OdometerDetailsSkeleton: React.FC<OdometerDetailsSkeletonProps> = ({ rows = 10 }) => {
    return (
        <div className="w-full flex flex-col">
            {/* 1. Header & Stats Skeleton */}
            <div className="flex-shrink-0 space-y-4 mb-6">
                {/* Header Actions */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-1">
                    <div className="flex items-center gap-4">
                        <Skeleton circle width={40} height={40} />
                        <div>
                            <Skeleton width={200} height={32} className="mb-2" />
                            <Skeleton width={300} height={16} />
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-full sm:w-80"><Skeleton height={42} borderRadius={8} /></div>
                        <div className="flex gap-2">
                            <Skeleton width={42} height={42} borderRadius={8} />
                            <Skeleton width={80} height={42} borderRadius={8} />
                            <Skeleton width={80} height={42} borderRadius={8} />
                        </div>
                    </div>
                </div>

                {/* Stats Card Skeleton */}
                <div className="w-full lg:w-3/4 rounded-2xl overflow-hidden">
                    <Skeleton height={160} borderRadius={16} className="w-full" />
                </div>
            </div>

            {/* 2. Desktop Table Skeleton */}
            <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full border-collapse">
                    <thead className="text-sm border-b border-gray-100">
                        <tr>
                            <th className="px-5 py-3 text-left"><Skeleton width={40} height={14} /></th> {/* S.No */}
                            <th className="px-5 py-3 text-left"><Skeleton width={100} height={14} /></th> {/* Date */}
                            <th className="px-5 py-3 text-center"><Skeleton width={120} height={14} /></th> {/* Total Distance */}
                            <th className="px-5 py-3 text-center"><Skeleton width={100} height={14} /></th> {/* Trips */}
                            <th className="px-5 py-3 text-left"><Skeleton width={80} height={14} /></th>  {/* View Details */}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {Array(rows).fill(0).map((_, i) => (
                            <tr key={i} className="h-16">
                                <td className="px-5 py-3"><Skeleton width={20} /></td>
                                <td className="px-5 py-3"><Skeleton width={120} height={14} /></td>
                                <td className="px-5 py-3 text-center"><Skeleton width={80} height={20} borderRadius={4} /></td>
                                <td className="px-5 py-3 text-center"><Skeleton width={70} height={20} borderRadius={4} /></td>
                                <td className="px-5 py-3"><Skeleton width={90} height={12} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* 3. Mobile Card Skeleton */}
            <div className="md:hidden w-full space-y-4 pb-10">
                {Array(5).fill(0).map((_, i) => (
                    <div key={i} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                            <Skeleton width={100} height={16} />
                            <Skeleton width={60} height={14} />
                        </div>
                        <div className="flex justify-between items-center gap-4">
                            <Skeleton width={80} height={14} />
                            <Skeleton width={90} height={24} borderRadius={4} />
                        </div>
                        <div className="mt-4">
                            <Skeleton width="100%" height={36} borderRadius={8} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OdometerDetailsSkeleton;
