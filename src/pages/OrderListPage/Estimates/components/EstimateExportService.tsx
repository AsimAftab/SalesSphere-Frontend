import { createElement } from 'react';
import { ExportService } from '@/services/export';

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

/**
 * Estimate Export Service
 *
 * Uses the generic ExportService for standardized PDF exports.
 */
export const EstimateExportService = {
    async toPdf(estimates: Estimate[]) {
        // Lazy load PDF component to avoid Vite crash
        const { default: EstimateListPDF } = await import('./EstimateListPDF');

        // Use createElement instead of JSX to avoid Vite parsing issues
        const pdfElement = createElement(EstimateListPDF, { estimates });

        await ExportService.toPdf({
            component: pdfElement,
            filename: 'Estimates_Report',
            openInNewTab: true,
        });
    },
};
