import type { EmployeeOdometerDetails } from '@/api/odometerService';
import toast from "react-hot-toast";

// Service handles PDF (via react-pdf/OdometerDetailsPDF)
export const OdometerDetailsExportService = {

    // --- PDF EXPORT ---
    async toPdf(details: EmployeeOdometerDetails) {
        if (!details) return toast.error("No data to export");
        const toastId = toast.loading("Preparing PDF...");

        try {
            const { pdf } = await import('@react-pdf/renderer');
            // Import the PDF Layout Component
            const OdometerDetailsPDF = (await import('./OdometerDetailsPDF')).default;

            const blob = await pdf(<OdometerDetailsPDF data={details} />).toBlob();
            const url = URL.createObjectURL(blob);

            window.open(url, '_blank');
            toast.success("PDF exported successfully", { id: toastId });

            setTimeout(() => URL.revokeObjectURL(url), 100);
        } catch (err) {
            console.error("PDF Export Error:", err);
            toast.error("PDF export failed", { id: toastId });
        }
    }
};
