import { type Expense } from "../../../api/expensesService";

export const ExpenseExportService = {
  async toExcel(data: Expense[]) {
    if (data.length === 0) return;

    const ExcelJS = (await import('exceljs')).default;
    const { saveAs } = await import('file-saver');
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Expenses Audit');
    
    // 1. Expanded Column Definitions for Full Audit Detail
    worksheet.columns = [
      { header: 'S.No', key: 'sno', width: 8 },
      { header: 'Title', key: 'title', width: 30 },
      { header: 'Amount', key: 'amount', width: 18 },
      { header: 'Category', key: 'cat', width: 20 },
      { header: 'Incurred Date', key: 'date', width: 15 },
      { header: 'Entry Date', key: 'entryDate', width: 15 },
      { header: 'Party', key: 'party', width: 25 },
      { header: 'Reviewer', key: 'reviewer', width: 25 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Description', key: 'desc', width: 45 },
      { header: 'Receipt Image', key: 'receipt', width: 35 }
    ];

    // 2. Comprehensive Data Mapping
    data.forEach((exp, index) => {
      const row = worksheet.addRow({
        sno: index + 1,
        title: exp.title,
        amount: `RS ${exp.amount.toLocaleString('en-IN')}`,
        cat: exp.category,
        date: exp.incurredDate,
        entryDate: exp.entryDate || 'N/A', // Added Entry Date
        party: exp.party?.companyName || exp.party?.id || 'N/A', // Added Party Details
        reviewer: exp.approvedBy?.name || "Under Review",
        status: exp.status.toUpperCase(),
        desc: exp.description || "", // Added Description
      });

      // 3. Image Evidence Handling (As Hyperlinks)
      if (exp.receipt) {
        const cell = row.getCell('receipt');
        cell.value = {
          text: 'View Receipt Proof',
          hyperlink: exp.receipt,
          tooltip: 'Click to view the original audit evidence'
        };
        cell.font = { color: { argb: 'FF0000FF' }, underline: true }; // Standard blue link
      } else {
        row.getCell('receipt').value = 'No Documentation';
      }
    });

    // 4. Header Styling (Secondary Blue: #197ADC)
      const headerRow = worksheet.getRow(1);
      headerRow.height = 30;
      headerRow.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF197ADC' }
        };
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        
        // ADD THIS: White borders to act as column separators in the blue header
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFFFFFFF' } },
          left: { style: 'thin', color: { argb: 'FFFFFFFF' } },
          bottom: { style: 'thin', color: { argb: 'FFFFFFFF' } },
          right: { style: 'thin', color: { argb: 'FFFFFFFF' } }
        };
      });

      // 5. Row Formatting: Alignment, Borders, and Wrapping
    worksheet.eachRow((row, rowNumber) => {
      // Apply a standard height for data rows (slightly taller for comfort)
      if (rowNumber > 1) {
        row.height = 25;
      }

      row.eachCell((cell, colNumber) => {
        // Standard Border for all cells (Header and Content)
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          right: { style: 'thin', color: { argb: 'FFE5E7EB' } }
        };

        /**
         * ALIGNMENT LOGIC
         * Centered: S.No (1), Incurred Date (5), Entry Date (6), Status (9)
         * Wrapped Left: Description (10)
         * Standard Left: Title (2), Amount (3), Category (4), Party (7), Reviewer (8), Receipt (11)
         */
        if ([1, 5, 6, 9].includes(colNumber)) {
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
        } 
        else if (colNumber === 10) {
          // Description needs wrapping for long justifications
          cell.alignment = { 
            vertical: 'middle', 
            horizontal: 'left', 
            wrapText: true, 
            indent: 1 
          };
        } 
        else {
          // Standard text/amount fields
          cell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
        }
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `Expenses_Full_Audit_${new Date().toISOString().split('T')[0]}.xlsx`);
  },

  async toPdf(data: Expense[]) {
    if (data.length === 0) return;
    const { pdf } = await import('@react-pdf/renderer');
    const ExpensesPDFReportModule = await import('../ExpensesPDFReport');
    const ExpensesPDFReport = ExpensesPDFReportModule.default;
    
    const blob = await pdf(<ExpensesPDFReport data={data} />).toBlob();
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  }
};