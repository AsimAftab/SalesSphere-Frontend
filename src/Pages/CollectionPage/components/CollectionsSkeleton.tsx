import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export const CollectionsSkeleton: React.FC = () => {
    return (
        <>
            {/* Desktop Skeleton */}
            <div className="hidden lg:block">
                <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="w-12 px-4 py-3"><Skeleton width={16} height={16} /></th>
                                <th className="w-16 px-4 py-3"><Skeleton width={40} /></th>
                                <th className="px-4 py-3"><Skeleton width={100} /></th>
                                <th className="px-4 py-3"><Skeleton width={80} /></th>
                                <th className="px-4 py-3"><Skeleton width={100} /></th>
                                <th className="px-4 py-3"><Skeleton width={100} /></th>
                                <th className="px-4 py-3"><Skeleton width={80} /></th>
                                <th className="w-20 px-4 py-3"><Skeleton width={50} /></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {[...Array(7)].map((_, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-4 py-3"><Skeleton width={16} height={16} /></td>
                                    <td className="px-4 py-3"><Skeleton width={30} /></td>
                                    <td className="px-4 py-3"><Skeleton width={150} /></td>
                                    <td className="px-4 py-3"><Skeleton width={100} /></td>
                                    <td className="px-4 py-3">
                                        <Skeleton width={120} height={28} borderRadius={16} />
                                    </td>
                                    <td className="px-4 py-3"><Skeleton width={100} /></td>
                                    <td className="px-4 py-3"><Skeleton width={80} /></td>
                                    <td className="px-4 py-3 text-center">
                                        <Skeleton width={36} height={36} borderRadius={8} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Skeleton */}
            <div className="lg:hidden space-y-4">
                {[...Array(5)].map((_, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <Skeleton width={16} height={16} />
                                <div>
                                    <Skeleton width={40} height={12} className="mb-1" />
                                    <Skeleton width={150} height={20} />
                                </div>
                            </div>
                            <Skeleton width={36} height={36} borderRadius={8} />
                        </div>

                        <div className="mb-3">
                            <Skeleton width={120} height={32} />
                        </div>

                        <div className="flex gap-2 mb-3">
                            <Skeleton width={100} height={24} borderRadius={12} />
                            <Skeleton width={80} height={24} borderRadius={12} />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Skeleton width={80} height={12} className="mb-1" />
                                <Skeleton width={100} height={16} />
                            </div>
                            <div>
                                <Skeleton width={70} height={12} className="mb-1" />
                                <Skeleton width={90} height={16} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};
