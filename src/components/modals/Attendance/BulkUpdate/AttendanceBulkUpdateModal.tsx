import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import RestrictionView from '../common/RestrictionView';
import BulkUpdateForm from './components/BulkUpdateForm';
import { useBulkUpdate } from './hooks/useBulkUpdate';
import { type BulkUpdateModalProps } from './types';
import { MODAL_VARIANTS, OVERLAY_VARIANTS } from './constants';

const AttendanceBulkUpdateModal: React.FC<BulkUpdateModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    day,
    weekday,
    month,
    isWeeklyOffDay,
    organizationWeeklyOffDay
}) => {
    const {
        selectedStatus,
        setSelectedStatus,
        note,
        setNote,
        error,
        setError
    } = useBulkUpdate();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        variants={OVERLAY_VARIANTS}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
                        onClick={onClose}
                    />

                    {/* Modal Container */}
                    <div className="fixed inset-0 flex items-center justify-center z-[70] p-4 pointer-events-none">
                        <motion.div
                            variants={MODAL_VARIANTS}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg pointer-events-auto overflow-hidden ring-1 ring-black/5 relative"
                        >
                            {/* Header */}
                            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 flex-shrink-0">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Bulk Update Attendance</h3>
                                    <p className="text-sm text-gray-500">
                                        Applying changes for <span className="font-medium text-secondary">{month} {day}, {weekday}</span>
                                    </p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-1 rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all duration-200 hover:rotate-90 focus:outline-none"
                                >
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                                {isWeeklyOffDay ? (
                                    <RestrictionView weekday={organizationWeeklyOffDay || weekday} onClose={onClose} />
                                ) : (
                                    <BulkUpdateForm
                                        day={day}
                                        weekday={weekday}
                                        month={month}
                                        onClose={onClose}
                                        onConfirm={onConfirm}
                                        selectedStatus={selectedStatus}
                                        setSelectedStatus={setSelectedStatus}
                                        note={note}
                                        setNote={setNote}
                                        error={error}
                                        setError={setError}
                                    />
                                )}
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AttendanceBulkUpdateModal;
