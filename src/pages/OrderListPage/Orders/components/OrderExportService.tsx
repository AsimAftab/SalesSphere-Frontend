import { createElement } from 'react';
import type { Order } from '@/api/orderService';
import { ExportService } from '@/services/export';

/**
 * Order Export Service
 *
 * Uses the generic ExportService for standardized PDF exports.
 */
export const OrderExportService = {
    async toPdf(orders: Order[]) {
        // Lazy load PDF component to avoid Vite crash
        const { default: OrderListPDF } = await import('./OrderListPDF');

        // Use createElement instead of JSX to avoid Vite parsing issues
        const pdfElement = createElement(OrderListPDF, { orders });

        await ExportService.toPdf({
            component: pdfElement,
            filename: 'Orders_Report',
            openInNewTab: true,
        });
    },
};
