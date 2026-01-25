import React from 'react';
import ErrorBoundary from '../../../components/UI/ErrorBoundary/ErrorBoundary';
import { useProspectViewState } from './components/useProspectViewState';
import ProspectsContent from './ProspectsContent';

const ProspectsAnalytics: React.FC = () => {
    const { state, actions } = useProspectViewState();

    return (
        <ErrorBoundary>
            <ProspectsContent state={state} actions={actions} />
        </ErrorBoundary>
    );
};

export default ProspectsAnalytics;

