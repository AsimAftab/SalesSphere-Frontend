import type { OdometerStat } from '@/api/odometerService';
import { formatDisplayDate } from '@/utils/dateUtils';
import toast from "react-hot-toast";

// Service handles both Excel (via exceljs) and PDF (via react-pdf/OdometerListPDF)
export const OdometerExportService = {

    // --- EXCEL EXPORT ---
    async toExcel(data: OdometerStat[]) {
        if (!data || data.length === 0) {
            toast.error("No odometer data available to export");
            return;
        }
        const toastId = toast.loading("Generating Excel report...");

        try {
            const ExcelJS = (await import('exceljs')).default;
            const { saveAs } = await import('file-saver');

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Odometer Records');

            // Define Columns
            worksheet.columns = [
                { header: 'S.No', key: 'sno', width: 8 },
                { header: 'Employee', key: 'employee', width: 25 },
                { header: 'Role', key: 'role', width: 20 },
                { header: 'Date Range', key: 'dateRange', width: 35 },
                { header: 'Total Distance', key: 'distance', width: 20 },
            ];

            // Map Data
            data.forEach((item, index) => {
                const dateRangeStr = `${formatDisplayDate(item.dateRange.start)} - ${formatDisplayDate(item.dateRange.end)}`;

                worksheet.addRow({
                    sno: index + 1,
                    employee: item.employee?.name || "N/A",
                    role: item.employee?.role || "Staff",
                    dateRange: dateRangeStr,
                    distance: `${item.totalDistance.toLocaleString()} KM`
                });
            });

            // Styling (Matching MiscWorkExportService branding)
            const headerRow = worksheet.getRow(1);
            headerRow.height = 30;
            headerRow.eachCell((cell) => {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FF197ADC' } // Brand Blue
                };
                cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 };
                cell.alignment = { vertical: 'middle', horizontal: 'center' };
                cell.border = {
                    top: { style: 'thin', color: { argb: 'FFFFFFFF' } },
                    left: { style: 'thin', color: { argb: 'FFFFFFFF' } },
                    bottom: { style: 'thin', color: { argb: 'FFFFFFFF' } },
                    right: { style: 'thin', color: { argb: 'FFFFFFFF' } }
                };
            });

            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber > 1) {
                    row.eachCell((cell) => {
                        cell.border = {
                            top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
                            left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
                            bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
                            right: { style: 'thin', color: { argb: 'FFE5E7EB' } }
                        };
                        cell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
                    });
                }
            });

            const buffer = await workbook.xlsx.writeBuffer();
            saveAs(new Blob([buffer]), `Odometer_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
            toast.success('Excel exported successfully', { id: toastId });
        } catch (err) {
            console.error("Excel Export Error:", err);
            toast.error('Failed to export Excel', { id: toastId });
        }
    },

    // --- PDF EXPORT ---
    async toPdf(data: OdometerStat[]) {
        if (!data || data.length === 0) {
            toast.error("No odometer data available to export");
            return;
        }
        const toastId = toast.loading("Preparing PDF...");

        try {
            const { pdf } = await import('@react-pdf/renderer');
            // Import the PDF Layout Component
            const OdometerListPDF = (await import('../OdometerListPDF')).default;

            const blob = await pdf(<OdometerListPDF data={data} />).toBlob();
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
