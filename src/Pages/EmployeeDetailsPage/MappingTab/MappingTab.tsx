import React from 'react';
import { useMappingLogic } from './useMappingLogic';

const MappingTab: React.FC = () => {
    const { } = useMappingLogic();

    return (
        <div className="h-full overflow-y-auto py-6">
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-lg shadow-sm border border-gray-100 h-96">
                <div className="p-4 bg-indigo-50 rounded-full mb-4">
                    <svg className="w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Route Mapping</h3>
                <p className="text-gray-500 text-center max-w-sm">
                    Route visualization and location data will be available here.
                </p>
            </div>
        </div>
    );
};

export default MappingTab;
