import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const CompletedBeatsSkeleton: React.FC = () => (
    <div className="flex-1 flex flex-col space-y-6 animate-in fade-in duration-500">
        {/* Header: Title (left), Search (right) */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <Skeleton width={250} height={32} className="mb-2" />
                <Skeleton width={300} height={20} />
            </div>
            <div className="w-full sm:w-auto flex justify-end">
                <Skeleton height={40} width={320} borderRadius={999} />
            </div>
        </div>

        {/* Table Skeleton */}
        <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead className="bg-gray-50 text-sm">
                        <tr>
                            {/* Columns: S.No, Name, Stops, Compl By, Compl Date, View, Status */}
                            <th className="px-5 py-4 text-left"><Skeleton width={40} height={16} /></th>
                            <th className="px-5 py-4 text-left"><Skeleton width={150} height={16} /></th>
                            <th className="px-5 py-4 text-left"><Skeleton width={80} height={16} /></th>
                            <th className="px-5 py-4 text-left"><Skeleton width={120} height={16} /></th>
                            <th className="px-5 py-4 text-left"><Skeleton width={100} height={16} /></th>
                            <th className="px-5 py-4 text-left"><Skeleton width={100} height={16} /></th>
                            <th className="px-5 py-4 text-left"><Skeleton width={80} height={16} /></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {[...Array(8)].map((_, i) => (
                            <tr key={i} className="hover:bg-gray-50">
                                <td className="px-5 py-4"><Skeleton width={30} height={20} /></td>
                                <td className="px-5 py-4"><Skeleton width={180} height={20} /></td>
                                <td className="px-5 py-4"><Skeleton width={60} height={20} /></td>
                                <td className="px-5 py-4"><Skeleton width={140} height={20} /></td>
                                <td className="px-5 py-4"><Skeleton width={100} height={20} /></td>
                                <td className="px-5 py-4"><Skeleton width={90} height={20} /></td>
                                <td className="px-5 py-4"><Skeleton width={70} height={24} borderRadius={12} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Mobile View Skeleton (Cards) */}
        <div className="md:hidden space-y-4">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-3">
                    <div className="flex justify-between items-start">
                        <div>
                            <Skeleton width={160} height={20} className="mb-1" />
                            <Skeleton width={100} height={16} />
                        </div>
                        <Skeleton width={60} height={24} borderRadius={12} />
                    </div>
                    <div className="pt-2 border-t border-gray-50 grid grid-cols-2 gap-3">
                        <Skeleton width={80} height={16} />
                        <Skeleton width={80} height={16} />
                    </div>
                    <div className="pt-2 border-t border-gray-50">
                        <Skeleton width="100%" height={32} borderRadius={8} />
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default CompletedBeatsSkeleton;
