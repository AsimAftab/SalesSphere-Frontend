import type { FilteredEmployee, CalendarDay } from '../types';
import { ExportService } from '@/services/export';

/**
 * Attendance Export Service
 *
 * Uses the generic ExportService for standardized PDF exports.
 * Note: Excel export is currently disabled/commented out in the original.
 */
export const AttendanceExportService = {
    async toPdf(employees: FilteredEmployee[], month: string, year: number, days: CalendarDay[]) {
        const AttendancePDF = (await import('../AttendancePDF')).default;

        await ExportService.toPdf({
            component: <AttendancePDF employees={employees} month={month} year={year} days={days} />,
            filename: `Attendance_Sheet_${month}_${year}`,
            openInNewTab: true,
        });
    },
};
