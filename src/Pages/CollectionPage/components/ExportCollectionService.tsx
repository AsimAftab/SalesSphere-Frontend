import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import type { Collection } from '../../../api/collectionService';
import { pdf } from '@react-pdf/renderer';
import CollectionPDFReport from '../CollectionPDFReport';

/**
 * Export service for Collections
 * Handles PDF and Excel export functionality
 */
export const CollectionExportService = {
    /**
     * Export Collections to PDF
     */
    async toPdf(collections: Collection[]): Promise<void> {
        const blob = await pdf(<CollectionPDFReport collections={collections} />).toBlob();
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
    },

    /**
     * Export Collections to Excel
     */
    async toExcel(collections: Collection[]): Promise<void> {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Collections');

        // Define columns
        worksheet.columns = [
            { header: 'S.No', key: 'sno', width: 8 },
            { header: 'Party Name', key: 'partyName', width: 20 }, // Reduced width
            { header: 'Amount Received', key: 'paidAmount', width: 18 },
            { header: 'Payment Mode', key: 'paymentMode', width: 18 },
            { header: 'Received Date', key: 'receivedDate', width: 15 },
            { header: 'Created By', key: 'createdBy', width: 20 },
        ];

        // Style header row (Reference: ExportExpenseService.tsx)
        const headerRow = worksheet.getRow(1);
        headerRow.height = 30;
        headerRow.eachCell((cell) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF197ADC' } // Secondary Blue
            };
            cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };

            // White borders for header
            cell.border = {
                top: { style: 'thin', color: { argb: 'FFFFFFFF' } },
                left: { style: 'thin', color: { argb: 'FFFFFFFF' } },
                bottom: { style: 'thin', color: { argb: 'FFFFFFFF' } },
                right: { style: 'thin', color: { argb: 'FFFFFFFF' } }
            };
        });

        // Add data rows
        collections.forEach((collection, index) => {
            const row = worksheet.addRow({
                sno: index + 1,
                partyName: collection.partyName,
                paidAmount: collection.paidAmount,
                paymentMode: collection.paymentMode,
                receivedDate: new Date(collection.receivedDate).toISOString().split('T')[0], // YYYY-MM-DD
                createdBy: collection.createdBy.name,
            });

            // Set height for data rows
            row.height = 25;

            // Format amount as currency
            const amountCell = row.getCell('paidAmount');
            amountCell.numFmt = '"RS" #,##0'; // Matches RS prefix and integer format
            amountCell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 }; // Changed to Left

            // Alternate row colors (Optional, Expenses doesn't assume this in the loop but uses standard borders)
            // Keeping existing zebra striping as it's nice, but Expenses ExportService doesn't explicitly have it in the snippet provided?
            // Wait, Expenses ExportService snippet DOES NOT show zebra striping logic. It matches PDF which has it.
            // I will keep it but rely on the iteration.

            // Apply borders and alignment to all cells in this row
            row.eachCell((cell, colNumber) => {
                cell.border = {
                    top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
                    left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
                    bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
                    right: { style: 'thin', color: { argb: 'FFE5E7EB' } }
                };

                // Alignment Logic
                // Center: S.No (1), Received Date (6 - Adjusted for removed columns?)
                // Wait, columns are: 1:S.No, 2:ColNum, 3:Party, 4:Amount, 5:Mode, 6:Date, 7:CreatedBy.
                // Center S.No (1) and Date (6).
                if ([1, 6].includes(colNumber)) {
                    cell.alignment = { vertical: 'middle', horizontal: 'center' };
                } else if (colNumber === 4) { // Amount
                    cell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 }; // Left aligned
                } else {
                    // Default Left
                    cell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
                }
            });
        });

        // Add empty row
        worksheet.addRow([]);

        // Add summary row
        const summaryRow = worksheet.addRow({
            sno: '',
            partyName: 'Total Collections:',
            paidAmount: collections.reduce((sum, c) => sum + c.paidAmount, 0),
            paymentMode: '',
            receivedDate: '',
            createdBy: '',
        });

        summaryRow.font = { bold: true };
        summaryRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFDBEAFE' }
        };

        // Align 'Total Collections:' label to right
        summaryRow.getCell('partyName').alignment = { vertical: 'middle', horizontal: 'right', indent: 1 };

        const totalAmountCell = summaryRow.getCell('paidAmount');
        totalAmountCell.numFmt = '"RS" #,##0';
        totalAmountCell.font = { bold: true, size: 12 };
        totalAmountCell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };

        // Generate and save file
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        saveAs(blob, `Collections_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
    }
};
