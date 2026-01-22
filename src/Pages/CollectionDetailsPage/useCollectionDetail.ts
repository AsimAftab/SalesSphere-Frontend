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

/**
 * Hook for managing a single Collection's detail view.
 * Provides data fetching, CRUD operations, modal state, and permissions.
 * Follows the Facade Pattern: { data, state, actions, permissions }
 * 
 * @param id - The collection ID from route params
 * @returns Object containing data, state, actions, and permissions
 */
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

            // Merge files into data so the service handles sequential upload
            const collectionData = { ...data, images: files || undefined };

            // 1. Update Collection Details (Service handles text + sequential images)
            const updatedCollection = await CollectionRepository.updateCollection(id, collectionData);

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

    // Delete Image Mutation
    const deleteImageMutation = useMutation({
        mutationFn: async ({ imageNumber }: { imageNumber: number }) => {
            if (!id) throw new Error('Collection ID is required');
            return await CollectionRepository.deleteCollectionImage(id, imageNumber);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['collection', id] });
            queryClient.invalidateQueries({ queryKey: ['collections'] });
            toast.success("Image Deleted Successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete image");
        }
    });

    // Upload Image Mutation
    const uploadImageMutation = useMutation({
        mutationFn: async ({ imageNumber, file }: { imageNumber: number, file: File }) => {
            if (!id) throw new Error('Collection ID is required');
            return await CollectionRepository.uploadCollectionImage(id, imageNumber, file);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['collection', id] });
            toast.success("Image Uploaded Successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to upload image");
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
            isDeletingImage: deleteImageMutation.isPending,
            isUploadingImage: uploadImageMutation.isPending,
            activeModal,
        },
        actions: {
            update: async (formData: any, files: File[] | null) => {
                return updateMutation.mutateAsync({ data: formData, files });
            },
            delete: deleteMutation.mutate,
            deleteImage: (imageNumber: number) => deleteImageMutation.mutate({ imageNumber }),
            uploadImage: (imageNumber: number, file: File) => uploadImageMutation.mutate({ imageNumber, file }),
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
