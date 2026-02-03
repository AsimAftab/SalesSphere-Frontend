import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import type { PlanFormData } from '../types';
import { AVAILABLE_MODULES } from '../constants';

interface ModulesSelectionSectionProps {
    formData: PlanFormData;
    errors: Record<string, string>;
    handleModuleToggle: (moduleId: string) => void;
    handleSelectAll: () => void;
    handleDeselectAll: () => void;
}

const ModulesSelectionSection: React.FC<ModulesSelectionSectionProps> = ({
    formData,
    errors,
    handleModuleToggle,
    handleSelectAll,
    handleDeselectAll
}) => {
    const selectedCount = formData.enabledModules.length;
    const allSelected = selectedCount === AVAILABLE_MODULES.length;

    return (
        <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <span className="text-sm font-semibold text-gray-700">
                        Select Modules <span className="text-red-500">*</span>
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 tabular-nums">
                        {selectedCount} / {AVAILABLE_MODULES.length}
                    </span>
                </div>
                <button
                    type="button"
                    onClick={allSelected ? handleDeselectAll : handleSelectAll}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-all"
                >
                    {allSelected ? 'Deselect All' : 'Select All'}
                </button>
            </div>

            {errors.modules && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.modules}
                </p>
            )}

            {/* Module Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {AVAILABLE_MODULES.map((module) => {
                    const isSelected = formData.enabledModules.includes(module.id);

                    return (
                        <button
                            key={module.id}
                            type="button"
                            onClick={() => handleModuleToggle(module.id)}
                            aria-pressed={isSelected}
                            className={`
                                flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-left transition-all duration-150
                                focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1
                                ${isSelected
                                    ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500/20'
                                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50'}
                            `}
                        >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                isSelected ? 'bg-white shadow-sm' : 'bg-gray-100'
                            }`}>
                                <img
                                    src={module.icon}
                                    alt={module.label}
                                    className={`w-4.5 h-4.5 ${isSelected ? '' : 'opacity-40 grayscale'}`}
                                />
                            </div>
                            <span className={`text-[13px] font-medium leading-tight flex-1 ${
                                isSelected ? 'text-gray-900' : 'text-gray-500'
                            }`}>
                                {module.label}
                            </span>
                            {isSelected && (
                                <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default ModulesSelectionSection;
