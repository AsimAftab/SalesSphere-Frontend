/**
 * useSystemUserActions Hook
 * Manages modal states and action handlers for system user operations
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { systemUserService, type SystemUser } from '@/api/SuperAdmin';
import { SYSTEM_USER_ROUTES } from '../utils';

interface UseSystemUserActionsProps {
    systemUser: SystemUser | undefined;
    refetch: () => void;
}

export const useSystemUserActions = ({ systemUser, refetch }: UseSystemUserActionsProps) => {
    const navigate = useNavigate();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

    /**
     * Handle save/update system user
     */
    const handleSave = async (formData: FormData) => {
        if (!systemUser?._id) return;

        try {
            await systemUserService.update(systemUser._id, formData);
            toast.success('System user updated successfully');
            refetch();
            setIsEditModalOpen(false);
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : 'Failed to update system user');
        }
    };

    /**
     * Handle delete system user
     */
    const handleDelete = async () => {
        if (!systemUser?._id) return;

        try {
            await systemUserService.delete(systemUser._id);
            toast.success('System user deleted successfully');
            setIsDeleteConfirmOpen(false);
            navigate(SYSTEM_USER_ROUTES.LIST);
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : 'Failed to delete system user');
        }
    };

    return {
        // Modal states
        isEditModalOpen,
        setIsEditModalOpen,
        isDeleteConfirmOpen,
        setIsDeleteConfirmOpen,

        // Action handlers
        handleSave,
        handleDelete,
    };
};
