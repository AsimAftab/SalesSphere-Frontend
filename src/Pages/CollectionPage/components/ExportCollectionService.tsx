import type { Collection } from '../../../api/collectionService';
import toast from 'react-hot-toast';
import CollectionPDFReport from '../CollectionPDFReport';

/**
 * Export service for Collections
 * Uses lazy loading for ExcelJS and file-saver to optimize bundle size.
 */
export const CollectionExportService = {
    /**
     * Export Collections to PDF with lazy loading
     */
    async toPdf(collections: Collection[]): Promise<void> {
        if (collections.length === 0) {
            toast.error('No collection data available to export');
            return;
        }

        const toastId = toast.loading('Generating PDF report...');

        try {
            // Dynamic import for optimization
            const { pdf } = await import('@react-pdf/renderer');
            const blob = await pdf(<CollectionPDFReport collections={collections} />).toBlob();
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');

            toast.success('PDF report generated successfully!', { id: toastId });
            setTimeout(() => URL.revokeObjectURL(url), 100);
        } catch (err) {
            console.error('PDF Export Error:', err);
            toast.error('Failed to generate PDF report', { id: toastId });
        }
    },

    /**
     * Export Collections to Excel with all payment mode details and images.
     * Uses lazy loading for ExcelJS and file-saver.
     */
    async toExcel(collections: Collection[]): Promise<void> {
        if (collections.length === 0) {
            toast.error('No collection data available to export');
            return;
        }

        const toastId = toast.loading('Generating Excel report...');

        try {
            // Dynamic imports for optimization
            const ExcelJS = (await import('exceljs')).default;
            const { saveAs } = await import('file-saver');

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Collections');

            // Calculate max images across all collections
            const maxImages = collections.reduce((max, c) =>
                Math.max(max, (c.images?.length || 0)), 0);

            // Define columns - image columns are dynamic based on data
            const columns: { header: string; key: string; width: number }[] = [
                { header: 'S.No', key: 'sno', width: 8 },
                { header: 'Party Name', key: 'partyName', width: 22 },
                { header: 'Amount Received', key: 'paidAmount', width: 18 },
                { header: 'Payment Mode', key: 'paymentMode', width: 16 },
                { header: 'Received Date', key: 'receivedDate', width: 14 },
                { header: 'Bank Name', key: 'bankName', width: 18 },
                { header: 'Cheque Number', key: 'chequeNumber', width: 16 },
                { header: 'Cheque Date', key: 'chequeDate', width: 14 },
                { header: 'Cheque Status', key: 'chequeStatus', width: 14 },
                { header: 'Notes', key: 'notes', width: 30 },
                { header: 'Created By', key: 'createdBy', width: 18 },
            ];

            for (let i = 0; i < maxImages; i++) {
                columns.push({ header: `Image URL ${i + 1}`, key: `img_${i}`, width: 25 });
            }

            worksheet.columns = columns;

            // Style header row
            const headerRow = worksheet.getRow(1);
            headerRow.height = 30;
            headerRow.eachCell((cell) => {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FF197ADC' } // Secondary Blue
                };
                cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
                cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
                cell.border = {
                    top: { style: 'thin', color: { argb: 'FFFFFFFF' } },
                    left: { style: 'thin', color: { argb: 'FFFFFFFF' } },
                    bottom: { style: 'thin', color: { argb: 'FFFFFFFF' } },
                    right: { style: 'thin', color: { argb: 'FFFFFFFF' } }
                };
            });

            // Add data rows
            collections.forEach((collection, index) => {
                const images = collection.images || [];
                const isCheque = collection.paymentMode === 'Cheque';

                const rowData: Record<string, string | number | { text: string; hyperlink: string; tooltip: string }> = {
                    sno: index + 1,
                    partyName: collection.partyName,
                    paidAmount: collection.paidAmount,
                    paymentMode: collection.paymentMode,
                    receivedDate: collection.receivedDate || '-',
                    bankName: collection.bankName || '-',
                    chequeNumber: isCheque ? (collection.chequeNumber || '-') : '-',
                    chequeDate: isCheque ? (collection.chequeDate || '-') : '-',
                    chequeStatus: isCheque ? (collection.chequeStatus || '-') : '-',
                    notes: collection.notes || '-',
                    createdBy: collection.createdBy?.name || 'Unknown',
                };

                // Map images as hyperlinks dynamically
                images.forEach((imgUrl, imgIdx) => {
                    if (imgUrl) {
                        rowData[`img_${imgIdx}`] = {
                            text: 'View Image',
                            hyperlink: imgUrl,
                            tooltip: 'Click to open'
                        };
                    }
                });

                const row = worksheet.addRow(rowData);
                row.height = 25;

                // Format amount as currency
                const amountCell = row.getCell('paidAmount');
                amountCell.numFmt = '"RS" #,##0';

                // Style image hyperlink cells
                for (let i = 0; i < maxImages; i++) {
                    const cell = row.getCell(`img_${i}`);
                    if (cell.value && typeof cell.value === 'object') {
                        cell.font = { color: { argb: 'FF0000FF' }, underline: true };
                    }
                }

                // Apply borders and alignment to all cells
                row.eachCell((cell, colNumber) => {
                    cell.border = {
                        top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
                        left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
                        bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
                        right: { style: 'thin', color: { argb: 'FFE5E7EB' } }
                    };

                    // Center alignment for S.No (1), Cheque Status (9)
                    if ([1, 9].includes(colNumber)) {
                        cell.alignment = { vertical: 'middle', horizontal: 'center' };
                    } else if (colNumber === 3) { // Amount
                        cell.alignment = { vertical: 'middle', horizontal: 'right' };
                    } else {
                        cell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
                    }
                });
            });

            // Generate and save file
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
            saveAs(blob, `Collections_Report_${new Date().toISOString().split('T')[0]}.xlsx`);

            toast.success('Excel report exported successfully!', { id: toastId });
        } catch (err) {
            toast.error('Failed to generate Excel report', { id: toastId });
        }
    }
};
