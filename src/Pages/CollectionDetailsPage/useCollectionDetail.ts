import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
    deleteCollection,
    type Collection
} from '../../api/collectionService';
import { useAuth } from '../../api/authService';

// MOCK DATA (matching useCollectionViewState.ts)
const MOCK_COLLECTIONS: Collection[] = [
    {
        id: '507f1f77bcf86cd799439011',
        _id: '507f1f77bcf86cd799439011',
        collectionNumber: 'COL-001',
        partyId: 'p1',
        partyName: 'Tech Solutions Ltd',
        paidAmount: 25000,
        paymentMode: 'Cash',
        receivedDate: '2024-03-15',
        createdBy: { _id: 'u1', name: 'John Doe' },
        createdAt: '2024-03-15T10:00:00Z',
        updatedAt: '2024-03-15T10:00:00Z',
        receiptUrl: 'https://via.placeholder.com/400x300',
        images: ['https://via.placeholder.com/400x300/FFB6C1', 'https://via.placeholder.com/400x300/87CEEB']
    },
    {
        id: '507f1f77bcf86cd799439012',
        _id: '507f1f77bcf86cd799439012',
        collectionNumber: 'COL-002',
        partyId: 'p2',
        partyName: 'Global Traders',
        paidAmount: 50000,
        paymentMode: 'Cheque',
        receivedDate: '2024-03-14',
        bankName: 'HDFC Bank',
        chequeNumber: 'CHQ123456',
        chequeDate: '2024-03-14',
        chequeStatus: 'Cleared',
        createdBy: { _id: 'u2', name: 'Jane Smith' },
        createdAt: '2024-03-14T14:30:00Z',
        updatedAt: '2024-03-14T14:30:00Z',
        receiptUrl: 'https://via.placeholder.com/400x300/90EE90',
        images: ['https://via.placeholder.com/400x300/DDA0DD']
    },
    {
        id: '507f1f77bcf86cd799439013',
        _id: '507f1f77bcf86cd799439013',
        collectionNumber: 'COL-003',
        partyId: 'p3',
        partyName: 'Alpha Corp',
        paidAmount: 75000,
        paymentMode: 'Bank Transfer',
        receivedDate: '2024-03-13',
        bankName: 'ICICI Bank',
        transactionId: 'TXN789012',
        createdBy: { _id: 'u1', name: 'John Doe' },
        createdAt: '2024-03-13T09:15:00Z',
        updatedAt: '2024-03-13T09:15:00Z',
        receiptUrl: 'https://via.placeholder.com/400x300/F0E68C',
        images: ['https://via.placeholder.com/400x300/FFE4B5', 'https://via.placeholder.com/400x300/B0E0E6']
    },
    {
        id: '507f1f77bcf86cd799439014',
        _id: '507f1f77bcf86cd799439014',
        collectionNumber: 'COL-004',
        partyId: 'p4',
        partyName: 'Beta Industries',
        paidAmount: 30000,
        paymentMode: 'QR Pay',
        receivedDate: '2024-03-12',
        transactionId: 'UPI987654321',
        upiId: 'beta@paytm',
        createdBy: { _id: 'u3', name: 'Mike Johnson' },
        createdAt: '2024-03-12T16:45:00Z',
        updatedAt: '2024-03-12T16:45:00Z',
        receiptUrl: 'https://via.placeholder.com/400x300/FFD700',
        images: ['https://via.placeholder.com/400x300/FFDAB9']
    },
    {
        id: '507f1f77bcf86cd799439015',
        _id: '507f1f77bcf86cd799439015',
        collectionNumber: 'COL-005',
        partyId: 'p5',
        partyName: 'Gamma Services',
        paidAmount: 45000,
        paymentMode: 'Cheque',
        receivedDate: '2024-03-10',
        bankName: 'SBI',
        chequeNumber: 'CHQ654321',
        chequeDate: '2024-03-10',
        chequeStatus: 'Pending',
        createdBy: { _id: 'u2', name: 'Jane Smith' },
        createdAt: '2024-03-10T11:20:00Z',
        updatedAt: '2024-03-10T11:20:00Z',
        receiptUrl: 'https://via.placeholder.com/400x300/98FB98'
    }
];

export const useCollectionDetail = (id: string | undefined) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { hasPermission } = useAuth();

    // --- Data Fetching (Using Mock Data) ---
    const collectionQuery = useQuery({
        queryKey: ['collection', id],
        queryFn: async () => {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 300));

            const collection = MOCK_COLLECTIONS.find(c => c._id === id);
            if (!collection) {
                throw new Error('Collection not found');
            }
            return collection;
        },
        enabled: !!id,
    });

    // --- UI State ---
    const [activeModal, setActiveModal] = useState<'edit' | 'delete' | null>(null);

    // --- Mutations ---
    const deleteMutation = useMutation({
        mutationFn: () => deleteCollection(id!),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['collections'] });
            toast.success("Collection Deleted Successfully");
            navigate('/collection');
        },
        onError: () => toast.error("Failed to delete collection")
    });

    // Try to get payment mode from cache for skeleton
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
            isSaving: false,
            isDeleting: deleteMutation.isPending,
            activeModal,
        },
        actions: {
            update: async (_formData: any, _files: File[] | null) => {
                // TODO: Implement updateCollection in collectionService
                toast.error('Update functionality not yet implemented');
                return Promise.reject('Not implemented');
            },
            delete: deleteMutation.mutate,
            openEditModal: () => setActiveModal('edit'),
            openDeleteModal: () => setActiveModal('delete'),
            closeModal: () => setActiveModal(null),
        },
        permissions: {
            canUpdate: hasPermission("collections", "update"),
            canDelete: hasPermission("collections", "delete"),
        }
    };
};
