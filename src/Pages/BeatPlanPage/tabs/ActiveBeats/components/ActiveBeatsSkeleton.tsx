import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ActiveBeatsSkeleton: React.FC = () => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header Skeleton */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-2">
                    <Skeleton width={190} height={32} />
                    <Skeleton width={250} height={20} />
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <Skeleton width={280} height={40} borderRadius={8} /> {/* Filter Bar placeholder */}
                    <Skeleton width={40} height={40} borderRadius={8} />  {/* Filter Icon */}
                </div>
            </div>


            {/* Table Skeleton */}
                    <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead className="text-sm">
                                    <tr>
                                        <th className="px-5 py-4 text-left"><Skeleton width={40} height={16} /></th>
                                        <th className="px-5 py-4 text-left"><Skeleton width={150} height={16} /></th>
                                        <th className="px-5 py-4 text-left"><Skeleton width={80} height={16} /></th>
                                        <th className="px-5 py-4 text-left"><Skeleton width={120} height={16} /></th>
                                        <th className="px-5 py-4 text-left"><Skeleton width={120} height={16} /></th>
                                        <th className="px-5 py-4 text-left"><Skeleton width={100} height={16} /></th>
                                        <th className="px-5 py-4 text-left"><Skeleton width={100} height={16} /></th>
                                        <th className="px-5 py-4 text-left"><Skeleton width={60} height={16} /></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {[...Array(8)].map((_, i) => (
                                        <tr key={i} className="hover:bg-gray-50">
                                            <td className="px-5 py-4"><Skeleton width={30} height={20} /></td>
                                            <td className="px-5 py-4"><Skeleton width={180} height={20} /></td>
                                            <td className="px-5 py-4"><Skeleton width={60} height={20} /></td>
                                            <td className="px-5 py-4"><Skeleton width={140} height={20} /></td>
                                            <td className="px-5 py-4"><Skeleton width={140} height={20} /></td>
                                            <td className="px-5 py-4"><Skeleton width={140} height={20} /></td>
                                            <td className="px-5 py-4"><Skeleton width={90} height={32} borderRadius={6} /></td>
                                            <td className="px-5 py-4">
                                                <div className="flex gap-2">
                                                    <Skeleton width={32} height={32} borderRadius={8} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

            {/* Mobile Cards Skeleton */}
            <div className="md:hidden space-y-4">
                {[1, 2, 3].map((item) => (
                    <div key={item} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-4 space-y-4">
                            {/* Header: S.No + Status */}
                            <div className="flex justify-between items-center">
                                <Skeleton width={60} height={14} />
                                <Skeleton width={70} height={20} borderRadius={100} />
                            </div>

                            {/* Name */}
                            <Skeleton width="80%" height={24} />

                            {/* Details Grid */}
                            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-50">
                                {/* Assigned To */}
                                <div>
                                    <Skeleton width={70} height={12} className="mb-2" />
                                    <div className="flex items-center gap-2">
                                        <Skeleton circle width={20} height={20} />
                                        <Skeleton width={80} height={14} />
                                    </div>
                                </div>
                                {/* Date */}
                                <div>
                                    <Skeleton width={40} height={12} className="mb-2" />
                                    <div className="flex items-center gap-2">
                                        <Skeleton width={14} height={14} />
                                        <Skeleton width={90} height={14} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="border-t border-gray-100 grid grid-cols-2 divide-x divide-gray-100">
                            <div className="py-2.5 flex items-center justify-center">
                                <Skeleton width={100} height={20} />
                            </div>
                            <div className="py-2.5 flex items-center justify-center">
                                <Skeleton width={80} height={20} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActiveBeatsSkeleton;
