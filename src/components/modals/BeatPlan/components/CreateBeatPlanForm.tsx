import React, { useEffect, useRef } from 'react';
import {
    AlertCircle,
    CheckCircle,
    Loader2,
    MapPin,
} from 'lucide-react';
import type { SimpleDirectory } from '@/api/beatPlanService';
import { BEAT_PLAN_TABS, type BeatPlanTabType } from '../common/BeatPlanConstants';

import partiesIcon from '@/assets/images/icons/parties-icon.svg';
import sitesIcon from '@/assets/images/icons/sites-icon.svg';
import prospectsIcon from '@/assets/images/icons/prospects-icon.svg';
import { Button as CustomButton, SearchBar } from '@/components/ui';

interface CreateBeatPlanFormProps {
    name: string;
    setName: (name: string) => void;
    selectedIds: Set<string>;
    toggleSelection: (id: string) => void;
    directories: SimpleDirectory[]; // Already filtered
    loading: boolean;
    submitting: boolean;
    onSubmit: () => void;
    onCancel: () => void;
    searchQuery: string;
    setSearchQuery: (q: string) => void;
    activeTab: BeatPlanTabType;
    setActiveTab: (tab: BeatPlanTabType) => void;
    isEditMode?: boolean;
    enabledTypes?: string[];
}

