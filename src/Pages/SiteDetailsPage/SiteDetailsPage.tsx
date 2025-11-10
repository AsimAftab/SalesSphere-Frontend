import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import SiteDetailsContent from './SiteDetailsContent';
import {
  getFullSiteDetails,
  updateSite,
  deleteSite,
  uploadSiteImage,
  deleteSiteImage,
  type FullSiteDetailsData,
  type Site,
} from '../../api/siteService';
import toast from 'react-hot-toast';

// Import Modals
import ConfirmationModal from '../../components/modals/DeleteEntityModal';
import EditEntityModal, {
  type EditEntityData,
} from '../../components/modals/EditEntityModal';

// Define a unique key for this query
const SITE_QUERY_KEY = 'siteDetails';

const SiteDetailsPage: React.FC = () => {
  const { siteId } = useParams<{ siteId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // State for controlling the modals
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // 1. FETCH QUERY (GET)
  const siteQuery = useQuery<FullSiteDetailsData, Error>({
    queryKey: [SITE_QUERY_KEY, siteId],
    queryFn: () => getFullSiteDetails(siteId!),
    enabled: !!siteId,
  });

  // 2. UPDATE MUTATION (PUT)
  const updateMutation = useMutation({
    mutationFn: (payload: Partial<Site>) => updateSite(siteId!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SITE_QUERY_KEY, siteId] });
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      toast.success('Site updated successfully!');
      setIsEditOpen(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update site.');
    },
  });

  // 3. DELETE MUTATION (DELETE)
  const deleteMutation = useMutation({
    mutationFn: () => deleteSite(siteId!),
    onSuccess: () => {
      toast.success('Site deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      navigate('/sites');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete site.');
    },
  });

  // 4. UPLOAD IMAGE MUTATION (POST)
  const uploadImageMutation = useMutation({
    mutationFn: (variables: { imageNumber: number; file: File }) =>
      uploadSiteImage(siteId!, variables.imageNumber, variables.file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SITE_QUERY_KEY, siteId] });
      toast.success('Image uploaded successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to upload image.');
    },
  });

  // 5. DELETE IMAGE MUTATION (DELETE)
  const deleteImageMutation = useMutation({
    mutationFn: (imageNumber: number) =>
      deleteSiteImage(siteId!, imageNumber),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SITE_QUERY_KEY, siteId] });
      toast.success('Image deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete image.');
    },
  });

  // --- Handlers for Modals, Content, and Images ---

  const handleModalSave = async (updatedData: EditEntityData) => {
    const siteUpdatePayload: Partial<Site> = {
      name: updatedData.name,
      ownerName: updatedData.ownerName,
      dateJoined: updatedData.dateJoined,
      address: updatedData.address,
      latitude: updatedData.latitude,
      longitude: updatedData.longitude,
      email: updatedData.email,
      phone: updatedData.phone,
      description: updatedData.description,
    };
    updateMutation.mutate(siteUpdatePayload);
  };

  const handleDeleteConfirmed = () => {
    deleteMutation.mutate();
    setIsDeleteConfirmOpen(false);
  };

  // --- Image Handlers ---
  const handleImageUpload = (imageNumber: number, file: File) => {
    if (!siteId) return;
    uploadImageMutation.mutate({ imageNumber, file });
  };

  const handleImageDelete = (imageNumber: number) => {
    if (!siteId) return;
    deleteImageMutation.mutate(imageNumber);
  };

  // Combine all loading states for the UI
  const isPageLoading = siteQuery.isPending;
  const isDeletingSite = deleteMutation.isPending;
  const isUpdatingSite = updateMutation.isPending;
  const isUploadingImage = uploadImageMutation.isPending;
  const isDeletingImage = deleteImageMutation.isPending;

  const errorMsg = siteQuery.isError ? siteQuery.error.message : null;
  const siteData = siteQuery.data;

  const isMutating =
    isDeletingSite ||
    isUpdatingSite ||
    isUploadingImage ||
    isDeletingImage;

  return (
    <Sidebar>
      <SiteDetailsContent
        site={siteData?.site || null}
        contact={siteData?.contact || null}
        location={siteData?.location || null}
        loading={isPageLoading}
        error={errorMsg}
        isMutating={isMutating}
        isUploading={isUploadingImage}
        isDeletingImage={isDeletingImage}
        // --- THIS IS THE FIX ---
        images={siteData?.site?.images || []} // Was siteData?.site.images
        // ---
        onDataRefresh={() =>
          queryClient.invalidateQueries({ queryKey: [SITE_QUERY_KEY, siteId] })
        }
        onOpenEditModal={() => setIsEditOpen(true)}
        onDeleteRequest={() => setIsDeleteConfirmOpen(true)}
        onImageUpload={handleImageUpload}
        onImageDelete={handleImageDelete}
      />

      {/* Modals are now rendered here, in the parent */}
      {/* We also check for location/contact to prevent modal pop-in before data is fully loaded */}
      {siteData && siteData.site && siteData.location && siteData.contact && (
        <>
          <ConfirmationModal
            isOpen={isDeleteConfirmOpen}
            title="Confirm Deletion"
            message={`Are you sure you want to delete "${siteData.site.siteName}"? This action cannot be undone.`}
            onConfirm={handleDeleteConfirmed}
            onCancel={() => setIsDeleteConfirmOpen(false)}
            confirmButtonText="Delete"
            confirmButtonVariant="danger"
          />

          <EditEntityModal
            isOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            onSave={handleModalSave}
            title="Edit Site"
            nameLabel="Site Name"
            ownerLabel="Owner Name"
            panVatMode="hidden"
            descriptionMode="optional"
            initialData={{
              name: siteData.site.siteName,
              ownerName: siteData.site.ownerName,
              dateJoined: siteData.site.dateJoined,
              address: siteData.location.address ?? '',
              description: siteData.site.description ?? '',
              latitude: siteData.location.latitude ?? 0,
              longitude: siteData.location.longitude ?? 0,
              email: siteData.contact.email ?? '',
              phone: (siteData.contact.phone ?? '').replace(/[^0-9]/g, ''),
              panVat: '',
            }}
          />
        </>
      )}
    </Sidebar>
  );
};

export default SiteDetailsPage;