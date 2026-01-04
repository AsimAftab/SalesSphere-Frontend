// src/pages/Entities/PartyPage/partyExportUtils.ts
import React from 'react';
import toast from 'react-hot-toast';
// ✅ FIX: Use 'import type' for Party and ensure correct path
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

  setStatus('excel');
  try {
    const response = await getAllPartiesDetails();
    const allDetailedData = Array.isArray(response) ? response : (response as any).data;

    const filteredIds = new Set(filteredData.map(p => p.id));
    const finalDataToExport = allDetailedData.filter((p: any) => filteredIds.has(p.id || p._id));

    const ExcelJS = await import('exceljs');
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
    worksheet.getColumn('phone').numFmt = '0'; 
    worksheet.getRow(1).font = { bold: true };
    
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `Party_List_${new Date().toISOString().split('T')[0]}.xlsx`);

    toast.success('Excel exported successfully');
  } catch (err) {
    console.error(err);
    toast.error('Failed to export Excel');
  } finally {
    setStatus(null);
  }
};