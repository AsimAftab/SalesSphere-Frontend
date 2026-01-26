import { useState } from 'react';
import type { BeatPlanList } from '../../../../api/beatPlanService';
import { Building, MapPin, Users } from 'lucide-react';

export const useViewBeatPlan = (template: BeatPlanList | null) => {
    const [activeTab, setActiveTab] = useState<'parties' | 'sites' | 'prospects'>('parties');

    const tabs = [
        { id: 'parties', label: 'Parties', icon: Building, count: template?.totalParties || 0, data: template?.parties || [] },
        { id: 'sites', label: 'Sites', icon: MapPin, count: template?.totalSites || 0, data: template?.sites || [] },
        { id: 'prospects', label: 'Prospects', icon: Users, count: template?.totalProspects || 0, data: template?.prospects || [] },
    ] as const;

    const activeData = tabs.find(t => t.id === activeTab)?.data || [];

    return {
        activeTab,
        setActiveTab,
        tabs,
        activeData
    };
};
