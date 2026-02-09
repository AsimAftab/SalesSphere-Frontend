import React from 'react';
import Skeleton from 'react-loading-skeleton';

const TransactionSkeleton: React.FC = () => (
    <div className="w-full max-w-6xl mx-auto space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center gap-4">
            <Skeleton width={40} height={40} borderRadius={12} />
            <div>
                <Skeleton width={200} height={32} />
                <Skeleton width={300} height={16} className="mt-1" />
            </div>
        </div>

        {/* Customer Section Skeleton (Card) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                <Skeleton width={20} height={20} circle />
                <Skeleton width={150} height={20} />
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Skeleton width={100} height={14} />
                    <Skeleton height={46} borderRadius={12} />
                </div>
                <div className="space-y-2">
                    <Skeleton width={120} height={14} />
                    <Skeleton height={46} borderRadius={12} />
                </div>
            </div>
        </div>

        {/* Lines Table Skeleton */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <Skeleton width={120} height={20} />
                <Skeleton width={100} height={32} borderRadius={8} />
            </div>
            <div className="p-0">
                <div className="grid grid-cols-7 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200">
                    {[...Array(7)].map((_, i) => (
                        <Skeleton key={i} height={16} width="80%" />
                    ))}
                </div>
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="grid grid-cols-7 gap-4 px-6 py-4 border-b border-gray-100 items-center">
                        <Skeleton height={20} width={20} />
                        <Skeleton height={20} />
                        <Skeleton height={36} borderRadius={8} />
                        <Skeleton height={36} borderRadius={8} />
                        <Skeleton height={36} borderRadius={8} />
                        <Skeleton height={20} className="text-right" />
                        <div className="flex justify-center"><Skeleton circle width={24} height={24} /></div>
                    </div>
                ))}
            </div>
        </div>

        {/* Summary Skeleton */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row gap-8 items-start justify-between">
            <div className="flex-1 w-full space-y-4">
                <Skeleton width={120} height={16} />
                <Skeleton height={80} borderRadius={12} />
            </div>
            <div className="w-full md:w-80 space-y-4">
                <div className="space-y-3 pb-4 border-b border-gray-100">
                    <div className="flex justify-between"><Skeleton width={80} height={16} /> <Skeleton width={60} height={16} /></div>
                    <div className="flex justify-between"><Skeleton width={100} height={16} /> <Skeleton width={60} height={16} /></div>
                </div>
                <div className="flex justify-between items-end">
                    <Skeleton width={100} height={24} />
                    <Skeleton width={120} height={32} />
                </div>
                <div className="pt-4 gap-3 flex flex-col">
                    <Skeleton height={50} borderRadius={12} />
                    <Skeleton height={50} borderRadius={12} />
                </div>
            </div>
        </div>
    </div>
);

export default TransactionSkeleton;
