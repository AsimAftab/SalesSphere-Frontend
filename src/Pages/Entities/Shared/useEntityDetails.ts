// src/pages/Entities/shared/useEntityDetails.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

interface DetailOps {
  entityId: string;
  queryKey: string;
  uploadFn: (id: string, num: number, file: File) => Promise<any>;
  deleteFn: (id: string, num: number) => Promise<any>;
}

export function useEntityDetails({ entityId, queryKey, uploadFn, deleteFn }: DetailOps) {
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: ({ num, file }: { num: number; file: File }) => uploadFn(entityId, num, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey, entityId] });
      toast.success('Image uploaded successfully');
    },
    onError: (err: any) => toast.error(err.message || 'Upload failed'),
  });

  const deleteMutation = useMutation({
    mutationFn: (num: number) => deleteFn(entityId, num),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey, entityId] });
      toast.success('Image deleted successfully');
    },
    onError: (err: any) => toast.error(err.message || 'Delete failed'),
  });

  return {
    isUploading: uploadMutation.isPending,
    isDeleting: deleteMutation.isPending,
    onUpload: (num: number, file: File) => uploadMutation.mutate({ num, file }),
    onDelete: (num: number) => deleteMutation.mutate(num),
  };
}