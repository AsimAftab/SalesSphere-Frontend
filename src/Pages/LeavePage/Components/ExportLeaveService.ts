import React from "react";
import { type LeaveRequest } from "../../../api/leaveService";
import toast from "react-hot-toast";

export const ExportLeaveService = {
  /**
   * Generates a professional Excel report with custom styling and borders.
   */
  async exportToExcel(filteredData: LeaveRequest[]) {
    if (filteredData.length === 0) {
      toast.error("No leave data available to export");
      return;
    }

    const toastId = toast.loading("Generating Excel report...");

    try {
      // Dynamic imports for optimization
      const ExcelJS = (await import("exceljs")).default;
      const { saveAs } = await import("file-saver");

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Leave Requests Report");

      // Define Columns
      worksheet.columns = [
        { header: "S.No", key: "sno", width: 8 },
        { header: "Employee", key: "employee", width: 25 },
        { header: "Category", key: "category", width: 25 },
        { header: "Start Date", key: "start", width: 15 },
        { header: "End Date", key: "end", width: 15 },
        { header: "Days", key: "days", width: 10 },
        { header: "Reason", key: "reason", width: 35 },
        { header: "Reviewer", key: "reviewer", width: 25 },
        { header: "Status", key: "status", width: 15 },
       
      ];

      // Add Data Rows
      filteredData.forEach((item, index) => {
        worksheet.addRow({
          sno: index + 1,
          employee: item.createdBy.name,
          category: item.category.replace(/_/g, ' ').toUpperCase(),
          start: item.startDate,
          end: item.endDate || "Single Day",
          days: item.leaveDays,
          reason: item.reason,
           reviewer: item.approvedBy?.name || "N/A",
          status: item.status.toUpperCase(),
         
        });
      });

      // Header Styling (SOLID: Separated styling logic)
      worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF197ADC" }, // SalesSphere Secondary Blue
        };
        cell.alignment = { horizontal: "left", vertical: "middle" };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });

      // Data Row Styling
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
          row.eachCell((cell) => {
            cell.alignment = { vertical: "middle", horizontal: "left", wrapText: true };
            cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' }
            };
          });

          // Zebra Striping
          if (rowNumber % 2 === 0) {
            row.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF9FAFB" } };
          }
        }
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const dateStr = new Date().toISOString().split("T")[0];
      saveAs(new Blob([buffer]), `Leave_Report_${dateStr}.xlsx`);

      toast.success("Excel report exported successfully!", { id: toastId });
    } catch (err) {
      console.error("Excel Export Error:", err);
      toast.error("Failed to generate Excel report", { id: toastId });
    }
  },

  /**
   * Generates a PDF document and opens it in a new browser tab.
   */
  async exportToPdf(filteredData: LeaveRequest[], PDFComponent: React.ReactElement<any>) {
    if (filteredData.length === 0) {
      toast.error("No leave data available to export");
      return;
    }

    const toastId = toast.loading("Preparing PDF Document...");

    try {
      const { pdf } = await import("@react-pdf/renderer");
      const blob = await pdf(PDFComponent as any).toBlob();
      const url = URL.createObjectURL(blob);
      
      window.open(url, "_blank");
      
      toast.success("PDF opened in new tab!", { id: toastId });
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (err) {
      console.error("PDF Export Error:", err);
      toast.error("Failed to generate PDF document", { id: toastId });
    }
  },
};