import { useState, useMemo, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { createBeatPlanList, updateBeatPlanList, getAvailableDirectories, getBeatPlanListById } from '../../../../api/beatPlanService';
import type { SimpleDirectory, CreateBeatPlanListPayload, BeatPlanList, AssignedParty, AssignedSite, AssignedProspect } from '../../../../api/beatPlanService';
import { type BeatPlanTabType } from '../common/BeatPlanConstants';

export const useCreateBeatPlan = (onSuccess?: () => void, editData?: BeatPlanList | null) => {
    const queryClient = useQueryClient();
    const [name, setName] = useState('');
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [directories, setDirectories] = useState<{
        parties: SimpleDirectory[];
        sites: SimpleDirectory[];
        prospects: SimpleDirectory[];
        all: SimpleDirectory[];
    }>({ parties: [], sites: [], prospects: [], all: [] });

    const [loadingDirectories, setLoadingDirectories] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<BeatPlanTabType>('all');

    // Fetch Full Edit Data (to ensure we have the selected IDs populated)
    const { data: fullEditData, isLoading: loadingEditData } = useQuery({
        queryKey: ['beat-plan-list', editData?._id],
        queryFn: () => editData ? getBeatPlanListById(editData._id) : Promise.resolve(null as any),
        enabled: !!editData?._id,
        staleTime: 0, // Always fetch fresh to avoid stale selection
    });

    // Prefill Data for Edit Mode
    useEffect(() => {
        if (fullEditData) {
            setName(fullEditData.name);
            const ids = new Set<string>();
            fullEditData.parties?.forEach((p: AssignedParty) => ids.add(p._id));
            fullEditData.sites?.forEach((s: AssignedSite) => ids.add(s._id));
            fullEditData.prospects?.forEach((p: AssignedProspect) => ids.add(p._id));
            setSelectedIds(ids);
        } else if (!editData) {
            // Reset only if completely exiting edit mode
            setName('');
            setSelectedIds(new Set());
        }
    }, [fullEditData, editData]);

    // Combined Loading
    const loading = loadingDirectories || loadingEditData;

    // Fetch Directories
    const fetchDirectories = async () => {
        try {
            setLoadingDirectories(true);
            const data = await getAvailableDirectories();
            setDirectories(data);
        } catch (error) {
            console.error('Error fetching directories:', error);
            toast.error('Failed to load directories');
        } finally {
            setLoadingDirectories(false);
        }
    };

    // Filter Logic
    const filteredDirectories = useMemo(() => {
        let items = activeTab === 'all' ? directories.all : directories.all.filter(d => d.type === activeTab);

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            items = items.filter(item =>
                (item.name || '').toLowerCase().includes(q) ||
                (item.ownerName || '').toLowerCase().includes(q) ||
                (item.location?.address || '').toLowerCase().includes(q)
            );
        }
        // Sort: Selected first
        return [...items].sort((a, b) => {
            const aSelected = selectedIds.has(a._id);
            const bSelected = selectedIds.has(b._id);
            if (aSelected && !bSelected) return -1;
            if (!aSelected && bSelected) return 1;
            return 0;
        });
    }, [directories, activeTab, searchQuery, selectedIds]);

    const toggleSelection = (id: string) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
    };

    // Mutation (Create or Update)
    const { mutate: saveBeatPlan, isPending: submitting } = useMutation({
        mutationFn: async () => {
            if (!name.trim()) throw new Error('Please enter a plan name');
            if (selectedIds.size === 0) throw new Error('Please select at least one stop');

            const selectedItems = directories.all.filter(d => selectedIds.has(d._id));


            const parties = selectedItems.filter(d => d.type === 'party').map(d => d._id);
            const sites = selectedItems.filter(d => d.type === 'site').map(d => d._id);
            const prospects = selectedItems.filter(d => d.type === 'prospect').map(d => d._id);

            const payload: CreateBeatPlanListPayload = {
                name,
                parties,
                sites,
                prospects
            };

            if (editData) {
                return await updateBeatPlanList({ id: editData._id, updateData: payload });
            } else {
                return await createBeatPlanList(payload);
            }
        },
        onSuccess: () => {
            toast.success(editData ? 'Beat plan updated successfully' : 'Beat plan template created successfully');
            queryClient.invalidateQueries({ queryKey: ['beat-plan-lists'] }); // Invalidate Lists
            // Also invalidate detail if viewing?
            if (editData) {
                queryClient.invalidateQueries({ queryKey: ['beat-plan-list', editData._id] });
            }
            if (onSuccess) onSuccess();
        },
        onError: (error: any) => {
            toast.error(error.message || `Failed to ${editData ? 'update' : 'create'} beat plan`);
        }
    });

    const reset = () => {
        setName('');
        setSelectedIds(new Set());
        setSearchQuery('');
        setActiveTab('all');
    };

    return {
        name, setName,
        selectedIds, toggleSelection,
        directories: filteredDirectories,
        loading,
        submitting,
        createBeatPlan: saveBeatPlan, // Alias for backward compatibility (or visual simplicity)
        searchQuery, setSearchQuery,
        activeTab, setActiveTab,
        fetchDirectories,
        reset,
        isEditMode: !!editData
    };
};
