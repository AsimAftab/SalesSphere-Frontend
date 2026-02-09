import React, { useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';
import partiesIcon from '@/assets/images/icons/parties-icon.svg';
import sitesIcon from '@/assets/images/icons/sites-icon.svg';
import prospectsIcon from '@/assets/images/icons/prospects-icon.svg';

interface DirectoryItem {
    _id: string;
    partyName?: string;
    siteName?: string;
    prospectName?: string;
    name?: string;
    ownerName?: string;
    location?: { address?: string };
}

interface ViewBeatPlanContentProps {
    activeTab: 'parties' | 'sites' | 'prospects';
    setActiveTab: (tab: 'parties' | 'sites' | 'prospects') => void;
    tabs: ReadonlyArray<{
        id: string;
        label: string;
        icon?: React.ElementType;
        count: number;
        data: DirectoryItem[];
    }>;
    activeData: DirectoryItem[];
}

const ViewBeatPlanContent: React.FC<ViewBeatPlanContentProps> = ({
    activeTab,
    setActiveTab,
    tabs,
    activeData
}) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Reset scroll position when tab changes
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = 0;
        }
    }, [activeTab]);

    const getIconSrc = (type: string) => {
        switch (type) {
            case 'parties': return partiesIcon;
            case 'sites': return sitesIcon;
            case 'prospects': return prospectsIcon;
            default: return null;
        }
    };

    const getThemeColor = (type: string) => {
        switch (type) {
            case 'parties': return { bg: 'bg-blue-50', text: 'text-blue-600', badgeBg: 'bg-blue-100', badgeText: 'text-blue-700' };
            case 'prospects': return { bg: 'bg-orange-50', text: 'text-orange-600', badgeBg: 'bg-orange-100', badgeText: 'text-orange-700' };
            case 'sites': return { bg: 'bg-green-50', text: 'text-green-600', badgeBg: 'bg-green-100', badgeText: 'text-green-700' };
            default: return { bg: 'bg-gray-50', text: 'text-gray-600', badgeBg: 'bg-gray-100', badgeText: 'text-gray-600' };
        }
    };

    return (
        <div className="flex flex-col h-full max-h-[600px] overflow-hidden bg-gradient-to-br from-gray-50/50 to-white">
            {/* Enhanced Tabs */}
            <div className="flex-none px-6 pt-4 pb-5">
                <div className="flex gap-2 p-1.5 bg-gray-100/80 rounded-xl backdrop-blur-sm inline-flex shadow-sm border border-gray-200/50">
                    {tabs.map((tab) => {
                        const theme = getThemeColor(tab.id);
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as "parties" | "prospects" | "sites")}
                                className={`group relative px-5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center gap-2.5 ${isActive
                                    ? 'bg-white text-gray-900 shadow-md scale-105'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                                    }`}
                            >
                                {/* Icon */}
                                {getIconSrc(tab.id) && (
                                    <div className={`w-4 h-4 transition-colors ${isActive ? theme.text : 'text-gray-400 group-hover:text-gray-600'}`}
                                        style={{
                                            backgroundColor: 'currentColor',
                                            mask: `url("${getIconSrc(tab.id)}") no-repeat center / contain`,
                                            WebkitMask: `url("${getIconSrc(tab.id)}") no-repeat center / contain`
                                        }}
                                    />
                                )}
                                <span>{tab.label}</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold transition-colors ${isActive
                                    ? `${theme.badgeBg} ${theme.badgeText}`
                                    : 'bg-gray-200 text-gray-600 group-hover:bg-gray-300'
                                    }`}>
                                    {tab.count}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Enhanced Content Area */}
            <div className="px-6 pb-6 h-[375px] min-h-0 flex-initial flex flex-col">
                <div className="flex-1 border border-gray-200/80 rounded-2xl overflow-hidden bg-white shadow-lg relative flex flex-col">
                    {activeData.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-8 text-center h-full">
                            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                                <MapPin className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="font-semibold text-lg text-gray-700">No {activeTab} found</p>
                            <p className="text-sm text-gray-500 mt-2">This template has no {activeTab} assigned yet</p>
                        </div>
                    ) : (
                        <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar">
                            <div className="divide-y divide-gray-100">
                                {activeData.map((item: DirectoryItem, idx: number) => {
                                    const type = activeTab;
                                    const theme = getThemeColor(type);
                                    const name = item.partyName || item.siteName || item.prospectName || item.name;
                                    const address = item.location?.address || 'No address available';
                                    const owner = item.ownerName || 'Unassigned';

                                    return (
                                        <div
                                            key={item._id || idx}
                                            className="group px-5 py-4 flex items-center gap-4 transition-all duration-200 hover:bg-gradient-to-r hover:from-gray-50/80 hover:to-transparent cursor-default"
                                        >
                                            {/* Enhanced Icon */}
                                            <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${theme.bg} group-hover:scale-110 transition-transform duration-200 shadow-sm`}>
                                                {getIconSrc(type) ? (
                                                    <div
                                                        className={`w-6 h-6 ${theme.text}`}
                                                        style={{
                                                            backgroundColor: 'currentColor',
                                                            mask: `url("${getIconSrc(type)}") no-repeat center / contain`,
                                                            WebkitMask: `url("${getIconSrc(type)}") no-repeat center / contain`
                                                        }}
                                                    />
                                                ) : (
                                                    <MapPin className={`w-6 h-6 ${theme.text}`} />
                                                )}
                                            </div>

                                            {/* Enhanced Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2.5 mb-1">
                                                    <span className="font-bold text-base text-gray-900 truncate group-hover:text-gray-950">
                                                        {name}
                                                    </span>
                                                    <span className={`text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wide font-extrabold ${theme.badgeBg} ${theme.badgeText} shadow-sm`}>
                                                        {type === 'parties' ? 'party' : type.slice(0, -1)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600 truncate">
                                                    <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
                                                    <span className="truncate">{address}</span>
                                                </div>
                                            </div>

                                            {/* Enhanced Owner Badge */}
                                            <div className="hidden sm:block">
                                                <span className="inline-flex items-center px-3.5 py-1.5 bg-gradient-to-br from-gray-50 to-gray-100/80 text-gray-700 rounded-lg border border-gray-200/80 font-semibold text-sm shadow-sm group-hover:shadow-md transition-shadow">
                                                    {owner}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewBeatPlanContent;
