import React, { useMemo } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import FeatureToggleRow from './FeatureToggleRow';

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

    // Check if module is partially enabled
    const hasAnyEnabled = useMemo(() => {
        return Object.values(permissions).some(value => value === true);
    }, [permissions]);

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
            {/* Module Header */}
            <div className="bg-secondary text-white p-4">
                <div className="flex items-center justify-between">
                    {/* Left: Expand/Collapse Button + Module Name */}
                    <button
                        onClick={() => onToggleExpand(moduleName)}
                        className="flex items-center gap-2 hover:opacity-80 transition-opacity flex-1 text-left"
                        disabled={disabled}
                    >
                        {isExpanded ? (
                            <ChevronDown className="w-5 h-5" />
                        ) : (
                            <ChevronRight className="w-5 h-5" />
                        )}
                        <span className="font-semibold text-md">
                            {moduleDisplayName}
                        </span>
                    </button>

                    {/* Right: All Access Toggle */}
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium opacity-90">ALL ACCESS</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={allFeaturesEnabled}
                                onChange={() => onToggleModuleAll(moduleName)}
                                disabled={disabled}
                            />
                            <div className={`w-9 h-5 rounded-full transition-colors ${allFeaturesEnabled ? 'bg-white' : 'bg-gray-200'
                                } after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full ${allFeaturesEnabled
                                    ? 'after:bg-green-500' // Changed to green
                                    : 'after:bg-white'
                                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`} />
                        </label>
                    </div>
                </div>

                {/* Status indicator when collapsed */}
                {!isExpanded && hasAnyEnabled && (
                    <div className="mt-2 text-sm opacity-75">
                        {Object.values(permissions).filter(v => v).length} / {Object.keys(features).length} features enabled
                    </div>
                )}
            </div>

            {/* Feature List (Expanded) */}
            {isExpanded && (
                <div className="bg-gray-50">
                    {/* Section Header */}
                    <div className="px-4 py-2 bg-gray-100 border-b border-gray-200">
                        <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                            FEATURE PERMISSIONS
                        </h4>
                    </div>

                    {/* Feature Toggles */}
                    <div className="divide-y divide-gray-200">
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
            )}
        </div>
    );
};

export default ModulePermissionAccordion;
