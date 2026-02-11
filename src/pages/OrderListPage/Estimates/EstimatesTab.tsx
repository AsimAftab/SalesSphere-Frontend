import React from 'react';
import useEstimateManager from './hooks/useEstimateManager';
import EstimateListContent from './EstimateListContent';
import { useAuth } from '@/api/authService';

const EstimatesTab: React.FC = () => {
    const { state, actions } = useEstimateManager();
    const { hasPermission } = useAuth();

    // Derive permissions for child components
    const permissions = {
        canCreate: hasPermission('estimates', 'create'),
        canDelete: hasPermission('estimates', 'delete'),
        canBulkDelete: hasPermission('estimates', 'bulkDelete'),
        canExportPdf: hasPermission('estimates', 'exportPdf'),
    };

    return <EstimateListContent state={state} actions={actions} permissions={permissions} />;
};

export default EstimatesTab;