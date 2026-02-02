import React from 'react';
import { useCollectionsLogic } from './useCollectionsLogic';

const CollectionsTab: React.FC = () => {
    useCollectionsLogic();

    return (
        <div className="h-full overflow-y-auto py-6">
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-lg shadow-sm border border-gray-100 h-96">
                <div className="p-4 bg-green-50 rounded-full mb-4">
                    <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Collection History</h3>
                <p className="text-gray-500 text-center max-w-sm">
                    No payment collections recorded. Collection details and history will be displayed here.
                </p>
            </div>
        </div>
    );
};

export default CollectionsTab;
