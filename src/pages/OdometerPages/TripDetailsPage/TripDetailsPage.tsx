import React from 'react';
import Sidebar from '@/components/layout/Sidebar/Sidebar';
import TripDetailsContent from './TripDetailsContent';
import { ErrorBoundary } from '@/components/ui';

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
