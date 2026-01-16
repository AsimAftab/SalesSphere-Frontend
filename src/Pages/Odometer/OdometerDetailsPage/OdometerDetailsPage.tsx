import React from 'react';
import Sidebar from '../../../components/layout/Sidebar/Sidebar';
import ErrorBoundary from '../../../components/UI/ErrorBoundary/ErrorBoundary';
import OdometerDetailsContent from './OdometerDetailsContent';

const OdometerDetailsPage: React.FC = () => {
    return (
        <Sidebar>
            <ErrorBoundary>
                <OdometerDetailsContent />
            </ErrorBoundary>
        </Sidebar>
    );
};

export default OdometerDetailsPage;
