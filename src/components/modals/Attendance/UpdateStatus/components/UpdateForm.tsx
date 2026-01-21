import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldExclamationIcon } from '@heroicons/react/24/outline';
import { STATUS_OPTIONS } from '../constants';

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
                <div className="grid grid-cols-3 gap-4">
                    {STATUS_OPTIONS.map((opt) => {
                        const isSelected = selectedStatus === opt.code;
                        const baseColor = opt.color;

                        // Helper for conditional class construction
                        const getClasses = () => {
                            if (isSelected) {
                                // Active State: Stronger bg, colored border, shadow, NO RING
                                return `bg-${baseColor}-50 border-${baseColor}-500 text-${baseColor}-700 shadow-md transform scale-[1.02] focus:ring-0`;
                            }
                            // Inactive State: White bg, gray border, hover effects
                            return `bg-white border-gray-100 text-gray-600 hover:border-${baseColor}-200 hover:bg-${baseColor}-50/30 hover:shadow-sm focus:ring-0`;
                        };

                        return (
                            <button
                                key={opt.code}
                                onClick={() => onStatusChange(opt.code)}
                                disabled={isDisabled}
                                className={`
                                    relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-300 ease-out focus:outline-none
                                    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                                    ${getClasses()}
                                `}
                            >
                                <span className={`text-2xl font-bold mb-1 ${isSelected ? `text-${baseColor}-600` : 'text-gray-700'}`}>
                                    {opt.code}
                                </span>
                                <span className={`text-xs font-semibold uppercase tracking-wide ${isSelected ? `text-${baseColor}-700` : 'text-gray-400'}`}>
                                    {opt.label}
                                </span>

                                {isSelected && (
                                    <motion.div
                                        layoutId="active-indicator"
                                        className={`absolute top-2 right-2 w-2 h-2 rounded-full bg-${baseColor}-500`}
                                    />
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
