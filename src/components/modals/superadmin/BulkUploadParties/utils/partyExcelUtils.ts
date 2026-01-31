import { PartyExcelRowSchema } from '../types';

// Default Location Fallback
const DEFAULT_LAT = 27.7172;
const DEFAULT_LNG = 85.3240;
const DEFAULT_ADDRESS = "Kathmandu, Nepal";

interface ExcelRowData {
    [key: string]: string | number | boolean | null | undefined;
}

interface PartyPayloadRow {
    [key: string]: unknown;
    companyName: string;
    ownerName: string;
    panVat: string;
    phone: string;
    email: string;
    address: string;
    partyType: string;
    description: string;
    latitude: number;
    longitude: number;
}

export const readPartyExcelFile = async (file: File): Promise<ExcelRowData[]> => {
    const ExcelJS = await import('exceljs');
    const buffer = await file.arrayBuffer();
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);

    const worksheet = workbook.worksheets[0];
    if (!worksheet) throw new Error("No worksheet found.");

    const jsonData: ExcelRowData[] = [];
    const headers: string[] = [];

    const headerRow = worksheet.getRow(1);
    if (headerRow.cellCount === 0) throw new Error("Empty Excel file.");

    headerRow.eachCell((cell) => {
        headers.push(String(cell.value));
    });

    worksheet.eachRow((row, rowNumber) => {
        if (rowNumber <= 2) return; // Skip header and instruction

        const rowObject: ExcelRowData = {};
        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
            const header = headers[colNumber - 1];
            // Safe helper to get cell text
            const cellValue = cell.value;
            const textValue = (typeof cellValue === 'object' && cellValue !== null && 'text' in cellValue)
                ? (cellValue as { text: string }).text
                : cellValue;

            rowObject[header] = textValue as string | number | boolean | null | undefined;
        });

        // Only add if row has some data
        if (Object.values(rowObject).some(val => val !== null && val !== '' && val !== undefined)) {
            jsonData.push(rowObject);
        }
    });

    return jsonData;
};

export const transformExcelToPartyPayload = (jsonData: ExcelRowData[]): PartyPayloadRow[] => {
    const validRows: PartyPayloadRow[] = [];

    jsonData.forEach((row, index) => {
        // Map Excel headers to Schema keys
        const cleanRow = {
            sNo: row['S.No'] || row['s.no'] || index + 1,
            partyName: row['Party Name'],
            ownerName: row['Owner Name'],
            panVat: row['PAN/VAT Number'],
            phone: row['Phone Number'],
            email: row['Email'],
            address: row['Address'],
            partyType: row['Party Type'],
            description: row['Description']
        };

        const result = PartyExcelRowSchema.safeParse(cleanRow);

        if (result.success) {
            const data = result.data;
            const address = data.address?.trim() || DEFAULT_ADDRESS;

            validRows.push({
                companyName: data.partyName,
                ownerName: data.ownerName,
                panVat: data.panVat,
                phone: data.phone,
                email: data.email || '',
                address: address,
                partyType: data.partyType || '',
                description: data.description || '',
                // Defaults
                latitude: DEFAULT_LAT,
                longitude: DEFAULT_LNG
            });
        } else {
            // Collect validation errors for preview
            // We can chose to throw or filter. 
            // Ideally we pass them to the UI, but for now we follow the 'transform' pattern returning payload
        }
    });

    return validRows;
};

export const validatePartyRow = (row: ExcelRowData): { success: boolean, errors?: string[] } => {
    // Map Excel keys to schema keys
    const cleanRow = {
        partyName: row['Party Name'],
        ownerName: row['Owner Name'],
        panVat: row['PAN/VAT Number'],
        phone: row['Phone Number'],
        email: row['Email'],
        address: row['Address'],
        partyType: row['Party Type'],
        description: row['Description']
    };

    const result = PartyExcelRowSchema.safeParse(cleanRow);
    if (!result.success) {
        return {
            success: false,
            errors: result.error.errors.map(e => e.message)
        };
    }
    return { success: true };
};

export const downloadPartyTemplate = async (organizationName?: string) => {
    const ExcelJS = await import('exceljs');
    const { saveAs } = await import('file-saver');

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Parties Template");

    // Columns
    worksheet.columns = [
        { header: 'S.No', key: 'S.No', width: 10 },
        { header: 'Party Name', key: 'Party Name', width: 30 },
        { header: 'Owner Name', key: 'Owner Name', width: 25 },
        { header: 'PAN/VAT Number', key: 'PAN/VAT Number', width: 20 },
        { header: 'Phone Number', key: 'Phone Number', width: 20 },
        { header: 'Party Type', key: 'Party Type', width: 20 },
        { header: 'Email', key: 'Email', width: 30 },
        { header: 'Address', key: 'Address', width: 40 },
        { header: 'Description', key: 'Description', width: 40 },
    ];

    // Instruction Row
    const instructionRow = worksheet.addRow([
        "",
        "Required",
        "Required",
        "Required",
        "Required",
        "Optional",
        "Optional",
        "Optional",
        "Optional"
    ]);

    // Style Instructions
    instructionRow.font = { italic: true, size: 10, color: { argb: 'FF555555' } };
    instructionRow.alignment = { horizontal: 'center' };

    // Style Headers
    const headerRow = worksheet.getRow(1);
    headerRow.height = 25;
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

    headerRow.eachCell((cell, colNumber) => {
        // Red for Required (Col 2-5)
        if (colNumber >= 2 && colNumber <= 5) {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFE6E6' } };
            cell.font = { bold: true, size: 12, color: { argb: 'FF990000' } };
            cell.border = { top: { style: 'thin', color: { argb: 'FF990000' } }, bottom: { style: 'medium', color: { argb: 'FF990000' } }, left: { style: 'thin', color: { argb: 'FF990000' } }, right: { style: 'thin', color: { argb: 'FF990000' } } };
        } else {
            // Blue for Optional
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE6F0FF' } };
            cell.font = { bold: true, size: 12, color: { argb: 'FF003366' } };
            cell.border = { top: { style: 'thin', color: { argb: 'FF003366' } }, bottom: { style: 'medium', color: { argb: 'FF003366' } }, left: { style: 'thin', color: { argb: 'FF003366' } }, right: { style: 'thin', color: { argb: 'FF003366' } } };
        }
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const safeName = organizationName || "Organization";
    saveAs(blob, `Parties_Upload_Template_${safeName.replace(/\s+/g, '_')}.xlsx`);
};
