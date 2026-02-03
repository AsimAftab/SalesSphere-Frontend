import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RestrictionView from '../common/RestrictionView';
import BulkUpdateForm from './components/BulkUpdateForm';
import { useBulkUpdate } from './hooks/useBulkUpdate';
import { type BulkUpdateModalProps } from './types';
import { MODAL_VARIANTS, OVERLAY_VARIANTS } from './constants';
import type { BulkUpdateFormData } from '../common/AttendanceSchema';
import { Button, ErrorBoundary } from '@/components/ui';
import { X } from 'lucide-react';

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
    const { form } = useBulkUpdate(isOpen);
    const { control, register, handleSubmit, formState: { errors, isValid } } = form;

    const onSubmit = (data: BulkUpdateFormData) => {
        onConfirm(data.status, data.note);
    };

    return (
        <ErrorBoundary>
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
                                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg pointer-events-auto overflow-hidden ring-1 ring-black/5 relative flex flex-col max-h-[90vh]"
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
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Body */}
                                <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar">
                                    {isWeeklyOffDay ? (
                                        <RestrictionView weekday={organizationWeeklyOffDay} />
                                    ) : (
                                        <BulkUpdateForm
                                            day={day}
                                            weekday={weekday}
                                            month={month}
                                            control={control}
                                            register={register}
                                            errors={errors}
                                        />
                                    )}
                                </div>

                                {/* Footer */}
                                {!isWeeklyOffDay && (
                                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 flex-shrink-0">
                                        <Button
                                            onClick={onClose}
                                            variant="outline"
                                            className="text-gray-700 bg-white border-gray-300 hover:bg-gray-50 font-medium"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleSubmit(onSubmit)}
                                            disabled={!isValid}
                                            className={`
                                            font-medium transition-all duration-200 shadow-sm
                                            ${isValid
                                                    ? 'bg-primary hover:bg-primary-600 hover:shadow-md transform hover:-translate-y-0.5 text-white'
                                                    : 'bg-gray-300 cursor-not-allowed opacity-70 text-white'}
                                        `}
                                        >
                                            Apply Update
                                        </Button>
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>
        </ErrorBoundary>
    );
};

export default AttendanceBulkUpdateModal;
