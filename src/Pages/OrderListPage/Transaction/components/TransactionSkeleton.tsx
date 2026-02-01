import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

const TransactionSkeleton: React.FC = () => (
    <div className="w-full">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4 px-1">
            <div className="flex items-center gap-4">
                <Skeleton circle width={48} height={48} />
                <div>
                    <Skeleton width={200} height={32} />
                    <Skeleton width={250} height={16} className="mt-2" />
                </div>
            </div>
            <Skeleton width={160} height={44} borderRadius={12} />
        </div>

        {/* 3 Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Column 1: Form Details */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col h-[650px] shadow-sm">
                <div className="mb-8">
                    <Skeleton width={180} height={24} className="mb-6" />

                    <div className="space-y-6">
                        <div>
                            <Skeleton width={100} height={14} className="mb-2" />
                            <Skeleton height={48} borderRadius={12} />
                        </div>
                        <div>
                            <Skeleton width={120} height={14} className="mb-2" />
                            <Skeleton height={48} borderRadius={12} />
                        </div>
                    </div>
                </div>

                <div className="mt-auto pt-6 border-t border-gray-50">
                    <Skeleton width={100} height={20} className="mb-4" />
                    <div className="space-y-3">
                        <div className="flex justify-between"><Skeleton width={120} height={16} /> <Skeleton width={60} height={16} /></div>
                        <div className="flex justify-between"><Skeleton width={100} height={16} /> <Skeleton width={80} height={16} /></div>
                    </div>
                </div>
            </div>

            {/* Column 2: Product Browser */}
            <div className="bg-white rounded-2xl border border-gray-100 flex flex-col h-[650px] overflow-hidden shadow-sm">
                <div className="p-5 border-b flex justify-between items-center bg-gray-50/30">
                    <Skeleton width={150} height={24} />
                </div>

                {/* Search & Filter Bar Skeleton */}
                <div className="p-6 flex gap-3 border-b border-gray-50">
                    <Skeleton className="flex-1" height={42} borderRadius={12} />
                    <Skeleton width={42} height={42} borderRadius={12} />
                </div>

                <div className="p-4 space-y-4 overflow-hidden">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex gap-4 items-center p-3 border border-gray-50 rounded-2xl">
                            <Skeleton width={64} height={64} borderRadius={12} />
                            <div className="flex-1">
                                <Skeleton width="70%" height={18} />
                                <Skeleton width="40%" height={12} className="mt-2" />
                                <div className="flex justify-between mt-2">
                                    <Skeleton width={50} height={14} />
                                    <Skeleton width={70} height={14} />
                                </div>
                            </div>
                            <Skeleton width={36} height={36} borderRadius={10} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Column 3: Active Cart */}
            <div className="bg-white rounded-2xl border border-gray-100 h-[650px] flex flex-col shadow-sm">
                <div className="p-5 border-b flex justify-between items-center bg-gray-50/30">
                    <Skeleton width={120} height={24} />
                    <Skeleton width={60} height={20} borderRadius={20} />
                </div>

                <div className="flex-1 flex flex-col items-center justify-center space-y-4 px-6 text-center">
                    <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center">
                        <ShoppingCartIcon className="h-10 w-10 text-gray-200" />
                    </div>
                    <div className="w-full">
                        <Skeleton width="60%" height={16} className="mx-auto" />
                        <Skeleton width="80%" height={12} className="mt-2 mx-auto" />
                    </div>
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-200 space-y-4">
                    <div className="space-y-3">
                        <div className="flex justify-between"><Skeleton width={80} height={14} /> <Skeleton width={100} height={14} /></div>
                        <div className="flex justify-between items-center">
                            <Skeleton width={60} height={14} />
                            <Skeleton width={80} height={32} borderRadius={8} />
                        </div>
                    </div>
                    <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                        <Skeleton width={120} height={24} />
                        <Skeleton width={100} height={28} />
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default TransactionSkeleton;
