import React from 'react';
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
            case 'sites': return { bg: 'bg-orange-50', text: 'text-orange-600', badgeBg: 'bg-orange-100', badgeText: 'text-orange-700' };
            case 'prospects': return { bg: 'bg-green-50', text: 'text-green-600', badgeBg: 'bg-green-100', badgeText: 'text-green-700' };
            default: return { bg: 'bg-gray-50', text: 'text-gray-600', badgeBg: 'bg-gray-100', badgeText: 'text-gray-600' };
        }
    };

    return (
        <div className="flex flex-col h-full overflow-hidden bg-gray-50/50">
            {/* Tabs */}
            <div className="flex-none px-6 pt-2 pb-4">
                <div className="flex p-1 bg-gray-100/80 rounded-lg backdrop-blur-sm self-start inline-flex">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as "parties" | "prospects" | "sites")}
                            className={`px-4 py-2 text-xs font-medium rounded-md capitalize transition-all flex items-center gap-2 ${activeTab === tab.id
                                ? 'bg-white text-secondary shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <span>{tab.label}</span>
                            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${activeTab === tab.id ? 'bg-secondary/10 text-secondary' : 'bg-gray-200 text-gray-600'
                                }`}>
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-h-0 px-6 pb-6 flex flex-col relative z-0">
                <div className="flex-1 border border-gray-200 rounded-xl overflow-hidden bg-white relative flex flex-col shadow-sm">
                    {activeData.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-4 text-center">
                            <div className="w-12 h-12 rounded-full  flex items-center justify-center mb-3">
                                <MapPin className="w-6 h-6 text-gray-400" />
                            </div>
                            <p className="font-medium">No {activeTab} found</p>
                            <p className="text-xs text-gray-400 mt-1">This template has no {activeTab} assigned</p>
                        </div>
                    ) : (
                        <div className="flex-1 overflow-y-auto divide-y divide-gray-100 custom-scrollbar">
                            {activeData.map((item: DirectoryItem, idx: number) => {
                                // Determine single type string for theming
                                const type = activeTab; // 'parties' | 'sites' | 'prospects'    
                                const theme = getThemeColor(type);

                                // Normalize fields
                                const name = item.partyName || item.siteName || item.prospectName || item.name;
                                const address = item.location?.address || 'No address available';
                                const owner = item.ownerName || 'Unassigned';

                                return (
                                    <div
                                        key={item._id || idx}
                                        className="group p-4 flex items-center gap-4 transition-all duration-200 border-b border-gray-50 last:border-0 hover:bg-gray-50"
                                    >
                                        {/* Icon */}
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${theme.bg}`}>
                                            {getIconSrc(type) ? (
                                                <div
                                                    className={`w-5 h-5 ${theme.text}`}
                                                    style={{
                                                        backgroundColor: 'currentColor',
                                                        mask: `url("${getIconSrc(type)}") no-repeat center / contain`,
                                                        WebkitMask: `url("${getIconSrc(type)}") no-repeat center / contain`
                                                    }}
                                                />
                                            ) : (
                                                <MapPin className={`w-5 h-5 ${theme.text}`} />
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className="font-semibold text-sm text-gray-900 truncate">
                                                    {name}
                                                </span>
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold ${theme.badgeBg} ${theme.badgeText}`}>
                                                    {type === 'parties' ? 'party' : type.slice(0, -1)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs text-gray-500 truncate">
                                                <MapPin className="w-3 h-3 flex-shrink-0 text-gray-400" />
                                                <span className="truncate">{address}</span>
                                            </div>
                                        </div>

                                        {/* Owner Badge */}
                                        <div className="hidden sm:block text-right">
                                            <span className="text-xs px-2.5 py-1 bg-gray-50 text-gray-600 rounded-lg border border-gray-100 font-medium">
                                                {owner}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewBeatPlanContent;
