// src/api/tour-plans/components/ExportTourService.ts
import React from "react";
import { type TourPlan } from "../../../api/tourPlanService";
import toast from "react-hot-toast";

export const ExportTourService = {
  async exportToExcel(filteredData: TourPlan[]) {
    if (filteredData.length === 0) {
      toast.error("No data available to export");
      return;
    }

    const toastId = toast.loading("Generating Excel report...");

    try {
      const ExcelJS = (await import("exceljs")).default;
      const { saveAs } = await import("file-saver");

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Tour Plans Report");

      worksheet.columns = [
        { header: "S.No", key: "sno", width: 8 },
        { header: "Place of Visit", key: "place", width: 30 },
        { header: "Purpose", key: "purpose", width: 30 },
        { header: "Start Date", key: "start", width: 15 },
        { header: "End Date", key: "end", width: 15 },
        { header: "Duration (Days)", key: "days", width: 15 },
        { header: "Created By", key: "employee", width: 25 },
        { header: "Status", key: "status", width: 15 },
        { header: "Reviewer", key: "reviewer", width: 25 },
      ];

      filteredData.forEach((item, index) => {
        worksheet.addRow({
          sno: index + 1,
          place: item.placeOfVisit,
          purpose: item.purposeOfVisit,
          start: item.startDate,
          end: item.endDate,
          days: item.numberOfDays,
           employee: item.createdBy.name,
          status: item.status.toUpperCase(),
          reviewer: item.approvedBy?.name || "N/A",
        });
      });

      // HEADER STYLING
      worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF197ADC" },
        };
        // FIXED: Changed to left alignment as requested
        cell.alignment = { horizontal: "left", vertical: "middle" };
        
        // Add borders to header
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });

      // DATA ROW STYLING
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
          row.eachCell((cell) => {
            // FIXED: Alignment left for all data cells
            cell.alignment = { vertical: "middle", horizontal: "left", wrapText: true };
            
            // FIXED: Added Borders to all data cells
            cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' }
            };
          });

          if (rowNumber % 2 === 0) {
            row.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF9FAFB" } };
          }
        }
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const dateStr = new Date().toISOString().split("T")[0];
      saveAs(new Blob([buffer]), `Tour_Plans_Report_${dateStr}.xlsx`);

      toast.success("Excel report exported successfully!", { id: toastId });
    } catch (err) {
      console.error("Excel Export Error:", err);
      toast.error("Failed to generate Excel report", { id: toastId });
    }
  },

  async exportToPdf(filteredData: TourPlan[], PDFComponent: React.ReactElement<any>) {
    // ... (rest of PDF logic remains the same)
    if (filteredData.length === 0) {
        toast.error("No data available to export");
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