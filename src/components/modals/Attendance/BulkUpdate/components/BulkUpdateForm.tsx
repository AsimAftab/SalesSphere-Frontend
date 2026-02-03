import React from 'react';
import { Controller, useWatch } from 'react-hook-form';
import type { Control, UseFormRegister, FieldErrors } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import BulkOptionCard from './BulkOptionCard';
import { BULK_STATUS_OPTIONS } from '../constants';
import type { BulkUpdateFormData } from '../../common/AttendanceSchema';
import { ShieldAlert } from 'lucide-react';

interface BulkUpdateFormProps {
    day: number;
    weekday: string;
    month: string;
    control: Control<BulkUpdateFormData>;
    register: UseFormRegister<BulkUpdateFormData>;
    errors: FieldErrors<BulkUpdateFormData>;
}

const BulkUpdateForm: React.FC<BulkUpdateFormProps> = ({
    control,
    register,
    errors
}) => {
    const selectedStatus = useWatch({
        control,
        name: 'status'
    });

    return (
        <div>
            {/* Status Selection */}
            <div className="space-y-4 mb-6">
                <label className="block text-sm font-semibold text-gray-700">Select Action</label>
                <div className="grid gap-3">
                    <Controller
                        control={control}
                        name="status"
                        render={({ field: { value, onChange } }) => (
                            <>
                                {BULK_STATUS_OPTIONS.map((option) => (
                                    <BulkOptionCard
                                        key={option.code}
                                        option={option}
                                        isSelected={value === option.code}
                                        onSelect={onChange}
                                    />
                                ))}
                            </>
                        )}
                    />
                </div>
                {errors.status && (
                    <p className="text-sm text-red-600 mt-2">{errors.status.message}</p>
                )}
            </div>

            {/* Note Input */}
            <AnimatePresence>
                {selectedStatus && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="bg-secondary/5 rounded-xl p-4  mb-6">
                            <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center justify-between">
                                <span>Note <span className="text-red-500">*</span></span>
                                <span className="text-xs text-secondary flex items-center gap-1">
                                    <ShieldAlert className="w-3 h-3 text-secondary" />
                                    Required for bulk updates
                                </span>
                            </label>
                            <textarea
                                {...register('note')}
                                rows={3}
                                className={`
                                    w-full px-3 py-2 text-sm text-gray-700 placeholder-gray-400
                                    bg-white border rounded-lg outline-none transition-all duration-200
                                    ${errors.note
                                        ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                                        : 'border-gray-200 focus:border-secondary focus:ring-2 focus:ring-secondary'}
                                `}
                                placeholder="Please specify a reason for this bulk change..."
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

            {/* Warning Footer */}
            <div className="bg-orange-50 rounded-lg p-3 mb-6 border border-orange-100 flex gap-3 items-start">
                <ShieldAlert className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div>
                    <h4 className="text-sm text-orange-900">
                        <span className="font-bold">Caution:</span> Confirming this action will <span className="underline">overwrite</span> any existing attendance status for all employees for this date.
                    </h4>
                </div>
            </div>
        </div>
    );
};

export default BulkUpdateForm;
