import React from "react";
import { type Note } from "@/api/notesService";
import {
    ExportService,
    formatExportDate,
    sanitizeForExcel,
    createHyperlink,
    type ExcelColumn,
    type ExcelCellValue,
} from '@/services/export';

/**
 * Notes Export Service
 *
 * Uses the generic ExportService for standardized Excel/PDF exports.
 */
export const NoteExportService = {
    async toExcel(filteredData: Note[]) {
        // Calculate max images for dynamic columns
        const maxImages = Math.max(...filteredData.map(n => n.images?.length || 0), 0);

        // Define base columns
        const columns: ExcelColumn[] = [
            { header: 'S.No', key: 'sno', width: 8, style: { alignment: { horizontal: 'center' } } },
            { header: 'Title', key: 'title', width: 25 },
            { header: 'Date', key: 'date', width: 15, style: { alignment: { horizontal: 'center' } } },
            { header: 'Entity Type', key: 'entityType', width: 15 },
            { header: 'Entity Name', key: 'linkedTo', width: 20 },
            { header: 'Created By', key: 'employee', width: 20 },
            { header: 'Description', key: 'description', width: 40 },
        ];

        // Add dynamic image columns
        for (let i = 0; i < maxImages; i++) {
            columns.push({ header: `Image ${i + 1}`, key: `image_${i}`, width: 25 });
        }

        await ExportService.toExcel({
            data: filteredData,
            filename: 'Notes_Report',
            sheetName: 'Notes Report',
            columns,
            rowMapper: (item, index) => {
                const entityType = item.partyName ? "Party"
                    : item.prospectName ? "Prospect"
                        : item.siteName ? "Site"
                            : "General";

                const rowData: Record<string, ExcelCellValue> = {
                    sno: index + 1,
                    title: item.title,
                    date: formatExportDate(item.createdAt),
                    entityType,
                    linkedTo: item.partyName || item.prospectName || item.siteName || "General",
                    employee: item.createdBy.name,
                    description: sanitizeForExcel(item.description),
                };

                // Add image hyperlinks
                if (item.images) {
                    item.images.forEach((img, imgIdx) => {
                        if (img.imageUrl) {
                            rowData[`image_${imgIdx}`] = createHyperlink(img.imageUrl, 'View Attachment');
                        }
                    });
                }

                return rowData;
            },
            onWorksheetReady: (worksheet) => {
                // Apply text wrapping to description and title columns
                worksheet.eachRow((row, rowNumber) => {
                    if (rowNumber === 1) return;
                    row.eachCell((cell, colNumber) => {
                        const columnKey = worksheet.getColumn(colNumber).key || '';
                        if (['description', 'title', 'linkedTo'].includes(columnKey)) {
                            cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true, indent: 1 };
                        }
                    });
                });
            },
        });
    },

    async toPdf(_filteredData: Note[], PDFComponent: React.ReactElement) {
        await ExportService.toPdf({
            component: PDFComponent,
            filename: 'Notes_Report',
            openInNewTab: true,
        });
    }
};
