import { useState, useCallback, useEffect, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { roleService, type FeatureRegistry } from '../../../../api/roleService';
import { useFeaturePermissions } from './useFeaturePermissions';
import { useAuth } from '../../../../api/authService';
import { type Role, MODULES_LIST, MODULE_KEY_MAP } from '../types/admin.types';
import type { FeaturePermissions } from '../types/featurePermission.types';

/**
 * Facade hook for Permission Tab - encapsulates all logic
 * Follows SOLID principles: SRP - handles only permission management
 */
export const usePermissionTab = () => {
    const queryClient = useQueryClient();
    const { user, isLoading: isAuthLoading } = useAuth();

    // --- State ---
    const [selectedRoleId, setSelectedRoleId] = useState<string>('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isRevokeModalOpen, setIsRevokeModalOpen] = useState(false);
    const [isGrantAllModalOpen, setIsGrantAllModalOpen] = useState(false);
    const [webAccess, setWebAccess] = useState(false);
    const [mobileAccess, setMobileAccess] = useState(false);

    // --- Queries ---
    const { data: rolesResponse, isLoading: isLoadingRoles } = useQuery({
        queryKey: ['roles'],
        queryFn: roleService.getAll
    });

    const { data: featureRegistryResponse } = useQuery({
        queryKey: ['featureRegistry'],
        queryFn: roleService.getFeatureRegistry
    });

    // --- Derived Data ---
    const roles: Role[] = rolesResponse?.data?.data || [];
    const selectedRole = roles.find(r => r._id === selectedRoleId);
    const featureRegistry: FeatureRegistry | null = featureRegistryResponse?.data?.data || null;

    // Filter modules based on subscription
    const filteredModules = useMemo(() => {
        if (isAuthLoading || !user) return [];

        const enabledKeys = user.subscription?.enabledModules || [];
        const systemKeys = ['dashboard'];
        const allowedKeys = new Set([...enabledKeys, ...systemKeys]);

        return MODULES_LIST.filter(moduleName => {
            const key = MODULE_KEY_MAP[moduleName];
            return allowedKeys.has(key);
        });
    }, [user, isAuthLoading]);

    // --- Feature Permissions Hook ---
    const {
        permissions,
        expandedModules,
        loadPermissions,
        toggleModuleExpansion,
        toggleFeature,
        toggleModuleAll,
        revokeAllPermissions,
        grantAllPermissions,
        getBackendPermissions
    } = useFeaturePermissions(featureRegistry);

    // --- Effects ---
    useEffect(() => {
        if (selectedRoleId && selectedRole) {
            if (selectedRole.permissions) {
                loadPermissions(selectedRole.permissions);
            }
            setWebAccess(selectedRole.webPortalAccess || false);
            setMobileAccess(selectedRole.mobileAppAccess || false);
        }
    }, [selectedRoleId, selectedRole, loadPermissions]);

    // --- Mutations ---
    const { mutate: updateRole, isPending: isUpdating } = useMutation({
        mutationFn: (newPermissions?: FeaturePermissions) => roleService.update(selectedRoleId, {
            permissions: newPermissions ?? getBackendPermissions(),
            webPortalAccess: webAccess,
            mobileAppAccess: mobileAccess
        }),
        onSuccess: () => {
            toast.success('Role permissions updated successfully!');
            queryClient.invalidateQueries({ queryKey: ['roles'] });
        },
        onError: (err: any) => {
            const message = err?.response?.data?.message || 'Update failed';
            toast.error(message);
        }
    });

    const { mutate: deleteRole, isPending: isDeleting } = useMutation({
        mutationFn: () => roleService.delete(selectedRoleId),
        onSuccess: () => {
            toast.success('Role deleted successfully!');
            setSelectedRoleId('');
            setIsDeleteModalOpen(false);
            queryClient.invalidateQueries({ queryKey: ['roles'] });
        },
        onError: (err: any) => {
            const message = err?.response?.data?.message || 'Delete failed';
            toast.error(message);
            setIsDeleteModalOpen(false);
        }
    });

    // --- Handlers ---
    const handleSave = useCallback(() => {
        if (!selectedRoleId) {
            toast.error("Please select a role to update");
            return;
        }
        updateRole(undefined);
    }, [selectedRoleId, updateRole]);

    const handleDeleteClick = useCallback(() => {
        if (!selectedRole) return;
        if (selectedRole.isDefault) {
            toast.error("Default roles cannot be deleted");
            return;
        }
        setIsDeleteModalOpen(true);
    }, [selectedRole]);

    const handleCancel = useCallback(() => {
        if (selectedRole) {
            if (selectedRole.permissions) {
                loadPermissions(selectedRole.permissions);
            }
            setWebAccess(selectedRole.webPortalAccess || false);
            setMobileAccess(selectedRole.mobileAppAccess || false);
            toast.success("Changes discarded");
        }
    }, [selectedRole, loadPermissions]);

    const handleConfirmRevoke = useCallback(() => {
        revokeAllPermissions();
        setIsRevokeModalOpen(false);
    }, [revokeAllPermissions]);

    const handleConfirmGrantAll = useCallback(() => {
        grantAllPermissions();
        setIsGrantAllModalOpen(false);
    }, [grantAllPermissions]);

    const handleConfirmDelete = useCallback(() => {
        deleteRole();
    }, [deleteRole]);

    const isPending = isUpdating || isDeleting;

    return {
        // Data
        roles,
        selectedRole,
        selectedRoleId,
        featureRegistry,
        filteredModules,
        permissions,
        expandedModules,

        // Access Control
        webAccess,
        mobileAccess,
        setWebAccess,
        setMobileAccess,

        // Loading States
        isLoadingRoles,
        isPending,

        // Modal States
        isCreateModalOpen,
        isDeleteModalOpen,
        isRevokeModalOpen,
        isGrantAllModalOpen,
        setIsCreateModalOpen,
        setIsDeleteModalOpen,
        setIsRevokeModalOpen,
        setIsGrantAllModalOpen,

        // Actions
        setSelectedRoleId,
        toggleModuleExpansion,
        toggleFeature,
        toggleModuleAll,

        // Handlers
        handleSave,
        handleCancel,
        handleDeleteClick,
        handleConfirmRevoke,
        handleConfirmGrantAll,
        handleConfirmDelete,

        // Constants for rendering
        MODULE_KEY_MAP
    };
};
