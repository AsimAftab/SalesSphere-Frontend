import React from "react";
import { type TripOdometerDetails } from "@/api/odometerService";
import toast from "react-hot-toast";
import { generatePdfBlob } from "@/utils/pdfUtils";

export const ExportTripService = {
    async exportToPdf(_trip: TripOdometerDetails, PDFComponent: React.ReactElement) {
        const toastId = toast.loading("Generating PDF...");
        try {
            const blob = await generatePdfBlob(PDFComponent);
            const url = URL.createObjectURL(blob);

            // Open in new tab
            window.open(url, "_blank");

            toast.success("PDF Generated!", { id: toastId });

            // Clean up
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        } catch (err) {
            console.error("PDF Export Error:", err);
            toast.error("PDF generation failed", { id: toastId });
        }
    }
};
