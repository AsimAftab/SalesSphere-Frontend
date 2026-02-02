/**
 * Excel Utilities for Bulk Upload
 * Provides reusable functions for reading and writing Excel files
 */

import type { BulkProductData } from '@/api/productService';
import type { ExcelRowData, TemplateColumn } from './BulkUploadTypes';

/**
 * Extracts cell value from various Excel cell formats
 * Handles text objects, formula results, and primitive values
 * @param cell - The Excel cell value (can be object or primitive)
 * @returns String representation of the cell value
 */
export const getCellValue = (cell: unknown): string => {
    if (!cell) return '';
    if (typeof cell === 'object' && cell !== null) {
        const cellObj = cell as { text?: string; result?: unknown };
        if (cellObj.text) return String(cellObj.text).trim();
        if (cellObj.result) return String(cellObj.result).trim();
    }
    return String(cell).trim();
};

/**
 * Reads an Excel file and returns parsed row data
 * Skips header and instruction rows (starts from row 3)
 * @param file - The Excel file to parse
 * @returns Promise resolving to array of row objects
 */
export const readExcelFile = async (file: File): Promise<ExcelRowData[]> => {
    const ExcelJS = await import('exceljs');
    const buffer = await file.arrayBuffer();
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);
    const worksheet = workbook.worksheets[0];

    if (!worksheet) {
        throw new Error('No worksheet found in the Excel file.');
    }

    const jsonData: ExcelRowData[] = [];
    const headers: string[] = [];

    // Extract headers from row 1 and normalize them
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell, colNumber) => {
        const headerText = String(cell.value).trim().toLowerCase();
        headers[colNumber] = headerText; // Store by column index (1-based map, but array is 0-based so we'll adjust)
    });

    // Parse data rows
    worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // Skip actual header row

        // Check if this is the instruction row (heuristic: check first cell)
        const firstCellVal = String(row.getCell(1).value).toLowerCase();
        if (firstCellVal.includes('required') || firstCellVal.includes('optional')) {
            return; // Skip instruction row
        }

        const rowObject: ExcelRowData = {};

        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
            // exceljs colNumber is 1-based
            const header = headers[colNumber];
            if (header) {
                // Map normalized headers back to our expected keys if needed, 
                // or just store usage specific keys. 
                // For simplicity, we'll try to map standard headers to standard keys here 
                // OR just store the lowercased header and update transformExcelToBulkPayload to look for lowercase.
                rowObject[header] = cell.value as unknown;
            }
        });

        // Only add non-empty rows
        if (Object.values(rowObject).some(val => val !== null && val !== '' && val !== undefined)) {
            jsonData.push(rowObject);
        }
    });

    return jsonData;
};

/**
 * Transforms raw Excel row data to API payload format
 * Maps Excel columns to BulkProductData interface
 * @param rows - Array of raw Excel row data
 * @returns Array of formatted product payloads matching BulkProductData
 */
export const transformExcelToBulkPayload = (rows: ExcelRowData[]): BulkProductData[] => {
    return rows.map(row => {
        // Headers are normalized to lowercase by readExcelFile
        const priceStr = getCellValue(row['price']);
        const pieceStr = getCellValue(row['stock (qty)'] || row['stock'] || row['qty']);

        // Parse and Validate Price
        let price = parseFloat(priceStr);
        if (isNaN(price)) price = 0;

        // Parse and Validate Piece (Qty)
        let piece = parseInt(pieceStr, 10);
        if (isNaN(piece)) piece = 0;

        // Parse Serial Number (Optional)
        const serialNo = getCellValue(row['Serial No'] || row['serial no'] || row['serialno'] || row['serial']);

        return {
            productName: getCellValue(row['product name'] || row['productname']) || '',
            category: getCellValue(row['category']) || '',
            price: price,
            qty: piece,
            serialNo: serialNo || undefined,
        };
    });
};

/**
 * Template column configuration for product bulk upload
 */
export const TEMPLATE_COLUMNS: TemplateColumn[] = [
    { header: 'S.No', key: 'sNo', width: 10 },
    { header: 'Product Name', key: 'productName', width: 40 },
    { header: 'Category', key: 'category', width: 25 },
    { header: 'Price', key: 'price', width: 20 },
    { header: 'Stock (Qty)', key: 'qty', width: 20 },
    { header: 'Serial No', key: 'serialNo', width: 25 }, // Product Attribute (Optional)
];

/**
 * Generates and downloads an Excel template for bulk product upload
 * @param filename - Optional custom filename (defaults to 'Product_Template.xlsx')
 */
export const downloadBulkUploadTemplate = async (filename = 'Product_Template.xlsx'): Promise<void> => {
    const ExcelJS = await import('exceljs');
    const { saveAs } = await import('file-saver');

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Products Template');

    // Set up columns
    worksheet.columns = TEMPLATE_COLUMNS.map(col => ({
        header: col.header,
        key: col.key,
        width: col.width,
    }));

    // Add instruction row with clearer text
    // Adding 'Optional' for S.No (1) and Serial No (6)
    worksheet.addRow(['Optional', 'Required', 'Required', 'Required (Number)', 'Required (Whole Number)', 'Optional']);

    // Style header row (Row 1)
    const headerRow = worksheet.getRow(1);
    headerRow.height = 28;

    headerRow.eachCell((cell, colNumber) => {
        // Center text vertically
        cell.alignment = { vertical: 'middle', horizontal: 'left' };

        // S.No (Col 1) and Serial No (Col 6) are Optional -> Secondary Style
        if (colNumber === 1 || colNumber === 6) {
            // Optional/Secondary - Slate Blue/Gray Style
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } }; // Slate-100
            cell.font = { bold: true, color: { argb: 'FF475569' } }; // Slate-600
            cell.border = { bottom: { style: 'thin', color: { argb: 'FFCBD5E1' } } };
        } else {
            // Required fields - Primary Alert Style (Soft Red/Pink)
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF0F0' } }; // Very Light Red
            cell.font = { bold: true, color: { argb: 'FFDC2626' } }; // Red-600
            cell.border = { bottom: { style: 'thin', color: { argb: 'FFFECACA' } } };
        }
    });

    // Style instruction row (Row 2)
    const instructionRow = worksheet.getRow(2);
    instructionRow.eachCell((cell) => {
        cell.font = { italic: true, color: { argb: 'FF6B7280' }, size: 10 };
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), filename);
};
