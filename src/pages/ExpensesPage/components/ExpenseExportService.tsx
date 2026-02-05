import { type Expense } from "@/api/expensesService";
import {
    ExportService,
    createHyperlink,
    type ExcelColumn,
    type ExcelCellValue,
} from '@/services/export';

/**
 * Expense Export Service
 *
 * Uses the generic ExportService for standardized Excel/PDF exports.
 */
export const ExpenseExportService = {
    async toExcel(data: Expense[]) {
        const columns: ExcelColumn[] = [
            { header: 'S.No', key: 'sno', width: 8, style: { alignment: { horizontal: 'center' } } },
            { header: 'Title', key: 'title', width: 30 },
            { header: 'Amount', key: 'amount', width: 18 },
            { header: 'Category', key: 'cat', width: 20 },
            { header: 'Incurred Date', key: 'date', width: 15, style: { alignment: { horizontal: 'center' } } },
            { header: 'Entry Date', key: 'entryDate', width: 15, style: { alignment: { horizontal: 'center' } } },
            { header: 'Party', key: 'party', width: 25 },
            { header: 'Reviewer', key: 'reviewer', width: 25 },
            { header: 'Status', key: 'status', width: 15, style: { alignment: { horizontal: 'center' } } },
            { header: 'Description', key: 'desc', width: 45 },
            { header: 'Receipt Image', key: 'receipt', width: 35 },
        ];

        await ExportService.toExcel({
            data,
            filename: 'Expenses_Full_Audit',
            sheetName: 'Expenses Audit',
            columns,
            rowMapper: (exp, index) => {
                const rowData: Record<string, ExcelCellValue> = {
                    sno: index + 1,
                    title: exp.title,
                    amount: `RS ${exp.amount.toLocaleString('en-IN')}`,
                    cat: exp.category,
                    date: exp.incurredDate,
                    entryDate: exp.entryDate ? new Date(exp.entryDate).toISOString().split('T')[0] : 'N/A',
                    party: exp.party?.companyName || exp.party?.id || 'N/A',
                    reviewer: exp.approvedBy?.name || "Under Review",
                    status: exp.status.toUpperCase(),
                    desc: exp.description || "",
                    receipt: exp.receipt
                        ? createHyperlink(exp.receipt, 'View Receipt Proof', 'Click to view the original audit evidence')
                        : 'No Documentation',
                };
                return rowData;
            },
            onWorksheetReady: (worksheet) => {
                // Apply text wrapping to description column
                worksheet.eachRow((row, rowNumber) => {
                    if (rowNumber === 1) return;
                    const descCell = row.getCell(10); // Description column
                    descCell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true, indent: 1 };
                });
            },
        });
    },

    async toPdf(data: Expense[]) {
        const ExpensesPDFReport = (await import('../ExpensesPDFReport')).default;

        await ExportService.toPdf({
            component: <ExpensesPDFReport data={data} />,
            filename: 'Expenses_Report',
            openInNewTab: true,
        });
    }
};
