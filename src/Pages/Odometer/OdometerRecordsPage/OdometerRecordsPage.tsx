import React from 'react';
import Sidebar from '../../../components/layout/Sidebar/Sidebar';
import ErrorBoundary from '../../../components/ui/ErrorBoundary/ErrorBoundary';
import OdometerRecordsContent from './OdometerRecordsContent';

const OdometerRecordsPage: React.FC = () => {
    return (
        <Sidebar>
            <ErrorBoundary>
                <OdometerRecordsContent />
            </ErrorBoundary>
        </Sidebar>
    );
};

export default OdometerRecordsPage;
