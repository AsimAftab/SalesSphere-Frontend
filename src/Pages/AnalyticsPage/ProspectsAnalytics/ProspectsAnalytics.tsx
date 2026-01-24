import React from 'react';
import ProspectStats from './components/ProspectStats';

const ProspectsAnalytics: React.FC = () => {
    return (
        <div className="h-full w-full">
            <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Prospects Analytics</h2>
                <p className="text-sm text-gray-500 mt-1">
                    Track prospect acquisition metrics and category distribution.
                </p>
            </div>
            <ProspectStats />
        </div>
    );
};

export default ProspectsAnalytics;

