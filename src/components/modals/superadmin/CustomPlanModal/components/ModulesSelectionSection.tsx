import React from 'react';
import { CheckCircle2 } from "lucide-react";
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
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between bg-gray-50/50 p-3 rounded-xl border border-gray-200">
                <div>
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                        <span className="w-1 h-4 bg-secondary rounded-full"></span>
                        Included Modules
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5 pl-3">Select features for this plan</p>
                </div>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={handleSelectAll}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg bg-white border border-gray-200 hover:border-secondary hover:text-secondary hover:shadow-sm transition-all shadow-sm"
                    >
                        Select All
                    </button>
                    <button
                        type="button"
                        onClick={handleDeselectAll}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg bg-white border border-gray-200 hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-all shadow-sm"
                    >
                        Clear
                    </button>
                </div>
            </div>

            {errors.modules && (
                <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100 flex items-center gap-2 animate-pulse">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    {errors.modules}
                </div>
            )}

            {/* Added p-2 to account for hover scale effects without clipping */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-[300px] overflow-y-auto p-2 custom-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                {AVAILABLE_MODULES.map((module) => {
                    const isSelected = formData.enabledModules.includes(module.id);

                    return (
                        <button
                            key={module.id}
                            type="button"
                            onClick={() => handleModuleToggle(module.id)}
                            aria-pressed={isSelected}
                            className={`
                                relative flex flex-col items-center justify-center p-3 rounded-2xl border cursor-pointer transition-all duration-300 group h-32 w-full
                                active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2
                                ${isSelected
                                    ? 'border-transparent bg-secondary/5 ring-2 ring-secondary shadow-lg shadow-secondary/10'
                                    : 'border-slate-100 bg-white hover:border-secondary/50 hover:shadow-lg hover:-translate-y-1 hover:shadow-gray-200/50'}
                            `}
                        >
                            {isSelected && (
                                <div className="absolute top-3 right-3 text-secondary animate-in fade-in zoom-in duration-300">
                                    <CheckCircle2 className="w-5 h-5 fill-secondary text-white drop-shadow-sm" />
                                </div>
                            )}

                            <div className={`
                                w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-all duration-300
                                ${isSelected
                                    ? 'bg-white text-secondary shadow-sm ring-1 ring-secondary/20'
                                    : 'bg-slate-50 text-slate-400 group-hover:bg-secondary/10 group-hover:text-secondary group-hover:scale-110'}
                            `}>
                                <img
                                    src={module.icon}
                                    alt={module.label}
                                    className={`w-6 h-6 transition-all duration-300 ${isSelected ? 'scale-110' : 'opacity-60 group-hover:opacity-100'}`}
                                />
                            </div>
                            <span className={`text-xs font-semibold text-center leading-tight transition-colors duration-300 ${isSelected ? 'text-secondary' : 'text-slate-600 group-hover:text-slate-900'}`}>
                                {module.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default ModulesSelectionSection;
