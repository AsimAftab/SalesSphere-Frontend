import React from "react";
import { type LeaveRequest } from "../../../api/leaveService";
import toast from "react-hot-toast";
import { generatePdfBlob } from "../../../utils/pdfUtils";

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
        { header: "Category", key: "category", width: 20 },
        { header: "Start Date", key: "start", width: 15 },
        { header: "End Date", key: "end", width: 15 },
        { header: "Days", key: "days", width: 10 },
        { header: "Reason", key: "reason", width: 40 },
        { header: "Reviewer", key: "reviewer", width: 20 },
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
          reviewer: item.approvedBy?.name || "Under Review",
          status: item.status.toUpperCase(),
        });
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

        // White borders for header to match Party Export
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFFFFFFF' } },
          left: { style: 'thin', color: { argb: 'FFFFFFFF' } },
          bottom: { style: 'thin', color: { argb: 'FFFFFFFF' } },
          right: { style: 'thin', color: { argb: 'FFFFFFFF' } }
        };
      });

      // 5. Row Formatting: Alignment, Borders, and Wrapping
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
          row.height = 25;
        }

        row.eachCell((cell, colNumber) => {
          // Standard Grey Border
          cell.border = {
            top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
            left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
            bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
            right: { style: 'thin', color: { argb: 'FFE5E7EB' } }
          };

          // Alignment Logic
          // Center: S.No (1), Start Date (4), End Date (5), Days (6)
          if ([1, 4, 5, 6].includes(colNumber)) {
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
          }
          // Wrap Description/Reason (7)
          else if (colNumber === 7) {
            cell.alignment = {
              vertical: 'middle',
              horizontal: 'left',
              wrapText: true,
              indent: 1
            };
          }
          else {
            cell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
          }
        });
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
  async exportToPdf(filteredData: LeaveRequest[], PDFComponent: React.ReactElement) {
    if (filteredData.length === 0) {
      toast.error("No leave data available to export");
      return;
    }

    const toastId = toast.loading("Generating PDF report...");

    try {
      const blob = await generatePdfBlob(PDFComponent);
      const url = URL.createObjectURL(blob);

      window.open(url, "_blank");

      toast.success("PDF report generated successfully!", { id: toastId });
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (err) {
      toast.error("Failed to generate PDF report", { id: toastId });
    }
  },
};