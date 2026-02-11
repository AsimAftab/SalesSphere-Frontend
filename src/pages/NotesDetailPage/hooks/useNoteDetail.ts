import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { NoteRepository, type CreateNoteRequest, type NoteImage } from '@/api/notesService';
import { PartyRepository } from '@/api/partyService';
import { ProspectRepository } from '@/api/prospectService';
import { SiteRepository } from '@/api/siteService';

/**
 * Interface for note update mutation payload
 */
interface NoteUpdatePayload {
  data: CreateNoteRequest & { existingImages: NoteImage[] };
  files: File[];
}

/**
 * Custom hook for managing note detail page state and operations.
 * Handles fetching single note, entity lists for edit modal, and CRUD mutations.
 * 
 * @param id - The note ID from route params
 * @returns Object containing:
 *   - data: Note data and entity lists for edit modal
 *   - state: Loading, saving, and error states
 *   - actions: Update and delete mutation handlers
 * 
 * @example
 * ```tsx
 * const { data, state, actions } = useNoteDetail(id);
 * // Edit: actions.update({ data: formData, files: [] })
 * // Delete: actions.delete()
 * ```
 */
export const useNoteDetail = (id: string | undefined) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // --- Data Fetching ---
  const noteQuery = useQuery({
    queryKey: ['note', id],
    queryFn: () => NoteRepository.getNoteById(id!),
    enabled: !!id,
  });

  // Prefetching lists for the Edit Modal
  const partiesQuery = useQuery({ queryKey: ["parties-list"], queryFn: PartyRepository.getParties });
  const prospectsQuery = useQuery({ queryKey: ["prospects-list"], queryFn: ProspectRepository.getProspects });
  const sitesQuery = useQuery({ queryKey: ["sites-list"], queryFn: SiteRepository.getSites });

  // --- Mutations ---
  const deleteMutation = useMutation({
    mutationFn: () => NoteRepository.deleteNote(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes-list'] });
      toast.success("Note deleted successfully");
      navigate('/notes');
    },
    onError: (err: Error) => toast.error(err.message || "Failed to delete note")
  });

  const updateMutation = useMutation({
    mutationFn: async ({ data, files }: NoteUpdatePayload) => {
      // 1. Update the basic Note info (title, description, links)
      const updatedNote = await NoteRepository.updateNote(id!, data);

      // 2. IDENTIFY DELETIONS
      // 'data.existingImages' contains the images the user KEPT.
      // 'noteQuery.data.images' contains what was originally there.
      const originalImages = noteQuery.data?.images || [];
      const keptUrls = data.existingImages.map((img) => img.imageUrl);

      const toDelete = originalImages.filter(orig => !keptUrls.includes(orig.imageUrl));

      // Delete removed images from server
      for (const img of toDelete) {
        await NoteRepository.deleteNoteImage(id!, img.imageNumber);
      }

      // 3. UPLOAD NEW FILES
      // We need to find available slots (imageNumber 1 or 2)
      // Let's see which image numbers are currently taken by kept images
      const takenNumbers = data.existingImages.map((img) => img.imageNumber);

      // Determine which numbers (1 and 2) are free
      const availableNumbers = [1, 2].filter(num => !takenNumbers.includes(num));

      // Upload files into the free slots
      for (let i = 0; i < files.length; i++) {
        if (availableNumbers[i]) {
          await NoteRepository.uploadNoteImage(id!, availableNumbers[i], files[i]);
        }
      }

      return updatedNote;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['note', id] });
      queryClient.invalidateQueries({ queryKey: ['notes-list'] });
      toast.success("Note updated successfully");
    },
    onError: (err: Error) => toast.error(err.message || "Update failed")
  });

  const uploadImageMutation = useMutation({
    mutationFn: async ({ imageNumber, file }: { imageNumber: number; file: File }) => {
      return await NoteRepository.uploadNoteImage(id!, imageNumber, file);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['note', id] });
      toast.success("Image uploaded successfully");
    },
    onError: (err: Error) => toast.error(err.message || "Failed to upload image")
  });

  const deleteImageMutation = useMutation({
    mutationFn: (imageNumber: number) => NoteRepository.deleteNoteImage(id!, imageNumber),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['note', id] });
      toast.success("Image deleted successfully");
    },
    onError: (err: Error) => toast.error(err.message || "Failed to delete image")
  });

  return {
    data: {
      note: noteQuery.data,
      parties: partiesQuery.data || [],
      prospects: prospectsQuery.data || [],
      sites: sitesQuery.data || [],
    },
    state: {
      isLoading: noteQuery.isLoading,
      error: noteQuery.error ? (noteQuery.error as Error).message : null,
      isSaving: updateMutation.isPending,
      isDeleting: deleteMutation.isPending,
      isUploadingImage: uploadImageMutation.isPending,
      isDeletingImage: deleteImageMutation.isPending,
    },
    actions: {
      update: updateMutation.mutateAsync,
      delete: deleteMutation.mutate,
      uploadImage: uploadImageMutation.mutate,
      deleteImage: deleteImageMutation.mutate,
    }
  };
};