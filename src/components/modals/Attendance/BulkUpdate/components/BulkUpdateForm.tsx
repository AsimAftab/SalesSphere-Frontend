import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldExclamationIcon } from '@heroicons/react/24/outline';
import Button from '../../../../UI/Button/Button';
import BulkOptionCard from './BulkOptionCard';
import { BULK_STATUS_OPTIONS } from '../constants';

interface BulkUpdateFormProps {
    day: number;
    weekday: string;
    month: string;
    onClose: () => void;
    onConfirm: (status: string, note: string) => void;
    selectedStatus: string | null;
    setSelectedStatus: (status: string) => void;
    note: string;
    setNote: (note: string) => void;
    error: string | null;
    setError: (error: string | null) => void;
}

const BulkUpdateForm: React.FC<BulkUpdateFormProps> = ({
    day,
    weekday,
    month,
    onClose,
    onConfirm,
    selectedStatus,
    setSelectedStatus,
    note,
    setNote,
    error,
    setError
}) => {

    const handleSubmit = () => {
        if (!selectedStatus) return;
        if (!note.trim()) {
            setError('A note is required to process this update.');
            return;
        }
        onConfirm(selectedStatus, note);
    };

    return (
        <div>
            {/* Header */}
            <div className="mb-6 border-b border-gray-100 pb-4">
                <h3 className="text-lg font-bold text-gray-900">Bulk Update Attendance</h3>
                <p className="text-sm text-gray-500 mt-1">
                    Applying changes for <span className="font-medium text-primary">{month} {day}, {weekday}</span>
                </p>
            </div>

            {/* Status Selection */}
            <div className="space-y-4 mb-6">
                <label className="block text-sm font-semibold text-gray-700">Select Action</label>
                <div className="grid gap-3">
                    {BULK_STATUS_OPTIONS.map((option) => (
                        <BulkOptionCard
                            key={option.code}
                            option={option}
                            isSelected={selectedStatus === option.code}
                            onSelect={(code) => { setSelectedStatus(code); setError(null); }}
                        />
                    ))}
                </div>
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
                        <div className="mb-6">
                            <label htmlFor="note" className="block text-sm font-semibold text-gray-700 mb-2">
                                Reason / Note <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="note"
                                rows={3}
                                value={note}
                                onChange={(e) => {
                                    setNote(e.target.value);
                                    if (e.target.value.trim()) setError(null);
                                }}
                                className={`block w-full rounded-lg border shadow-sm sm:text-sm p-3 outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-colors ${error ? 'border-red-300 focus:border-red-500' : 'border-gray-200'
                                    }`}
                                placeholder="e.g., Office closed for renovation..."
                            />
                            {error && (
                                <motion.p
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="mt-2 text-sm text-red-600 flex items-center gap-1"
                                >
                                    <ShieldExclamationIcon className="w-4 h-4" /> {error}
                                </motion.p>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Warning Footer */}
            <div className="bg-orange-50 rounded-lg p-3 mb-6 border border-orange-100 flex gap-3 items-start">
                <ShieldExclamationIcon className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-orange-800 leading-relaxed">
                    <strong>Caution:</strong> Confirming this action will <u>overwrite</u> any existing attendance status for all employees for this date.
                </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
                <Button onClick={onClose} variant="ghost">Cancel</Button>
                <Button
                    onClick={handleSubmit}
                    variant="secondary"
                    disabled={!selectedStatus || !note.trim()}
                    className={!selectedStatus ? 'opacity-50' : ''}
                >
                    Confirm Update
                </Button>
            </div>
        </div>
    );
};

export default BulkUpdateForm;
