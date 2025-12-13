import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import PartyContent from './PartyContent';
import { 
  getParties, 
  addParty, 
  getAllPartiesDetails, // ✅ Ensure this is imported from service
  type NewPartyData 
} from '../../api/partyService';
import toast from 'react-hot-toast';

const PARTIES_QUERY_KEY = 'parties';

const PartyPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [exportingStatus, setExportingStatus] = useState<'pdf' | 'excel' | null>(null);

  // 1. Fetch Party List
  const partyQuery = useQuery({
    queryKey: [PARTIES_QUERY_KEY],
    queryFn: getParties,
    staleTime: 1000 * 60 * 5, 
  });

  // 2. Add Party Mutation
  const addPartyMutation = useMutation({
    mutationFn: (newPartyData: NewPartyData) => addParty(newPartyData),
    onSuccess: () => {
      toast.success('Party added successfully!');
      queryClient.invalidateQueries({ queryKey: [PARTIES_QUERY_KEY] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add party');
    },
  });

  const handleSaveParty = (newPartyData: NewPartyData) => {
    addPartyMutation.mutate(newPartyData);
  };

  // --- EXPORT HANDLERS ---

  // 3. Export PDF
  const handleExportPdf = async () => {
    setExportingStatus('pdf');
    try {
      // Fetch full details specifically for export
      const response = await getAllPartiesDetails();
      const partiesData = Array.isArray(response) ? response : (response as any).data;

      // Lazy load libraries
      const { pdf } = await import('@react-pdf/renderer');
      const { saveAs } = await import('file-saver');
      const PartyListPDF = (await import('./PartyListPDF')).default;

      // Generate Blob
      const doc = <PartyListPDF parties={partiesData} />;
      const blob = await pdf(doc).toBlob();
      saveAs(blob, `Party_List_${new Date().toISOString().split('T')[0]}.pdf`);
      
      toast.success('PDF exported successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to export PDF');
    } finally {
      setExportingStatus(null);
    }
  };

// 4. Export Excel (Fixed Address Width + Left Aligned Phone)
  const handleExportExcel = async () => {
    setExportingStatus('excel');
    try {
      const response = await getAllPartiesDetails();
      const partiesData = Array.isArray(response) ? response : (response as any).data;
      const ExcelJS = await import('exceljs');
      const { saveAs } = await import('file-saver');
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Parties');
      const columns = [
        { header: 'S.No', key: 's_no', width: 10 ,style: { alignment: { horizontal: 'left' }}},
        { header: 'Party Name', key: 'companyName', width: 25 },
        { header: 'Owner Name', key: 'ownerName', width: 20 },
        { header: 'Email', key: 'email', width: 25 },
        { 
          header: 'Phone', 
          key: 'phone', 
          width: 15, 
          style: { alignment: { horizontal: 'left' } } 
        }, 
        { header: 'PAN/VAT', key: 'panVat', width: 15, style: { numFmt: '@' } },
        
        // ADDRESS: Will be auto-sized below
        { header: 'Date Joined', key: 'dateJoined', width: 15 },
        { header: 'Address', key: 'address', width: 30 },
        
        // IMAGE: Before Description
        { header: 'Image URL', key: 'image', width: 30 }, 

        // DESCRIPTION: Last column, wrap text
        { header: 'Description', key: 'description', width: 50, style: { alignment: { wrapText: true } } }, 
      ];

      worksheet.columns = columns as any;

      // 2. Prepare Rows
      const rows = partiesData.map((party: any, index: number) => {
        const rowData: any = {
          s_no: index + 1,
          companyName: party.companyName,
          ownerName: party.ownerName,
          email: party.email || 'N/A',
          phone: party.phone ? Number(party.phone) : 'N/A',
          panVat: party.panVat ? String(party.panVat) : 'N/A', 
          dateJoined: party.dateCreated ? new Date(party.dateCreated).toLocaleDateString() : 'N/A',
          address: party.address || '', // Ensure it's not null for length check
          description: party.description ? party.description.substring(0, 32000) : 'N/A',
        };

        if (party.image) {
          rowData.image = {
            text: party.image, 
            hyperlink: party.image,
            tooltip: 'Click to open image'
          };
        } else {
          rowData.image = 'N/A';
        }

        return rowData;
      });

      worksheet.addRows(rows);

      // 3. Style Header
      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true };
      headerRow.commit();

      // 4. Style Hyperlinks
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return;
        const cell = row.getCell('image');
        if (cell.value && typeof cell.value === 'object' && 'hyperlink' in cell.value) {
          cell.font = { color: { argb: 'FF0000FF' }, underline: true };
        }
      });

      // 5. Dynamic Column Width Calculation (Improved)
      worksheet.columns.forEach((column) => {
        let maxLength = 0;
        
        // Start with header length
        if (column.header) {
            maxLength = column.header.length;
        }

        // Check every cell in the column
        column.eachCell && column.eachCell({ includeEmpty: true }, (cell) => {
          let columnLength = 0;
          if (cell.value) {
            if (typeof cell.value === 'object' && 'text' in (cell.value as any)) {
                columnLength = (cell.value as any).text.toString().length;
            } else {
                columnLength = cell.value.toString().length;
            }
          }
          if (columnLength > maxLength) {
            maxLength = columnLength;
          }
        });

        // Add padding (extra space)
        // If it is the Address column, give it a bit more breathing room
        const padding = column.key === 'address' ? 5 : 2;
        
        // Increase Max Limit to 100 characters (was 50/60)
        column.width = Math.min(maxLength + padding, 100); 
      });

      // 6. Write Buffer
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `Party_List_${new Date().toISOString().split('T')[0]}.xlsx`);

      toast.success('Excel exported successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to export Excel');
    } finally {
      setExportingStatus(null);
    }
  };



  return (
    <Sidebar>
      <PartyContent
        data={partyQuery.data || null}
        loading={partyQuery.isPending}
        error={partyQuery.isError ? partyQuery.error.message : null}
        onSaveParty={handleSaveParty}
        isCreating={addPartyMutation.isPending}
        // Pass export props
        onExportPdf={handleExportPdf}
        onExportExcel={handleExportExcel}
        exportingStatus={exportingStatus}
      />
    </Sidebar>
  );
};

export default PartyPage;