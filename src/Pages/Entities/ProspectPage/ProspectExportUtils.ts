import React from 'react';
import toast from 'react-hot-toast';
import type { Prospect} from '../../../api/prospectService';
import { getAllProspectsDetails } from '../../../api/prospectService';


export const handleExportPdf = async (
  filteredData: Prospect[], 
  setStatus: (status: 'pdf' | null) => void
) => {
  if (filteredData.length === 0) return toast.error("No prospects to export");

  setStatus('pdf');
  const toastId = toast.loading("Preparing PDF report...");

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
    toast.success('PDF generated successfully', { id: toastId });
  } catch (err) {
    console.error("PDF Export Error:", err);
    toast.error('Failed to export PDF', { id: toastId });
  } finally {
    setStatus(null);
  }
};

/**
 * Excel Export with Lazy Loading & Dynamic Columns
 */
export const handleExportExcel = async (
  filteredData: Prospect[], 
  setStatus: (status: 'excel' | null) => void
) => {
  if (!filteredData || filteredData.length === 0) return toast.error("No prospects to export");

  const toastId = toast.loading("Generating detailed Excel report...");
  setStatus('excel');

  try {
    // 1. Fetch Full Detailed Data
    const allDetailedData = await getAllProspectsDetails();
    const filteredIds = new Set(filteredData.map(p => p.id));
    // Data is typed as 'any' here because the raw API response might use different keys before mapping
    const rawDetailedData = allDetailedData.filter((p: any) => filteredIds.has(p._id || p.id));

    // 2. Lazy Load Excel Libraries
    const ExcelJS = (await import('exceljs')).default;
    const { saveAs } = await import('file-saver');

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Prospect Details');

    // 3. Calculate Dynamic Column Needs
    // Based on ApiProspectImage interface
    const maxImages = rawDetailedData.reduce((max: number, p: any) => 
      Math.max(max, (p.images?.length || 0)), 0);

    // Get Unique Categories across detailed data
    const activeCategoriesSet = new Set<string>();
    rawDetailedData.forEach((p: any) => {
      // Use raw API key 'prospectInterest' or mapped 'interest'
      const interests = p.interest || p.prospectInterest || [];
      interests.forEach((i: any) => { if (i.category) activeCategoriesSet.add(i.category); });
    });
    const dynamicCategories = Array.from(activeCategoriesSet).sort();

    // 4. Define Columns
    const columns: any[] = [
      { header: 'S.No', key: 'sno', width: 8 },
      { header: 'Prospect Name', key: 'name', width: 25 },
      { header: 'Owner Name', key: 'owner', width: 20 },
      { header: 'Phone', key: 'phone', width: 18 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'PAN/VAT', key: 'panVat', width: 15 },
      { header: 'Address', key: 'address', width: 40 },
    ];

    for (let i = 0; i < maxImages; i++) {
      columns.push({ header: `Image URL ${i + 1}`, key: `img_${i}`, width: 35 });
    }

    dynamicCategories.forEach(catName => {
      columns.push({ header: `${catName} (Brands)`, key: `cat_${catName}`, width: 25 });
    });

    worksheet.columns = columns;

    // 5. Add Rows with detailed mapping
    rawDetailedData.forEach((p: any, index: number) => {
      const rowData: any = {
        sno: index + 1,
        name: p.prospectName || p.name || '-',
        owner: p.ownerName || '-',
        phone: p.contact?.phone || p.phone || '-',
        email: p.contact?.email || p.email || '-',
        panVat: p.panVatNumber || p.panVat || '-',
        address: p.location?.address || p.address || '-',
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

    // 6. Final Styling
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.alignment = { horizontal: 'left', vertical: 'middle' };
        if (rowNumber === 1) {
          cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF197ADC' } };
        }
      });
    });

    // 7. Generate and Save
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `Detailed_Prospect_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
    
    toast.success("Excel exported successfully", { id: toastId });
  } catch (err) {
    console.error("Excel Export Error:", err);
    toast.error("Failed to generate Excel", { id: toastId });
  } finally {
    setStatus(null);
  }
};