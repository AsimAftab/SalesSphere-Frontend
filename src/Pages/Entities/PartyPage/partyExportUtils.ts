import React from 'react';
import toast from 'react-hot-toast';
import type { Party } from '../../../api/partyService';
import { getAllPartiesDetails } from '../../../api/partyService';
import { formatDisplayDate } from '../../../utils/dateUtils';
import { generatePdfBlob } from '../../../utils/pdfUtils';

/** Extended Party type for export - includes raw API fallback fields */
interface PartyExportData extends Party {
  contact?: { phone?: string; email?: string };
  partyName?: string;
  panVatNumber?: string;
  location?: { address?: string };
}

export const handleExportPdf = async (
  filteredData: Party[],
  setStatus: (status: 'pdf' | null) => void
) => {
  if (filteredData.length === 0) return toast.error("No parties to export");

  setStatus('pdf');
  try {
    const response = await getAllPartiesDetails();
    const allDetailedData: Party[] = Array.isArray(response) ? response : (response as { data: Party[] }).data;

    const filteredIds = new Set(filteredData.map(p => p.id));
    const finalDataToExport = allDetailedData.filter((p: Party) => filteredIds.has(p.id));

    const PartyListPDF = (await import('./PartyListPDF')).default;

    const docElement = React.createElement(PartyListPDF, {
      parties: finalDataToExport
    }) as React.ReactElement;

    const blob = await generatePdfBlob(docElement);

    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    toast.success('PDF generated Successfully.');
  } catch {
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
    const allDetailedData: Party[] = Array.isArray(response) ? response : (response as { data: Party[] }).data;

    const filteredIds = new Set(filteredData.map(p => p.id));
    const finalDataToExport = allDetailedData.filter((p: Party) => filteredIds.has(p.id));

    // Lazy load libraries
    const ExcelJS = (await import('exceljs')).default;
    const { saveAs } = await import('file-saver');

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Parties');

    // 1. Column Definitions (Image at the end)
    worksheet.columns = [
      { header: 'S.No', key: 's_no', width: 10 },
      { header: 'Party Name', key: 'companyName', width: 35 },
      { header: 'Owner Name', key: 'ownerName', width: 25 },
      { header: 'Party Type', key: 'partyType', width: 20 },
      { header: 'Email', key: 'email', width: 40 },
      { header: 'Phone', key: 'phone', width: 20 },
      { header: 'PAN/VAT', key: 'panVat', width: 20 },
      { header: 'Date Joined', key: 'dateJoined', width: 20 },
      { header: 'Address', key: 'address', width: 60 },
      { header: 'Description', key: 'description', width: 50 },
      { header: 'Image', key: 'image', width: 15 }, // Moved to last
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
    finalDataToExport.forEach((party: PartyExportData, index: number) => {
      const rawPhone = party.phone || party.contact?.phone;
      const phoneAsNumber = rawPhone ? Number(rawPhone.toString().replace(/\D/g, '')) : null;

      // Ensure PAN/VAT is a string
      const panVatValue = party.panVat || party.panVatNumber;
      const panVatString = panVatValue ? String(panVatValue) : 'N/A';

      const rowData: PartyExportRow = {
        s_no: index + 1,
        companyName: party.companyName || party.partyName || '',
        ownerName: party.ownerName,
        partyType: party.partyType || 'Not Specified',
        email: party.email || party.contact?.email || 'N/A',
        phone: phoneAsNumber || 'N/A',
        panVat: panVatString,
        dateJoined: party.dateCreated || party.createdAt
          ? formatDisplayDate(party.dateCreated || party.createdAt || '')
          : 'N/A',
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
        // Wrap Address (9) and Description (10)
        else if ([9, 10].includes(colNumber)) {
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
  } catch {
    toast.error('Failed to export Excel');
  } finally {
    setStatus(null);
  }
};