import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import PartyDetailsContent, {
  type FullPartyDetailsData,
  type Order,
} from './PartyDetailsContent';
import { getPartyDetails, deleteParty, updateParty, type Party } from '../../api/partyService';
import toast from 'react-hot-toast';

// Import the modals
import ConfirmationModal from '../../components/modals/DeleteEntityModal';
import EditEntityModal, { type EditEntityData } from '../../components/modals/EditEntityModal';

// Define a unique key for this query
const PARTY_QUERY_KEY = 'partyDetails';

// Helper function to fetch all data for this page
const fetchFullPartyData = async (partyId: string): Promise<FullPartyDetailsData> => {
  if (!partyId) throw new Error('Party ID is missing.');
  
  // 1. Fetch the main party data
  const party = await getPartyDetails(partyId);
  
  // 2. Fetch related orders (currently mocked as empty)
  // When you build your orders API, you'll fetch them here.
  const orders: Order[] = []; 
  
  return { party, orders };
};

const PartyDetailsPage: React.FC = () => {
  const { partyId } = useParams<{ partyId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // State for controlling the modals now lives in the parent
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // 1. FETCH QUERY (GET)
  const partyQuery = useQuery<FullPartyDetailsData, Error>({
    queryKey: [PARTY_QUERY_KEY, partyId],
    queryFn: () => fetchFullPartyData(partyId!),
    enabled: !!partyId, // Only run if partyId exists
  });

  // 2. UPDATE MUTATION (PUT)
  const updateMutation = useMutation({
    mutationFn: (payload: Partial<Party>) => updateParty(partyId!, payload),
    onSuccess: () => {
      // Invalidate the query to refetch data in the background
      queryClient.invalidateQueries({ queryKey: [PARTY_QUERY_KEY, partyId] });
      toast.success('Party updated successfully!');
      setIsEditOpen(false); // Close modal on success
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update party.');
    },
  });

  // 3. DELETE MUTATION (DELETE)
  const deleteMutation = useMutation({
    mutationFn: () => deleteParty(partyId!),
    onSuccess: () => {
      toast.success('Party deleted successfully');
      // Invalidate the main 'parties' list
      queryClient.invalidateQueries({ queryKey: ['parties'] }); 
      navigate('/parties');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete party.');
    },
  });

  // --- Handlers for Modals and Content ---

  // Wrapper function to map modal data to API data
  const handleModalSave = async (updatedData: Partial<EditEntityData>) => {
    const partyUpdatePayload: Partial<Party> = {
      companyName: updatedData.name,
      ownerName: updatedData.ownerName,
      address: updatedData.address,
      latitude: updatedData.latitude,
      longitude: updatedData.longitude,
      email: updatedData.email,
      phone: updatedData.phone,
      panVat: updatedData.panVat,
      description: updatedData.description,
    };
    // Run the mutation
    updateMutation.mutate(partyUpdatePayload);
  };

  const handleDeleteConfirmed = () => {
    deleteMutation.mutate();
    setIsDeleteConfirmOpen(false);
  };
  
  // Combine all loading states for the UI
  const isLoading = partyQuery.isPending || updateMutation.isPending || deleteMutation.isPending;
  const errorMsg = partyQuery.isError ? partyQuery.error.message : null;
  const partyData = partyQuery.data?.party;

  return (
    <Sidebar>
      <PartyDetailsContent
        data={partyQuery.data || null}
        loading={isLoading}
        error={errorMsg}
        onDataRefresh={() => queryClient.invalidateQueries({ queryKey: [PARTY_QUERY_KEY, partyId] })}
        // Pass functions to the child to open the modals
        onOpenEditModal={() => setIsEditOpen(true)}
        onDeleteRequest={() => setIsDeleteConfirmOpen(true)}
      />

      {/* Modals are now rendered here, in the parent */}
      {partyData && (
        <ConfirmationModal
          isOpen={isDeleteConfirmOpen}
          title="Confirm Deletion"
          message={`Are you sure you want to delete "${partyData.companyName}"? This action cannot be undone.`}
          onConfirm={handleDeleteConfirmed}
          onCancel={() => setIsDeleteConfirmOpen(false)}
          confirmButtonText="Delete"
          confirmButtonVariant="danger"
        />
      )}
      
      {partyData && (
        <EditEntityModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          onSave={handleModalSave} // Pass the save handler
          title="Edit Party"
          nameLabel="Party Name"
          ownerLabel="Owner Name"
          panVatMode="required"
          descriptionMode="required"
          initialData={{
             name: partyData.companyName,
             ownerName: partyData.ownerName,
             dateJoined: partyData.dateCreated,
             address: partyData.address ?? '',
             description: partyData.description ?? '',
             latitude: partyData.latitude ?? 0,
             longitude: partyData.longitude ?? 0,
             email: partyData.email ?? '',
             phone: (partyData.phone ?? '').replace(/[^0-9]/g, ''),
             panVat: partyData.panVat ?? '',
          }}
        />
      )}
    </Sidebar>
  );
};

export default PartyDetailsPage;