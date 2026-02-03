import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchEmployeeRecordByDate, type AttendanceRecord } from '@/api/attendanceService';
import { Button } from '@/components/ui';
import {
  Clock,
  FileText,
  MapPin,
  ShieldAlert,
  User,
  X,
} from 'lucide-react';

// --- Types & Interfaces ---

interface AttendanceStatusModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (newStatus: string, note: string) => void;
    employeeName: string;
    day: number;
    month: string;
    employeeId: string | null;
    dateString: string | null;
    isWeeklyOffDay: boolean;
    organizationWeeklyOffDay: string;
}

// --- Constants ---
const MODAL_VARIANTS = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } }
};

const OVERLAY_VARIANTS = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
};

const STATUS_OPTIONS = [
    { code: 'P', label: 'Present', color: 'green' },
    { code: 'A', label: 'Absent', color: 'red' },
    { code: 'L', label: 'Leave', color: 'yellow' },
    { code: 'H', label: 'Half Day', color: 'purple' },
    { code: 'W', label: 'Weekly Off', color: 'blue' },
];

const COLORS: Record<string, string> = {
    green: 'text-green-700 bg-green-50 border-green-200 ring-green-500',
    red: 'text-red-700 bg-red-50 border-red-200 ring-red-500',
    yellow: 'text-yellow-700 bg-yellow-50 border-yellow-200 ring-yellow-500',
    purple: 'text-purple-700 bg-purple-50 border-purple-200 ring-purple-500',
    blue: 'text-blue-700 bg-blue-50 border-blue-200 ring-blue-500',
    gray: 'text-gray-700 bg-gray-50 border-gray-200 ring-gray-400',
};

