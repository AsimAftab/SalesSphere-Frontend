import React from 'react';
import { Controller } from 'react-hook-form';
import type { Control, UseFormRegister, FieldErrors } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldExclamationIcon } from '@heroicons/react/24/outline';
import { STATUS_OPTIONS } from '../constants';
import type { UpdateStatusFormData } from '../../common/AttendanceSchema';

interface UpdateFormProps {
    control: Control<UpdateStatusFormData>;
    register: UseFormRegister<UpdateStatusFormData>;
    errors: FieldErrors<UpdateStatusFormData>;
    isDisabled: boolean;
    isNoteRequired: boolean;
    showNoteInput: boolean;
}

const UpdateForm: React.FC<UpdateFormProps> = ({
    control,
    register,
    errors,
    isDisabled,
    isNoteRequired,
    showNoteInput
}) => {
    return (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Set New Status</label>
                <div className="grid grid-cols-3 gap-4">
                    <Controller
                        control={control}
                        name="status"
                        render={({ field: { value, onChange } }) => (
                            <>
                                {STATUS_OPTIONS.map((opt) => {
                                    const isSelected = value === opt.code;
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
                                            type="button"
                                            onClick={() => onChange(opt.code)}
                                            disabled={isDisabled}
                                            className={`
                                                relative w-full p-3 rounded-xl border transition-all duration-200 ease-in-out
                                                flex flex-col items-center justify-center gap-2
                                                outline-none select-none
                                                disabled:opacity-50 disabled:cursor-not-allowed
                                                ${getClasses()}
                                            `}
                                        >
                                            <span className={`text-2xl ${isSelected ? 'scale-110' : ''} transition-transform duration-200`}>
                                                {opt.label.charAt(0)}
                                            </span>
                                            <span className="text-xs font-medium tracking-wide">
                                                {opt.label}
                                            </span>

                                            {/* Active Indicator Dot */}
                                            {isSelected && (
                                                <span className={`absolute top-2 right-2 w-2 h-2 rounded-full bg-${baseColor}-500`} />
                                            )}
                                        </button>
                                    );
                                })}
                            </>
                        )}
                    />
                </div>
                {errors.status && (
                    <p className="mt-2 text-sm text-red-600">{errors.status.message}</p>
                )}
            </div>

            <AnimatePresence>
                {showNoteInput && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="bg-secondary/5 rounded-xl p-4 mb-6">
                            <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center justify-between">
                                <span>Note {isNoteRequired && <span className="text-red-500">*</span>}</span>
                                {isNoteRequired && (
                                    <span className="text-xs text-secondary flex items-center gap-1">
                                        <ShieldExclamationIcon className="w-3 h-3" />
                                        Required
                                    </span>
                                )}
                                {!isNoteRequired && (
                                    <span className="text-xs text-gray-400 font-normal">Optional</span>
                                )}
                            </label>
                            <textarea
                                {...register('note')}
                                disabled={isDisabled}
                                rows={3}
                                className={`
                                    w-full px-3 py-2 text-sm text-gray-700 placeholder-gray-400
                                    bg-white border rounded-lg outline-none transition-all duration-200
                                    disabled:bg-gray-50 disabled:text-gray-500
                                    ${errors.note
                                        ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                                        : 'border-gray-200 focus:border-secondary focus:ring-2 focus:ring-secondary'}
                                `}
                                placeholder={isNoteRequired ? "Please specify a reason for this change..." : "Add an optional note..."}
                            />
                            {errors.note && (
                                <p className="mt-1 text-xs text-red-600 font-medium ml-1">
                                    {errors.note.message}
                                </p>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UpdateForm;
