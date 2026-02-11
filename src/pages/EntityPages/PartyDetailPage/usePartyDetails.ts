import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  getPartyDetails,
  updateParty,
  deleteParty,
  getPartyTypes,
  uploadPartyImage,
  deletePartyImage,
  type Party as ServiceParty
} from '../../../api/partyService';
import type { PartyDetailsHookReturn, PartyDetailsResponse } from './types';

export const usePartyDetails = (): PartyDetailsHookReturn => {
  const { partyId } = useParams<{ partyId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const QUERY_KEY = ['partyDetails', partyId];

  // Fetch party details (removed getPartyStats as backend endpoint doesn't exist)
  const partyQuery = useQuery<PartyDetailsResponse>({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const party = await getPartyDetails(partyId!);
      return { party } as PartyDetailsResponse;
    },
    enabled: !!partyId,
  });



  // Metadata Query
  const typesQuery = useQuery<string[]>({
    queryKey: ['partyTypes'],
    queryFn: getPartyTypes,
    staleTime: 60 * 60 * 1000, // 1 hour
  });

  // 2. Update Mutation
  const updateMutation = useMutation({
    mutationFn: (payload: Partial<ServiceParty>) => updateParty(partyId!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['parties'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardData'] });
      toast.success('Updated successfully');
    },
    onError: (error: Error) => {
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
    onError: (error: Error) => {
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
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete image');
    }
  });

  // 5. Party Delete Mutation
  const deletePartyMutation = useMutation({
    mutationFn: () => deleteParty(partyId!),
    onSuccess: () => {
      toast.success('Party deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['parties'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardData'] });
      navigate('/parties');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete party');
    }
  });

  return {
    data: partyQuery.data,
    isLoading: partyQuery.isLoading,
    error: partyQuery.error,
    partyTypes: typesQuery.data || [],

    mutations: {
      update: updateMutation.mutateAsync,
      delete: deletePartyMutation.mutateAsync,
      uploadImage: uploadImageMutation.mutateAsync,
      deleteImage: deleteImageMutation.mutateAsync,

      isUploading: uploadImageMutation.isPending,
      isDeleting: deleteImageMutation.isPending
    }
  };
};