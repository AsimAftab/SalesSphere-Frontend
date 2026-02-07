import React from 'react';
import Sidebar from '@/components/layout/Sidebar/Sidebar';
import OdometerDetailsContent from './OdometerDetailsContent';
import { ErrorBoundary } from '@/components/ui';

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
