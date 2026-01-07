import React from 'react';

interface FeatureToggleRowProps {
    featureKey: string;
    description: string;
    enabled: boolean;
    onToggle: (featureKey: string) => void;
    disabled?: boolean;
}

/**
 * Individual feature toggle row within a module
 * Shows feature name, description, and toggle switch
 */
const FeatureToggleRow: React.FC<FeatureToggleRowProps> = ({
    featureKey,
    description,
    enabled,
    onToggle,
    disabled = false
}) => {
    // Convert camelCase to Title Case for display
    const formatFeatureName = (key: string): string => {
        return key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (str) => str.toUpperCase())
            .trim();
    };

    return (
        <div className="flex items-start justify-between py-3 px-4 hover:bg-gray-50/50 transition-colors group">
            <div className="flex-1 flex items-start gap-2">
                {/* Feature Bullet */}
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-600 flex-shrink-0" />

                {/* Feature Info */}
                <div className="flex-1">
                    <div className="text-md font-medium text-gray-900">
                        {formatFeatureName(featureKey)}
                    </div>
                    <div className="text-sm text-gray-500 mt-0.5">
                        {description}
                    </div>
                </div>
            </div>

            {/* Toggle Switch */}
            <div className="flex items-center gap-2 ml-4">
                <span className={`text-sm font-medium ${enabled ? 'text-green-600' : 'text-gray-400'}`}>
                    {enabled ? 'Access' : 'No Access'}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={enabled}
                        onChange={() => onToggle(featureKey)}
                        disabled={disabled}
                    />
                    <div className={`w-9 h-5 rounded-full transition-colors ${enabled ? 'bg-green-500' : 'bg-gray-200'
                        } peer-checked:bg-green-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white ${disabled ? 'opacity-50 cursor-not-allowed' : ''
                        }`} />
                </label>
            </div>
        </div>
    );
};

export default FeatureToggleRow;
