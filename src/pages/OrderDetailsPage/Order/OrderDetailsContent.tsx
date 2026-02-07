import React from 'react';

import InvoicePreview from './components/InvoicePreview';
import { type InvoiceData } from '@/api/orderService';
import OrderDetailsSkeleton from './components/OrderDetailsSkeleton';
import { EmptyState, DetailPageHeader } from '@/components/ui';

interface OrderDetailsContentProps {
    state: {
        invoiceData: InvoiceData | null | undefined;
        isLoading: boolean;
        error: Error | null;
        isPrinting: boolean;
        orderId: string | undefined;
        backButtonText: string;
        permissions: {
            canExportPdf: boolean;
        };
    };
    actions: {
        onExportPdf: () => void;
        onGoBack: () => void;
    };
}

const OrderDetailsContent: React.FC<OrderDetailsContentProps> = ({ state, actions }) => {
    const { invoiceData, isLoading, error, isPrinting, orderId, permissions, backButtonText } = state;
    const { onExportPdf, onGoBack } = actions;

    const renderMainContent = () => {
        if (isLoading) {
            return <OrderDetailsSkeleton />;
        }

        if (error) {
            return <EmptyState title="Error" description={error.message} variant="error" />;
        }

        if (invoiceData) {
            return (
                <InvoicePreview
                    data={invoiceData}
                    onExportPdf={onExportPdf}
                    isPrinting={isPrinting}
                    permissions={permissions}
                />
            );
        }

        if (!orderId) {
            return <EmptyState title="No Order ID" description="No order ID was provided." variant="error" />;
        }

        return null; // Should not happen ideally
    };

    return (
        <div className="space-y-6">
            <DetailPageHeader
                title="Order Details"
                backLabel={backButtonText}
                onBack={onGoBack}
            />
            {renderMainContent()}
        </div>
    );
};

export default OrderDetailsContent;
