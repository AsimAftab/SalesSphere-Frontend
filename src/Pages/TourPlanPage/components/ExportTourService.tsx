// src/api/tour-plans/components/ExportTourService.ts
import React from "react";
import { type TourPlan } from "../../../api/tourPlanService";
import toast from "react-hot-toast";

// Interface for strictly typed export data
interface TourPlanExportRow {
  sno: number;
  place: string;
  purpose: string;
  start: string;
  end: string;
  days: number;
  employee: string;
  status: string;
  reviewer: string;
}

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

      // DEFINE COLUMNS
      worksheet.columns = [
        { header: "S.No", key: "sno", width: 8 },
        { header: "Place of Visit", key: "place", width: 30 },
        { header: "Purpose", key: "purpose", width: 35 },
        { header: "Start Date", key: "start", width: 14 },
        { header: "End Date", key: "end", width: 14 },
        { header: "Duration (Days)", key: "days", width: 17 },
        { header: "Created By", key: "employee", width: 25 },
        { header: "Status", key: "status", width: 15 },
        { header: "Reviewer", key: "reviewer", width: 25 },
      ];

      // POPULATE ROWS
      filteredData.forEach((item, index) => {
        const rowData: TourPlanExportRow = {
          sno: index + 1,
          place: item.placeOfVisit,
          purpose: item.purposeOfVisit,
          start: item.startDate,
          end: item.endDate || "-",
          days: item.numberOfDays,
          employee: item.createdBy.name,
          status: item.status.toUpperCase(),
          reviewer: item.approvedBy?.name || "Under Review",
        };
        worksheet.addRow(rowData);
      });

      // STYLE HEADER ROW
      const headerRow = worksheet.getRow(1);
      headerRow.height = 30;
      headerRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 12 };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF197ADC" },
        };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFFFFFFF' } },
          left: { style: 'thin', color: { argb: 'FFFFFFFF' } },
          bottom: { style: 'thin', color: { argb: 'FFFFFFFF' } },
          right: { style: 'thin', color: { argb: 'FFFFFFFF' } }
        };
      });

      // STYLE DATA ROWS
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
          row.height = 25; // Consistent row height

          row.eachCell((cell, colNumber) => {
            // Standard Light Border
            cell.border = {
              top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
              left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
              bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
              right: { style: 'thin', color: { argb: 'FFE5E7EB' } }
            };

            // Alignment Logic
            // Center: S.No (1), Start (4), End (5), Days (6), Status (8)
            // Left with wrap: Place (2), Purpose (3), Employee (7), Reviewer (9)
            if ([1, 4, 5, 6, 8].includes(colNumber)) {
              cell.alignment = { vertical: "middle", horizontal: "center" };
            } else {
              cell.alignment = { vertical: "middle", horizontal: "left", wrapText: true, indent: 1 };
            }
          });
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

  async exportToPdf(filteredData: TourPlan[], PDFComponent: React.ReactElement) {
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