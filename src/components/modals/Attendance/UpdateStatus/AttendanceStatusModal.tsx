import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Button from '../../../UI/Button/Button';
import RestrictionView from '../common/RestrictionView';
import CurrentRecordView from './components/CurrentRecordView';
import UpdateForm from './components/UpdateForm';
import { useStatusUpdate } from './hooks/useStatusUpdate';
import type { AttendanceStatusModalProps } from './types';
import { MODAL_VARIANTS, OVERLAY_VARIANTS } from './constants';

const AttendanceStatusModal: React.FC<AttendanceStatusModalProps> = ({
    isOpen,
    onClose,
    onSave,
    employeeName,
    day,
    month,
    employeeId,
    dateString,
    isWeeklyOffDay,
    organizationWeeklyOffDay,
}) => {
    const {
        record,
        isDataLoading,
        isError,
        originalNote,
        selectedStatus,
        setSelectedStatus,
        note,
        setNote,
        isStatusChanged,
        isNoteRequired,
        canSave
    } = useStatusUpdate(employeeId, dateString, isOpen, isWeeklyOffDay) as any; // Type casting for destructuring simplistic hook return

    const handleConfirm = () => {
        if (canSave && selectedStatus) {
            onSave(selectedStatus, note);
        }
    };

    const formattedWeekday = React.useMemo(() => {
        if (!dateString) return '';
        // Parse date as UTC to ensure stable weekday regardless of local time
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' });
    }, [dateString]);

    return (
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
                        >
                            {/* Header */}
                            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 flex-shrink-0">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Update Status</h3>
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
                            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                                {isWeeklyOffDay ? (
                                    <RestrictionView weekday={organizationWeeklyOffDay} />
                                ) : (
                                    <>
                                        <CurrentRecordView
                                            record={record}
                                            isLoading={isDataLoading}
                                            isError={isError}
                                            originalNote={originalNote}
                                            employeeId={employeeId}
                                        />

                                        <UpdateForm
                                            selectedStatus={selectedStatus}
                                            onStatusChange={setSelectedStatus}
                                            note={note}
                                            onNoteChange={setNote}
                                            isDisabled={isDataLoading}
                                            isWeeklyOff={false}
                                            isNoteRequired={isNoteRequired}
                                            showNoteInput={isStatusChanged}
                                        />
                                    </>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 flex-shrink-0">
                                <Button onClick={onClose} variant="ghost">Cancel</Button>
                                <Button
                                    onClick={handleConfirm}
                                    variant="secondary"
                                    disabled={!canSave}
                                    className={!canSave ? 'opacity-50' : ''}
                                >
                                    Save Changes
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AttendanceStatusModal;
