import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { useViewBeatPlan } from './hooks/useViewBeatPlan';
import ViewBeatPlanContent from './components/ViewBeatPlanContent';
import type { BeatPlanList } from '../../../api/beatPlanService';
import ErrorBoundary from '../../ui/ErrorBoundary/ErrorBoundary';

interface ViewBeatPlanModalProps {
    isOpen: boolean;
    onClose: () => void;
    template: BeatPlanList | null;
}

const ViewBeatPlanModal: React.FC<ViewBeatPlanModalProps> = ({ isOpen, onClose, template }) => {
    const {
        activeTab,
        setActiveTab,
        tabs,
        activeData
    } = useViewBeatPlan(template);

    if (!isOpen || !template) return null;

    return (
        <ErrorBoundary>
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]" onClick={onClose}>
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-2xl w-full max-w-4xl flex flex-col shadow-2xl overflow-hidden max-h-[90vh]"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900">{template.name}</h3>
                                    <p className="text-sm text-gray-500 mt-0.5">
                                        Created by {template.createdBy?.name} • {template.totalDirectories} Total Stops
                                    </p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all duration-200 hover:rotate-90 focus:outline-none"
                                >
                                    <XMarkIcon className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Content using UI Component */}
                            <ViewBeatPlanContent
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                                tabs={tabs}
                                activeData={activeData}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </ErrorBoundary>
    );
};

export default ViewBeatPlanModal;
