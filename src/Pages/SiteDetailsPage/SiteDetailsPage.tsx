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
  getSiteSubOrganizations, 
  getSiteCategoriesList, // Make sure you import SITE categories, not PROSPECT categories if they differ
  type FullSiteDetailsData,
  type Site,
  type SiteCategoryData
} from '../../api/siteService';
import toast from 'react-hot-toast';

// Import Modals
import ConfirmationModal from '../../components/modals/DeleteEntityModal';
import EditEntityModal, {
  type EditEntityData,
} from '../../components/modals/EditEntityModal';

const SITE_QUERY_KEY = 'siteDetails';
const SITE_CATEGORIES_KEY = 'siteCategories'; // Ensure this matches your query key

const SiteDetailsPage: React.FC = () => {
  const { siteId } = useParams<{ siteId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // 1. FETCH SITE DETAILS
  const siteQuery = useQuery<FullSiteDetailsData, Error>({
    queryKey: [SITE_QUERY_KEY, siteId],
    queryFn: () => getFullSiteDetails(siteId!),
    enabled: !!siteId,
  });

  // 2. FETCH SITE CATEGORIES (for Edit Modal)
  const categoriesQuery = useQuery<SiteCategoryData[], Error>({
    queryKey: [SITE_CATEGORIES_KEY],
    queryFn: getSiteCategoriesList,
    enabled: isEditOpen, 
    staleTime: 5 * 60 * 1000 
  });

  // 3. FETCH SUB-ORGANIZATIONS
  const subOrgsQuery = useQuery<string[], Error>({
    queryKey: ['subOrganizations'],
    queryFn: getSiteSubOrganizations,
    initialData: [],
    enabled: isEditOpen,
  });

  // 4. Handler to update Sub-Org cache
  const handleAddSubOrg = (newSubOrg: string) => {
      queryClient.setQueryData(['subOrganizations'], (oldData: string[] | undefined) => {
          const currentList = oldData || [];
          if (!currentList.includes(newSubOrg)) {
              return [...currentList, newSubOrg].sort();
          }
          return currentList;
      });
  };

  // 5. UPDATE MUTATION
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

  // 6. DELETE MUTATION
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

  // 7. IMAGE MUTATIONS
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

  // --- Handlers ---

  const handleModalSave = async (updatedData: EditEntityData) => {
    const siteUpdatePayload: Partial<Site> = {
      name: updatedData.name,
      ownerName: updatedData.ownerName,
      dateJoined: updatedData.dateJoined,
      subOrgName: updatedData.subOrgName, 
      address: updatedData.address,
      latitude: updatedData.latitude,
      longitude: updatedData.longitude,
      email: updatedData.email,
      phone: updatedData.phone,
      description: updatedData.description,
      siteInterest: updatedData.siteInterest // Map siteInterest
    };
    updateMutation.mutate(siteUpdatePayload);
  };

  const handleDeleteConfirmed = () => {
    deleteMutation.mutate();
    setIsDeleteConfirmOpen(false);
  };

  const handleImageUpload = (imageNumber: number, file: File) => {
    if (!siteId) return;
    uploadImageMutation.mutate({ imageNumber, file });
  };

  const handleImageDelete = (imageNumber: number) => {
    if (!siteId) return;
    deleteImageMutation.mutate(imageNumber);
  };

  const isPageLoading = siteQuery.isPending;
  const isMutating = updateMutation.isPending || deleteMutation.isPending || uploadImageMutation.isPending || deleteImageMutation.isPending;
  const errorMsg = siteQuery.isError ? siteQuery.error.message : null;
  const siteData = siteQuery.data;

  return (
    <Sidebar>
      <SiteDetailsContent
        site={siteData?.site || null}
        contact={siteData?.contact || null}
        location={siteData?.location || null}
        loading={isPageLoading}
        error={errorMsg}
        isMutating={isMutating}
        isUploading={uploadImageMutation.isPending}
        isDeletingImage={deleteImageMutation.isPending}
        images={siteData?.site?.images || []} 
        onDataRefresh={() =>
          queryClient.invalidateQueries({ queryKey: [SITE_QUERY_KEY, siteId] })
        }
        onOpenEditModal={() => setIsEditOpen(true)}
        onDeleteRequest={() => setIsDeleteConfirmOpen(true)}
        onImageUpload={handleImageUpload}
        onImageDelete={handleImageDelete}
      />

      {/* Modals */}
      {siteData && siteData.site && siteData.location && siteData.contact && (
        <>
          <ConfirmationModal
            isOpen={isDeleteConfirmOpen}
            title="Confirm Deletion"
            message={`Are you sure you want to delete "${siteData.site.siteName}"?`}
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
              // ✅ FIX: Use 'subOrganization' (API property) instead of 'subOrgName'
              subOrgName: siteData.site.subOrganization, 
              // ✅ FIX: Pass siteInterest
              siteInterest: siteData.site.siteInterest || [] 
            }}
            entityType='Site'
            // Pass Dropdown Data
            categoriesData={categoriesQuery.data || []} 
            subOrgsList={subOrgsQuery.data || []} 
            onAddSubOrg={handleAddSubOrg} 
          />
        </>
      )}
    </Sidebar>
  );
};

export default SiteDetailsPage;