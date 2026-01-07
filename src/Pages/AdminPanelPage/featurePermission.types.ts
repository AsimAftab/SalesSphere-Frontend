// Feature-based permission types for AdminPanel

/**
 * Feature permissions structure matching backend
 * Each module contains feature keys mapped to boolean values
 */
export interface FeaturePermissions {
    [moduleName: string]: {
        [featureKey: string]: boolean;
    };
}

/**
 * Feature registry from backend
 * Each module contains features directly (NOT nested under 'features' property)
 * Example: { attendance: { viewMyAttendance: 'description', webCheckIn: 'description' } }
 */
export interface FeatureRegistry {
    [moduleName: string]: {
        [featureKey: string]: string; // featureKey -> description
    };
}

/**
 * UI state for module expansion
 */
export interface ModuleExpansionState {
    [moduleName: string]: boolean;
}

/**
 * Feature metadata for display
 */
export interface FeatureInfo {
    key: string;
    description: string;
    enabled: boolean;
}

/**
 * Module with its features for display
 */
export interface ModuleWithFeatures {
    name: string;
    displayName: string;
    features: FeatureInfo[];
    allFeaturesEnabled: boolean;
}
