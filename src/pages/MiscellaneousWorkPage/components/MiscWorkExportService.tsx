import { type MiscWork as MiscWorkType, MiscWorkMapper } from "@/api/miscellaneousWorkService";
import {
    ExportService,
    createHyperlink,
    formatExportDate,
    type ExcelColumn,
    type ExcelCellValue,
} from '@/services/export';

/**
 * MiscWork Export Service
 *
 * Uses the generic ExportService for standardized Excel/PDF exports.
 * This reduces code duplication while maintaining entity-specific logic.
 */
export const MiscWorkExportService = {
    async toExcel(data: MiscWorkType[]) {
        // Calculate max image count for dynamic columns
        const maxImageCount = Math.max(...data.map(item => item.images?.length || 0), 0);

        // Define base columns
        const columns: ExcelColumn[] = [
            { header: 'S.No', key: 'sno', width: 8, style: { alignment: { horizontal: 'center' } } },
            { header: 'Employee', key: 'employee', width: 25 },
            { header: 'Role', key: 'role', width: 20 },
            { header: 'Nature of Work', key: 'nature', width: 35 },
            { header: 'Work Date', key: 'date', width: 15, style: { alignment: { horizontal: 'center' } } },
            { header: 'Address', key: 'address', width: 60 },
        ];

        // Add dynamic image columns
        for (let i = 1; i <= maxImageCount; i++) {
            columns.push({ header: `Image ${i}`, key: `img_${i}`, width: 25 });
        }

        // Add assigner column at the end
        columns.push({ header: 'Assigner', key: 'assigner', width: 25 });

        // Use generic ExportService
        await ExportService.toExcel({
            data,
            filename: 'Misc_Work_Report',
            sheetName: 'Miscellaneous Work',
            columns,
            rowMapper: (item, index) => {
                const rowData: Record<string, ExcelCellValue> = {
                    sno: index + 1,
                    employee: item.employee?.name || MiscWorkMapper.DEFAULT_TEXT,
                    role: item.employee?.role || 'Staff',
                    nature: item.natureOfWork || MiscWorkMapper.DEFAULT_NATURE,
                    date: formatExportDate(item.workDate),
                    address: item.address || MiscWorkMapper.DEFAULT_ADDRESS,
                    assigner: item.assignedBy?.name || MiscWorkMapper.DEFAULT_TEXT,
                };

                // Add image hyperlinks
                if (item.images) {
                    item.images.forEach((url, i) => {
                        rowData[`img_${i + 1}`] = createHyperlink(url, 'View Image');
                    });
                }

                return rowData;
            },
            onWorksheetReady: (worksheet) => {
                // Apply text wrapping to long text columns
                worksheet.eachRow((row, rowNumber) => {
                    if (rowNumber === 1) return;
                    row.eachCell((cell, colNumber) => {
                        const columnKey = worksheet.getColumn(colNumber).key || '';
                        if (['address', 'nature'].includes(columnKey)) {
                            cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true, indent: 1 };
                        }
                    });
                });
            },
        });
    },

    async toPdf(data: MiscWorkType[]) {
        // Dynamically import the PDF component
        const MiscellaneousWorkListPDF = (await import('../MiscellaneousWorkListPDF')).default;

        await ExportService.toPdf({
            component: <MiscellaneousWorkListPDF data={data} />,
            filename: 'Misc_Work_Report',
            openInNewTab: true,
        });
    },
};
