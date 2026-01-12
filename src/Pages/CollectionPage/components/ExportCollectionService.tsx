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
        saveAs(blob, `collections-${new Date().toISOString().split('T')[0]}.pdf`);
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
            { header: 'Collection Number', key: 'collectionNumber', width: 18 },
            { header: 'Party Name', key: 'partyName', width: 25 },
            { header: 'Amount Received', key: 'paidAmount', width: 15 },
            { header: 'Payment Mode', key: 'paymentMode', width: 18 },
            { header: 'Cheque Status', key: 'chequeStatus', width: 15 },
            { header: 'Cheque Number', key: 'chequeNumber', width: 18 },
            { header: 'Transaction ID', key: 'transactionId', width: 20 },
            { header: 'Received Date', key: 'receivedDate', width: 15 },
            { header: 'Created By', key: 'createdBy', width: 20 },
            { header: 'Notes', key: 'notes', width: 30 },
        ];

        // Style header row
        const headerRow = worksheet.getRow(1);
        headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF163355' }
        };
        headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
        headerRow.height = 25;

        // Add data rows
        collections.forEach((collection, index) => {
            const row = worksheet.addRow({
                sno: index + 1,
                collectionNumber: collection.collectionNumber || '-',
                partyName: collection.partyName,
                paidAmount: collection.paidAmount,
                paymentMode: collection.paymentMode,
                chequeStatus: collection.paymentMode === 'Cheque' ? (collection.chequeStatus || '-') : '-',
                chequeNumber: collection.chequeNumber || '-',
                transactionId: collection.transactionId || '-',
                receivedDate: new Date(collection.receivedDate).toLocaleDateString('en-GB'),
                createdBy: collection.createdBy.name,
                notes: collection.notes || '-',
            });

            // Format amount as currency
            const amountCell = row.getCell('paidAmount');
            amountCell.numFmt = '₹ #,##0.00';
            amountCell.alignment = { horizontal: 'right' };

            // Alternate row colors
            if (index % 2 === 0) {
                row.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFF9FAFB' }
                };
            }
        });

        // Add borders to all cells
        worksheet.eachRow((row) => {
            row.eachCell((cell: any) => {
                cell.border = {
                    top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
                    left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
                    bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
                    right: { style: 'thin', color: { argb: 'FFE5E7EB' } }
                };
            });
        });

        // Add summary row
        const summaryRow = worksheet.addRow({
            sno: '',
            collectionNumber: '',
            partyName: 'Total Collections:',
            paidAmount: collections.reduce((sum, c) => sum + c.paidAmount, 0),
            paymentMode: '',
            chequeStatus: '',
            chequeNumber: '',
            transactionId: '',
            receivedDate: '',
            createdBy: '',
            notes: '',
        });

        summaryRow.font = { bold: true };
        summaryRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFDBEAFE' }
        };

        const totalAmountCell = summaryRow.getCell('paidAmount');
        totalAmountCell.numFmt = '₹ #,##0.00';
        totalAmountCell.font = { bold: true, size: 12 };

        // Generate and save file
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        saveAs(blob, `collections-${new Date().toISOString().split('T')[0]}.xlsx`);
    }
};
