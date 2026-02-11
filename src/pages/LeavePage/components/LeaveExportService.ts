import React from "react";
import { type LeaveRequest } from "@/api/leaveService";
import {
    ExportService,
    formatExportDate,
    type ExcelColumn,
} from '@/services/export';

/**
 * Leave Export Service
 *
 * Uses the generic ExportService for standardized Excel/PDF exports.
 */
export const LeaveExportService = {
    async toExcel(filteredData: LeaveRequest[]) {
        const columns: ExcelColumn[] = [
            { header: 'S.No', key: 'sno', width: 8, style: { alignment: { horizontal: 'center' } } },
            { header: 'Employee', key: 'employee', width: 25 },
            { header: 'Category', key: 'category', width: 20 },
            { header: 'Start Date', key: 'start', width: 15, style: { alignment: { horizontal: 'center' } } },
            { header: 'End Date', key: 'end', width: 15, style: { alignment: { horizontal: 'center' } } },
            { header: 'Days', key: 'days', width: 10, style: { alignment: { horizontal: 'center' } } },
            { header: 'Reason', key: 'reason', width: 40 },
            { header: 'Reviewer', key: 'reviewer', width: 30 },
            { header: 'Status', key: 'status', width: 15 },
        ];

        await ExportService.toExcel({
            data: filteredData,
            filename: 'Leave_Report',
            sheetName: 'Leave Requests Report',
            columns,
            rowMapper: (item, index) => ({
                sno: index + 1,
                employee: item.createdBy.name,
                category: item.category.replace(/_/g, ' ').toUpperCase(),
                start: formatExportDate(item.startDate),
                end: item.endDate ? formatExportDate(item.endDate) : 'Single Day',
                days: item.leaveDays,
                reason: item.reason,
                reviewer: item.approvedBy?.name || 'Under Review',
                status: item.status.toUpperCase(),
            }),
            onWorksheetReady: (worksheet) => {
                // Apply text wrapping to reason column
                worksheet.eachRow((row, rowNumber) => {
                    if (rowNumber === 1) return;
                    const reasonCell = row.getCell(7); // Reason column
                    reasonCell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true, indent: 1 };
                });
            },
        });
    },

    async toPdf(filteredData: LeaveRequest[], PDFComponent: React.ReactElement) {
        if (filteredData.length === 0) {
            const toast = (await import('react-hot-toast')).default;
            toast.error("No leave data available to export");
            return;
        }

        await ExportService.toPdf({
            component: PDFComponent,
            filename: 'Leave_Report',
            openInNewTab: true,
        });
    },
};
