import { type MiscWork as MiscWorkType, MiscWorkMapper } from "../../../api/miscellaneousWorkService";
import toast from "react-hot-toast";

export const MiscWorkExportService = {
  /**
   * Generates a professional Excel report with dynamic columns and branded styling.
   */
  async toExcel(data: MiscWorkType[]) {
    if (!data || data.length === 0) return toast.error("No data to export");
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
      const columns: any[] = [
        { header: 'S.No', key: 'sno', width: 8 },
        { header: 'Employee', key: 'employee', width: 25 },
        { header: 'Role', key: 'role', width: 20 }, // Added Role Column
        { header: 'Nature of Work', key: 'nature', width: 35 },
        { header: 'Work Date', key: 'date', width: 15 },
        { header: 'Address', key: 'address', width: 50 },
      ];

      // Dynamically add columns for images found in the dataset
      for (let i = 1; i <= maxImageCount; i++) {
        columns.push({ header: `Image ${i}`, key: `img_${i}`, width: 50 });
      }
      columns.push({ header: 'Assigner', key: 'assigner', width: 25 });
      worksheet.columns = columns;

      // 3. Map Data using centralized Mapper logic
      data.forEach((item, index) => {
        const rowData: any = {
          sno: index + 1,
          employee: item.employee?.name || MiscWorkMapper.DEFAULT_TEXT,
          role: item.employee?.role || "Staff", // Added Role Data
          nature: item.natureOfWork || MiscWorkMapper.DEFAULT_NATURE,
          // Use centralized date formatting
          date: MiscWorkMapper.formatDate(item.workDate),
          address: item.address || MiscWorkMapper.DEFAULT_ADDRESS,
          assigner: item.assignedBy?.name || MiscWorkMapper.DEFAULT_TEXT,
        };

        // Populate dynamic image columns with hyperlinks
        if (item.images) {
          item.images.forEach((url, i) => {
            rowData[`img_${i + 1}`] = { text: url, hyperlink: url };
          });
        }
        worksheet.addRow(rowData);
      });

      // 4. Branded Styling & Alignment
      worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell, colNumber) => {
          const columnKey = worksheet.getColumn(colNumber).key;

          cell.alignment = {
            horizontal: 'left',
            vertical: 'middle',
            wrapText: columnKey === 'address' || columnKey === 'nature'
          };

          if (rowNumber === 1) {
            // Header styling using brand colors
            cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FF197ADC' } // Branded Secondary Blue
            };
          } else if (cell.value && typeof cell.value === 'object' && 'hyperlink' in cell.value) {
            // Hyperlink styling for images
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
    if (!data || data.length === 0) return toast.error("No data to export");
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