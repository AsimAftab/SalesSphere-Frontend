import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import ProspectDetailsContent from './ProspectDetailsContent';
import {
  getProspectById,
  deleteProspect,
  updateProspect,
  transferProspectToParty,
  type Prospect,
} from '../../api/prospectService';
import toast from 'react-hot-toast';

// Import Modals
import ConfirmationModal from '../../components/modals/DeleteEntityModal';
import EditEntityModal, { type EditEntityData } from '../../components/modals/EditEntityModal';

// Define a unique key for this query
const PROSPECT_QUERY_KEY = 'prospectDetails';

const ProspectDetailsPage: React.FC = () => {
  const { prospectId } = useParams<{ prospectId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // State for controlling the modals
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  // 1. FETCH QUERY (GET)
  const prospectQuery = useQuery<Prospect, Error>({
    queryKey: [PROSPECT_QUERY_KEY, prospectId],
    queryFn: () => getProspectById(prospectId!),
    enabled: !!prospectId, // Only run if prospectId exists
  });

  // 2. UPDATE MUTATION (PUT)
  const updateMutation = useMutation({
    mutationFn: (payload: Partial<Prospect>) => updateProspect(prospectId!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROSPECT_QUERY_KEY, prospectId] });
       queryClient.invalidateQueries({ queryKey: ['prospects'] });
      toast.success('Prospect updated successfully!');
      setIsEditOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update prospect.');
    },
  });


  // 3. DELETE MUTATION (DELETE)
  const deleteMutation = useMutation({
    mutationFn: () => deleteProspect(prospectId!),
    onSuccess: () => {
      toast.success('Prospect deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['prospects'] }); // Invalidate the list
      navigate('/prospects');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete prospect.');
    },
  });

  // 4. TRANSFER MUTATION (POST)
  const transferMutation = useMutation({
    mutationFn: () => transferProspectToParty(prospectId!),
    onSuccess: (newParty) => {
      toast.success('Prospect successfully transferred to party!');
      queryClient.invalidateQueries({ queryKey: ['prospects'] }); // Invalidate prospect list
      queryClient.invalidateQueries({ queryKey: ['parties'] }); // Invalidate party list
      navigate(`/parties/${newParty._id}`); // Navigate to new party
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to transfer prospect.');
    },
  });

  // --- Handlers for Modals and Content ---

  // Wrapper function to map modal data to API data
  const handleModalSave = async (updatedData: Partial<EditEntityData>) => {
    const prospectUpdatePayload: Partial<Prospect> = {
      name: updatedData.name,
      ownerName: updatedData.ownerName,
      address: updatedData.address,
      latitude: updatedData.latitude,
      longitude: updatedData.longitude,
      email: updatedData.email,
      phone: updatedData.phone,
      panVat: updatedData.panVat,
      description: updatedData.description,
    };
    updateMutation.mutate(prospectUpdatePayload);
  };

  const handleDeleteConfirmed = () => {
    deleteMutation.mutate();
    setIsDeleteConfirmOpen(false);
  };

  const handleTransferConfirmed = () => {
    transferMutation.mutate();
    setIsTransferModalOpen(false);
  };

  // Combine all loading states for the UI
  const isLoading =
    prospectQuery.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending ||
    transferMutation.isPending;
  const errorMsg = prospectQuery.isError ? prospectQuery.error.message : null;
  const prospectData = prospectQuery.data;

  return (
    <Sidebar>
      <ProspectDetailsContent
        data={prospectData || null}
        loading={isLoading}
        error={errorMsg}
        onDataRefresh={() => queryClient.invalidateQueries({ queryKey: [PROSPECT_QUERY_KEY, prospectId] })}
        // Pass functions to the child to open the modals
        onOpenEditModal={() => setIsEditOpen(true)}
        onDeleteRequest={() => setIsDeleteConfirmOpen(true)}
        onTransferRequest={() => setIsTransferModalOpen(true)}
      />

      {/* Modals are now rendered here, in the parent */}
      {prospectData && (
        <>
          <ConfirmationModal
            isOpen={isDeleteConfirmOpen}
            title="Confirm Deletion"
            message={`Are you sure you want to delete "${prospectData.name}"? This action cannot be undone.`}
            onConfirm={handleDeleteConfirmed}
            onCancel={() => setIsDeleteConfirmOpen(false)}
            confirmButtonText="Delete"
            confirmButtonVariant="danger"
          />

          <ConfirmationModal
            isOpen={isTransferModalOpen}
            title="Confirm Transfer"
            message={`Are you sure you want to transfer "${prospectData.name}" to a Party? This prospect record will be removed.`}
            onConfirm={handleTransferConfirmed}
            onCancel={() => setIsTransferModalOpen(false)}
            confirmButtonText="Transfer"
            confirmButtonVariant="primary"
          />

          <EditEntityModal
            isOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            onSave={handleModalSave}
            title="Edit Prospect"
            nameLabel="Prospect Name"
            ownerLabel="Owner Name"
            panVatMode="optional"
            descriptionMode="required"
            initialData={{
              name: prospectData.name,
              ownerName: prospectData.ownerName,
              dateJoined: prospectData.dateJoined,
              address: prospectData.address ?? '',
              description: prospectData.description ?? '',
              latitude: prospectData.latitude ?? 0,
              longitude: prospectData.longitude ?? 0,
              email: prospectData.email ?? '',
              phone: (prospectData.phone ?? '').replace(/[^0-9]/g, ''),
              panVat: prospectData.panVat ?? '',
            }}
          />
        </>
      )}
    </Sidebar>
  );
};

export default ProspectDetailsPage;