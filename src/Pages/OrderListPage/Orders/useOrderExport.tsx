import { useState, createElement } from 'react';
import toast from 'react-hot-toast';
import type { Order } from '../../../api/orderService';

export const useOrderExport = (orders: Order[]) => {
    const [isExporting, setIsExporting] = useState(false);

    const handleExportPdf = async () => {
        if (!orders || orders.length === 0) {
            toast.error("No orders found to export");
            return;
        }

        const toastId = toast.loading("Preparing PDF view...");
        setIsExporting(true);

        try {
            // Lazy load PDF dependencies to avoid Vite crash
            const [{ pdf }, { default: OrderListPDF }] = await Promise.all([
                import('@react-pdf/renderer'),
                import('./components/OrderListPDF')
            ]);

            // Use createElement instead of JSX to avoid Vite parsing issues
            const pdfElement = createElement(OrderListPDF, { orders });
            // Cast to any to satisfy @react-pdf/renderer type requirements
            const blob = await pdf(pdfElement as any).toBlob();
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');
            toast.success("PDF opened in new tab!", { id: toastId });

            // Revoke URL after a delay
            setTimeout(() => URL.revokeObjectURL(url), 100);
        } catch (err) {
            console.error(err);
            toast.error("Failed to open PDF", { id: toastId });
        } finally {
            setIsExporting(false);
        }
    };

    return { handleExportPdf, isExporting };
};
