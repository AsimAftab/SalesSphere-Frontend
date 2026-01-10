import React from 'react';
import Sidebar from '../../../components/layout/Sidebar/Sidebar';
import { useEstimateDetails } from './useEstimateDetails';
import EstimateDetailsContent from './EstimateDetailsContent';

import ErrorBoundary from '../../../components/UI/ErrorBoundary/ErrorBoundary';

const EstimateDetailsPage: React.FC = () => {
    const { state, actions } = useEstimateDetails();

    return (
        <Sidebar>
            <ErrorBoundary>
                <EstimateDetailsContent state={state} actions={actions} />
            </ErrorBoundary>
        </Sidebar>
    );
};

export default EstimateDetailsPage;
