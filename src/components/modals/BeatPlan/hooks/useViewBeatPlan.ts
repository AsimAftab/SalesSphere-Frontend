import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { BeatPlanList } from '@/api/beatPlanService';
import { getBeatPlanListById } from '@/api/beatPlanService';

export const useViewBeatPlan = (template: BeatPlanList | null) => {
    const [activeTab, setActiveTab] = useState<'parties' | 'sites' | 'prospects'>('parties');

    const { data: fullTemplate, isLoading } = useQuery({
        queryKey: ['beat-plan-list', template?._id],
        queryFn: () => template ? getBeatPlanListById(template._id) : Promise.reject('No ID'),
        enabled: !!template?._id,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    // Use full template if available, otherwise fallback to prop (which usually has summaries only)
    const displayData = fullTemplate || template;

    // Calculate counts dynamically from authoritative data if available, else fallback to template summary
    const counts = {
        parties: fullTemplate ? (fullTemplate.parties?.filter(Boolean).length || 0) : (template?.totalParties || 0),
        sites: fullTemplate ? (fullTemplate.sites?.filter(Boolean).length || 0) : (template?.totalSites || 0),
        prospects: fullTemplate ? (fullTemplate.prospects?.filter(Boolean).length || 0) : (template?.totalProspects || 0),
    };

    const tabs = [
        { id: 'parties', label: 'Parties', count: counts.parties, data: displayData?.parties || [] },
        { id: 'prospects', label: 'Prospects', count: counts.prospects, data: displayData?.prospects || [] },
        { id: 'sites', label: 'Sites', count: counts.sites, data: displayData?.sites || [] },
    ] as const;

    const activeData = tabs.find(t => t.id === activeTab)?.data || [];

    return {
        activeTab,
        setActiveTab,
        tabs,
        activeData,
        isLoading
    };
};
