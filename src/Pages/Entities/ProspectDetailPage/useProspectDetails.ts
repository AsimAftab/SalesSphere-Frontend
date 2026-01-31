import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useAuth } from '../../../api/authService';
import {
  getFullProspectDetails, deleteProspect, updateProspect,
  transferProspectToParty, uploadProspectImage, deleteProspectImage,
  getProspectCategoriesList, type Prospect
} from '../../../api/prospectService';

export const useProspectDetails = () => {
  const { prospectId } = useParams<{ prospectId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { hasPermission } = useAuth();
  const QUERY_KEY = ['prospectDetails', prospectId];

  const prospectQuery = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => getFullProspectDetails(prospectId!),
    enabled: !!prospectId,
  });

  const categoriesQuery = useQuery({
    queryKey: ['prospectCategories'],
    queryFn: getProspectCategoriesList,
    staleTime: 5 * 60 * 1000,
  });

  const updateMutation = useMutation({
    mutationFn: (payload: Partial<Prospect>) => updateProspect(prospectId!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['prospects'] });
      queryClient.invalidateQueries({ queryKey: ['prospectStats'] });
      queryClient.invalidateQueries({ queryKey: ['prospectCategories'] });
      queryClient.invalidateQueries({ queryKey: ['brandProspectCounts'] });
      toast.success('Prospect updated successfully');
    },
  });

  const transferMutation = useMutation({
    mutationFn: () => transferProspectToParty(prospectId!),
    onSuccess: (newParty) => {
      queryClient.invalidateQueries({ queryKey: ['prospects'] });
      queryClient.invalidateQueries({ queryKey: ['parties'] });
      queryClient.invalidateQueries({ queryKey: ['prospectStats'] });
      queryClient.invalidateQueries({ queryKey: ['prospectCategories'] });
      queryClient.invalidateQueries({ queryKey: ['brandProspectCounts'] });
      toast.success('Successfully transferred to Party');
      navigate(`/parties/${newParty._id}`);
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: (vars: { num: number; file: File }) => uploadProspectImage(prospectId!, vars.num, vars.file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });

  const deleteImageMutation = useMutation({
    mutationFn: (num: number) => deleteProspectImage(prospectId!, num),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteProspect(prospectId!),
    onSuccess: () => {
      toast.success('Prospect deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['prospects'] });
      queryClient.invalidateQueries({ queryKey: ['prospectStats'] });
      queryClient.invalidateQueries({ queryKey: ['prospectCategories'] });
      queryClient.invalidateQueries({ queryKey: ['brandProspectCounts'] });
      navigate('/prospects');
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to delete prospect'),
  });

  return {
    prospectId,
    data: prospectQuery.data,
    categories: categoriesQuery.data || [],
    isLoading: prospectQuery.isLoading,
    error: prospectQuery.error?.message || null,
    isMutating: updateMutation.isPending || transferMutation.isPending,
    isUploading: uploadImageMutation.isPending,
    isDeletingImage: deleteImageMutation.isPending,
    actions: {
      update: updateMutation.mutateAsync,
      transfer: transferMutation.mutate,
      uploadImage: uploadImageMutation.mutate,
      deleteImage: deleteImageMutation.mutate,
      deleteProspect: deleteMutation.mutate,
    },
    permissions: {
      canUpdate: hasPermission('prospects', 'update'),
      canDelete: hasPermission('prospects', 'delete'),
      canTransfer: hasPermission('prospects', 'transferToParty'),
      canManageImages: hasPermission('prospects', 'manageImages'),
    }
  };
};