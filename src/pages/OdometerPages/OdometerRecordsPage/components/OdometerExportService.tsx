import type { OdometerStat } from '@/api/odometerService';
import { formatDisplayDate } from '@/utils/dateUtils';
import {
    ExportService,
    type ExcelColumn,
    type ExcelCellValue,
} from '@/services/export';

/**
 * Odometer Export Service
 *
 * Uses the generic ExportService for standardized Excel/PDF exports.
 */
export const OdometerExportService = {
    async toExcel(data: OdometerStat[]) {
        const columns: ExcelColumn[] = [
            { header: 'S.No', key: 'sno', width: 8, style: { alignment: { horizontal: 'center' } } },
            { header: 'Employee', key: 'employee', width: 25 },
            { header: 'Role', key: 'role', width: 20 },
            { header: 'Date Range', key: 'dateRange', width: 35 },
            { header: 'Total Distance', key: 'distance', width: 20 },
        ];

        await ExportService.toExcel({
            data,
            filename: 'Odometer_Report',
            sheetName: 'Odometer Records',
            columns,
            rowMapper: (item, index) => {
                const dateRangeStr = `${formatDisplayDate(item.dateRange.start)} - ${formatDisplayDate(item.dateRange.end)}`;

                const rowData: Record<string, ExcelCellValue> = {
                    sno: index + 1,
                    employee: item.employee?.name || "N/A",
                    role: item.employee?.role || "Staff",
                    dateRange: dateRangeStr,
                    distance: `${item.totalDistance.toLocaleString()} KM`,
                };
                return rowData;
            },
        });
    },

    async toPdf(data: OdometerStat[]) {
        const OdometerListPDF = (await import('../OdometerListPDF')).default;

        await ExportService.toPdf({
            component: <OdometerListPDF data={data} />,
            filename: 'Odometer_Report',
            openInNewTab: true,
        });
    }
};
