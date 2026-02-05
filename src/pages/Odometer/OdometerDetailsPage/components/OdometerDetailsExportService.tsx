import type { EmployeeOdometerDetails } from '@/api/odometerService';
import toast from "react-hot-toast";
import { ExportService } from '@/services/export';

/**
 * Odometer Details Export Service
 *
 * Uses the generic ExportService for standardized PDF exports.
 */
export const OdometerDetailsExportService = {
    async toPdf(details: EmployeeOdometerDetails) {
        if (!details) {
            toast.error("No data to export");
            return;
        }

        const OdometerDetailsPDF = (await import('./OdometerDetailsPDF')).default;

        await ExportService.toPdf({
            component: <OdometerDetailsPDF data={details} />,
            filename: 'Odometer_Details',
            openInNewTab: true,
        });
    }
};
