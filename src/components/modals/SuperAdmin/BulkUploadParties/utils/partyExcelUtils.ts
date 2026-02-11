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


    // Columns - Define headers here
    const columns = [
        { header: 'S.No', key: 'S.No', width: 8 },
        { header: 'Party Name', key: 'Party Name', width: 35 },
        { header: 'Owner Name', key: 'Owner Name', width: 25 },
        { header: 'PAN/VAT Number', key: 'PAN/VAT Number', width: 20 },
        { header: 'Phone Number', key: 'Phone Number', width: 20 },
        { header: 'Party Type', key: 'Party Type', width: 20 },
        { header: 'Email', key: 'Email', width: 30 },
        { header: 'Address', key: 'Address', width: 40 },
        { header: 'Description', key: 'Description', width: 40 },
    ];
    worksheet.columns = columns;

    // Unlock all definition columns so data can be entered
    worksheet.columns.forEach(col => {
        col.protection = { locked: false };
    });

    // Instruction Row (Row 2)
    const instructionRow = worksheet.addRow([
        "Optional",
        "Required",
        "Required",
        "Required",
        "Required",
        "Optional (e.g. Retailer)",
        "Optional",
        "Optional",
        "Optional"
    ]);


    // --- Styling ---

    // 1. Header Row Styling (Secondary Color #197ADC)
    const headerRow = worksheet.getRow(1);
    headerRow.height = 32;
    // Removed global row styling to prevent bleeding

    // Strictly iterate only the defined columns
    for (let i = 1; i <= columns.length; i++) {
        const cell = headerRow.getCell(i);
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.font = { bold: true, size: 12, color: { argb: 'FFFFFFFF' } }; // White text
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF197ADC' } }; // Secondary 
        cell.border = {
            top: { style: 'thin', color: { argb: 'FF165BAA' } },
            left: { style: 'thin', color: { argb: 'FF165BAA' } },
            bottom: { style: 'thin', color: { argb: 'FF165BAA' } },
            right: { style: 'thin', color: { argb: 'FF165BAA' } }
        };
        // Explicitly lock header cells
        cell.protection = { locked: true };
    }

    // 2. Instruction Row Styling
    instructionRow.height = 24;
    // Removed global row styling

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

        // Styling based on Required/Optional in Party Template
        // Cols: 1=Optional(S.No), 2=Req(Name), 3=Req(Owner), 4=Req(PAN), 5=Req(Phone), 6=Opt(Type), 7=Opt(Email), 8=Opt(Addr), 9=Opt(Desc)
        if (i >= 2 && i <= 5) {
            cell.font = { italic: true, bold: true, size: 10, color: { argb: 'FFDC2626' } }; // Red for Required
        } else {
            cell.font = { italic: true, size: 10, color: { argb: 'FF6B7280' } }; // Gray for Optional
        }
    }


    // --- Data Validation ---
    for (let i = 3; i <= 1000; i++) {
        const row = worksheet.getRow(i);

        // S.No (Col 1) - Whole Number
        row.getCell(1).dataValidation = {
            type: 'whole',
            operator: 'greaterThanOrEqual',
            showErrorMessage: true,
            allowBlank: true,
            formulae: [1],
            error: 'S.No must be a number'
        };

        // Phone Number (Col 5) - Text length 10
        row.getCell(5).dataValidation = {
            type: 'textLength',
            operator: 'equal',
            showErrorMessage: true,
            allowBlank: false,
            formulae: [10],
            errorStyle: 'stop',
            errorTitle: 'Invalid Phone',
            error: 'Phone number must be exactly 10 digits.'
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
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const safeName = organizationName || "Organization";
    saveAs(blob, `Parties_Upload_Template_${safeName.replace(/\s+/g, '_')}.xlsx`);
};
