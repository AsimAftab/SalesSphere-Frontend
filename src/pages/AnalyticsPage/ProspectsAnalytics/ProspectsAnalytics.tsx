import React from 'react';
import { useProspectViewState } from './components/useProspectViewState';
import ProspectsContent from './ProspectsContent';
import { ErrorBoundary } from '@/components/ui';

const ProspectsAnalytics: React.FC = () => {
    const { state, actions } = useProspectViewState();

    return (
        <ErrorBoundary>
            <ProspectsContent state={state} actions={actions} />
        </ErrorBoundary>
    );
};

export default ProspectsAnalytics;

