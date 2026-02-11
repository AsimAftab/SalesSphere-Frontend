import { useState, useEffect, useCallback } from 'react';
import api from '@/api/api'; // Import configured axios instance
import { API_ENDPOINTS } from '@/api/endpoints';
import { toast } from 'react-hot-toast';

export type EntityType = 'party' | 'prospect' | 'site';

export interface MappingItem {
    _id: string;
    name: string;
    subText?: string; // e.g., Owner Name or Address
    image?: string;
    assignedAt?: string;
    category?: string;
    categoryLabel?: string; // e.g., "Party Type" or "Sub-Organization"
    address?: string;
}

interface UseEntityMappingProps {
    entityType: EntityType;
    employeeId: string;
}

export const useEntityMapping = ({ entityType, employeeId }: UseEntityMappingProps) => {
    const [assignedItems, setAssignedItems] = useState<MappingItem[]>([]);
    const [availableItems, setAvailableItems] = useState<MappingItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAssigning, setIsAssigning] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [filterOptions, setFilterOptions] = useState<string[]>([]);
    const [selectedFilter, setSelectedFilter] = useState<string>('');

    // Helper to get base URL
    const getBaseUrl = useCallback(() => {
        switch (entityType) {
            case 'party': return API_ENDPOINTS.parties.BASE;
            case 'prospect': return API_ENDPOINTS.prospects.BASE;
            case 'site': return API_ENDPOINTS.sites.BASE;
            default: return '';
        }
    }, [entityType]);

    const getAssignUrl = useCallback((id: string) => {
        switch (entityType) {
            case 'party': return API_ENDPOINTS.parties.ASSIGN(id);
            case 'prospect': return API_ENDPOINTS.prospects.ASSIGN(id);
            case 'site': return API_ENDPOINTS.sites.ASSIGN(id);
            default: return '';
        }
    }, [entityType]);

    const fetchFilterOptions = useCallback(async () => {
        try {
            if (entityType === 'party') {
                const res = await api.get(API_ENDPOINTS.parties.TYPES);
                // Expected: { data: [{ name: '...' }] }
                const options = res.data.data.map((t: { name: string }) => t.name);
                setFilterOptions(options);
            } else if (entityType === 'site') {
                const res = await api.get(API_ENDPOINTS.sites.SUB_ORGS);
                const options = res.data.data.map((t: { name: string }) => t.name);
                setFilterOptions(options);
            } else {
                setFilterOptions([]);
            }
        } catch {
            // Intentionally empty - filter options fetch failure is non-critical
        }
    }, [entityType]);

    const fetchData = useCallback(async () => {
        if (!employeeId) return;
        setIsLoading(true);
        setError(null);
        try {
            const baseUrl = getBaseUrl();

            // 1. Fetch All Available Entities (for the organization)
            const allRes = await api.get(baseUrl);

            const allData: Array<Record<string, unknown> & { _id: string; assignedUsers?: Array<string | { _id: string }>; location?: { address?: string } }> = allRes.data.data || [];

            const assigned: MappingItem[] = [];
            const available: MappingItem[] = [];

            // Process data to map to UI structure


            // Re-implementing the loop to include category:
            allData.forEach(item => {
                const isAssigned = item.assignedUsers && item.assignedUsers.some((u: string | { _id: string }) =>
                    (typeof u === 'string' ? u : u._id) === employeeId
                );

                let category = '';
                let categoryLabel = '';
                if (entityType === 'party') {
                    category = String(item.partyType || '');
                    categoryLabel = 'Party Type';
                }
                if (entityType === 'site') {
                    category = String(item.subOrganization || '');
                    categoryLabel = 'Sub-Organization';
                }

                const mapItem: MappingItem = {
                    _id: item._id,
                    name: String(item.partyName || item.prospectName || item.siteName || 'Unknown'),
                    assignedAt: item.assignedAt as string | undefined,
                    category: category,
                    categoryLabel: categoryLabel,
                    address: (item.address as string) || item.location?.address || '',
                };

                if (isAssigned) {
                    assigned.push(mapItem);
                } else {
                    available.push(mapItem);
                }
            });

            setAssignedItems(assigned);
            setAvailableItems(available);

        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { message?: string } }; message?: string };
            setError(axiosErr.response?.data?.message || axiosErr.message || 'Failed to fetch data');
            toast.error(`Failed to load ${entityType}s`);
        } finally {
            setIsLoading(false);
        }
    }, [entityType, employeeId, getBaseUrl]);

    // Fetch filters on mount
    useEffect(() => {
        fetchFilterOptions();
    }, [fetchFilterOptions]);

    // Initial Load
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const assignEntities = async (entityIds: string[]) => {
        if (!entityIds.length) return;
        setIsAssigning(true);
        try {
            await Promise.all(entityIds.map(id =>
                api.post(getAssignUrl(id), {
                    userIds: [employeeId]
                })
            ));

            toast.success(`Assigned ${entityIds.length} ${entityType}(s)`);
            await fetchData();
        } catch (err: unknown) {
            console.error('Assign error:', err);
            const axiosErr = err as { response?: { data?: { message?: string } } };
            toast.error(axiosErr.response?.data?.message || 'Failed to assign');
        } finally {
            setIsAssigning(false);
        }
    };

    const unassignEntities = async (entityIds: string[]) => {
        if (!entityIds.length) return;
        setIsAssigning(true);
        try {
            await Promise.all(entityIds.map(id =>
                api.delete(getAssignUrl(id), {
                    data: { userIds: [employeeId] }
                })
            ));

            toast.success(`Removed ${entityIds.length} ${entityType}(s)`);
            await fetchData();
        } catch (err: unknown) {
            console.error('Unassign error:', err);
            const axiosErr = err as { response?: { data?: { message?: string } } };
            toast.error(axiosErr.response?.data?.message || 'Failed to unassign');
        } finally {
            setIsAssigning(false);
        }
    };

    return {
        assignedItems,
        availableItems,
        isLoading,
        isAssigning,
        error,
        assignEntities,
        unassignEntities,
        refresh: fetchData,
        // Filter props
        filterOptions,
        selectedFilter,
        setFilter: setSelectedFilter
    };
};
