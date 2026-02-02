import { useState, createElement } from 'react';
import toast from 'react-hot-toast';
import { generatePdfBlob } from '@/utils/pdfUtils';

// Define Interface locally
interface Estimate {
    id: string;
    _id: string;
    estimateNumber: string;
    partyName: string;
    totalAmount: number;
    dateTime: string;
    createdBy: { name: string };
}

export const useEstimateExport = (estimates: Estimate[]) => {
    const [isExporting, setIsExporting] = useState(false);

    const handleExportPdf = async () => {
        if (!estimates || estimates.length === 0) {
            toast.error("No estimates found to export");
            return;
        }

        const toastId = toast.loading("Preparing PDF view...");
        setIsExporting(true);

        try {
            // Lazy load PDF component to avoid Vite crash
            const { default: EstimateListPDF } = await import('./components/EstimateListPDF');

            // Use createElement instead of JSX to avoid Vite parsing issues
            const pdfElement = createElement(EstimateListPDF, { estimates });
            const blob = await generatePdfBlob(pdfElement);
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
