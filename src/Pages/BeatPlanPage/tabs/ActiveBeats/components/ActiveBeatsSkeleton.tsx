import React from 'react';
import Skeleton from 'react-loading-skeleton';

interface ActiveBeatsSkeletonProps {
    canViewDetails?: boolean;
    canDelete?: boolean;
}

const ActiveBeatsSkeleton: React.FC<ActiveBeatsSkeletonProps> = ({
    canViewDetails = true,
    canDelete = true,
}) => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header: Title/Desc (Left) + Search/Filter (Right) */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-2">
                    <Skeleton width={220} height={32} />
                    <Skeleton width={280} height={20} />
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-stretch sm:items-center">
                    {/* SearchBar Skeleton */}
                    <div className="w-full sm:w-72">
                        <Skeleton height={42} borderRadius={8} className="w-full" />
                    </div>
                    {/* Filter Button Skeleton */}
                    <Skeleton width={42} height={42} borderRadius={8} />
                </div>
            </div>

            {/* Table Skeleton */}
            <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead className="bg-gray-50 text-sm">
                            <tr>
                                <th className="px-5 py-4 text-left"><Skeleton width={40} height={16} /></th>
                                <th className="px-5 py-4 text-left"><Skeleton width={180} height={16} /></th>
                                <th className="px-5 py-4 text-left"><Skeleton width={80} height={16} /></th>
                                <th className="px-5 py-4 text-left"><Skeleton width={120} height={16} /></th>
                                <th className="px-5 py-4 text-left"><Skeleton width={100} height={16} /></th>
                                <th className="px-5 py-4 text-left"><Skeleton width={100} height={16} /></th>
                                {canViewDetails && <th className="px-5 py-4 text-left"><Skeleton width={80} height={16} /></th>}
                                {canDelete && <th className="px-5 py-4 text-left"><Skeleton width={50} height={16} /></th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {[...Array(8)].map((_, i) => (
                                <tr key={i} className="hover:bg-gray-50">
                                    <td className="px-5 py-4"><Skeleton width={30} height={20} /></td>
                                    <td className="px-5 py-4"><Skeleton width={200} height={20} /></td>
                                    <td className="px-5 py-4"><Skeleton width={60} height={20} /></td>
                                    <td className="px-5 py-4"><Skeleton width={140} height={20} /></td>
                                    <td className="px-5 py-4"><Skeleton width={100} height={20} /></td>
                                    <td className="px-5 py-4"><Skeleton width={90} height={20} /></td>
                                    {canViewDetails && <td className="px-5 py-4"><Skeleton width={80} height={24} borderRadius={12} /></td>}
                                    {canDelete && <td className="px-5 py-4"><Skeleton width={32} height={32} borderRadius={6} /></td>}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Cards Skeleton */}
            <div className="md:hidden space-y-4">
                {[1, 2, 3].map((item) => (
                    <div key={item} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <Skeleton width={50} height={14} className="mb-1" />
                                <Skeleton width={180} height={20} />
                            </div>
                            <Skeleton width={70} height={24} borderRadius={12} />
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                            <div>
                                <Skeleton width={100} height={20} />
                            </div>
                            <div>
                                <Skeleton width={100} height={20} />
                            </div>
                        </div>

                        {(canViewDetails || canDelete) && (
                            <div className="pt-4 flex items-center justify-between border-t border-gray-100">
                                {canViewDetails && <Skeleton width={90} height={32} borderRadius={6} />}
                                {canDelete && <Skeleton width={32} height={32} borderRadius={6} />}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActiveBeatsSkeleton;
