import React from 'react';
import toast from 'react-hot-toast';
import type { Prospect } from '../../../api/prospectService';
import { getAllProspectsDetails } from '../../../api/prospectService';


export const handleExportPdf = async (
  filteredData: Prospect[],
  setStatus: (status: 'pdf' | null) => void
) => {
  if (filteredData.length === 0) return toast.error("No prospects to export");

  setStatus('pdf');


  try {
    // Fetch full details for all prospects to ensure we have images/interests
    const allDetailedData = await getAllProspectsDetails();

    // Filter the detailed records to match the user's current filtered view
    const filteredIds = new Set(filteredData.map(p => p.id));
    const finalDataToExport = allDetailedData.filter((p: any) => filteredIds.has(p._id || p.id));

    // Lazy load PDF libraries
    const { pdf } = await import('@react-pdf/renderer');
    const ProspectListPDF = (await import('./ProspectListPDF')).default;

    const docElement = React.createElement(ProspectListPDF, {
      prospects: finalDataToExport
    }) as any;

    const blob = await pdf(docElement).toBlob();
    window.open(URL.createObjectURL(blob), '_blank');
    toast.success('PDF exported successfully');
  } catch (err) {
    toast.error('Failed to export PDF');
  } finally {
    setStatus(null);
  }
};

/**
 * Excel Export with Lazy Loading & Dynamic Columns
 */
/**
 * Excel Export with Lazy Loading & Dynamic Columns
 * Aligned with Site Module Standards
 */
export const handleExportExcel = async (
  filteredData: Prospect[],
  setStatus: (status: 'excel' | null) => void
) => {
  if (!filteredData || filteredData.length === 0) return toast.error("No prospects to export");


  setStatus('excel');

  try {
    // 1. Fetch Full Detailed Data
    const allDetailedData = await getAllProspectsDetails();
    const filteredIds = new Set(filteredData.map(p => p.id));
    // Data is typed as 'any' here to handle raw API variations before strict mapping
    const rawDetailedData = allDetailedData.filter((p: any) => filteredIds.has(p._id || p.id));

    // 2. Lazy Load Excel Libraries
    const ExcelJS = (await import('exceljs')).default;
    const { saveAs } = await import('file-saver');

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Prospect Details');

    // 3. Calculate Dynamic Column Needs
    const maxImages = rawDetailedData.reduce((max: number, p: any) =>
      Math.max(max, (p.images?.length || 0)), 0);

    // Get Unique Categories
    const activeCategoriesSet = new Set<string>();
    rawDetailedData.forEach((p: any) => {
      const interests = p.interest || p.prospectInterest || [];
      interests.forEach((i: any) => { if (i.category) activeCategoriesSet.add(i.category); });
    });
    const dynamicCategories = Array.from(activeCategoriesSet).sort();

    // 4. Define Columns (Aligned with Sites)
    const columns: any[] = [
      { header: 'S.No', key: 'sno', width: 8 },
      { header: 'Prospect Name', key: 'name', width: 25 },
      { header: 'Owner Name', key: 'owner', width: 20 },
      { header: 'Phone', key: 'phone', width: 16 },
      { header: 'Email', key: 'email', width: 27 },
      { header: 'PAN/VAT', key: 'panVat', width: 15 },
      { header: 'Address', key: 'address', width: 40 },
      { header: 'Created By', key: 'createdBy', width: 25 },
      { header: 'Joined Date', key: 'date', width: 15 },
    ];

    for (let i = 0; i < maxImages; i++) {
      columns.push({ header: `Image URL ${i + 1}`, key: `img_${i}`, width: 25 });
    }

    dynamicCategories.forEach(catName => {
      columns.push({ header: `${catName} (Brands)`, key: `cat_${catName}`, width: 35 });
    });

    worksheet.columns = columns;

    // Define Strict Export Interface
    interface ProspectExportRow {
      sno: number;
      name: string;
      owner: string;
      phone: number | string | null;
      email: string;
      panVat: string;
      address: string;
      createdBy: string;
      date: string;
      [key: string]: string | number | null | undefined | { text: string; hyperlink: string; tooltip: string };
    }

    // 5. Add Rows with detailed mapping
    rawDetailedData.forEach((p: any, index: number) => {
      const cleanPhone = (p.contact?.phone || p.phone)
        ? Number((p.contact?.phone || p.phone).toString().replace(/\D/g, ''))
        : null;

      const rowData: ProspectExportRow = {
        sno: index + 1,
        name: p.prospectName || p.name || '-',
        owner: p.ownerName || '-',
        phone: cleanPhone || (p.contact?.phone || p.phone || '-'), // Fallback to string if clean fails
        email: p.contact?.email || p.email || '-',
        panVat: p.panVatNumber || p.panVat || '-',
        address: p.location?.address || p.address || '-',
        createdBy: p.createdBy?.name || '-',
        date: p.dateJoined ? new Date(p.dateJoined).toISOString().split('T')[0] : '-',
      };

      // Map Images as Hyperlinks
      if (p.images) {
        p.images.forEach((img: any, imgIdx: number) => {
          if (img.imageUrl) {
            rowData[`img_${imgIdx}`] = {
              text: 'View Image',
              hyperlink: img.imageUrl,
              tooltip: 'Click to open'
            };
          }
        });
      }

      // Map Dynamic Interest Categories
      dynamicCategories.forEach(catName => {
        const interests = p.interest || p.prospectInterest || [];
        const match = interests.find((i: any) => i.category === catName);
        rowData[`cat_${catName}`] = match ? (match.brands?.join(', ') || '-') : '-';
      });

      const row = worksheet.addRow(rowData);

      // Hyperlink styling
      for (let i = 0; i < maxImages; i++) {
        const cell = row.getCell(`img_${i}`);
        if (cell.value && typeof cell.value === 'object') {
          cell.font = { color: { argb: 'FF0000FF' }, underline: true };
        }
      }
    });

    // 6. Final Styling (Exact Site Match)

    // Header Row Styling
    const headerRow = worksheet.getRow(1);
    headerRow.height = 30;
    headerRow.eachCell((cell) => {
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF197ADC' }
      };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFFFFFFF' } },
        left: { style: 'thin', color: { argb: 'FFFFFFFF' } },
        bottom: { style: 'thin', color: { argb: 'FFFFFFFF' } },
        right: { style: 'thin', color: { argb: 'FFFFFFFF' } }
      };
    });

    // Data Row Styling
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        row.height = 25;
      }

      row.eachCell((cell, colNumber) => {
        // Standard Border
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          right: { style: 'thin', color: { argb: 'FFE5E7EB' } }
        };

        // Alignment Logic
        // Center: S.No (1), Date (9)
        // Wrap: Address (7)
        // Left: Others
        if ([1, 9].includes(colNumber)) {
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
        } else if (colNumber === 7) {
          cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true, indent: 1 };
        } else {
          cell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
        }
      });
    });

    // 7. Generate and Save
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `Detailed_Prospect_Report_${new Date().toISOString().split('T')[0]}.xlsx`);

    toast.success("Excel exported successfully");
  } catch (err) {
    toast.error("Failed to export Excel");
  } finally {
    setStatus(null);
  }
};