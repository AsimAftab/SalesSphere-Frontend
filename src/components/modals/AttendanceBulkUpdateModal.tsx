import React, { useState, useEffect } from 'react';
import Button from '../UI/Button/Button';
// 1. IMPORT an icon for the warning message
import { ShieldExclamationIcon } from '@heroicons/react/24/outline'; 

interface BulkUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (status: string, note: string) => void;
  day: number;
  weekday: string;
  month: string;
  isWeeklyOffDay: boolean; // <-- 2. ADD new prop
}

const statusStyles: Record<
  string,
  {
    textColor: string;
    hoverBorder: string;
    bg: string;
    hoverBg: string;
    ring: string;
    border: string;
  }
> = {
  L: {
    textColor: 'text-yellow-700',
    hoverBorder: 'hover:border-yellow-500',
    bg: 'bg-yellow-50',
    hoverBg: 'hover:bg-yellow-100',
    ring: 'focus:ring-yellow-400',
    border: 'border-yellow-500',
  },
};

const bulkStatuses = [{ code: 'L', label: 'Mark as Leave (Holiday)' }];

const BulkUpdateModal: React.FC<BulkUpdateModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  day,
  weekday,
  month,
  isWeeklyOffDay, // <-- 3. Destructure new prop
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [isNoteMissing, setIsNoteMissing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedStatus(null);
      setNote('');
      setIsNoteMissing(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStatusClick = (status: { code: string; label: string }) => {
    setSelectedStatus(status.code);
  };

  const handleConfirm = () => {
    if (selectedStatus && !note.trim()) {
      setIsNoteMissing(true); 
      return; 
    }

    if (selectedStatus) {
      onConfirm(selectedStatus, note);
    }
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNote(e.target.value);
    if (e.target.value.trim()) {
      setIsNoteMissing(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  // --- 4. NEW LOGIC BLOCK ---
  // If the day is a weekly off day, show a special warning modal and stop
  if (isWeeklyOffDay) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md text-center">
          <ShieldExclamationIcon className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-800">Action Not Allowed</h3>
          <p className="text-sm text-gray-600 mt-2">
            You cannot set a holiday on a scheduled weekly off day
            (<span className="font-semibold">{weekday}</span>).
          </p>
          <div className="mt-6 flex justify-center">
            <Button onClick={handleClose} variant="primary">
              OK
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // --- 5. ORIGINAL MODAL RENDER ---
  // This code will now only run if isWeeklyOffDay is false
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h3 className="text-lg font-bold text-gray-800">Bulk Update Attendance</h3>
        <p className="text-sm text-gray-600 mt-1">
          Apply a status to <span className="font-semibold">all employees</span> for{' '}
          <span className="font-semibold">
            {month} {day} ({weekday})
          </span>
          .
        </p>

        <div className="space-y-3 mt-6">
          {bulkStatuses.map((status) => {
            const styles = statusStyles[status.code];
            const isSelected = selectedStatus === status.code;
            return (
              <button
                key={status.code}
                onClick={() => handleStatusClick(status)}
                className={`w-full text-left p-3 rounded-lg border-2 ${
                  isSelected ? styles.border : 'border-gray-200'
                } ${isSelected ? styles.bg : 'bg-white'} ${
                  styles.hoverBorder
                } ${
                  styles.hoverBg
                } transition-colors duration-200 focus:outline-none focus:ring-2 ${
                  styles.ring
                }`}
              >
                <span className={`font-bold text-lg ${styles.textColor}`}>
                  {status.code}
                </span>
                <span className="ml-3 text-gray-700">{status.label}</span>
              </button>
            );
          })}
        </div>

        {selectedStatus && (
          <div className="mt-4">
            <label
              htmlFor="note"
              className="block text-sm font-medium text-gray-700"
            >
              Occasion Name / Note{' '}
              <span className="text-red-500">* (Required)</span>
            </label>
            <div className="mt-1">
              <textarea
                id="note"
                rows={3}
                value={note}
                onChange={handleNoteChange}
                className={`block w-full shadow-sm sm:text-sm rounded-md focus:ring-secondary focus:border-secondary resize-y bg-gray-100 ${
                  isNoteMissing
                    ? 'border-red-500 ring-red-500 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-300'
                }`}
                placeholder="e.g., Diwali Holiday, Company-wide Training"
              ></textarea>
              {isNoteMissing && (
                <p className="mt-1 text-xs text-red-600">This field is required.</p>
              )}
            </div>
          </div>
        )}

        <p className="text-xs text-gray-500 mt-4">
          <strong>Warning:</strong> This action will overwrite the existing
          status for all employees on this day.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <Button onClick={handleClose} variant="ghost">
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            variant="secondary"
            disabled={!selectedStatus}
          >
            Confirm Update
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BulkUpdateModal;