import React from 'react';
import useOrderManager from './hooks/useOrderManager';
import OrderListContent from './OrderListContent';
import { useAuth } from '@/api/authService';

const OrdersTab: React.FC = () => {
    const { state, actions } = useOrderManager();
    const { hasPermission, user } = useAuth();

    // Derive permissions for child components
    const permissions = {
        canCreate: hasPermission('invoices', 'create'),
        canUpdateStatus: hasPermission('invoices', 'updateStatus'),
        canExportPdf: hasPermission('invoices', 'exportPdf'),
    };

    return <OrderListContent
        state={state}
        actions={actions}
        permissions={permissions}
        currentUserId={user?.id || user?._id}
        currentUserRole={user?.role}
    />;
};

export default OrdersTab;
