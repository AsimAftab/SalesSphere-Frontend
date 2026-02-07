import React, { useMemo } from 'react';
import {
    ChevronRight, LayoutDashboard, MapPinned, ShoppingBag, FileText, FileSpreadsheet,
    Users, CalendarCheck, CalendarOff, Building2, UserSearch, HardHat, BarChart3,
    TrendingUp, Building, Route, Map, Wallet, Car, StickyNote, Briefcase, Package,
    type LucideIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import FeatureToggleRow from './FeatureToggleRow';

const MODULE_ICONS: Record<string, LucideIcon> = {
    dashboard: LayoutDashboard,
    liveTracking: MapPinned,
    products: ShoppingBag,
    invoices: FileText,
    estimates: FileSpreadsheet,
    employees: Users,
    attendance: CalendarCheck,
    leaves: CalendarOff,
    parties: Building2,
    prospects: UserSearch,
    sites: HardHat,
    analytics: BarChart3,
    prospectDashboard: TrendingUp,
    sitesDashboard: Building,
    beatPlan: Route,
    tourPlan: Map,
    collections: Wallet,
    expenses: Wallet,
    odometer: Car,
    notes: StickyNote,
    miscellaneousWork: Briefcase,
};

interface ModulePermissionAccordionProps {
    moduleName: string;
    moduleDisplayName: string;
    features: {
        [featureKey: string]: string; // key -> description
    };
    permissions: {
        [featureKey: string]: boolean;
    };
    isExpanded: boolean;
    onToggleExpand: (moduleName: string) => void;
    onToggleFeature: (moduleName: string, featureKey: string) => void;
    onToggleModuleAll: (moduleName: string) => void;
    disabled?: boolean;
}

/**
 * Expandable module section with feature permissions
 * Shows module header with All Access toggle and feature list when expanded
 */
const ModulePermissionAccordion: React.FC<ModulePermissionAccordionProps> = ({
    moduleName,
    moduleDisplayName,
    features,
    permissions,
    isExpanded,
    onToggleExpand,
    onToggleFeature,
    onToggleModuleAll,
    disabled = false
}) => {
    // Check if all features are enabled
    const allFeaturesEnabled = useMemo(() => {
        const featureKeys = Object.keys(features);
        if (featureKeys.length === 0) return false;
        return featureKeys.every(key => permissions[key] === true);
    }, [features, permissions]);

    // Count enabled features
    const enabledCount = useMemo(() => {
        return Object.values(permissions).filter(v => v === true).length;
    }, [permissions]);

    const totalCount = Object.keys(features).length;
    const progressPercent = totalCount > 0 ? (enabledCount / totalCount) * 100 : 0;

    // Check if module is partially enabled
    const hasAnyEnabled = useMemo(() => {
        return Object.values(permissions).some(value => value === true);
    }, [permissions]);

    const ModuleIcon = MODULE_ICONS[moduleName] || Package;

    return (
        <div className={`border rounded-xl overflow-hidden bg-white transition-all ${isExpanded ? 'border-secondary/30 shadow-md ring-1 ring-secondary/10' : 'border-gray-200 hover:shadow-md hover:border-gray-300'}`}>
            {/* Module Header */}
            <div className={`px-4 py-3.5 transition-colors ${isExpanded ? 'bg-secondary/5' : 'bg-white'}`}>
                <div className="flex items-center justify-between">
                    {/* Left: Expand/Collapse Button + Module Name */}
                    <button
                        onClick={() => onToggleExpand(moduleName)}
                        className="flex items-center gap-3 flex-1 text-left group"
                        disabled={disabled}
                    >
                        <div className={`flex-shrink-0 p-1.5 rounded-md transition-colors ${isExpanded ? 'bg-secondary/10' : 'bg-gray-100 group-hover:bg-gray-200'}`}>
                            <ModuleIcon className={`w-4 h-4 ${isExpanded ? 'text-secondary' : 'text-gray-500'}`} />
                        </div>
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                            <span className="font-semibold text-sm text-gray-900 truncate">
                                {moduleDisplayName}
                            </span>

                            {/* Feature count badge */}
                            <span className="text-xs font-semibold text-secondary flex-shrink-0">
                                {enabledCount}/{totalCount}
                            </span>

                            {/* Status badge when collapsed */}
                            {!isExpanded && (
                                <>
                                    {allFeaturesEnabled ? (
                                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200 flex-shrink-0">
                                            Full Access
                                        </span>
                                    ) : hasAnyEnabled ? (
                                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex-shrink-0">
                                            Partial
                                        </span>
                                    ) : (
                                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-red-50 text-red-500 border border-red-200 flex-shrink-0">
                                            No Access
                                        </span>
                                    )}
                                </>
                            )}
                        </div>

                        <motion.div
                            animate={{ rotate: isExpanded ? 90 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex-shrink-0"
                        >
                            <ChevronRight className={`w-4 h-4 ${isExpanded ? 'text-secondary' : 'text-gray-400'}`} />
                        </motion.div>
                    </button>

                    {/* Right: All Access Toggle */}
                    <div className="flex items-center gap-2.5 ml-4 flex-shrink-0">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:inline">All Access</span>
                        <label htmlFor={`module-all-access-${moduleName}`} className="relative inline-flex items-center cursor-pointer">
                            <input
                                id={`module-all-access-${moduleName}`}
                                type="checkbox"
                                className="sr-only peer"
                                checked={allFeaturesEnabled}
                                onChange={() => onToggleModuleAll(moduleName)}
                                disabled={disabled}
                            />
                            <div className={`w-10 h-[22px] rounded-full transition-colors ${allFeaturesEnabled ? 'bg-green-500' : 'bg-gray-300'
                                } peer-checked:bg-green-500 after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all after:shadow-sm peer-checked:after:translate-x-[18px] ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`} />
                            <span className="sr-only">Toggle all access for {moduleDisplayName}</span>
                        </label>
                    </div>
                </div>

                {/* Progress bar */}
                {!isExpanded && (
                    <div className="mt-2.5 ml-10">
                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-300 ${allFeaturesEnabled ? 'bg-green-500' : hasAnyEnabled ? 'bg-amber-400' : 'bg-gray-200'}`}
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Feature List (Animated Expand/Collapse) */}
            <AnimatePresence initial={false}>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        style={{ overflow: 'hidden' }}
                    >
                        <div className="border-t border-secondary/10">
                            <div className="divide-y divide-gray-100">
                                {Object.entries(features).map(([featureKey, description]) => (
                                    <FeatureToggleRow
                                        key={featureKey}
                                        featureKey={featureKey}
                                        description={description}
                                        enabled={permissions[featureKey] || false}
                                        onToggle={(key) => onToggleFeature(moduleName, key)}
                                        disabled={disabled}
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ModulePermissionAccordion;
