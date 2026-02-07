import React from 'react';
import Sidebar from '@/components/layout/Sidebar/Sidebar';
import OdometerRecordsContent from './OdometerRecordsContent';
import { ErrorBoundary } from '@/components/ui';

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