// --- Helpers ---
const formatTime = (time: string | null | undefined) => {
    if (!time) return 'NA';
    return new Date(time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
};

// --- Sub-Components ---

const GenericSpinner = () => (
    <div className="flex justify-center p-4"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-secondary"></div></div>
);

const CurrentRecordView: React.FC<{
    record: AttendanceRecord | undefined;
    isLoading: boolean;
    isError: boolean;
    originalNote: string | null;
}> = ({ record, isLoading, isError, originalNote }) => {
    if (isLoading) return <GenericSpinner />;

    if (isError) {
        return (
            <div className="text-red-500 text-sm p-4 bg-red-50 rounded-lg border border-red-200 text-center">
                Failed to load current details.
            </div>
        );
    }

    const hasData = record && !['A', 'L', 'W', '-', 'NA'].includes(record.status);

    return (
        <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 mb-6">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" /> Current Record
            </h4>

            {!hasData ? (
                <p className="text-sm text-gray-400 italic text-center py-2">No check-in activity recorded.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                        <p className="text-gray-500 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Check In</p>
                        <p className="font-medium text-gray-900">{formatTime(record?.checkInTime)}</p>
                        <p className="text-xs text-gray-500 truncate" title={record?.checkInAddress || ''}>
                            <MapPin className="w-3 h-3 inline mr-1" />{record?.checkInAddress || 'No location'}
                        </p>
                    </div>

                    <div className="space-y-1">
                        <p className="text-gray-500 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Check Out</p>
                        <p className="font-medium text-gray-900">{formatTime(record?.checkOutTime)}</p>
                        <p className="text-xs text-gray-500 truncate" title={record?.checkOutAddress || ''}>
                            <MapPin className="w-3 h-3 inline mr-1" />{record?.checkOutAddress || 'No location'}
                        </p>
                    </div>
                </div>
            )}

            {(record?.markedBy || originalNote) && (
                <div className="mt-4 pt-3 border-t border-gray-200 grid grid-cols-2 gap-4 text-xs">
                    {record?.markedBy && (
                        <div>
                            <span className="text-gray-500 block mb-0.5">Updated By</span>
                            <span className="font-medium text-gray-700 flex items-center gap-1">
                                <User className="w-3 h-3" /> {record.markedBy.name}
                            </span>
                        </div>
                    )}
                    {originalNote && (
                        <div className="col-span-2">
                            <span className="text-gray-500 block mb-0.5">Previous Note</span>
                            <p className="text-gray-700 italic">"{originalNote}"</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const RestrictionView: React.FC<{
    weekday: string;
}> = ({ weekday }) => (
    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex gap-4 items-start mb-6">
        <div className="bg-yellow-100 p-2 rounded-full shrink-0">
            <ShieldAlert className="w-6 h-6 text-yellow-600" />
        </div>
        <div>
            <h4 className="text-sm font-bold text-yellow-900">Weekly Off Day</h4>
            <p className="text-sm text-yellow-700 mt-1">
                This day is marked as a weekly off ({weekday}). Attendance updates are restricted.
            </p>
        </div>
    </div>
);

const UpdateForm: React.FC<{
    selectedStatus: string | null;
    onStatusChange: (code: string) => void;
    note: string;
    onNoteChange: (val: string) => void;
    isDisabled: boolean;
    isWeeklyOff: boolean;
    isNoteRequired: boolean;
    showNoteInput: boolean;
}> = ({ selectedStatus, onStatusChange, note, onNoteChange, isDisabled, isWeeklyOff, isNoteRequired, showNoteInput }) => {
    return (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Set New Status</label>
                <div className="grid grid-cols-3 gap-3">
                    {STATUS_OPTIONS.map((opt) => {
                        const isSelected = selectedStatus === opt.code;
                        // Standardizing styling logic
                        const baseStyles = "relative flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1";
                        const colorClass = isSelected ? COLORS[opt.color].split(' ')[1] : 'bg-white'; // Extract bg class
                        const borderClass = isSelected ? COLORS[opt.color].split(' ')[2] : 'border-gray-200 hover:border-gray-300';
                        const textClass = isSelected ? COLORS[opt.color].split(' ')[0] : 'text-gray-600';
                        const ringClass = isSelected ? COLORS[opt.color].split(' ')[3] : 'focus:ring-gray-200';

                        // Special case for 'W' on weekly off
                        const isWeeklyOffActive = isWeeklyOff && opt.code === 'W';
                        const finalBorder = isWeeklyOffActive ? 'border-secondary ring-2 ring-secondary' : borderClass;

                        return (
                            <button
                                key={opt.code}
                                onClick={() => onStatusChange(opt.code)}
                                disabled={isDisabled}
                                className={`${baseStyles} ${colorClass} ${finalBorder} ${textClass} ${ringClass} disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                <span className="text-lg font-bold">{opt.code}</span>
                                <span className="text-xs mt-1 font-medium">{opt.label}</span>
                                {isSelected && (
                                    <motion.div layoutId="check" className="absolute top-1 right-1 w-2 h-2 rounded-full bg-current" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            <AnimatePresence>
                {showNoteInput && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="pt-2">
                            <label htmlFor="modalNote" className="block text-sm font-semibold text-gray-700 mb-2">
                                Update Note {isNoteRequired && <span className="text-red-500">*</span>}
                            </label>
                            <textarea
                                id="modalNote"
                                rows={3}
                                value={note}
                                onChange={(e) => onNoteChange(e.target.value)}
                                disabled={isDisabled || isWeeklyOff}
                                placeholder={isWeeklyOff ? "Updates disabled for weekly off." : "Reason for this change..."}
                                className="block w-full rounded-lg border border-gray-300 shadow-sm sm:text-sm p-3 outline-none focus:ring-2 focus:ring-secondary focus:border-secondary resize-y transition-colors disabled:bg-gray-50 disabled:text-gray-400"
                            />
                        </div>

                        {/* Warning Footer */}
                        <div className="bg-orange-50 rounded-lg p-3 mt-4 border border-orange-100 flex gap-3 items-start">
                            <ShieldAlert className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-orange-800 leading-relaxed">
                                <strong>Caution:</strong> Confirming this action will <u>overwrite</u> any existing attendance status for this employee for this date.
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// --- Main Modal Component ---
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
    // State
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
    const [originalStatus, setOriginalStatus] = useState<string | null>(null);
    const [note, setNote] = useState('');
    const [originalNote, setOriginalNote] = useState<string | null>(null);

    // Data Query
    const { data: record, isLoading: isDataLoading, isError } = useQuery({
        queryKey: ['attendanceDetail', employeeId, dateString],
        queryFn: () => fetchEmployeeRecordByDate(employeeId!, dateString!),
        enabled: isOpen && !!employeeId && !!dateString,
        staleTime: 5 * 60 * 1000,
    });

    // Effects
    useEffect(() => {
        if (!isOpen) return;

        if (record) {
            // Logic to determine effective status
            const hasValidData = record.status && record.status !== '-' && record.status !== 'NA';
            const isActuallyEmpty = !hasValidData && !record.checkInTime; // Simplified check

            if (isActuallyEmpty) {
                const defaultStatus = isWeeklyOffDay ? 'W' : null;
                setSelectedStatus(defaultStatus);
                setOriginalStatus(defaultStatus);
                setOriginalNote(null);
            } else {
                const status = (record.status === 'NA' || record.status === '-') ? null : record.status;
                setSelectedStatus(status);
                setOriginalStatus(status);
                setOriginalNote(record.notes && record.notes !== 'NA' ? record.notes : null);
            }
        } else if (!isDataLoading) {
            // No record found at all
            const defaultStatus = isWeeklyOffDay ? 'W' : null;
            setSelectedStatus(defaultStatus);
            setOriginalStatus(defaultStatus);
            setOriginalNote(null);
        }
        setNote('');
    }, [record, isDataLoading, isOpen, isWeeklyOffDay]);

    // Derived State
    const isStatusChanged = originalStatus !== selectedStatus;
    const isNoteChanged = (originalNote || '') !== note;
    const isUnchanged = !isStatusChanged && !isNoteChanged;
    const isNoteRequired = isStatusChanged && !isWeeklyOffDay;
    const isNoteMissing = isNoteRequired && !note.trim();
    const canSave = selectedStatus && selectedStatus !== '-' && !isUnchanged && !isDataLoading && !isNoteMissing && !isWeeklyOffDay;

    const handleConfirm = () => {
        if (canSave && selectedStatus) {
            onSave(selectedStatus, note);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        variants={OVERLAY_VARIANTS}
                        initial="hidden" animate="visible" exit="exit"
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                        onClick={onClose}
                    />
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
                        <motion.div
                            variants={MODAL_VARIANTS}
                            initial="hidden" animate="visible" exit="exit"
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg pointer-events-auto overflow-hidden relative ring-1 ring-black/5"
                        >
                            {/* Header */}
                            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Update Status</h3>
                                    <p className="text-sm text-gray-500">
                                        {employeeName} • <span className="font-medium text-secondary">{month} {day}</span>
                                    </p>
                                </div>
                                <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-6">
                                {isWeeklyOffDay && <RestrictionView weekday={organizationWeeklyOffDay} />}

                                <CurrentRecordView
                                    record={record}
                                    isLoading={isDataLoading}
                                    isError={isError}
                                    originalNote={originalNote}
                                />

                                <UpdateForm
                                    selectedStatus={selectedStatus}
                                    onStatusChange={setSelectedStatus}
                                    note={note}
                                    onNoteChange={setNote}
                                    isDisabled={isDataLoading || isWeeklyOffDay}
                                    isWeeklyOff={isWeeklyOffDay}
                                    isNoteRequired={isNoteRequired}
                                    showNoteInput={isStatusChanged}
                                />
                            </div>

                            {/* Footer */}
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
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