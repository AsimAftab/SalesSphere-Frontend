/**
 * Generic Export Service
 *
 * Provides reusable utilities for exporting data to Excel and PDF formats.
 * Reduces code duplication across entity-specific export services.
 *
 * @example
 * ```tsx
 * import { ExportService } from '@/services/export';
 *
 * // Excel Export
 * await ExportService.toExcel({
 *   data: employees,
 *   filename: 'Employee_List',
 *   sheetName: 'Employees',
 *   columns: [
 *     { header: 'Name', key: 'name', width: 25 },
 *     { header: 'Email', key: 'email', width: 30 },
 *   ],
 *   rowMapper: (emp, index) => ({
 *     sno: index + 1,
 *     name: emp.name,
 *     email: emp.email,
 *   }),
 * });
 *
 * // PDF Export
 * await ExportService.toPdf({
 *   component: <EmployeeListPDF employees={employees} />,
 *   filename: 'Employee_List',
 * });
 * ```
 */

import React from 'react';
import toast from 'react-hot-toast';

// --- Types ---

export interface ExcelColumn {
    /** Column header text */
    header: string;
    /** Key for data mapping */
    key: string;
    /** Column width in characters */
    width?: number;
    /** Cell style options */
    style?: {
        alignment?: { horizontal?: 'left' | 'center' | 'right'; vertical?: 'top' | 'middle' | 'bottom' };
        numFmt?: string;
    };
}

export interface ExcelHyperlink {
    text: string;
    hyperlink: string;
    tooltip?: string;
}

export type ExcelCellValue = string | number | boolean | Date | ExcelHyperlink | null | undefined;

export interface ExcelExportOptions<T> {
    /** Data array to export */
    data: T[];
    /** Output filename (without extension) */
    filename: string;
    /** Worksheet name */
    sheetName?: string;
    /** Column definitions */
    columns: ExcelColumn[];
    /** Map data item to row values */
    rowMapper: (item: T, index: number) => Record<string, ExcelCellValue>;
    /** Apply header styling */
    styleHeader?: boolean;
    /** Header background color (ARGB) */
    headerBgColor?: string;
    /** Header text color (ARGB) */
    headerTextColor?: string;
    /** Apply alternating row colors */
    alternateRowColors?: boolean;
    /** Custom post-processing */
    onWorksheetReady?: (worksheet: import('exceljs').Worksheet) => void;
}

export interface PdfExportOptions {
    /** React component to render as PDF */
    component: React.ReactElement;
    /** Output filename (without extension) */
    filename: string;
    /** Open in new tab instead of downloading */
    openInNewTab?: boolean;
}

export interface CsvExportOptions<T> {
    /** Data array to export */
    data: T[];
    /** Output filename (without extension) */
    filename: string;
    /** Column definitions */
    columns: { header: string; key: keyof T | ((item: T) => string) }[];
}

// --- Constants ---

const DEFAULT_HEADER_BG = 'FF197ADC'; // Blue
const DEFAULT_HEADER_TEXT = 'FFFFFFFF'; // White
const DEFAULT_BORDER_COLOR = 'FFE5E7EB'; // Gray

// --- Utility Functions ---

/**
 * Creates a hyperlink cell value for Excel
 */
export function createHyperlink(url: string, text?: string, tooltip?: string): ExcelHyperlink {
    return {
        text: text || url,
        hyperlink: url,
        tooltip: tooltip || 'Click to open',
    };
}

/**
 * Sanitizes text for Excel (removes control characters)
 */
export function sanitizeForExcel(text: string | null | undefined): string {
    if (!text) return '';
    // Remove control characters that crash Excel
    // eslint-disable-next-line no-control-regex
    return text.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F-\x9F]/g, '');
}

/**
 * Formats a date for export
 */
export function formatExportDate(date: string | Date | null | undefined): string {
    if (!date) return '—';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toISOString().split('T')[0];
}

/**
 * Generates a filename with current date
 */
export function generateFilename(baseName: string, extension: string): string {
    const date = new Date().toISOString().split('T')[0];
    return `${baseName}_${date}.${extension}`;
}

// --- Export Service ---

