import React from 'react';

export const PartyCollectionsTab: React.FC = () => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">💰</span>
                </div>
                <div>
                    <h3 className="text-lg font-medium text-gray-900">No Collections Found</h3>
                    <p className="text-gray-500 mt-1">Collection history will appear here.</p>
                </div>
            </div>
        </div>
    );
};
