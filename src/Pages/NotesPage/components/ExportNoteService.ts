import React from "react";
import { type Note } from "../../../api/notesService";
import toast from "react-hot-toast";

export const ExportNoteService = {
  async exportToExcel(filteredData: Note[]) {
    if (filteredData.length === 0) return toast.error("No data to export");
    const toastId = toast.loading("Generating Excel...");

    try {
      const ExcelJS = (await import("exceljs")).default;
      const { saveAs } = await import("file-saver");
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Notes Report");

      worksheet.columns = [
        { header: "S.No", key: "sno", width: 8 },
        { header: "Title", key: "title", width: 25 },
        { header: "Description", key: "description", width: 40 },
        { header: "Linked To", key: "linkedTo", width: 20 },
        { header: "Created By", key: "employee", width: 20 },
        { header: "Date", key: "date", width: 15 },
      ];

      filteredData.forEach((item, index) => {
        worksheet.addRow({
          sno: index + 1,
          title: item.title,
          description: item.description,
          linkedTo: item.partyName || item.prospectName || item.siteName || "General",
          employee: item.createdBy.name,
          date: item.createdAt ? new Date(item.createdAt).toISOString().split('T')[0] : '—',
        });
      });

      // Apply headers and borders
      worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF197ADC" } };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      });

      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(new Blob([buffer]), `Notes_Report_${new Date().toISOString().split("T")[0]}.xlsx`);
      toast.success("Excel exported!", { id: toastId });
    } catch (err) {
      toast.error("Export failed", { id: toastId });
    }
  },

  // FIXED: Added 'any' type to ReactElement to satisfy @react-pdf/renderer's strict DocumentProps requirement
  async exportToPdf(_filteredData: Note[], PDFComponent: React.ReactElement<any>) {
    const toastId = toast.loading("Preparing PDF...");
    try {
      const { pdf } = await import("@react-pdf/renderer");
      // FIXED: Cast PDFComponent to any inside pdf() to resolve the DocumentProps type mismatch
      const blob = await pdf(PDFComponent as any).toBlob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      toast.success("PDF Generated!", { id: toastId });
      
      // Cleanup URL after a short delay
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (err) {
      console.error("PDF Export Error:", err);
      toast.error("PDF generation failed", { id: toastId });
    }
  }
};