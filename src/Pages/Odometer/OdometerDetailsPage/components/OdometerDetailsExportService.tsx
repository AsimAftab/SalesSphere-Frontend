import type { EmployeeOdometerDetails } from '../../../../api/odometerService';
import toast from "react-hot-toast";

// Service handles both Excel (via exceljs) and PDF (via react-pdf/OdometerDetailsPDF)
export const OdometerDetailsExportService = {

    // --- EXCEL EXPORT ---
    async toExcel(details: EmployeeOdometerDetails) {
        if (!details || !details.dailyRecords) return toast.error("No data to export");
        const toastId = toast.loading("Generating Excel report...");

        try {
            const ExcelJS = (await import('exceljs')).default;
            const { saveAs } = await import('file-saver');

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Odometer Details');

            // Define Columns
            worksheet.columns = [
                { header: 'S.No', key: 'sno', width: 8 },
                { header: 'Date', key: 'date', width: 20 },
                { header: 'Total Distance', key: 'distance', width: 20 },
                { header: 'Total Trips', key: 'trips', width: 15 },
            ];

            // Add Header Info Row
            worksheet.spliceRows(1, 0, [`Employee: ${details.employee.name} (${details.employee.role})`]);
            worksheet.mergeCells('A1:D1');

            // Map Data
            details.dailyRecords.forEach((item, index) => {
                const date = new Date(item.date);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const dateStr = `${year}-${month}-${day}`;

                worksheet.addRow({
                    sno: index + 1,
                    date: dateStr,
                    distance: `${item.totalKm} KM`,
                    trips: item.tripCount
                });
            });

            // Styling
            const titleRow = worksheet.getRow(1);
            titleRow.font = { bold: true, size: 14, color: { argb: 'FF197ADC' } };
            titleRow.alignment = { horizontal: 'center' };

            const headerRow = worksheet.getRow(2); // The column headers are pushed down
            headerRow.height = 30;
            headerRow.eachCell((cell) => {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FF197ADC' }
                };
                cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 };
                cell.alignment = { vertical: 'middle', horizontal: 'center' };
            });

            const buffer = await workbook.xlsx.writeBuffer();
            const safeName = details.employee.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            saveAs(new Blob([buffer]), `Odometer_Details_${safeName}_${new Date().toISOString().split('T')[0]}.xlsx`);
            toast.success('Excel exported successfully', { id: toastId });
        } catch (err) {
            console.error("Excel Export Error:", err);
            toast.error('Failed to export Excel', { id: toastId });
        }
    },

    // --- PDF EXPORT ---
    async toPdf(details: EmployeeOdometerDetails) {
        if (!details) return toast.error("No data to export");
        const toastId = toast.loading("Preparing PDF...");

        try {
            const { pdf } = await import('@react-pdf/renderer');
            // Import the PDF Layout Component
            const OdometerDetailsPDF = (await import('./OdometerDetailsPDF')).default;

            const blob = await pdf(<OdometerDetailsPDF data={ details } />).toBlob();
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
