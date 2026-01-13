import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
    CollectionRepository,
    getCollectionDetails,
    deleteCollection,
    type Collection,
    type NewCollectionData
} from '../../api/collectionService';
import { useAuth } from '../../api/authService';

export const useCollectionDetail = (id: string | undefined) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { hasPermission } = useAuth();

    // --- Data Fetching ---
    const collectionQuery = useQuery({
        queryKey: ['collection', id],
        queryFn: async () => {
            if (!id) throw new Error('Collection ID is required');
            return await getCollectionDetails(id);
        },
        enabled: !!id,
        retry: 1,
    });

    // --- UI State ---
    const [activeModal, setActiveModal] = useState<'edit' | 'delete' | null>(null);

    // --- Mutations ---

    // Update Mutation
    const updateMutation = useMutation({
        mutationFn: async ({ data, files }: { data: Partial<NewCollectionData>, files: File[] | null }) => {
            if (!id) throw new Error('Collection ID is required');

            // 1. Update Collection Details
            const updatedCollection = await CollectionRepository.updateCollection(id, data);

            // 2. Upload Images if provided
            if (files && files.length > 0) {
                // Strategy: Upload sequentially 1..N
                const uploadPromises = files.map((file, index) => {
                    return CollectionRepository.uploadCollectionImage(id, index + 1, file);
                });
                await Promise.all(uploadPromises);
            }

            return updatedCollection;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['collection', id] });
            queryClient.invalidateQueries({ queryKey: ['collections'] });
            toast.success("Collection Updated Successfully");
            setActiveModal(null);
        },
        onError: (error: any) => {
            console.error(error);
            toast.error(error.message || "Failed to update collection");
        }
    });

    // Delete Mutation
    const deleteMutation = useMutation({
        mutationFn: async () => {
            if (!id) throw new Error('Collection ID is required');
            return await deleteCollection(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['collections'] });
            toast.success("Collection Deleted Successfully");
            navigate('/collection'); // Redirect to list
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete collection");
        }
    });

    // Try to get payment mode from cache for skeleton, fallback to null
    const cachedCollections = queryClient.getQueryData<Collection[]>(['collections', 'list']);
    const cachedPaymentMode = cachedCollections?.find(c => c._id === id)?.paymentMode || null;

    return {
        data: {
            collection: collectionQuery.data,
            cachedPaymentMode, // For skeleton to use during loading
        },
        state: {
            isLoading: collectionQuery.isLoading,
            error: collectionQuery.error ? (collectionQuery.error as Error).message : null,
            isSaving: updateMutation.isPending,
            isDeleting: deleteMutation.isPending,
            activeModal,
        },
        actions: {
            update: async (formData: any, files: File[] | null) => {
                return updateMutation.mutateAsync({ data: formData, files });
            },
            delete: deleteMutation.mutate,
            openEditModal: () => setActiveModal('edit'),
            openDeleteModal: () => setActiveModal('delete'),
            closeModal: () => setActiveModal(null),
        },
        permissions: {
            canUpdate: hasPermission("collections", "collectPayment"),
            canDelete: hasPermission("collections", "delete"),
        }
    };
};