export const ExportService = {
    /**
     * Export data to Excel (.xlsx)
     */
    async toExcel<T>(options: ExcelExportOptions<T>): Promise<void> {
        const {
            data,
            filename,
            sheetName = 'Sheet1',
            columns,
            rowMapper,
            styleHeader = true,
            headerBgColor = DEFAULT_HEADER_BG,
            headerTextColor = DEFAULT_HEADER_TEXT,
            alternateRowColors = false,
            onWorksheetReady,
        } = options;

        if (data.length === 0) {
            toast.error('No data available to export');
            return;
        }

        const toastId = toast.loading('Generating Excel...');

        try {
            const ExcelJS = (await import('exceljs')).default;
            const { saveAs } = await import('file-saver');

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet(sheetName);

            // Set columns
            worksheet.columns = columns.map((col) => ({
                header: col.header,
                key: col.key,
                width: col.width || 15,
                style: col.style,
            }));

            // Add rows
            data.forEach((item, index) => {
                const rowData = rowMapper(item, index);
                const row = worksheet.addRow(rowData);

                // Handle hyperlinks
                columns.forEach((col, colIndex) => {
                    const cellValue = rowData[col.key];
                    if (cellValue && typeof cellValue === 'object' && 'hyperlink' in cellValue) {
                        const cell = row.getCell(colIndex + 1);
                        cell.value = {
                            text: cellValue.text,
                            hyperlink: cellValue.hyperlink,
                        };
                        cell.font = { color: { argb: 'FF0000FF' }, underline: true };
                    }
                });
            });

            // Style header row
            if (styleHeader) {
                const headerRow = worksheet.getRow(1);
                headerRow.height = 30;
                headerRow.eachCell((cell) => {
                    cell.font = { bold: true, color: { argb: headerTextColor }, size: 12 };
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: headerBgColor },
                    };
                    cell.alignment = { vertical: 'middle', horizontal: 'center' };
                    cell.border = {
                        top: { style: 'thin', color: { argb: 'FFFFFFFF' } },
                        left: { style: 'thin', color: { argb: 'FFFFFFFF' } },
                        bottom: { style: 'thin', color: { argb: 'FFFFFFFF' } },
                        right: { style: 'thin', color: { argb: 'FFFFFFFF' } },
                    };
                });
            }

            // Style data rows
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber === 1) return; // Skip header

                row.height = 25;
                row.eachCell((cell) => {
                    cell.border = {
                        top: { style: 'thin', color: { argb: DEFAULT_BORDER_COLOR } },
                        left: { style: 'thin', color: { argb: DEFAULT_BORDER_COLOR } },
                        bottom: { style: 'thin', color: { argb: DEFAULT_BORDER_COLOR } },
                        right: { style: 'thin', color: { argb: DEFAULT_BORDER_COLOR } },
                    };
                    cell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
                });

                // Alternate row colors
                if (alternateRowColors && rowNumber % 2 === 0) {
                    row.eachCell((cell) => {
                        cell.fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: 'FFF9FAFB' },
                        };
                    });
                }
            });

            // Custom post-processing
            if (onWorksheetReady) {
                onWorksheetReady(worksheet);
            }

            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            saveAs(blob, generateFilename(filename, 'xlsx'));

            toast.success('Excel exported successfully', { id: toastId });
        } catch (error) {
            console.error('Excel export failed:', error);
            toast.error('Failed to export Excel', { id: toastId });
            throw error;
        }
    },

    /**
     * Export React component to PDF
     */
    async toPdf(options: PdfExportOptions): Promise<void> {
        const { component, filename, openInNewTab = true } = options;

        const toastId = toast.loading('Generating PDF...');

        try {
            const { pdf } = await import('@react-pdf/renderer');
            const { saveAs } = await import('file-saver');

            // Cast to any to satisfy @react-pdf/renderer's strict typing
            // The component should be a valid PDF document from @react-pdf/renderer
            const blob = await pdf(component as Parameters<typeof pdf>[0]).toBlob();

            if (openInNewTab) {
                const url = URL.createObjectURL(blob);
                window.open(url, '_blank');
                setTimeout(() => URL.revokeObjectURL(url), 100);
            } else {
                saveAs(blob, generateFilename(filename, 'pdf'));
            }

            toast.success('PDF generated successfully', { id: toastId });
        } catch (error) {
            console.error('PDF export failed:', error);
            toast.error('Failed to generate PDF', { id: toastId });
            throw error;
        }
    },

    /**
     * Export data to CSV
     */
    async toCsv<T>(options: CsvExportOptions<T>): Promise<void> {
        const { data, filename, columns } = options;

        if (data.length === 0) {
            toast.error('No data available to export');
            return;
        }

        const toastId = toast.loading('Generating CSV...');

        try {
            const { saveAs } = await import('file-saver');

            // Build CSV content
            const headers = columns.map((col) => col.header);
            const rows = data.map((item) =>
                columns.map((col) => {
                    const value = typeof col.key === 'function' ? col.key(item) : String(item[col.key] ?? '');
                    // Escape quotes and wrap in quotes if contains comma
                    const escaped = value.replace(/"/g, '""');
                    return escaped.includes(',') || escaped.includes('\n') ? `"${escaped}"` : escaped;
                })
            );

            const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
            saveAs(blob, generateFilename(filename, 'csv'));

            toast.success('CSV exported successfully', { id: toastId });
        } catch (error) {
            console.error('CSV export failed:', error);
            toast.error('Failed to export CSV', { id: toastId });
            throw error;
        }
    },
};

export default ExportService;
