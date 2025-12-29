import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import PartyContent from './PartyContent';
import { 
  getParties, 
  addParty, 
  getAllPartiesDetails, 
  getPartyTypes,
  type Party, // Import Party type
  type NewPartyData 
} from '../../api/partyService';
import { fetchMyOrganization } from '../../api/SuperAdmin/organizationService'; 
import toast from 'react-hot-toast';

const PARTIES_QUERY_KEY = 'parties';
const ORG_QUERY_KEY = 'myOrganization'; 
const PARTY_TYPES_QUERY_KEY = 'partyTypes';

const PartyPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [exportingStatus, setExportingStatus] = useState<'pdf' | 'excel' | null>(null);

  // --- Queries ---
  const orgQuery = useQuery({
    queryKey: [ORG_QUERY_KEY],
    queryFn: fetchMyOrganization,
    staleTime: 1000 * 60 * 60, 
  });

  const organizationId = orgQuery.data?.data?._id;
  const organizationName = orgQuery.data?.data?.name;

  const partyQuery = useQuery({
    queryKey: [PARTIES_QUERY_KEY],
    queryFn: getParties,
    staleTime: 1000 * 60 * 5, 
  });

  const typesQuery = useQuery({
    queryKey: [PARTY_TYPES_QUERY_KEY],
    queryFn: getPartyTypes,
    staleTime: 1000 * 60 * 30,
  });

  // --- Mutations ---
  const addPartyMutation = useMutation({
    mutationFn: (newPartyData: NewPartyData) => addParty(newPartyData),
    onSuccess: () => {
      toast.success('Party added successfully!');
      queryClient.invalidateQueries({ queryKey: [PARTIES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [PARTY_TYPES_QUERY_KEY] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add party');
    },
  });

  const handleSaveParty = (newPartyData: NewPartyData) => {
    addPartyMutation.mutate(newPartyData);
  };

  const handleRefreshData = () => {
    queryClient.invalidateQueries({ queryKey: [PARTIES_QUERY_KEY] });
    queryClient.invalidateQueries({ queryKey: [PARTY_TYPES_QUERY_KEY] });
  };

  // --- Export Logic ---

  // UPDATED: Now accepts filteredData from the UI
  const handleExportPdf = async (filteredData: Party[]) => {
    if (filteredData.length === 0) return toast.error("No parties to export");
    
    setExportingStatus('pdf');
    try {
      // 1. Fetch detailed data (kept as requested)
      const response = await getAllPartiesDetails();
      const allDetailedData = Array.isArray(response) ? response : (response as any).data;

      // 2. Filter the detailed data to match only what is currently filtered in UI
      const filteredIds = new Set(filteredData.map(p => p.id));
      const finalDataToExport = allDetailedData.filter((p: any) => filteredIds.has(p.id || p._id));

      const { pdf } = await import('@react-pdf/renderer');
      const PartyListPDF = (await import('./PartyListPDF')).default;

      // 3. Create PDF Blob
      const doc = <PartyListPDF parties={finalDataToExport} />;
      const blob = await pdf(doc).toBlob();
      
      // 4. OPEN IN NEW TAB
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      
      toast.success('PDF generated in new tab');
    } catch (err) {
      console.error(err);
      toast.error('Failed to export PDF');
    } finally {
      setExportingStatus(null);
    }
  };

  // UPDATED: Now accepts filteredData from the UI
  const handleExportExcel = async (filteredData: Party[]) => {
    if (filteredData.length === 0) return toast.error("No parties to export");

    setExportingStatus('excel');
    try {
      // 1. Fetch detailed data
      const response = await getAllPartiesDetails();
      const allDetailedData = Array.isArray(response) ? response : (response as any).data;

      // 2. Filter detailed data based on UI visible items
      const filteredIds = new Set(filteredData.map(p => p.id));
      const finalDataToExport = allDetailedData.filter((p: any) => filteredIds.has(p.id || p._id));

      const ExcelJS = await import('exceljs');
      const { saveAs } = await import('file-saver');
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Parties');
      
      const columns = [
        { header: 'S.No', key: 's_no', width: 10, style: { alignment: { horizontal: 'left' }}},
        { header: 'Party Name', key: 'companyName', width: 25 },
        { header: 'Owner Name', key: 'ownerName', width: 20 },
        { header: 'Party Type', key: 'partyType', width: 15 },
        { header: 'Email', key: 'email', width: 25 },
        // Phone column configured for numbers
        { header: 'Phone', key: 'phone', width: 18, style: { alignment: { horizontal: 'left' } } }, 
        { header: 'PAN/VAT', key: 'panVat', width: 15, style: { numFmt: '@' } },
        { header: 'Date Joined', key: 'dateJoined', width: 15 },
        { header: 'Address', key: 'address', width: 30 },
        { header: 'Description', key: 'description', width: 50, style: { alignment: { wrapText: true } } }, 
      ];

      worksheet.columns = columns as any;

      const rows = finalDataToExport.map((party: any, index: number) => {
        // Extract raw phone string from various possible paths
        const rawPhone = party.phone || party.contact?.phone;
        
        // Convert to Number: removes non-numeric chars and converts to number type
        const phoneAsNumber = rawPhone ? Number(rawPhone.toString().replace(/\D/g, '')) : null;

        return {
          s_no: index + 1,
          companyName: party.companyName || party.partyName,
          ownerName: party.ownerName,
          partyType: party.partyType || 'N/A',
          email: party.email || party.contact?.email || 'N/A',
          // Explicitly passing the numeric value
          phone: phoneAsNumber || 'N/A',
          panVat: party.panVat || party.panVatNumber || 'N/A', 
          dateJoined: party.dateCreated || party.createdAt ? new Date(party.dateCreated || party.createdAt).toLocaleDateString() : 'N/A',
          address: party.address || party.location?.address || '',
          description: party.description || 'N/A',
        };
      });

      worksheet.addRows(rows);

      // Force Numeric formatting on the Phone column (Column F in this setup)
      worksheet.getColumn('phone').numFmt = '0'; 

      worksheet.getRow(1).font = { bold: true };
      
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `Party_List_Filtered_${new Date().toISOString().split('T')[0]}.xlsx`);

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
        partyTypesList={typesQuery.data || []}
        loading={partyQuery.isPending}
        error={partyQuery.isError ? (partyQuery.error as Error).message : null}
        onSaveParty={handleSaveParty}
        isCreating={addPartyMutation.isPending}
        // Passing the updated handlers
        onExportPdf={handleExportPdf}
        onExportExcel={handleExportExcel}
        exportingStatus={exportingStatus}
        organizationId={organizationId} 
        organizationName={organizationName}
        onRefreshData={handleRefreshData}
      />
    </Sidebar>
  );
};

export default PartyPage;