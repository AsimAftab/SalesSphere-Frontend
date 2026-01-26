import { useState, useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { createBeatPlanList, getAvailableDirectories } from '../../../../api/beatPlanService';
import type { SimpleDirectory, CreateBeatPlanListPayload } from '../../../../api/beatPlanService';
import { type BeatPlanTabType } from '../common/BeatPlanConstants';

export const useCreateBeatPlan = (onSuccess?: () => void) => {
    const queryClient = useQueryClient();
    const [name, setName] = useState('');
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [directories, setDirectories] = useState<{
        parties: SimpleDirectory[];
        sites: SimpleDirectory[];
        prospects: SimpleDirectory[];
        all: SimpleDirectory[];
    }>({ parties: [], sites: [], prospects: [], all: [] });

    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<BeatPlanTabType>('all');

    // Fetch Directories
    const fetchDirectories = async () => {
        try {
            setLoading(true);
            const data = await getAvailableDirectories();
            setDirectories(data);
        } catch (error) {
            console.error('Error fetching directories:', error);
            toast.error('Failed to load directories');
        } finally {
            setLoading(false);
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
        return items;
    }, [directories, activeTab, searchQuery]);

    const toggleSelection = (id: string) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
    };

    // Mutation
    const { mutate: createBeatPlan, isPending: submitting } = useMutation({
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

            return await createBeatPlanList(payload);
        },
        onSuccess: () => {
            toast.success('Beat plan template created successfully');
            queryClient.invalidateQueries({ queryKey: ['beat-plans'] }); // Adjust query key as needed
            if (onSuccess) onSuccess();
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to create beat plan');
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
        createBeatPlan,
        searchQuery, setSearchQuery,
        activeTab, setActiveTab,
        fetchDirectories,
        reset
    };
};
