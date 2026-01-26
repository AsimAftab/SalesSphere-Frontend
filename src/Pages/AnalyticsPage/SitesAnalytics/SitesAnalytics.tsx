import React from 'react';
import SitesContent from './SitesContent';
import ErrorBoundary from '../../../components/UI/ErrorBoundary/ErrorBoundary';

const SitesAnalytics: React.FC = () => {
    return (
        <div className="h-full w-full">
            <ErrorBoundary>
                <SitesContent />
            </ErrorBoundary>
        </div>
    );
};

export default SitesAnalytics;

