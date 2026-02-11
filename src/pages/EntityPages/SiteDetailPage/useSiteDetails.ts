// src/pages/EntityPages/SiteDetailPage/useSiteDetails.ts
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
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
} from '../../../api/siteService';
import { useAuth } from '@/api/authService';

const SITE_QUERY_KEY = 'siteDetails';
const SUB_ORGS_QUERY_KEY = 'subOrganizations';
const SITE_CATEGORIES_KEY = 'siteCategories';

export const useSiteDetails = () => {
    const { siteId } = useParams<{ siteId: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { hasPermission } = useAuth();
    const QUERY_KEY = [SITE_QUERY_KEY, siteId];

    // 1. Fetch Site Details
    const siteQuery = useQuery<FullSiteDetailsData, Error>({
        queryKey: QUERY_KEY,
        queryFn: () => getFullSiteDetails(siteId!),
        enabled: !!siteId,
    });

    // 2. Fetch Sub-Organizations (prefetched/cached)
    const subOrgsQuery = useQuery<string[], Error>({
        queryKey: [SUB_ORGS_QUERY_KEY],
        queryFn: getSiteSubOrganizations,
        staleTime: 5 * 60 * 1000,
    });

    // 3. Fetch Categories (lazy load when modal opens - passed via isEditOpen flag)
    const categoriesQuery = useQuery<SiteCategoryData[], Error>({
        queryKey: [SITE_CATEGORIES_KEY],
        queryFn: getSiteCategoriesList,
        staleTime: 5 * 60 * 1000,
    });

    // Optimistic Add Sub-Org
    const handleAddSubOrg = (newSubOrg: string) => {
        queryClient.setQueryData<string[]>([SUB_ORGS_QUERY_KEY], (old = []) => {
            const trimmed = newSubOrg.trim();
            if (trimmed && !old.includes(trimmed)) {
                return [...old, trimmed].sort();
            }
            return old;
        });
    };

    // 4. Update Mutation
    const updateMutation = useMutation({
        mutationFn: (payload: Partial<Site>) => updateSite(siteId!, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: ['sites'] });
            queryClient.invalidateQueries({ queryKey: ['sitesDashboardData'] });
            queryClient.invalidateQueries({ queryKey: ['sitesCategoriesData'] });
            queryClient.invalidateQueries({ queryKey: ['sitesSubOrgsData'] });
            toast.success('Site updated successfully!');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to update site.');
        },
    });

    // 5. Delete Mutation
    const deleteMutation = useMutation({
        mutationFn: () => deleteSite(siteId!),
        onSuccess: () => {
            toast.success('Site deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['sites'] });
            queryClient.invalidateQueries({ queryKey: ['sitesDashboardData'] });
            queryClient.invalidateQueries({ queryKey: ['sitesCategoriesData'] });
            queryClient.invalidateQueries({ queryKey: ['sitesSubOrgsData'] });
            navigate('/sites');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to delete site.');
        },
    });

    // 6. Image Upload Mutation
    const uploadImageMutation = useMutation({
        mutationFn: (vars: { imageNumber: number; file: File }) =>
            uploadSiteImage(siteId!, vars.imageNumber, vars.file),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY });
            toast.success('Image uploaded successfully!');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to upload image.');
        },
    });

    // 7. Image Delete Mutation
    const deleteImageMutation = useMutation({
        mutationFn: (imageNumber: number) => deleteSiteImage(siteId!, imageNumber),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY });
            toast.success('Image deleted successfully!');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to delete image.');
        },
    });

    return {
        // Data
        data: siteQuery.data,
        subOrgs: subOrgsQuery.data || [],
        categories: categoriesQuery.data || [],

        // Loading States
        isLoading: siteQuery.isPending,
        error: siteQuery.error?.message || null,

        // Mutations (exposed as clean API)
        mutations: {
            update: updateMutation.mutateAsync,
            delete: deleteMutation.mutate,
            uploadImage: (imageNumber: number, file: File) =>
                uploadImageMutation.mutate({ imageNumber, file }),
            deleteImage: deleteImageMutation.mutate,
            addSubOrg: handleAddSubOrg,

            // Loading states for UI feedback
            isUpdating: updateMutation.isPending,
            isDeleting: deleteMutation.isPending,
            isUploading: uploadImageMutation.isPending,
            isDeletingImage: deleteImageMutation.isPending,
        },

        refreshData: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),

        // Permissions
        permissions: {
            canUpdate: hasPermission('sites', 'update'),
            canDelete: hasPermission('sites', 'delete'),
            canManageImages: hasPermission('sites', 'manageImages'),
        }
    };
};
