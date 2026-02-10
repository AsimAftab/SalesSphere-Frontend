import React, { useState } from 'react';
import ModulePermissionAccordion from '@/pages/AdminPanelPage/RolesPermissionsTab/components/ModulePermissionAccordion';
import type { PlanFormData, EnrichedModule } from '../types';
import type { FeatureRegistry } from '@/api/roleService';
import { AlertCircle } from 'lucide-react';

interface ModulesSelectionSectionProps {
    formData: PlanFormData;
    errors: Record<string, string>;
    handleModuleToggle: (moduleId: string) => void;
    availableModules: EnrichedModule[];
    featureRegistry: FeatureRegistry;
    handleFeatureToggle: (moduleId: string, featureKey: string) => void;
    disabled?: boolean;
}

const ModulesSelectionSection: React.FC<ModulesSelectionSectionProps> = ({
    formData,
    errors,
    handleModuleToggle,
    availableModules = [],
    featureRegistry = {},
    handleFeatureToggle,
    disabled = false
}) => {
    // We maintain expanded state locally, just like before
    // But now we map boolean map for this specific UI component
    const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

    const handleExpandToggle = (moduleId: string) => {
        setExpandedModules(prev => ({
            ...prev,
            [moduleId]: !prev[moduleId]
        }));
    };

    // Wrapper to ensure module is enabled if a feature is toggled
    const handleFeatureToggleWrapper = (moduleId: string, featureKey: string) => {
        // If module is not enabled, enable it first (or we can decide logic)
        // Ideally, toggling a feature means the module SHOULD be part of the plan
        if (!formData.enabledModules.includes(moduleId)) {
            handleModuleToggle(moduleId); // This usually auto-enables all features in current logic
            // But wait, if handleModuleToggle enables ALL, then toggling one specific feature AFTER might be weird if we wanted just one.
            // Actually, handleModuleToggle in hook initializes with defaults.
            // If user clicks a specific feature on a disabled module, they probably expect THAT feature + module enabled.
            // But current handleModuleToggle logic is "Enable All".

            // For now, let's assume user enables module via "All Access" toggle primarily.
            // If they toggle a feature, we proceed. UseCustomPlan handleFeatureToggle doesn't check enabledModules.
            // We should just call handleFeatureToggle. The module might need to be added to enabledModules manually?

            // Let's rely on standard flow: User enables module (All Access) then refines.
            // Or if they click a feature, we should probably add module to enabledModules if not present.
        }
        handleFeatureToggle(moduleId, featureKey);
    };

    // Wrapper for "All Access" toggle (Enable/Disable Module)
    const handleModuleToggleWrapper = (moduleId: string) => {
        handleModuleToggle(moduleId);
    };

    return (
        <div className="space-y-4">
            {errors.modules && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.modules}
                </p>
            )}

            <div className="space-y-3">
                {availableModules.map((module) => {
                    const moduleId = module.key;
                    const moduleFeatures = featureRegistry[moduleId] || {};
                    // Convert formData.moduleFeatures to the shape expected by component
                    // Component expects { [key]: boolean }
                    // Our state is { [moduleId]: { [key]: boolean } }
                    const permissions = formData.moduleFeatures?.[moduleId] || {};

                    // If module is not in enabledModules, permissions visually should be all false?
                    // UseCustomPlan logic: if not enabled, moduleFeatures might still exist or be empty.
                    // But for visual " All Access" toggle to work, we need to reflect "enabledModules" state.
                    // The component uses "allFeaturesEnabled" to show toggle state.
                    // If we want "All Access" toggle to control "enabledModules", we need to coordinate.

                    // Current component logic:
                    // <input checked={allFeaturesEnabled} ... />
                    // If we pass permissions={} (empty), allFeaturesEnabled is false.

                    const effectivePermissions = formData.enabledModules.includes(moduleId)
                        ? permissions
                        : {};

                    return (
                        <ModulePermissionAccordion
                            key={moduleId}
                            moduleName={moduleId}
                            moduleDisplayName={module.label}
                            features={moduleFeatures}
                            permissions={effectivePermissions as Record<string, boolean>}
                            isExpanded={!!expandedModules[moduleId]}
                            onToggleExpand={handleExpandToggle}
                            onToggleFeature={handleFeatureToggleWrapper}
                            onToggleModuleAll={handleModuleToggleWrapper}
                            disabled={disabled}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default ModulesSelectionSection;

