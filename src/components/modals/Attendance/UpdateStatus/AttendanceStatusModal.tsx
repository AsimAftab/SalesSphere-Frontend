import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Button from '../../../ui/Button/Button';
import type { AttendanceStatusModalProps } from './types';
import CurrentRecordView from './components/CurrentRecordView';
import UpdateForm from './components/UpdateForm';
import { useStatusUpdate } from './hooks/useStatusUpdate';
import { MODAL_VARIANTS, OVERLAY_VARIANTS } from './constants';
import RestrictionView from '../common/RestrictionView';
import type { UpdateStatusFormData } from '../common/AttendanceSchema';
import ErrorBoundary from '../../../ui/ErrorBoundary/ErrorBoundary';

const AttendanceStatusModal: React.FC<AttendanceStatusModalProps> = ({
    isOpen,
    onClose,
    employeeId,
    employeeName,
    dateString,
    onSave: handleSaveApi,
    isWeeklyOffDay,
    organizationWeeklyOffDay
}) => {
    const {
        form,
        record,
        isDataLoading,
        isError,
        isNoteRequired,
        canSave,
        isStatusChanged
    } = useStatusUpdate(employeeId, dateString, isOpen, isWeeklyOffDay);

    const { control, register, handleSubmit, formState: { errors } } = form;

    const onSubmit = (data: UpdateStatusFormData) => {
        handleSaveApi(data.status, data.note || '');
    };

    // Date formatting helper
    const { month, day, formattedWeekday } = React.useMemo(() => {
        if (!dateString) return { month: '', day: '', formattedWeekday: '' };
        const date = new Date(dateString);
        return {
            month: date.toLocaleString('default', { month: 'long' }),
            day: date.getDate().toString(),
            formattedWeekday: date.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' })
        };
    }, [dateString]);

    return (
        <ErrorBoundary>
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            variants={OVERLAY_VARIANTS}
                            initial="hidden" animate="visible" exit="exit"
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
                            onClick={onClose}
                        />
                        <div className="fixed inset-0 flex items-center justify-center z-[70] p-4 pointer-events-none">
                            <motion.div
                                variants={MODAL_VARIANTS}
                                initial="hidden" animate="visible" exit="exit"
                                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg pointer-events-auto flex flex-col max-h-[90vh] relative ring-1 ring-black/5 overflow-hidden"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Header */}
                                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 flex-shrink-0">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">Update Attendance</h3>
                                        <p className="text-sm text-gray-500">
                                            {employeeName} • <span className="font-medium text-secondary">{month} {day}, {formattedWeekday}</span>
                                        </p>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="p-1 rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all duration-200 hover:rotate-90 focus:outline-none"
                                    >
                                        <XMarkIcon className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Body */}
                                <div className="px-6 py-6 overflow-y-auto custom-scrollbar">
                                    {isWeeklyOffDay ? (
                                        <RestrictionView weekday={organizationWeeklyOffDay} />
                                    ) : (
                                        <div className="space-y-8">
                                            {/* Current Record Display */}
                                            <CurrentRecordView
                                                record={record}
                                                isLoading={isDataLoading}
                                                isError={isError}
                                                originalNote={record?.notes || null}
                                                employeeId={employeeId}
                                            />

                                            {/* Update Form */}
                                            <UpdateForm
                                                control={control}
                                                register={register}
                                                errors={errors}
                                                isDisabled={isDataLoading || !!isError}
                                                isNoteRequired={isNoteRequired}
                                                showNoteInput={isStatusChanged}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Footer */}
                                {!isWeeklyOffDay && (
                                    <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100 flex-shrink-0">
                                        <Button
                                            onClick={onClose}
                                            variant="outline"
                                            className="text-gray-700 bg-white border-gray-300 hover:bg-gray-50 font-medium"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleSubmit(onSubmit)}
                                            disabled={!canSave}
                                            className={`
                                                font-medium transition-all duration-200 shadow-sm
                                                ${canSave
                                                    ? 'bg-secondary hover:bg-secondary-600 hover:shadow-md transform hover:-translate-y-0.5 text-white'
                                                    : 'bg-gray-300 cursor-not-allowed opacity-70 text-white'}
                                            `}
                                        >
                                            Update Status
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

export default AttendanceStatusModal;
