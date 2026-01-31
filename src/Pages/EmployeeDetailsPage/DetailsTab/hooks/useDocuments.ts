import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
    uploadEmployeeDocuments,
    deleteEmployeeDocument
} from '../../../../api/employeeService';

export const useDocuments = (employeeId: string | undefined) => {
    const queryClient = useQueryClient();

    const [isDocDeleteModalOpen, setIsDocDeleteModalOpen] = useState(false);
    const [documentToDelete, setDocumentToDelete] = useState<{ id: string; name: string } | null>(null);

    const uploadDocMutation = useMutation({
        mutationFn: ({ userId, files }: { userId: string, files: File[] }) =>
            uploadEmployeeDocuments(userId, files),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employee', employeeId] });
            toast.success('Documents uploaded successfully');
        },
        onError: (err: Error) => {
            toast.error(err.message || 'Upload failed');
        }
    });

    const deleteDocMutation = useMutation({
        mutationFn: ({ userId, docId }: { userId: string, docId: string }) =>
            deleteEmployeeDocument(userId, docId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employee', employeeId] });
            toast.success('Document deleted successfully');
            setIsDocDeleteModalOpen(false);
            setDocumentToDelete(null);
        },
        onError: (err: Error) => {
            toast.error(err.message || 'Deletion failed');
            setIsDocDeleteModalOpen(false);
        }
    });

    const handleRequestDeleteDocument = (docId: string, docName: string) => {
        setDocumentToDelete({ id: docId, name: docName });
        setIsDocDeleteModalOpen(true);
    };

    const confirmDeleteDocument = () => {
        if (employeeId && documentToDelete?.id) {
            deleteDocMutation.mutate({ userId: employeeId, docId: documentToDelete.id });
        }
    };

    const handleUpload = (files: File[]) => {
        if (employeeId && files.length > 0) {
            uploadDocMutation.mutate({ userId: employeeId, files });
        }
    };

    return {
        isDocDeleteModalOpen,
        setIsDocDeleteModalOpen,
        documentToDelete,
        handleRequestDeleteDocument,
        confirmDeleteDocument,
        handleUpload,
        isUploading: uploadDocMutation.isPending,
        isDeleting: deleteDocMutation.isPending
    };
};
