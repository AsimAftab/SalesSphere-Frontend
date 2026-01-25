import React from 'react';
import SitesContent from './SitesContent';

const SitesAnalytics: React.FC = () => {
    return (
        <div className="h-full w-full">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Sites Analytics</h2>
                <p className="text-sm text-gray-500 mt-1">
                    Monitor site registrations, category breakdown, and brand distribution.
                </p>
            </div>
            <SitesContent />
        </div>
    );
};

export default SitesAnalytics;

