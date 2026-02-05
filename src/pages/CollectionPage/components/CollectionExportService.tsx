import type { Collection } from '@/api/collectionService';
import {
    ExportService,
    createHyperlink,
    type ExcelColumn,
    type ExcelCellValue,
} from '@/services/export';

/**
 * Collection Export Service
 *
 * Uses the generic ExportService for standardized Excel/PDF exports.
 */
export const CollectionExportService = {
    async toPdf(collections: Collection[]): Promise<void> {
        const CollectionPDFReport = (await import('../CollectionPDFReport')).default;

        await ExportService.toPdf({
            component: <CollectionPDFReport collections={collections} />,
            filename: 'Collections_Report',
            openInNewTab: true,
        });
    },

    async toExcel(collections: Collection[]): Promise<void> {
        // Calculate max images across all collections
        const maxImages = collections.reduce((max, c) =>
            Math.max(max, (c.images?.length || 0)), 0);

        // Define columns - image columns are dynamic based on data
        const columns: ExcelColumn[] = [
            { header: 'S.No', key: 'sno', width: 8, style: { alignment: { horizontal: 'center' } } },
            { header: 'Party Name', key: 'partyName', width: 22 },
            { header: 'Amount Received', key: 'paidAmount', width: 18 },
            { header: 'Payment Mode', key: 'paymentMode', width: 16 },
            { header: 'Received Date', key: 'receivedDate', width: 14 },
            { header: 'Bank Name', key: 'bankName', width: 18 },
            { header: 'Cheque Number', key: 'chequeNumber', width: 16 },
            { header: 'Cheque Date', key: 'chequeDate', width: 14 },
            { header: 'Cheque Status', key: 'chequeStatus', width: 14, style: { alignment: { horizontal: 'center' } } },
            { header: 'Notes', key: 'notes', width: 30 },
            { header: 'Created By', key: 'createdBy', width: 18 },
        ];

        // Add dynamic image columns
        for (let i = 0; i < maxImages; i++) {
            columns.push({ header: `Image URL ${i + 1}`, key: `img_${i}`, width: 25 });
        }

        await ExportService.toExcel({
            data: collections,
            filename: 'Collections_Report',
            sheetName: 'Collections',
            columns,
            rowMapper: (collection, index) => {
                const images = collection.images || [];
                const isCheque = collection.paymentMode === 'Cheque';

                const rowData: Record<string, ExcelCellValue> = {
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
                        rowData[`img_${imgIdx}`] = createHyperlink(imgUrl, 'View Image');
                    }
                });

                return rowData;
            },
            onWorksheetReady: (worksheet) => {
                // Apply currency format and alignment to amount column
                worksheet.eachRow((row, rowNumber) => {
                    if (rowNumber === 1) return;

                    const amountCell = row.getCell('paidAmount');
                    amountCell.numFmt = '"RS" #,##0';
                    amountCell.alignment = { vertical: 'middle', horizontal: 'right' };
                });
            },
        });
    }
};
