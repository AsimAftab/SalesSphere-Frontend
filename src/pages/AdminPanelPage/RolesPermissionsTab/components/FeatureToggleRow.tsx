import React from 'react';
import { Check, X } from 'lucide-react';

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
        <div className={`flex items-center justify-between py-2.5 px-4 transition-colors group border-l-2 ${enabled ? 'border-l-green-400' : 'border-l-transparent'}`}>
            <div className="flex-1 flex items-center gap-3 min-w-0">
                {/* Contextual Icon */}
                {enabled ? (
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3.5 h-3.5 text-green-600" />
                    </div>
                ) : (
                    <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <X className="w-3.5 h-3.5 text-red-500" />
                    </div>
                )}

                {/* Feature Info */}
                <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                        {formatFeatureName(featureKey)}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                        {description}
                    </div>
                </div>
            </div>

            {/* Toggle Switch */}
            <div className="flex items-center gap-2.5 ml-4 flex-shrink-0">
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full transition-colors ${enabled
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-500'
                    }`}>
                    {enabled ? 'Enabled' : 'Disabled'}
                </span>
                <label htmlFor={`feature-toggle-${featureKey}`} className="relative inline-flex items-center cursor-pointer">
                    <input
                        id={`feature-toggle-${featureKey}`}
                        type="checkbox"
                        className="sr-only peer"
                        checked={enabled}
                        onChange={() => onToggle(featureKey)}
                        disabled={disabled}
                    />
                    <div className={`w-10 h-[22px] rounded-full transition-colors ${enabled ? 'bg-green-500' : 'bg-red-200'
                        } peer-checked:bg-green-500 after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all after:shadow-sm peer-checked:after:translate-x-[18px] ${disabled ? 'opacity-50 cursor-not-allowed peer-disabled:bg-red-100' : ''
                        }`} />
                    <span className="sr-only">Toggle {featureKey}</span>
                </label>
            </div>
        </div>
    );
};

export default FeatureToggleRow;
