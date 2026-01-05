import React from 'react';
import toast from 'react-hot-toast';
import type { Party } from '../../../api/partyService';
import { getAllPartiesDetails } from '../../../api/partyService';

export const handleExportPdf = async (
  filteredData: Party[], 
  setStatus: (status: 'pdf' | null) => void
) => {
  if (filteredData.length === 0) return toast.error("No parties to export");

  setStatus('pdf');
  try {
    const response = await getAllPartiesDetails();
    const allDetailedData = Array.isArray(response) ? response : (response as any).data;

    const filteredIds = new Set(filteredData.map(p => p.id));
    const finalDataToExport = allDetailedData.filter((p: any) => filteredIds.has(p.id || p._id));

    const { pdf } = await import('@react-pdf/renderer');
    // ✅ FIX: Import directly if default export, or use named import
    const PartyListPDF = (await import('./PartyListPDF')).default;

    // ✅ FIX: Cast to any to resolve the "DocumentProps" type mismatch
    const docElement = React.createElement(PartyListPDF, { 
        parties: finalDataToExport 
    }) as any;

    const blob = await pdf(docElement).toBlob();
    
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    toast.success('PDF generated in new tab');
  } catch (err) {
    console.error(err);
    toast.error('Failed to export PDF');
  } finally {
    setStatus(null);
  }
};

export const handleExportExcel = async (
  filteredData: Party[], 
  setStatus: (status: 'excel' | null) => void
) => {
  if (filteredData.length === 0) return toast.error("No parties to export");

  const toastId = toast.loading("Generating Party report...");
  setStatus('excel');

  try {
    const response = await getAllPartiesDetails();
    const allDetailedData = Array.isArray(response) ? response : (response as any).data;

    const filteredIds = new Set(filteredData.map(p => p.id));
    const finalDataToExport = allDetailedData.filter((p: any) => filteredIds.has(p.id || p._id));

    // Lazy load libraries
    const ExcelJS = (await import('exceljs')).default;
    const { saveAs } = await import('file-saver');

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Parties');
    
    worksheet.columns = [
      { header: 'S.No', key: 's_no', width: 10 },
      { header: 'Party Name', key: 'companyName', width: 25 },
      { header: 'Owner Name', key: 'ownerName', width: 20 },
      { header: 'Party Type', key: 'partyType', width: 15 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Phone', key: 'phone', width: 18 }, 
      { header: 'PAN/VAT', key: 'panVat', width: 15 },
      { header: 'Date Joined', key: 'dateJoined', width: 15 },
      { header: 'Address', key: 'address', width: 30 },
      { header: 'Description', key: 'description', width: 50 }, 
    ];

    const rows = finalDataToExport.map((party: any, index: number) => {
      const rawPhone = party.phone || party.contact?.phone;
      const phoneAsNumber = rawPhone ? Number(rawPhone.toString().replace(/\D/g, '')) : null;

      return {
        s_no: index + 1,
        companyName: party.companyName || party.partyName,
        ownerName: party.ownerName,
        partyType: party.partyType || 'N/A',
        email: party.email || party.contact?.email || 'N/A',
        phone: phoneAsNumber || 'N/A',
        panVat: party.panVat || party.panVatNumber || 'N/A', 
        dateJoined: party.dateCreated || party.createdAt 
          ? new Date(party.dateCreated || party.createdAt).toLocaleDateString() 
          : 'N/A',
        address: party.address || party.location?.address || '',
        description: party.description || 'N/A',
      };
    });

    worksheet.addRows(rows);

    // 1. Style the Header (Row 1)
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }; // White Bold Font
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF197ADC' } // Corporate Blue Background
      };
      cell.alignment = { vertical: 'middle', horizontal: 'left' };
    });

    // 2. Format Phone Column
    const phoneColumn = worksheet.getColumn('phone');
    phoneColumn.numFmt = '0'; // Ensure it's treated as a number/plain string
    phoneColumn.alignment = { horizontal: 'left', vertical: 'middle' }; // Force left alignment

    // 3. Apply Global Alignment for all cells (optional but recommended for consistency)
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) { // Skip header as it's styled above
        row.eachCell((cell) => {
          cell.alignment = { vertical: 'middle', horizontal: 'left' };
        });
      }
    });
    
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `Party_List_${new Date().toISOString().split('T')[0]}.xlsx`);

    toast.success('Excel exported successfully', { id: toastId });
  } catch (err) {
    console.error(err);
    toast.error('Failed to export Excel', { id: toastId });
  } finally {
    setStatus(null);
  }
};