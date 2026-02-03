import React from 'react';
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
        <div className="flex flex-col flex-1 min-h-0 overflow-hidden bg-gray-50/50">
            {/* Fixed Top Section: Name & Search */}
            <div className="flex-none p-6 space-y-6 relative z-10">
                {/* Name Input */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Beat Plan Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. North Zone Weekly Route"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all shadow-sm"
                    />
                </div>

                {/* Selection Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <label className="block text-sm font-semibold text-gray-700 whitespace-nowrap">
                        Select Stops ({selectedIds.size} selected)
                    </label>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                        <div className="flex gap-2 p-1 bg-gray-100/80 rounded-lg self-start sm:self-auto backdrop-blur-sm">
                            {visibleTabs.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setActiveTab(t.id)}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-all ${activeTab === t.id
                                        ? 'bg-white text-secondary shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>

                        <SearchBar
                            value={searchQuery}
                            onChange={setSearchQuery}
                            placeholder="Search by name,owner and address"
                            className="w-full sm:w-64"
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
                        <div className="flex-1 overflow-y-auto divide-y divide-gray-100 custom-scrollbar">
                            {directories.map((item) => {
                                const isSelected = selectedIds.has(item._id);
                                const getThemeColor = (type: string) => {
                                    switch (type) {
                                        case 'party': return { bg: 'bg-blue-50', text: 'text-blue-600', badgeBg: 'bg-blue-100', badgeText: 'text-blue-700' };
                                        case 'site': return { bg: 'bg-orange-50', text: 'text-orange-600', badgeBg: 'bg-orange-100', badgeText: 'text-orange-700' };
                                        case 'prospect': return { bg: 'bg-green-50', text: 'text-green-600', badgeBg: 'bg-green-100', badgeText: 'text-green-700' };
                                        default: return { bg: 'bg-gray-50', text: 'text-gray-600', badgeBg: 'bg-gray-100', badgeText: 'text-gray-600' };
                                    }
                                };

                                const theme = getThemeColor(item.type);

                                return (
                                    <div
                                        key={item._id}
                                        onClick={() => toggleSelection(item._id)}
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

                                        {/* Icon */}
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${theme.bg}`}>
                                            {getIconSrc(item.type) ? (
                                                <div
                                                    className={`w-5 h-5 ${theme.text}`}
                                                    style={{
                                                        backgroundColor: 'currentColor',
                                                        mask: `url("${getIconSrc(item.type)}") no-repeat center / contain`,
                                                        WebkitMask: `url("${getIconSrc(item.type)}") no-repeat center / contain`
                                                    }}
                                                />
                                            ) : (
                                                <MapPin className={`w-5 h-5 ${theme.text}`} />
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className={`font-semibold text-sm truncate ${isSelected ? 'text-secondary' : 'text-gray-900'}`}>
                                                    {item.name || item.partyName || item.siteName || item.prospectName}
                                                </span>
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold ${theme.badgeBg} ${theme.badgeText}`}>
                                                    {item.type}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs text-gray-500 truncate">
                                                <MapPin className="w-3 h-3 flex-shrink-0 text-gray-400" />
                                                <span className="truncate">{item.location?.address || 'No address available'}</span>
                                            </div>
                                        </div>

                                        {/* Owner Badge */}
                                        <div className="hidden sm:block text-right">
                                            <span className="text-xs px-2.5 py-1 bg-gray-50 text-gray-600 rounded-lg border border-gray-100 font-medium">
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
