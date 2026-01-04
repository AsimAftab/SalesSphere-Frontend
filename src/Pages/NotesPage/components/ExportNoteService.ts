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

      // 1. Determine the maximum number of images any single note has
      const maxImages = Math.max(...filteredData.map(n => n.images?.length || 0), 0);

      // 2. Define Base Columns
      const baseColumns = [
        { header: "S.No", key: "sno", width: 8 },
        { header: "Title", key: "title", width: 25 },
        { header: "Date", key: "date", width: 15 },
        { header: "Entity Type", key: "entityType", width: 15 },
        { header: "Entity Name", key: "linkedTo", width: 20 },
        { header: "Created By", key: "employee", width: 20 },
        { header: "Description", key: "description", width: 40 },
      ];

      // 3. Dynamically add Image Columns (Image 1, Image 2, etc.)
      const imageColumns = Array.from({ length: maxImages }, (_, i) => ({
        header: `Image ${i + 1}`,
        key: `image_${i}`,
        width: 20,
      }));

      worksheet.columns = [...baseColumns, ...imageColumns];

      filteredData.forEach((item, index) => {
        const entityType = item.partyName ? "Party" 
                         : item.prospectName ? "Prospect" 
                         : item.siteName ? "Site" 
                         : "General";

        // Clean description of illegal characters that crash Excel
        const cleanDescription = item.description?.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F-\x9F]/g, "") || "";

        const rowData: any = {
          sno: index + 1,
          title: item.title,
          entityType: entityType,
          linkedTo: item.partyName || item.prospectName || item.siteName || "General",
          description: cleanDescription,
          employee: item.createdBy.name,
          date: item.createdAt ? new Date(item.createdAt).toISOString().split('T')[0] : '—',
        };

        const row = worksheet.addRow(rowData);

        // 4. Populate dynamic image columns with safe hyperlinks
        if (item.images && item.images.length > 0) {
          item.images.forEach((img, imgIdx) => {
            const cell = row.getCell(baseColumns.length + imgIdx + 1);
            if (img.imageUrl) {
              cell.value = {
                text: "View Attachment",
                hyperlink: img.imageUrl,
              };
              cell.font = { color: { argb: "FF0000FF" }, underline: true };
            }
          });
        }
      });

      // Header Styling
      worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF197ADC" } };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      });

      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(new Blob([buffer]), `Notes_Report_${new Date().toISOString().split("T")[0]}.xlsx`);
      toast.success("Excel exported!", { id: toastId });
    } catch (err) {
      console.error("Excel Export Error:", err);
      toast.error("Export failed", { id: toastId });
    }
  },

  async exportToPdf(_filteredData: Note[], PDFComponent: React.ReactElement<any>) {
    const toastId = toast.loading("Preparing PDF...");
    try {
      const { pdf } = await import("@react-pdf/renderer");
      const blob = await pdf(PDFComponent as any).toBlob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      toast.success("PDF Generated!", { id: toastId });
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (err) {
      console.error("PDF Export Error:", err);
      toast.error("PDF generation failed", { id: toastId });
    }
  }
};