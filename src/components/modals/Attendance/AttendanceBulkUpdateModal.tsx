import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldExclamationIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Button from '../../ui/Button/Button';

// --- Types & Interfaces (LSP/ISP) ---
interface BulkUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (status: string, note: string) => void;
  day: number;
  weekday: string;
  month: string;
  isWeeklyOffDay: boolean;
}

interface StatusOption {
  code: string;
  label: string;
  description?: string;
}

// --- Constants (OCP) ---
const BULK_STATUS_OPTIONS: StatusOption[] = [
  {
    code: 'L',
    label: 'Mark as Leave (Holiday)',
    description: 'Set a holiday for all employees (e.g., National Holiday).'
  }
];

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

// --- Sub-Components (SRP) ---

/**
 * View shown when action is restricted (e.g. Weekly Off)
 */
const RestrictionView: React.FC<{
  weekday: string;
  onClose: () => void;
}> = ({ weekday, onClose }) => (
  <div className="text-center p-2">
    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 mb-6">
      <ShieldExclamationIcon className="h-10 w-10 text-yellow-600" />
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-2">Action Restricted</h3>
    <p className="text-gray-500 mb-8">
      You cannot verify or update bulk attendance on a
      <span className="font-semibold text-gray-900 mx-1">Weekly Off ({weekday})</span>.
    </p>
    <Button onClick={onClose} variant="primary" className="w-full">
      Understood
    </Button>
  </div>
);

/**
 * The main form for bulk updating.
 */
const UpdateFormView: React.FC<{
  day: number;
  weekday: string;
  month: string;
  onClose: () => void;
  onConfirm: (status: string, note: string) => void;
}> = ({ day, weekday, month, onClose, onConfirm }) => {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);

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
          {BULK_STATUS_OPTIONS.map((option) => {
            const isSelected = selectedStatus === option.code;
            return (
              <div
                key={option.code}
                onClick={() => { setSelectedStatus(option.code); setError(null); }}
                className={`relative flex cursor-pointer rounded-xl border p-4 shadow-sm focus:outline-none transition-all duration-200 ${isSelected
                  ? 'border-yellow-500 ring-1 ring-yellow-500 bg-yellow-50/50'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                  }`}
              >
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center">
                    <div className="text-sm">
                      <p className={`font-medium ${isSelected ? 'text-yellow-900' : 'text-gray-900'}`}>
                        {option.label}
                      </p>
                      {option.description && (
                        <p className={`inline ${isSelected ? 'text-yellow-700' : 'text-gray-500'}`}>
                          {option.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${isSelected ? 'border-yellow-600' : 'border-gray-300'
                    }`}>
                    {isSelected && <div className="h-2.5 w-2.5 rounded-full bg-yellow-600" />}
                  </div>
                </div>
              </div>
            );
          })}
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

// --- Main Components ---

const AttendanceBulkUpdateModal: React.FC<BulkUpdateModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  day,
  weekday,
  month,
  isWeeklyOffDay,
}) => {
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
                  className="p-1 rounded-full hover:bg-red-100 text-gray-400 hover:text-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-secondary/20"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 sm:p-8">
                {isWeeklyOffDay ? (
                  <RestrictionView weekday={weekday} onClose={onClose} />
                ) : (
                  <UpdateFormView
                    day={day}
                    weekday={weekday}
                    month={month}
                    onClose={onClose}
                    onConfirm={onConfirm}
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