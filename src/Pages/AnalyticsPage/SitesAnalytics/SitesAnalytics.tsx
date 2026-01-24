import React from 'react';
import SiteStats from './components/SiteStats';

const SitesAnalytics: React.FC = () => {
    return (
        <div className="h-full w-full">
            <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Sites Analytics</h2>
                <p className="text-sm text-gray-500 mt-1">
                    Monitor site registrations, category breakdown, and brand distribution.
                </p>
            </div>
            <SiteStats />
        </div>
    );
};

export default SitesAnalytics;

