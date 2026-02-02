import React, { useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { useCreateBeatPlan } from './hooks/useCreateBeatPlan';
import CreateBeatPlanForm from './components/CreateBeatPlanForm';
import ErrorBoundary from '../../ui/ErrorBoundary/ErrorBoundary';
import type { BeatPlanList } from '../../../api/beatPlanService';

interface CreateBeatPlanModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    editData?: BeatPlanList | null;
}

const CreateBeatPlanModal: React.FC<CreateBeatPlanModalProps> = ({ isOpen, onClose, onSuccess, editData }) => {
    const {
        name, setName,
        selectedIds, toggleSelection,
        directories,
        loading,
        submitting,
        createBeatPlan,
        searchQuery, setSearchQuery,
        activeTab, setActiveTab,
        fetchDirectories,
        isEditMode,
        enabledTypes
    } = useCreateBeatPlan(onSuccess, editData);

    useEffect(() => {
        if (isOpen) {
            fetchDirectories();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    const handleClose = () => {
        if (!submitting) onClose();
    };

    if (!isOpen) return null;

    return (
        <ErrorBoundary>
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]" onClick={handleClose}>
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900">
                                        {isEditMode ? 'Edit Beat Plan Template' : 'Create Beat Plan Template'}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-0.5">
                                        {isEditMode ? 'Update route details' : 'Define a route template for your sales team'}
                                    </p>
                                </div>
                                <button
                                    onClick={handleClose}
                                    className="p-2 rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all duration-200 hover:rotate-90 focus:outline-none"
                                >
                                    <XMarkIcon className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Content using the Form Component */}
                            <CreateBeatPlanForm
                                name={name}
                                setName={setName}
                                selectedIds={selectedIds}
                                toggleSelection={toggleSelection}
                                directories={directories}
                                loading={loading}
                                submitting={submitting}
                                onSubmit={() => createBeatPlan()}
                                onCancel={handleClose}
                                searchQuery={searchQuery}
                                setSearchQuery={setSearchQuery}
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                                isEditMode={isEditMode}
                                enabledTypes={enabledTypes}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </ErrorBoundary>
    );
};

export default CreateBeatPlanModal;
