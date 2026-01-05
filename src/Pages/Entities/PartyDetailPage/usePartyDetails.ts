import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { 
  getPartyDetails, 
  getPartyStats, 
  updateParty, 
  deleteParty, 
  getPartyTypes,
  uploadPartyImage, 
  deletePartyImage 
} from '../../../api/partyService';

export const usePartyDetails = () => {
  const { partyId } = useParams<{ partyId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const QUERY_KEY = ['partyDetails', partyId];

  // 1. Fetching Party and Stats logic (Parallel)
  const partyQuery = useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const [party, statsData] = await Promise.all([
        getPartyDetails(partyId!),
        getPartyStats(partyId!)
      ]);
      return { party, statsData };
    },
    enabled: !!partyId,
  });

  // ✅ FIX: Added missing metadata query for the edit modal (Resolves TS2339 in image_2bfff0.png)
  const typesQuery = useQuery({
    queryKey: ['partyTypes'],
    queryFn: getPartyTypes,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  // 2. Update Mutation - Using mutateAsync to support Promise awaiting in UI
  const updateMutation = useMutation({
    mutationFn: (payload: any) => updateParty(partyId!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      // Invalidate the list view as well to keep data consistent
      queryClient.invalidateQueries({ queryKey: ['parties'] });
      toast.success('Updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update party');
    }
  });

  // 3. Image Upload Mutation
  const uploadImageMutation = useMutation({
    mutationFn: (file: File) => uploadPartyImage(partyId!, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Image uploaded successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to upload image');
    }
  });

  // 4. Image Delete Mutation
  const deleteImageMutation = useMutation({
    mutationFn: () => deletePartyImage(partyId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Image removed successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete image');
    }
  });

  // 5. Party Delete Mutation
  const deletePartyMutation = useMutation({
    mutationFn: () => deleteParty(partyId!),
    onSuccess: () => {
      toast.success('Party deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['parties'] });
      navigate('/parties');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete party');
    }
  });

  return {
    data: partyQuery.data,
    // ✅ FIX: Now returning partyTypes so the controller can pass it to EditEntityModal
    partyTypes: typesQuery.data || [],
    // Combined loading state for the main UI skeleton
    isLoading: partyQuery.isPending || updateMutation.isPending || deletePartyMutation.isPending,
    error: partyQuery.error,
    
    mutations: {
      // ✅ Using mutateAsync allows the Modal to await the result
      update: updateMutation.mutateAsync,
      delete: deletePartyMutation.mutate,
      uploadImage: uploadImageMutation.mutate,
      deleteImage: deleteImageMutation.mutate,
      
      // Loading states for specific UI elements (Spinners in DetailsMainCard)
      isUploading: uploadImageMutation.isPending,
      isDeleting: deleteImageMutation.isPending
    }
  };
};