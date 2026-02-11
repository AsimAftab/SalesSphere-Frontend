import React from 'react';
import Sidebar from '@/components/layout/Sidebar/Sidebar';
import { useOrderDetails } from './hooks/useOrderDetails';
import OrderDetailsContent from './OrderDetailsContent';
import { ErrorBoundary } from '@/components/ui';


const OrderDetailsPage: React.FC = () => {
    const { state, actions } = useOrderDetails();

    return (
        <Sidebar>
            <ErrorBoundary>
                <OrderDetailsContent state={state} actions={actions} />
            </ErrorBoundary>
        </Sidebar>
    );
};

export default OrderDetailsPage;
