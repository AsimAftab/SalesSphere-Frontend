import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const HierarchySkeleton: React.FC = () => (
    <div className="flex flex-col items-center space-y-6 p-10">
        <div className="flex flex-col items-center">
            <Skeleton width={240} height={60} borderRadius={8} />
            <div className="w-0.5 h-8 bg-gray-200 mt-2"></div>
            <div className="flex gap-8 mt-2">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex flex-col items-center">
                        <div className="w-0.5 h-4 bg-gray-200"></div>
                        <Skeleton width={200} height={56} borderRadius={8} />
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export default HierarchySkeleton;
