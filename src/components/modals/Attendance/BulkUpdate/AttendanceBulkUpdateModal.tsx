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
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                        onClick={onClose}
                    />

                    {/* Modal Container */}
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
                        <motion.div
                            variants={MODAL_VARIANTS}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg pointer-events-auto overflow-hidden ring-1 ring-black/5 relative"
                        >
                            {/* Close Button Header */}
                            <div className="absolute top-4 right-4 z-10">
                                <button
                                    onClick={onClose}
                                    className="p-1 rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all duration-200 hover:rotate-90 focus:outline-none"
                                >
                                    <XMarkIcon className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-6 sm:p-8">
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
