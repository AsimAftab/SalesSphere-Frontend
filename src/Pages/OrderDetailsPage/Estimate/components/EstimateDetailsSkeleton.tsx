import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const EstimateDetailsSkeleton: React.FC = () => {
    return (
        <div className="w-full bg-white md:rounded-xl md:shadow-xl p-6 md:p-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between md:items-start pb-4 border-b border-gray-200">
                <div>
                    {/* Estimate Number */}
                    <Skeleton width={200} height={36} className="mb-3" />
                    {/* Status Badge */}
                    <Skeleton width={100} height={28} borderRadius={9999} />
                </div>
                <div className="flex flex-col md:flex-row items-center gap-3 mt-4 md:mt-0">
                    {/* Action Buttons */}
                    <Skeleton width={160} height={40} borderRadius={6} />
                    <Skeleton width={160} height={40} borderRadius={6} />
                </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 my-8">
                {/* Organization Details */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                    <div className="flex items-center gap-3 mb-4">
                        <Skeleton circle width={24} height={24} />
                        <Skeleton width={180} height={20} />
                    </div>
                    <div className="space-y-4">
                        {Array(4).fill(0).map((_, i) => (
                            <div key={i} className="flex justify-between">
                                <Skeleton width={60} height={16} />
                                <Skeleton width={120} height={16} />
                            </div>
                        ))}
                    </div>
                </div>
                {/* Party Details */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                    <div className="flex items-center gap-3 mb-4">
                        <Skeleton circle width={24} height={24} />
                        <Skeleton width={140} height={20} />
                    </div>
                    <div className="space-y-4">
                        {Array(4).fill(0).map((_, i) => (
                            <div key={i} className="flex justify-between">
                                <Skeleton width={60} height={16} />
                                <Skeleton width={120} height={16} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Items Table */}
            <div className="my-8">
                <div className="rounded-lg border border-gray-200 overflow-hidden">
                    {/* Table Header */}
                    <Skeleton width="100%" height={48} borderRadius={0} />
                    {/* Table Rows */}
                    {Array(4).fill(0).map((_, i) => (
                        <div key={i} className="px-4 py-4 border-b border-gray-100 flex justify-between gap-4">
                            <Skeleton width={30} height={20} />
                            <Skeleton width={200} height={20} className="flex-1" />
                            <Skeleton width={50} height={20} />
                            <Skeleton width={80} height={20} />
                            <Skeleton width={80} height={20} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Pricing & Creation Footer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {/* Column 1: Creation Details */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                    <div className="flex items-center gap-3 mb-4">
                        <Skeleton circle width={24} height={24} />
                        <Skeleton width={140} height={20} />
                    </div>
                    <div className="space-y-2">
                        <Skeleton width="80%" height={16} />
                        <Skeleton width="60%" height={16} />
                    </div>
                </div>

                {/* Column 3: Summary Pricing */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                    <div className="flex items-center gap-3 mb-4">
                        <Skeleton circle width={24} height={24} />
                        <Skeleton width={100} height={20} />
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between"><Skeleton width={60} height={16} /> <Skeleton width={80} height={16} /></div>
                        <div className="flex justify-between"><Skeleton width={80} height={16} /> <Skeleton width={80} height={16} /></div>
                        <div className="flex justify-between pt-4 border-t"><Skeleton width={60} height={24} /> <Skeleton width={100} height={24} /></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EstimateDetailsSkeleton;
