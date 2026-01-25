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
    toast.success('PDF generated Successfully.');
  } catch (err) {
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

    // 1. Column Definitions (Image at the end)
    worksheet.columns = [
      { header: 'S.No', key: 's_no', width: 8 },
      { header: 'Party Name', key: 'companyName', width: 25 },
      { header: 'Owner Name', key: 'ownerName', width: 20 },
      { header: 'Party Type', key: 'partyType', width: 15 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Phone', key: 'phone', width: 18 },
      { header: 'PAN/VAT', key: 'panVat', width: 15 },
      { header: 'Date Joined', key: 'dateJoined', width: 15 },
      { header: 'Address', key: 'address', width: 30 },
      { header: 'Description', key: 'description', width: 40 },
      { header: 'Image', key: 'image', width: 20 }, // Moved to last
    ];

    // Define Strict Export Interface
    interface PartyExportRow {
      s_no: number;
      companyName: string;
      ownerName: string;
      partyType: string;
      email: string;
      phone: number | string | null;
      panVat: string;
      dateJoined: string;
      address: string;
      description: string;
      image: string | { text: string; hyperlink: string; tooltip: string };
    }

    // process rows
    finalDataToExport.forEach((party: any, index: number) => {
      const rawPhone = party.phone || party.contact?.phone;
      const phoneAsNumber = rawPhone ? Number(rawPhone.toString().replace(/\D/g, '')) : null;

      // Ensure PAN/VAT is a string
      const panVatValue = party.panVat || party.panVatNumber;
      const panVatString = panVatValue ? String(panVatValue) : 'N/A';

      const rowData: PartyExportRow = {
        s_no: index + 1,
        companyName: party.companyName || party.partyName,
        ownerName: party.ownerName,
        partyType: party.partyType || 'Not Specified',
        email: party.email || party.contact?.email || 'N/A',
        phone: phoneAsNumber || 'N/A',
        panVat: panVatString,
        dateJoined: party.dateCreated || party.createdAt
          ? new Date(party.dateCreated || party.createdAt).toISOString().split('T')[0]
          : 'N/A', // Format: YYYY-MM-DD
        address: party.address || party.location?.address || '',
        description: party.description || 'N/A',
        image: party.image ? {
          text: 'View Image',
          hyperlink: party.image,
          tooltip: 'Click to view image'
        } : 'No Image'
      };

      const row = worksheet.addRow(rowData);

      // Style the hyperlink if present
      if (party.image) {
        const cell = row.getCell('image');
        cell.font = { color: { argb: 'FF0000FF' }, underline: true };
      }
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

      // White borders
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
        // Standard Border
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          right: { style: 'thin', color: { argb: 'FFE5E7EB' } }
        };

        // Alignment Logic
        // Center: S.No (1), Date (8)
        if ([1, 8].includes(colNumber)) {
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
        }
        // Wrap Description (10)
        else if (colNumber === 10) {
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
    saveAs(new Blob([buffer]), `Party_List_${new Date().toISOString().split('T')[0]}.xlsx`);

    toast.success('Excel exported successfully.');
  } catch (err) {
    toast.error('Failed to export Excel');
  } finally {
    setStatus(null);
  }
};