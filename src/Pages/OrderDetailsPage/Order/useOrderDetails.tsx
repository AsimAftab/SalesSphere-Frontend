
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getOrderById, type InvoiceData } from '../../../api/orderService';
import toast from 'react-hot-toast';
import { useAuth } from '../../../api/authService';

export const useOrderDetails = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();
    const [isPrinting, setIsPrinting] = useState(false);
    const { hasPermission } = useAuth();

    const canExportPdf = hasPermission('invoices', 'exportPdf');

    const {
        data: invoiceData,
        isLoading,
        error
    } = useQuery<InvoiceData | null, Error>({
        queryKey: ['orders', orderId],
        queryFn: () => getOrderById(orderId!),
        enabled: !!orderId,
    });

    const handleExportPdf = async () => {
        if (!invoiceData) return;
        setIsPrinting(true);
        try {
            const { pdf } = await import('@react-pdf/renderer');
            // Import from local components folder
            const InvoiceDetailPDF = (await import('./components/InvoiceDetailPDF')).default;

            const doc = <InvoiceDetailPDF invoice={invoiceData} />;
            const blob = await pdf(doc).toBlob();

            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.target = '_blank';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setTimeout(() => URL.revokeObjectURL(url), 1000);
            toast.success("PDF generated successfully");

        } catch (error) {
            console.error("Failed to generate PDF", error);
            toast.error("Failed to generate PDF");
        } finally {
            setIsPrinting(false);
        }
    }

    const handleGoBack = () => {
        navigate('/order-lists?tab=orders');
    };

    return {
        state: {
            invoiceData,
            isLoading,
            error,
            isPrinting,
            orderId,
            permissions: {
                canExportPdf
            }
        },
        actions: {
            onExportPdf: handleExportPdf,
            onGoBack: handleGoBack
        }
    };
};
