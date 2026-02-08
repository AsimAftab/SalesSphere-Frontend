import { useState, useCallback, useEffect, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { roleService, type FeatureRegistry } from '@/api/roleService';
import { useFeaturePermissions } from './useFeaturePermissions';
import { useAuth } from '@/api/authService';
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
    const [roleDescription, setRoleDescription] = useState('');

    // --- Queries ---
    const { data: roles = [], isLoading: isLoadingRoles } = useQuery<Role[]>({
        queryKey: ['roles'],
        queryFn: roleService.getAll
    });

    const { data: featureRegistry, isLoading: isLoadingRegistry } = useQuery<FeatureRegistry>({
        queryKey: ['featureRegistry'],
        queryFn: roleService.getFeatureRegistry
    });

    // --- Derived Data ---
    const selectedRole = roles.find(r => r._id === selectedRoleId);

    // Filter modules based on subscription
    const filteredModules = useMemo(() => {
        if (isAuthLoading || !user) return [];

        const enabledKeys = user.subscription?.enabledModules || [];
        const systemKeys = ['dashboard'];
        const allowedKeys = new Set([...enabledKeys, ...systemKeys]);

        // Dashboard modules that depend on their parent entity module
        const dashboardParentMap: Record<string, string> = {
            prospectDashboard: 'prospects',
            sitesDashboard: 'sites',
        };

        return MODULES_LIST.filter(moduleName => {
            const key = MODULE_KEY_MAP[moduleName];
            // Show dashboard modules if their parent entity module is enabled
            const parentKey = dashboardParentMap[key];
            if (parentKey) return allowedKeys.has(parentKey) || allowedKeys.has(key);
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
    } = useFeaturePermissions(featureRegistry || null);

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

    // Sync description from selected role
    useEffect(() => {
        if (selectedRole) {
            setRoleDescription(selectedRole.description || '');
        } else {
            setRoleDescription('');
        }
    }, [selectedRoleId]);

    // --- Mutations ---
    const { mutate: updateRole, isPending: isUpdating } = useMutation({
        mutationFn: (newPermissions?: FeaturePermissions) => roleService.update(selectedRoleId, {
            permissions: newPermissions ?? getBackendPermissions(),
            webPortalAccess: webAccess,
            mobileAppAccess: mobileAccess,
            description: roleDescription.trim() || undefined
        }),
        onSuccess: () => {
            toast.success('Role permissions updated successfully!');
            queryClient.invalidateQueries({ queryKey: ['roles'] });
        },
        onError: (err: Error & { response?: { data?: { message?: string } } }) => {
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
        onError: (err: Error & { response?: { data?: { message?: string } } }) => {
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
            setRoleDescription(selectedRole.description || '');
            toast.success("Changes discarded");
        }
    }, [selectedRole, loadPermissions]);

    const handleConfirmRevoke = useCallback(() => {
        const newPermissions = revokeAllPermissions();
        setIsRevokeModalOpen(false);
        if (newPermissions) updateRole(newPermissions);
    }, [revokeAllPermissions, updateRole]);

    const handleConfirmGrantAll = useCallback(() => {
        const newPermissions = grantAllPermissions();
        setIsGrantAllModalOpen(false);
        if (newPermissions) updateRole(newPermissions);
    }, [grantAllPermissions, updateRole]);

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
        roleDescription,
        setRoleDescription,

        // Loading States
        isLoadingRoles,
        isLoadingRegistry,
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
