import React, { useState, useEffect } from 'react';
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
  getSiteCategoriesList,
  type FullSiteDetailsData,
  type Site,
  type SiteCategoryData,
} from '../../api/siteService';
import toast from 'react-hot-toast';

// Modals
import ConfirmationModal from '../../components/modals/DeleteEntityModal';
import EditEntityModal, {
  type EditEntityData,
} from '../../components/modals/EditEntityModal';

const SITE_QUERY_KEY = 'siteDetails';
const SITE_CATEGORIES_KEY = 'siteCategories';
const SUB_ORGS_QUERY_KEY = 'subOrganizations';

const SiteDetailsPage: React.FC = () => {
  const { siteId } = useParams<{ siteId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // 🔥 PREFETCH SUB-ORGS ASAP (THIS IS THE FIX)
  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: [SUB_ORGS_QUERY_KEY],
      queryFn: getSiteSubOrganizations,
    });
  }, [queryClient]);

  // 1. FETCH SITE DETAILS
  const siteQuery = useQuery<FullSiteDetailsData, Error>({
    queryKey: [SITE_QUERY_KEY, siteId],
    queryFn: () => getFullSiteDetails(siteId!),
    enabled: !!siteId,
  });

  // 2. FETCH SUB-ORGS (READS FROM PREFETCHED CACHE)
  const subOrgsQuery = useQuery<string[], Error>({
    queryKey: [SUB_ORGS_QUERY_KEY],
    queryFn: getSiteSubOrganizations,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: 'always', // Always refetch when component mounts
  });

  // 3. FETCH CATEGORIES ONLY WHEN MODAL OPENS
  const categoriesQuery = useQuery<SiteCategoryData[], Error>({
    queryKey: [SITE_CATEGORIES_KEY],
    queryFn: getSiteCategoriesList,
    enabled: isEditOpen,
    staleTime: 5 * 60 * 1000,
  });

  // 4. OPEN EDIT MODAL (INSTANT)
  const handleOpenEditModal = () => {
    setIsEditOpen(true);
  };

  // 5. ADD SUB-ORG LOCALLY
  const handleAddSubOrg = (newSubOrg: string) => {
    queryClient.setQueryData<string[]>([SUB_ORGS_QUERY_KEY], (old = []) => {
      const trimmed = newSubOrg.trim();
      if (trimmed && !old.includes(trimmed)) {
        return [...old, trimmed].sort();
      }
      return old;
    });
  };

  // 6. UPDATE SITE
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

  // 7. DELETE SITE
  const deleteMutation = useMutation({
    mutationFn: () => deleteSite(siteId!),
    onSuccess: () => {
      toast.success('Site deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      navigate('/sites');
    },
  });

  // 8. IMAGE MUTATIONS
  const uploadImageMutation = useMutation({
    mutationFn: (vars: { imageNumber: number; file: File }) =>
      uploadSiteImage(siteId!, vars.imageNumber, vars.file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SITE_QUERY_KEY, siteId] });
      toast.success('Image uploaded successfully!');
    },
  });

  const deleteImageMutation = useMutation({
    mutationFn: (imageNumber: number) =>
      deleteSiteImage(siteId!, imageNumber),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SITE_QUERY_KEY, siteId] });
      toast.success('Image deleted successfully!');
    },
  });

  const handleModalSave = async (updatedData: EditEntityData) => {
    const payload: Partial<Site> = {
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
      siteInterest: updatedData.siteInterest,
    };
    updateMutation.mutate(payload);
  };

  const siteData = siteQuery.data;

  return (
    <Sidebar>
      <SiteDetailsContent
        site={siteData?.site || null}
        contact={siteData?.contact || null}
        createdBy={siteData?.site?.createdBy || null}
        location={siteData?.location || null}
        loading={siteQuery.isPending}
        error={siteQuery.isError ? siteQuery.error.message : null}
        isMutating={updateMutation.isPending}
        isUploading={uploadImageMutation.isPending}
        isDeletingImage={deleteImageMutation.isPending}
        images={siteData?.site?.images || []}
        onDataRefresh={() =>
          queryClient.invalidateQueries({ queryKey: [SITE_QUERY_KEY, siteId] })
        }
        onOpenEditModal={handleOpenEditModal}
        onDeleteRequest={() => setIsDeleteConfirmOpen(true)}
        onImageUpload={(n, f) =>
          uploadImageMutation.mutate({ imageNumber: n, file: f })
        }
        onImageDelete={(n) => deleteImageMutation.mutate(n)}
      />

      {siteData && (
        <>
          <ConfirmationModal
            isOpen={isDeleteConfirmOpen}
            title="Confirm Deletion"
            message={`Are you sure you want to delete "${siteData.site.siteName}"?`}
            onConfirm={() => deleteMutation.mutate()}
            onCancel={() => setIsDeleteConfirmOpen(false)}
            confirmButtonText="Delete"
            confirmButtonVariant="danger"
          />

          {isEditOpen && (
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
                subOrgName: siteData.site.subOrganization,
                siteInterest: siteData.site.siteInterest || [],
              }}
              entityType="Site"
              categoriesData={categoriesQuery.data || []}
              subOrgsList={subOrgsQuery.data || []}
              onAddSubOrg={handleAddSubOrg}
            />
          )}
        </>
      )}
    </Sidebar>
  );
};

export default SiteDetailsPage;