const CreateBeatPlanForm: React.FC<CreateBeatPlanFormProps> = ({
    name, setName,
    selectedIds, toggleSelection,
    directories,
    loading,
    submitting,
    onSubmit,
    onCancel,
    searchQuery, setSearchQuery,
    activeTab, setActiveTab,
    isEditMode,
    enabledTypes
}) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Reset scroll position when tab changes
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = 0;
        }
    }, [activeTab]);
    // Filter tabs to only show enabled entity types
    const visibleTabs = BEAT_PLAN_TABS.filter(t =>
        t.id === 'all' || !enabledTypes || enabledTypes.includes(t.id)
    );

    const getIconSrc = (type: string) => {
        switch (type) {
            case 'party': return partiesIcon;
            case 'site': return sitesIcon;
            case 'prospect': return prospectsIcon;
            default: return null;
        }
    };

    return (
        <div className="flex flex-col h-full max-h-[85vh] min-h-0 overflow-hidden bg-gray-50/50">
            {/* Fixed Top Section: Name & Search */}
            <div className="flex-none p-6 space-y-6 relative z-10">
                {/* Name Input */}
                <div>
                    <label htmlFor="beat-plan-name" className="block text-sm font-semibold text-gray-700 mb-2">
                        Beat Plan Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="beat-plan-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. North Zone Weekly Route"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all shadow-sm"
                    />
                </div>

                {/* Selection Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">
                            Select Stops
                        </label>
                        <p className="text-sm text-gray-500 mt-0.5">{selectedIds.size} selected</p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                        <div className="flex gap-2 p-1.5 bg-gray-100/80 rounded-xl backdrop-blur-sm shadow-sm border border-gray-200/50 overflow-x-auto">
                            <div className="flex gap-2 flex-nowrap">
                                {visibleTabs.map((t) => {
                                    const theme = (() => {
                                        switch (t.id) {
                                            case 'party': return { text: 'text-blue-600' };
                                            case 'prospect': return { text: 'text-orange-600' };
                                            case 'site': return { text: 'text-green-600' };
                                            default: return { text: 'text-gray-600' };
                                        }
                                    })();
                                    const isActive = activeTab === t.id;
                                    return (
                                        <button
                                            key={t.id}
                                            onClick={() => setActiveTab(t.id)}
                                            className={`group px-4 py-2 text-sm font-semibold rounded-lg capitalize transition-all duration-200 flex items-center gap-2 ${isActive
                                                ? 'bg-white text-gray-900 shadow-md scale-105'
                                                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                                                }`}
                                        >
                                            {/* Icon */}
                                            {getIconSrc(t.id) && (
                                                <div className={`w-4 h-4 transition-colors ${isActive ? theme.text : 'text-gray-400 group-hover:text-gray-600'}`}
                                                    style={{
                                                        backgroundColor: 'currentColor',
                                                        mask: `url("${getIconSrc(t.id)}") no-repeat center / contain`,
                                                        WebkitMask: `url("${getIconSrc(t.id)}") no-repeat center / contain`
                                                    }}
                                                />
                                            )}
                                            <span>{t.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <SearchBar
                            value={searchQuery}
                            onChange={setSearchQuery}
                            placeholder="Search by name,owner and address"
                            className="w-full sm:w-auto sm:max-w-xs flex-shrink-0"
                        />
                    </div>
                </div>
            </div>

            {/* Scrollable List Area (Flexible Height, Max ~5 rows) */}
            <div className="px-6 pb-2 relative z-0 h-[375px] min-h-0 flex-initial flex flex-col">
                <div className="flex-1 border border-gray-200 rounded-xl overflow-hidden bg-white relative flex flex-col shadow-sm">
                    {loading ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10">
                            <Loader2 className="w-8 h-8 text-secondary animate-spin" />
                        </div>
                    ) : !directories || directories.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-4 text-center">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3">
                                <MapPin className="w-6 h-6 text-gray-400" />
                            </div>
                            <p className="font-medium">No locations found</p>
                            <p className="text-xs text-gray-400 mt-1">Try adjusting your search or filters</p>
                        </div>
                    ) : (
                        <div ref={scrollRef} className="flex-1 overflow-y-auto divide-y divide-gray-100 custom-scrollbar">
                            {directories.map((item) => {
                                const isSelected = selectedIds.has(item._id);
                                const getThemeColor = (type: string) => {
                                    switch (type) {
                                        case 'party': return { bg: 'bg-blue-50', text: 'text-blue-600', badgeBg: 'bg-blue-100', badgeText: 'text-blue-700' };
                                        case 'prospect': return { bg: 'bg-orange-50', text: 'text-orange-600', badgeBg: 'bg-orange-100', badgeText: 'text-orange-700' };
                                        case 'site': return { bg: 'bg-green-50', text: 'text-green-600', badgeBg: 'bg-green-100', badgeText: 'text-green-700' };
                                        default: return { bg: 'bg-gray-50', text: 'text-gray-600', badgeBg: 'bg-gray-100', badgeText: 'text-gray-600' };
                                    }
                                };

                                const theme = getThemeColor(item.type);

                                return (
                                    <div
                                        key={item._id}
                                        onClick={() => toggleSelection(item._id)}
                                        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleSelection(item._id)}
                                        role="button"
                                        tabIndex={0}
                                        className={`
                                                group p-4 flex items-center gap-4 cursor-pointer transition-all duration-200 border-b border-gray-50 last:border-0
                                                ${isSelected
                                                ? 'bg-secondary/5 hover:bg-secondary/10'
                                                : 'bg-white hover:bg-gray-50'}
                                            `}
                                    >
                                        {/* Checkbox */}
                                        <div className={`
                                                w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-200 flex-shrink-0
                                                ${isSelected
                                                ? 'bg-secondary border-secondary text-white shadow-sm scale-110'
                                                : 'border-gray-200 bg-gray-50 group-hover:border-gray-300'}
                                            `}>
                                            {isSelected && <CheckCircle className="w-3.5 h-3.5" />}
                                        </div>

                                        {/* Enhanced Icon */}
                                        <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${theme.bg} group-hover:scale-110 transition-transform duration-200 shadow-sm`}>
                                            {getIconSrc(item.type) ? (
                                                <div
                                                    className={`w-6 h-6 ${theme.text}`}
                                                    style={{
                                                        backgroundColor: 'currentColor',
                                                        mask: `url("${getIconSrc(item.type)}") no-repeat center / contain`,
                                                        WebkitMask: `url("${getIconSrc(item.type)}") no-repeat center / contain`
                                                    }}
                                                />
                                            ) : (
                                                <MapPin className={`w-6 h-6 ${theme.text}`} />
                                            )}
                                        </div>

                                        {/* Enhanced Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2.5 mb-1">
                                                <span className={`font-bold text-base truncate ${isSelected ? 'text-secondary' : 'text-gray-900 group-hover:text-gray-950'}`}>
                                                    {item.name || item.partyName || item.siteName || item.prospectName}
                                                </span>
                                                <span className={`text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wide font-extrabold ${theme.badgeBg} ${theme.badgeText} shadow-sm`}>
                                                    {item.type}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600 truncate">
                                                <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
                                                <span className="truncate">{item.location?.address || 'No address available'}</span>
                                            </div>
                                        </div>

                                        {/* Enhanced Owner Badge */}
                                        <div className="hidden sm:block">
                                            <span className="inline-flex items-center px-3.5 py-1.5 bg-gradient-to-br from-gray-50 to-gray-100/80 text-gray-700 rounded-lg border border-gray-200/80 font-semibold text-sm shadow-sm group-hover:shadow-md transition-shadow">
                                                {item.ownerName}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Fixed Footer */}
            <div className="flex-none px-6 py-4 bg-white border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10 transition-all">
                <div className="flex-1">
                    {selectedIds.size === 0 && (
                        <p className="text-md text-gray-700 flex items-center gap-2 px-3 py-2">
                            <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                            <span>Select locations to add to this template</span>
                        </p>
                    )}
                </div>
                <div className="flex justify-end gap-3 w-full sm:w-auto">
                    <CustomButton
                        variant="outline"
                        onClick={onCancel}
                        disabled={submitting}
                        className="text-gray-700 bg-white border-gray-300 hover:bg-gray-50 font-medium"
                    >
                        Cancel
                    </CustomButton>
                    <CustomButton
                        variant="secondary"
                        onClick={onSubmit}
                        disabled={submitting || !name || selectedIds.size === 0}
                        isLoading={submitting}
                    >
                        {isEditMode ? 'Update Beat Plan Template' : 'Create Beat Plan Template'}
                    </CustomButton>
                </div>
            </div>
        </div>
    );
};

export default CreateBeatPlanForm;
