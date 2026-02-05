import React from "react";
import { type TripOdometerDetails } from "@/api/odometerService";
import { ExportService } from '@/services/export';

/**
 * Trip Export Service
 *
 * Uses the generic ExportService for standardized PDF exports.
 */
export const TripExportService = {
    async toPdf(_trip: TripOdometerDetails, PDFComponent: React.ReactElement) {
        await ExportService.toPdf({
            component: PDFComponent,
            filename: 'Trip_Details',
            openInNewTab: true,
        });
    }
};
