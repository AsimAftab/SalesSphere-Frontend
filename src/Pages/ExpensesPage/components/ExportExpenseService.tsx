import { type Expense } from "../../../api/expensesService";

export const ExpenseExportService = {
  async toExcel(data: Expense[]) {
    if (data.length === 0) return;

    const ExcelJS = (await import('exceljs')).default;
    const { saveAs } = await import('file-saver');
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Expenses Audit');
    
    // 1. Column Definitions: Increased widths to prevent "merging" bleed
    worksheet.columns = [
      { header: 'S.No', key: 'sno', width: 8 },
      { header: 'Title', key: 'title', width: 35 }, // Increased for long titles
      { header: 'Amount', key: 'amount', width: 18 },
      { header: 'Category', key: 'cat', width: 20 },
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Reviewer', key: 'reviewer', width: 25 },
      { header: 'Status', key: 'status', width: 15 }
    ];

    // 2. Data Mapping
    data.forEach((exp, index) => {
      worksheet.addRow({
        sno: index + 1,
        title: exp.title,
        amount: `RS ${exp.amount.toLocaleString('en-IN')}`,
        cat: exp.category,
        date: exp.incurredDate,
        reviewer: exp.reviewer?.name || exp.approvedBy?.name || "Pending",
        status: exp.status.toUpperCase(),
      });
    });

    // 3. Header Styling: Secondary Blue (#197ADC)
    const headerRow = worksheet.getRow(1);
    headerRow.height = 30; // Increased height for better padding
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF197ADC' }
      };
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFFFFFFF' } },
        left: { style: 'thin', color: { argb: 'FFFFFFFF' } },
        bottom: { style: 'thin', color: { argb: 'FFFFFFFF' } },
        right: { style: 'thin', color: { argb: 'FFFFFFFF' } }
      };
    });

    // 4. Data Row Alignment Fix
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        row.height = 20;
        row.eachCell((cell, colNumber) => {
          // Center the S.No and Status, Left-align the rest
          if (colNumber === 1 || colNumber === 7) {
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
          } else {
            cell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
          }
          
          // Add light borders to keep cells separated
          cell.border = {
            bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
            right: { style: 'thin', color: { argb: 'FFE5E7EB' } }
          };
        });
      }
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `Expenses_Audit_${new Date().toISOString().split('T')[0]}.xlsx`);
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