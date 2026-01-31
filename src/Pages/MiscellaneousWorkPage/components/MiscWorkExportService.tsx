import { type MiscWork as MiscWorkType, MiscWorkMapper } from "../../../api/miscellaneousWorkService";
import toast from "react-hot-toast";

export const MiscWorkExportService = {

  async toExcel(data: MiscWorkType[]) {
    if (!data || data.length === 0) {
      toast.error("No miscellaneous work data available to export");
      return;
    }
    const toastId = toast.loading("Generating Excel report...");

    try {
      // Dynamic imports for performance optimization
      const ExcelJS = (await import('exceljs')).default;
      const { saveAs } = await import('file-saver');

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Miscellaneous Work');

      // 1. Calculate Dynamic Image Columns
      let maxImageCount = 0;
      data.forEach((item) => {
        if (item.images) maxImageCount = Math.max(maxImageCount, item.images.length);
      });

      // 2. Define Columns with standard widths
      const columns: { header: string; key: string; width: number }[] = [
        { header: 'S.No', key: 'sno', width: 8 },
        { header: 'Employee', key: 'employee', width: 25 },
        { header: 'Role', key: 'role', width: 20 }, // Added Role Column
        { header: 'Nature of Work', key: 'nature', width: 35 },
        { header: 'Work Date', key: 'date', width: 15 },
        { header: 'Address', key: 'address', width: 60 },
      ];

      // Dynamically add columns for images found in the dataset
      for (let i = 1; i <= maxImageCount; i++) {
        columns.push({ header: `Image ${i}`, key: `img_${i}`, width: 25 });
      }
      columns.push({ header: 'Assigner', key: 'assigner', width: 25 });
      worksheet.columns = columns;

      // 3. Map Data using centralized Mapper logic
      data.forEach((item, index) => {
        const rowData: Record<string, string | number | { text: string; hyperlink: string }> = {
          sno: index + 1,
          employee: item.employee?.name || MiscWorkMapper.DEFAULT_TEXT,
          role: item.employee?.role || "Staff", // Added Role Data
          nature: item.natureOfWork || MiscWorkMapper.DEFAULT_NATURE,
          // Use standard YYYY-MM-DD format (Matching Expenses Module)
          date: item.workDate ? new Date(item.workDate).toISOString().split('T')[0] : MiscWorkMapper.DEFAULT_TEXT,
          address: item.address || MiscWorkMapper.DEFAULT_ADDRESS,
          assigner: item.assignedBy?.name || MiscWorkMapper.DEFAULT_TEXT,
        };

        // Populate dynamic image columns with hyperlinks
        if (item.images) {
          item.images.forEach((url, i) => {
            rowData[`img_${i + 1}`] = { text: 'View Image', hyperlink: url };
          });
        }
        worksheet.addRow(rowData);
      });

      // 4. Branded Styling & Alignment (Matching Expenses Module)
      const headerRow = worksheet.getRow(1);
      headerRow.height = 30;
      headerRow.eachCell((cell) => {
        // Header Style: Blue Background, White Text, Bold, Centered
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF197ADC' }
        };
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };

        // White borders for headers
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFFFFFFF' } },
          left: { style: 'thin', color: { argb: 'FFFFFFFF' } },
          bottom: { style: 'thin', color: { argb: 'FFFFFFFF' } },
          right: { style: 'thin', color: { argb: 'FFFFFFFF' } }
        };
      });

      // Data Row Styling
      worksheet.eachRow((row) => {
        // Remove fixed height to allow auto-expansion for wrapped text (Address/Nature)
        // if (rowNumber > 1) { row.height = 25; }

        row.eachCell((cell, colNumber) => {
          // Standard Border for all content cells
          cell.border = {
            top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
            left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
            bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
            right: { style: 'thin', color: { argb: 'FFE5E7EB' } }
          };

          const columnKey = worksheet.getColumn(colNumber).key || '';

          // Alignment Logic
          if (['sno', 'date'].includes(columnKey)) {
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
          } else if (['address', 'nature'].includes(columnKey)) {
            // Wrap text for long fields
            cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true, indent: 1 };
          } else {
            // Standard left alignment
            cell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
          }

          // Hyperlink styling for images
          if (cell.value && typeof cell.value === 'object' && 'hyperlink' in cell.value) {
            cell.font = { color: { argb: 'FF0000FF' }, underline: true };
          }
        });
      });

      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(new Blob([buffer]), `Misc_Work_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
      toast.success('Excel exported successfully', { id: toastId });
    } catch (err) {
      console.error("Excel Export Error:", err);
      toast.error('Failed to export Excel', { id: toastId });
    }
  },

  /**
   * Generates a professional PDF audit report using react-pdf.
   */
  async toPdf(data: MiscWorkType[]) {
    if (!data || data.length === 0) {
      toast.error("No miscellaneous work data available to export");
      return;
    }
    const toastId = toast.loading("Preparing PDF...");

    try {
      const { pdf } = await import('@react-pdf/renderer');
      const MiscellaneousWorkListPDF = (await import('../MiscellaneousWorkListPDF')).default;

      const blob = await pdf(<MiscellaneousWorkListPDF data={data} />).toBlob();
      const url = URL.createObjectURL(blob);

      // Open PDF in a new tab for immediate viewing
      window.open(url, '_blank');
      toast.success("PDF exported successfully", { id: toastId });

      // Clean up the object URL to free memory
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (err) {
      console.error("PDF Export Error:", err);
      toast.error("PDF export failed", { id: toastId });
    }
  }
};