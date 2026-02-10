import React, { useState, useEffect } from 'react';
import {
  Box,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  XCircle,
} from 'lucide-react';
import type { SubscriptionPlan } from '@/api/SuperAdmin';
import { AVAILABLE_MODULES } from '@/components/modals/SuperAdmin/CustomPlanModal/constants';
import { Pagination } from '@/components/ui';

interface PlanModulesCardProps {
    plan: SubscriptionPlan;
}

const ITEMS_PER_PAGE = 6;

const PlanModulesCard: React.FC<PlanModulesCardProps> = ({ plan }) => {
    const enabledCount = plan.enabledModules?.filter((m) => m !== 'settings').length || 0;
    const [expandedModule, setExpandedModule] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const modulesToShow = AVAILABLE_MODULES.filter((mod) => plan.enabledModules?.includes(mod.id));

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedModules = modulesToShow.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    // Reset page if modules change
    useEffect(() => {
        setCurrentPage(1);
    }, [plan._id]);

    const getModuleFeatures = (moduleId: string): Record<string, boolean> | null => {
        if (!plan.moduleFeatures) return null;
        const features = plan.moduleFeatures[moduleId];
        if (!features || Object.keys(features).length === 0) return null;
        return features;
    };

    const formatFeatureKey = (key: string): string => {
        return key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (s) => s.toUpperCase())
            .trim();
    };

    const toggleExpand = (moduleId: string) => {
        setExpandedModule(prev => prev === moduleId ? null : moduleId);
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm h-full flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-5 pt-5 pb-4 border-b border-gray-100 bg-gradient-to-b from-gray-50/80 to-white">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white shadow-sm shadow-purple-200 shrink-0">
                        <Box className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <h3 className="text-base font-semibold text-gray-900">
                                {plan.isSystemPlan ? 'Included Modules' : 'Modules'}
                            </h3>
                            <span className="text-sm font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 tabular-nums shrink-0">
                                {enabledCount}
                            </span>
                        </div>
                        <p className="text-sm text-gray-400 mt-0.5">
                            {plan.isSystemPlan ? 'Modules included in this plan' : 'Module access configuration'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Module List */}
            <div className="flex-1 overflow-y-auto px-4 py-3 bg-gray-50/60">
                <div className="space-y-2.5">
                    {paginatedModules.map((mod) => {
                        const isEnabled = plan.enabledModules?.includes(mod.id);
                        const features = getModuleFeatures(mod.id);
                        const hasFeatures = features !== null;
                        const isExpanded = expandedModule === mod.id;
                        const enabledFeatureCount = features ? Object.values(features).filter(Boolean).length : 0;
                        const totalFeatureCount = features ? Object.keys(features).length : 0;

                        return (
                            <div key={mod.id} className="rounded-xl border border-gray-200 bg-white overflow-hidden transition-all hover:shadow-sm">
                                {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
                                <div
                                    className={`flex items-center gap-3.5 px-3.5 py-3 ${hasFeatures && isEnabled ? 'cursor-pointer' : ''}`}
                                    onClick={() => hasFeatures && isEnabled && toggleExpand(mod.id)}
                                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && hasFeatures && isEnabled && toggleExpand(mod.id)}
                                    role={hasFeatures && isEnabled ? 'button' : undefined}
                                    tabIndex={hasFeatures && isEnabled ? 0 : undefined}
                                >
                                    {/* Module Icon */}
                                    <div className={`p-2.5 rounded-xl flex-shrink-0 ${isEnabled ? 'bg-purple-50' : 'bg-gray-50'}`}>
                                        <img
                                            src={mod.icon}
                                            alt={mod.label}
                                            className={`w-5 h-5 ${!isEnabled ? 'opacity-40 grayscale' : ''}`}
                                        />
                                    </div>

                                    {/* Module Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-semibold truncate ${isEnabled ? 'text-gray-800' : 'text-gray-400'}`}>
                                            {mod.label}
                                        </p>
                                        {hasFeatures && isEnabled && (
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                {enabledFeatureCount} of {totalFeatureCount} features enabled
                                            </p>
                                        )}
                                    </div>

                                    {/* Status + Expand */}
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        {isEnabled ? (
                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                        ) : (
                                            <XCircle className="w-5 h-5 text-gray-300" />
                                        )}
                                        {hasFeatures && isEnabled && (
                                            isExpanded
                                                ? <ChevronDown className="w-4 h-4 text-gray-400" />
                                                : <ChevronRight className="w-4 h-4 text-gray-400" />
                                        )}
                                    </div>
                                </div>

                                {/* Expanded Features */}
                                {isExpanded && features && (
                                    <div className="border-t border-gray-100">
                                        <div className="px-4 py-3 bg-gray-50/40">
                                            <div className="space-y-0.5">
                                                {Object.entries(features).map(([key, enabled]) => (
                                                    <div
                                                        key={key}
                                                        className="flex items-start gap-2.5 py-1.5"
                                                    >
                                                        <div className="mt-0.5 shrink-0">
                                                            {enabled ? (
                                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                                            ) : (
                                                                <XCircle className="w-4 h-4 text-red-300" />
                                                            )}
                                                        </div>
                                                        <span className={`text-[13px] leading-snug ${enabled ? 'text-gray-700' : 'text-gray-400 line-through decoration-gray-300'}`}>
                                                            {formatFeatureKey(key)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Pagination */}
            <div className="border-t border-gray-100 bg-gray-50/30">
                <Pagination
                    currentPage={currentPage}
                    totalItems={modulesToShow.length}
                    itemsPerPage={ITEMS_PER_PAGE}
                    onPageChange={setCurrentPage}
                    className="!py-2.5 !px-4"
                />
            </div>
        </div>
    );
};

export default PlanModulesCard;
