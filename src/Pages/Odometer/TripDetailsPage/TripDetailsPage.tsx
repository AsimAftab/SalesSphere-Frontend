import React from 'react';
import Sidebar from '../../../components/layout/Sidebar/Sidebar';
import ErrorBoundary from '../../../components/ui/ErrorBoundary/ErrorBoundary';
import TripDetailsContent from './TripDetailsContent';

const TripDetailsPage: React.FC = () => {
    return (
        <Sidebar>
            <ErrorBoundary>
                <TripDetailsContent />
            </ErrorBoundary>
        </Sidebar>
    );
};

export default TripDetailsPage;
