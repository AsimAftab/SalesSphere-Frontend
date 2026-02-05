import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { systemUserService, type SystemUser } from '@/api/SuperAdmin/systemUserService';
import { ITEMS_PER_PAGE } from '../constants';

export const useSystemUserManager = () => {
    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<SystemUser | undefined>(undefined);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');

    // Fetch System Users
    const {
        data: response,
        isLoading,
        error,
        refetch
    } = useQuery({
        queryKey: ['systemUsers'],
        queryFn: systemUserService.getAll,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    const users = response?.data || [];

    // Filter Users Client-Side (since list is small for superadmins usually)
    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Create User Mutation
    const createMutation = useMutation({
        mutationFn: (data: FormData) => systemUserService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['systemUsers'] });
            toast.success('System user added successfully');
            closeModal();
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (err: any) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const msg = (err as any).response?.data?.message || 'Failed to add system user';
            toast.error(msg);
        }
    });

    // Update User Mutation
    const updateMutation = useMutation({
        mutationFn: (data: { id: string; payload: FormData }) => systemUserService.update(data.id, data.payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['systemUsers'] });
            toast.success('System user updated successfully');
            closeModal();
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (err: any) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const msg = (err as any).response?.data?.message || 'Failed to update system user';
            toast.error(msg);
        }
    });

    // Modal Actions
    const openAddModal = useCallback(() => {
        setSelectedUser(undefined);
        setModalMode('add');
        setIsModalOpen(true);
    }, []);

    const openEditModal = useCallback((user: SystemUser) => {
        setSelectedUser(user);
        setModalMode('edit');
        setIsModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        setSelectedUser(undefined);
    }, []);

    // Form Submission Handler
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleSave = async (formData: FormData, _customRoleId: string, _documents?: File[]) => {
        if (modalMode === 'add') {
            await createMutation.mutateAsync(formData);
        } else if (modalMode === 'edit' && selectedUser?._id) {
            await updateMutation.mutateAsync({ id: selectedUser._id, payload: formData });
        }
    };

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    // ITEMS_PER_PAGE is imported from constants

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    // Reset pagination when search query changes
    if (currentPage > 1 && paginatedUsers.length === 0 && filteredUsers.length > 0) {
        setCurrentPage(1);
    }

    return {
        users: paginatedUsers, // Return sliced data
        totalUsers: filteredUsers.length, // Total count for pagination
        itemsPerPage: ITEMS_PER_PAGE,
        currentPage,
        onPageChange: setCurrentPage,
        isLoading,
        error: error as Error | null,
        searchQuery,
        setSearchQuery,
        isModalOpen,
        modalMode,
        selectedUser,
        openAddModal,
        openEditModal,
        closeModal,
        handleSave,
        refetch
    };
};
