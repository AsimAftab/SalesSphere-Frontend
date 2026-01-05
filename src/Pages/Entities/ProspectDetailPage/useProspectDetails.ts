import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  getFullProspectDetails, deleteProspect, updateProspect,
  transferProspectToParty, uploadProspectImage, deleteProspectImage,
  getProspectCategoriesList, type Prospect
} from '../../../api/prospectService';

export const useProspectDetails = () => {
  const { prospectId } = useParams<{ prospectId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
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
      toast.success('Prospect updated successfully');
    },
  });

  const transferMutation = useMutation({
    mutationFn: () => transferProspectToParty(prospectId!),
    onSuccess: (newParty) => {
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
      deleteProspect: () => deleteProspect(prospectId!).then(() => navigate('/prospects')),
    }
  };
};