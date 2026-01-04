// src/pages/Entities/PartyPage/PartyPage.tsx
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Sidebar from '../../../components/layout/Sidebar/Sidebar';
import PartyContent from './PartyContent';
import { 
  getParties, 
  addParty, 
  getPartyTypes,
  type Party, // ✅ Ensure Party type is imported
  type NewPartyData 
} from '../../../api/partyService';
import { fetchMyOrganization } from '../../../api/SuperAdmin/organizationService'; 
import toast from 'react-hot-toast';
import { handleExportPdf, handleExportExcel } from './partyExportUtils';

const PartyPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [exportingStatus, setExportingStatus] = useState<'pdf' | 'excel' | null>(null);

  // --- Queries ---
  const orgQuery = useQuery({
    queryKey: ['myOrganization'],
    queryFn: fetchMyOrganization,
    staleTime: 1000 * 60 * 60, 
  });

  const partyQuery = useQuery({
    queryKey: ['parties'],
    queryFn: getParties,
    staleTime: 1000 * 60 * 5, 
  });

  const typesQuery = useQuery({
    queryKey: ['partyTypes'],
    queryFn: getPartyTypes,
    staleTime: 1000 * 60 * 30,
  });

  // --- Mutations ---
  const addPartyMutation = useMutation({
    mutationFn: (newPartyData: NewPartyData) => addParty(newPartyData),
    onSuccess: () => {
      toast.success('Party added successfully!');
      queryClient.invalidateQueries({ queryKey: ['parties'] });
      queryClient.invalidateQueries({ queryKey: ['partyTypes'] });
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to add party'),
  });

  return (
    <Sidebar>
      <PartyContent
        data={partyQuery.data || null}
        partyTypesList={typesQuery.data || []}
        loading={partyQuery.isPending}
        error={partyQuery.isError ? (partyQuery.error as Error).message : null}
        onSaveParty={(data: NewPartyData) => addPartyMutation.mutate(data)}
        isCreating={addPartyMutation.isPending}
        // ✅ Explicitly typed 'data' parameter to fix TS7006 error
        onExportPdf={(data: Party[]) => handleExportPdf(data, setExportingStatus)}
        onExportExcel={(data: Party[]) => handleExportExcel(data, setExportingStatus)}
        exportingStatus={exportingStatus}
        organizationId={orgQuery.data?.data?._id}
        organizationName={orgQuery.data?.data?.name}
        onRefreshData={() => queryClient.invalidateQueries({ queryKey: ['parties'] })}
      />
    </Sidebar>
  );
};

export default PartyPage;