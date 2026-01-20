import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldExclamationIcon } from '@heroicons/react/24/outline';
import { STATUS_OPTIONS, COLORS } from '../constants';

interface UpdateFormProps {
    selectedStatus: string | null;
    onStatusChange: (code: string) => void;
    note: string;
    onNoteChange: (val: string) => void;
    isDisabled: boolean;
    isWeeklyOff: boolean;
    isNoteRequired: boolean;
    showNoteInput: boolean;
}

const UpdateForm: React.FC<UpdateFormProps> = ({
    selectedStatus,
    onStatusChange,
    note,
    onNoteChange,
    isDisabled,
    isWeeklyOff,
    isNoteRequired,
    showNoteInput
}) => {
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
                            <ShieldExclamationIcon className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
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

export default UpdateForm;
