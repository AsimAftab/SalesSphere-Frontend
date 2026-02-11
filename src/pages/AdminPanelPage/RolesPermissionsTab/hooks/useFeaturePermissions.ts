import { useState, useCallback } from 'react';
import type { FeaturePermissions, FeatureRegistry } from '../types/featurePermission.types';

/**
 * Hook for managing feature-based permissions in AdminPanel
 * Handles nested permission state (module -> feature -> boolean)
 */
export const useFeaturePermissions = (featureRegistry: FeatureRegistry | null) => {
    const [permissions, setPermissions] = useState<FeaturePermissions>({});
    const [expandedModules, setExpandedModules] = useState<{ [key: string]: boolean }>({});

    /**
     * Initialize permissions from a role's permission object
     */
    const loadPermissions = useCallback((rolePermissions: FeaturePermissions) => {
        setPermissions(rolePermissions || {});
    }, []);

    /**
     * Toggle expand/collapse for a module
     */
    const toggleModuleExpansion = useCallback((moduleName: string) => {
        setExpandedModules(prev => ({
            ...prev,
            [moduleName]: !prev[moduleName]
        }));
    }, []);

    /**
     * Toggle a specific feature within a module
     */
    const toggleFeature = useCallback((moduleName: string, featureKey: string) => {
        setPermissions(prev => ({
            ...prev,
            [moduleName]: {
                ...prev[moduleName],
                [featureKey]: !prev[moduleName]?.[featureKey]
            }
        }));
    }, []);

    /**
     * Toggle all features within a module
     * If any feature is disabled, enable all. Otherwise, disable all.
     */
    const toggleModuleAll = useCallback((moduleName: string) => {
        if (!featureRegistry || !featureRegistry[moduleName]) return;

        // Features are directly in the module object, not nested
        const features = featureRegistry[moduleName];
        const featureKeys = Object.keys(features);

        // Check if all are currently enabled
        const allEnabled = featureKeys.every(
            key => permissions[moduleName]?.[key] === true
        );

        // Toggle: if all enabled, disable all. Otherwise, enable all.
        const newValue = !allEnabled;
        const newModulePermissions: { [key: string]: boolean } = {};

        featureKeys.forEach(key => {
            newModulePermissions[key] = newValue;
        });

        setPermissions(prev => ({
            ...prev,
            [moduleName]: newModulePermissions
        }));
    }, [featureRegistry, permissions]);

    /**
     * Grant all permissions across all modules (Populate Access button)
     */
    const grantAllPermissions = useCallback(() => {
        if (!featureRegistry) return null;

        const allPermissions: FeaturePermissions = {};

        Object.keys(featureRegistry).forEach(moduleName => {
            // Features are directly in the module object
            const features = featureRegistry[moduleName];
            allPermissions[moduleName] = {};

            Object.keys(features).forEach(featureKey => {
                allPermissions[moduleName][featureKey] = true;
            });
        });

        setPermissions(allPermissions);
        return allPermissions;
    }, [featureRegistry]);

    /**
     * Revoke all permissions across all modules
     */
    const revokeAllPermissions = useCallback(() => {
        if (!featureRegistry) return null;

        const noPermissions: FeaturePermissions = {};

        Object.keys(featureRegistry).forEach(moduleName => {
            // Features are directly in the module object
            const features = featureRegistry[moduleName];
            noPermissions[moduleName] = {};

            Object.keys(features).forEach(featureKey => {
                noPermissions[moduleName][featureKey] = false;
            });
        });

        setPermissions(noPermissions);
        return noPermissions;
    }, [featureRegistry]);

    /**
     * Get current permissions in backend format (ready to save)
     */
    const getBackendPermissions = useCallback((): FeaturePermissions => {
        return permissions;
    }, [permissions]);

    /**
     * Expand all modules
     */
    const expandAll = useCallback(() => {
        if (!featureRegistry) return;
        const expanded: { [key: string]: boolean } = {};
        Object.keys(featureRegistry).forEach(moduleName => {
            expanded[moduleName] = true;
        });
        setExpandedModules(expanded);
    }, [featureRegistry]);

    /**
     * Collapse all modules
     */
    const collapseAll = useCallback(() => {
        setExpandedModules({});
    }, []);

    return {
        permissions,
        expandedModules,
        loadPermissions,
        toggleModuleExpansion,
        toggleFeature,
        toggleModuleAll,
        grantAllPermissions,
        revokeAllPermissions,
        getBackendPermissions,
        expandAll,
        collapseAll
    };
};
