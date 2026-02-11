import React from "react";
import { type TourPlan } from "@/api/tourPlanService";
import {
    ExportService,
    type ExcelColumn,
    type ExcelCellValue,
} from '@/services/export';

/**
 * Tour Plan Export Service
 *
 * Uses the generic ExportService for standardized Excel/PDF exports.
 */
export const TourExportService = {
    async toExcel(filteredData: TourPlan[]) {
        const columns: ExcelColumn[] = [
            { header: 'S.No', key: 'sno', width: 8, style: { alignment: { horizontal: 'center' } } },
            { header: 'Place of Visit', key: 'place', width: 30 },
            { header: 'Purpose', key: 'purpose', width: 35 },
            { header: 'Start Date', key: 'start', width: 14, style: { alignment: { horizontal: 'center' } } },
            { header: 'End Date', key: 'end', width: 14, style: { alignment: { horizontal: 'center' } } },
            { header: 'Duration (Days)', key: 'days', width: 17, style: { alignment: { horizontal: 'center' } } },
            { header: 'Created By', key: 'employee', width: 25 },
            { header: 'Status', key: 'status', width: 15, style: { alignment: { horizontal: 'center' } } },
            { header: 'Reviewer', key: 'reviewer', width: 25 },
        ];

        await ExportService.toExcel({
            data: filteredData,
            filename: 'Tour_Plans_Report',
            sheetName: 'Tour Plans Report',
            columns,
            rowMapper: (item, index) => {
                const rowData: Record<string, ExcelCellValue> = {
                    sno: index + 1,
                    place: item.placeOfVisit,
                    purpose: item.purposeOfVisit,
                    start: item.startDate,
                    end: item.endDate || "-",
                    days: item.numberOfDays,
                    employee: item.createdBy.name,
                    status: item.status.toUpperCase(),
                    reviewer: item.approvedBy?.name || "Under Review",
                };
                return rowData;
            },
            onWorksheetReady: (worksheet) => {
                // Apply text wrapping to place and purpose columns
                worksheet.eachRow((row, rowNumber) => {
                    if (rowNumber === 1) return;
                    row.eachCell((cell, colNumber) => {
                        // Wrap: Place (2), Purpose (3), Employee (7), Reviewer (9)
                        if ([2, 3, 7, 9].includes(colNumber)) {
                            cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true, indent: 1 };
                        }
                    });
                });
            },
        });
    },

    async toPdf(_filteredData: TourPlan[], PDFComponent: React.ReactElement) {
        await ExportService.toPdf({
            component: PDFComponent,
            filename: 'Tour_Plans_Report',
            openInNewTab: true,
        });
    },
};
