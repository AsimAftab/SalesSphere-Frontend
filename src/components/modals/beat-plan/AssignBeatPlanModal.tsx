import React, { useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { useAssignBeatPlan } from './hooks/useAssignBeatPlan';
import AssignBeatPlanForm from './components/AssignBeatPlanForm';
import type { BeatPlanList } from '../../../api/beatPlanService';
import ErrorBoundary from '../../UI/ErrorBoundary/ErrorBoundary';

interface AssignBeatPlanModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    template: BeatPlanList | null;
}

const AssignBeatPlanModal: React.FC<AssignBeatPlanModalProps> = ({ isOpen, onClose, onSuccess, template }) => {
    const {
        employees,
        loading,
        fetchEmployees,
        selectedEmployeeId, setSelectedEmployeeId,
        startDate, setStartDate,
        assign,
        submitting,
        reset
    } = useAssignBeatPlan(onSuccess);

    useEffect(() => {
        if (isOpen) {
            fetchEmployees();
            reset();
        }
    }, [isOpen]);

    const handleClose = () => {
        if (!submitting) onClose();
    };

    const handleSubmit = () => {
        if (template) {
            assign(template);
        }
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
                            className="bg-white rounded-2xl w-full max-w-md flex flex-col shadow-2xl overflow-hidden"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">Assign Beat Plan</h2>
                                    <p className="text-sm text-gray-500">Assign "{template?.name}" to an employee</p>
                                </div>
                                <button
                                    onClick={handleClose}
                                    className="p-2 rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all duration-200 hover:rotate-90 focus:outline-none"
                                >
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Content using the Form Component */}
                            <AssignBeatPlanForm
                                employees={employees}
                                loading={loading}
                                selectedEmployeeId={selectedEmployeeId}
                                setSelectedEmployeeId={setSelectedEmployeeId}
                                startDate={startDate}
                                setStartDate={setStartDate}
                                submitting={submitting}
                                onSubmit={handleSubmit}
                                onCancel={handleClose}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </ErrorBoundary>
    );
};

export default AssignBeatPlanModal;
