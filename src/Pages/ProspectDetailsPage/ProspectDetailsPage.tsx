import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import ProspectDetailsContent from './ProspectDetailsContent';
import {
  getFullProspectDetails,
  deleteProspect,
  updateProspect,
  transferProspectToParty,
  uploadProspectImage,
  deleteProspectImage,
  getProspectCategoriesList, // ✅ Import this
  type FullProspectDetailsData,
  type Prospect,
  type ProspectCategoryData // ✅ Import this type
} from '../../api/prospectService';
import toast from 'react-hot-toast';

// Import Modals
import ConfirmationModal from '../../components/modals/ConfirmationModal';
import EditEntityModal, { type EditEntityData } from '../../components/modals/EditEntityModal';

const PROSPECT_QUERY_KEY = 'prospectDetails';
const CATEGORIES_QUERY_KEY = 'prospectCategories'; // ✅ Key for caching

const ProspectDetailsPage: React.FC = () => {
  const { prospectId } = useParams<{ prospectId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  // 1. FETCH PROSPECT DETAILS
  const prospectQuery = useQuery<FullProspectDetailsData, Error>({
    queryKey: [PROSPECT_QUERY_KEY, prospectId],
    queryFn: () => getFullProspectDetails(prospectId!),
    enabled: !!prospectId,
  });

  // 2. ✅ FETCH CATEGORIES (for the Edit Modal)
  const categoriesQuery = useQuery<ProspectCategoryData[], Error>({
    queryKey: [CATEGORIES_QUERY_KEY],
    queryFn: getProspectCategoriesList,
    enabled: isEditOpen, // Only fetch when modal is opened to save resources
    staleTime: 5 * 60 * 1000 // Cache for 5 minutes
  });

  // 3. UPDATE MUTATION
  const updateMutation = useMutation({
    mutationFn: (payload: Partial<Prospect>) => updateProspect(prospectId!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROSPECT_QUERY_KEY, prospectId] });
      queryClient.invalidateQueries({ queryKey: ['prospects'] });
      // Also invalidate categories if a new one was added during update (optional, but good practice)
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_QUERY_KEY] }); 
      toast.success('Prospect updated successfully!');
      setIsEditOpen(false);
    },
    onError: (error: any) => toast.error(error.message || 'Failed to update prospect.'),
  });

  // 4. DELETE MUTATION
  const deleteMutation = useMutation({
    mutationFn: () => deleteProspect(prospectId!),
    onSuccess: () => {
      toast.success('Prospect deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['prospects'] });
      navigate('/prospects');
    },
    onError: (error: any) => toast.error(error.message || 'Failed to delete prospect.'),
  });

  // 5. TRANSFER MUTATION
  const transferMutation = useMutation({
    mutationFn: () => transferProspectToParty(prospectId!),
    onSuccess: (newParty) => {
      toast.success('Prospect successfully transferred to party!');
      queryClient.invalidateQueries({ queryKey: ['prospects'] });
      queryClient.invalidateQueries({ queryKey: ['parties'] });
      navigate(`/parties/${newParty._id}`);
    },
    onError: (error: any) => toast.error(error.message || 'Failed to transfer prospect.'),
  });

  // 6. UPLOAD IMAGE MUTATION
  const uploadImageMutation = useMutation({
    mutationFn: (variables: { imageNumber: number; file: File }) =>
      uploadProspectImage(prospectId!, variables.imageNumber, variables.file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROSPECT_QUERY_KEY, prospectId] });
      toast.success('Image uploaded successfully!');
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to upload image.'),
  });

  // 7. DELETE IMAGE MUTATION
  const deleteImageMutation = useMutation({
    mutationFn: (imageNumber: number) =>
      deleteProspectImage(prospectId!, imageNumber),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROSPECT_QUERY_KEY, prospectId] });
      toast.success('Image deleted successfully!');
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to delete image.'),
  });

  // --- Handlers ---
  const handleModalSave = async (updatedData: Partial<EditEntityData>) => {
    if (!updatedData) return;

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
      // Pass 'interest' to match frontend interface (mapper will handle it)
      interest: (updatedData as any).prospectInterest, 
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

  const handleImageUpload = (imageNumber: number, file: File) => {
    if (!prospectId) return;
    uploadImageMutation.mutate({ imageNumber, file });
  };

  const handleImageDelete = (imageNumber: number) => {
    if (!prospectId) return;
    deleteImageMutation.mutate(imageNumber);
  };

  const isLoading = prospectQuery.isPending;
  const isMutating = updateMutation.isPending || deleteMutation.isPending || uploadImageMutation.isPending || deleteImageMutation.isPending;
  const isTransferring = transferMutation.isPending;
  const errorMsg = prospectQuery.isError ? prospectQuery.error.message : null;
  const prospectData = prospectQuery.data;

  // Safe access for modal data
  const modalInitialData = prospectData ? {
      name: prospectData.prospect.name,
      ownerName: prospectData.prospect.ownerName,
      dateJoined: prospectData.prospect.dateJoined,
      address: prospectData.location.address ?? '',
      description: prospectData.prospect.description ?? '',
      latitude: prospectData.location.latitude ?? 0,
      longitude: prospectData.location.longitude ?? 0,
      email: prospectData.contact.email ?? '',
      phone: (prospectData.contact.phone ?? '').replace(/[^0-9]/g, ''),
      panVat: prospectData.prospect.panVat ?? '',
      prospectInterest: prospectData.prospect.interest || [],
  } : undefined;

  return (
    <Sidebar>
      <ProspectDetailsContent
        prospect={prospectData?.prospect || null}
        contact={prospectData?.contact || null}
        location={prospectData?.location || null}
        loading={isLoading}
        error={errorMsg}
        isMutating={isMutating}
        isUploading={uploadImageMutation.isPending}
        isDeletingImage={deleteImageMutation.isPending}
        isTransferring={isTransferring}
        images={prospectData?.prospect?.images || []}
        onDataRefresh={() => queryClient.invalidateQueries({ queryKey: [PROSPECT_QUERY_KEY, prospectId] })}
        onOpenEditModal={() => setIsEditOpen(true)}
        onDeleteRequest={() => setIsDeleteConfirmOpen(true)}
        onTransferRequest={() => setIsTransferModalOpen(true)}
        onImageUpload={handleImageUpload}
        onImageDelete={handleImageDelete}
      />

      {/* Modals */}
      {prospectData && modalInitialData && (
        <>
          <ConfirmationModal
            isOpen={isDeleteConfirmOpen}
            title="Confirm Deletion"
            message={`Are you sure you want to delete "${prospectData.prospect.name}"? This action cannot be undone.`} 
            onConfirm={handleDeleteConfirmed}
            onCancel={() => setIsDeleteConfirmOpen(false)}
            confirmButtonText="Delete"
            confirmButtonVariant="danger"
          />

          <ConfirmationModal
            isOpen={isTransferModalOpen}
            title="Confirm Transfer"
            message={`Are you sure you want to transfer "${prospectData.prospect.name}" to a Party? This prospect record will be removed.`}
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
            initialData={modalInitialData}
            entityType="Prospect" 
            categoriesData={categoriesQuery.data || []}
          />
        </>
      )}
    </Sidebar>
  );
};

export default ProspectDetailsPage;