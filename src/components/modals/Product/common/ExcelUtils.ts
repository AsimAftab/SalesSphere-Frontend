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
    const columns = [
        { header: 'S.No', key: 'sNo', width: 10 },
        { header: 'Product Name', key: 'productName', width: 40 },
        { header: 'Category', key: 'category', width: 25 },
        { header: 'Price', key: 'price', width: 20 },
        { header: 'Stock (Qty)', key: 'qty', width: 20 },
        { header: 'Serial No', key: 'serialNo', width: 25 },
    ];
    worksheet.columns = columns;

    // Unlock all definition columns so data can be entered
    worksheet.columns.forEach(col => {
        col.protection = { locked: false };
    });

    // Instruction Row (Row 2) - improved clarity
    const instructionRow = worksheet.addRow([
        "Optional",
        "Required",
        "Required",
        "Required (Number)",
        "Required (Number)",
        "Optional"
    ]);

    // --- Styling ---

    // 1. Header Row Styling (Secondary Color #197ADC)
    const headerRow = worksheet.getRow(1);
    headerRow.height = 32;
    // No global row styling

    // Strictly iterate only the defined columns
    for (let i = 1; i <= columns.length; i++) {
        const cell = headerRow.getCell(i);
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.font = { bold: true, size: 12, color: { argb: 'FFFFFFFF' } }; // White text
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF197ADC' } }; // Secondary
        cell.border = {
            top: { style: 'thin', color: { argb: 'FF1E40AF' } },
            left: { style: 'thin', color: { argb: 'FF1E40AF' } },
            bottom: { style: 'thin', color: { argb: 'FF1E40AF' } },
            right: { style: 'thin', color: { argb: 'FF1E40AF' } }
        };
        // Explicitly lock header cells
        cell.protection = { locked: true };
    }

    // 2. Instruction Row Styling
    instructionRow.height = 24;
    // No global row styling

    for (let i = 1; i <= columns.length; i++) {
        const cell = instructionRow.getCell(i);
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF3F4F6' } }; // Gray 100
        cell.border = {
            top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
            left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
            bottom: { style: 'medium', color: { argb: 'FF9CA3AF' } },
            right: { style: 'thin', color: { argb: 'FFE5E7EB' } }
        };
        // Explicitly lock instruction cells
        cell.protection = { locked: true };

        // Styling based on content (Cols: 1=Opt, 2=Req, 3=Req, 4=Req, 5=Req, 6=Opt)
        if (i >= 2 && i <= 5) {
            cell.font = { italic: true, bold: true, size: 10, color: { argb: 'FFDC2626' } }; // Red for Required
        } else {
            cell.font = { italic: true, size: 10, color: { argb: 'FF6B7280' } }; // Gray for Optional
        }
    }

    // --- Data Validation ---
    // Apply validation for rows 3 to 1000 (reasonable limit for bulk upload template)
    for (let i = 3; i <= 1000; i++) {
        const row = worksheet.getRow(i);

        // Price (Col 4) - Decimal, >= 0
        row.getCell(4).dataValidation = {
            type: 'decimal',
            operator: 'greaterThanOrEqual',
            showErrorMessage: true,
            allowBlank: false,
            formulae: [0],
            errorStyle: 'stop',
            errorTitle: 'Invalid Price',
            error: 'Price must be a number greater than or equal to 0.'
        };

        // Stock/Qty (Col 5) - Whole Number, >= 0
        row.getCell(5).dataValidation = {
            type: 'whole',
            operator: 'greaterThanOrEqual',
            showErrorMessage: true,
            allowBlank: false,
            formulae: [0],
            errorStyle: 'stop',
            errorTitle: 'Invalid Quantity',
            error: 'Quantity must be a whole number.'
        };

        // S.No (Col 1) - Whole Number
        row.getCell(1).dataValidation = {
            type: 'whole',
            operator: 'greaterThanOrEqual',
            showErrorMessage: true,
            allowBlank: true,
            formulae: [1],
            error: 'S.No must be a number'
        };
    }

    // 4. Protect Sheet
    await worksheet.protect('', {
        selectLockedCells: false,
        selectUnlockedCells: true,
        formatCells: true,
        formatColumns: true,
        formatRows: true, // Allow user to format rows
        insertRows: true, // Allow user to add rows
        deleteRows: true, // Allow user to delete rows
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), filename);
};
