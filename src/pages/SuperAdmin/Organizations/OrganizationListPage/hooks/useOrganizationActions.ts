import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import type { OrganizationFormData } from '@/components/modals/SuperAdmin/OrganizationFormModal/types';
import {
    addOrganization,
    updateOrganization,
    toggleOrganizationStatus,
    type Organization
} from '../../../../../api/SuperAdmin/organizationService';

export const useOrganizationActions = (refreshData: () => void) => {
    const [isUpdating, setIsUpdating] = useState(false);

    const handleAddOrganization = useCallback(async (orgData: OrganizationFormData) => {
        try {
            setIsUpdating(true);
            await addOrganization(orgData);
            toast.success('Organization added successfully');
            refreshData();
            return true;
        } catch (error: unknown) {
            console.error('Error adding organization:', error);
            const err = error as { response?: { data?: { message?: string } }; message?: string };
            const msg = err.response?.data?.message || err.message || 'Failed to add organization';
            toast.error(msg);
            return false;
        } finally {
            setIsUpdating(false);
        }
    }, [refreshData]);

    const handleUpdateOrganization = useCallback(async (id: string, updates: Partial<Organization>) => {
        try {
            setIsUpdating(true);
            await updateOrganization(id, updates);
            toast.success('Organization updated successfully');
            refreshData();
            return true;
        } catch (error: unknown) {
            console.error('Error updating organization:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to update organization');
            return false;
        } finally {
            setIsUpdating(false);
        }
    }, [refreshData]);

    const handleToggleStatus = useCallback(async (id: string, currentStatus: string) => {
        try {
            setIsUpdating(true); // Reusing updating state
            const shouldActivate = currentStatus !== 'Active';
            await toggleOrganizationStatus(id, shouldActivate);
            toast.success(`Organization ${shouldActivate ? 'activated' : 'deactivated'} successfully`);
            refreshData();
        } catch (error: unknown) {
            console.error('Error toggling status:', error);
            toast.error('Failed to change organization status');
        } finally {
            setIsUpdating(false);
        }
    }, [refreshData]);

    return {
        addOrganization: handleAddOrganization,
        updateOrganization: handleUpdateOrganization,
        toggleStatus: handleToggleStatus,
        isUpdating
    };
};
