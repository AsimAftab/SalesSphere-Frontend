// src/components/UI/BulkUpdateModal.tsx

import React from 'react';
import Button from '../UI/Button/Button';

interface BulkUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (status: string) => void;
  day: number;
  weekday: string;
  month: string;
}

// FIX: Create a style map with full Tailwind class names
const statusStyles: Record<string, { textColor: string; hoverBorder: string; hoverBg: string; ring: string }> = {
    L: {
        textColor: 'text-yellow-500',
        hoverBorder: 'hover:border-yellow-500',
        hoverBg: 'hover:bg-yellow-50',
        ring: 'focus:ring-yellow-400'
    },
    // You can add other statuses here in the future if needed
    // W: { ... }
};

const bulkStatuses = [
  { code: 'L', label: 'Mark as Leave (Holiday)' },
];

const BulkUpdateModal: React.FC<BulkUpdateModalProps> = ({ isOpen, onClose, onConfirm, day, weekday, month }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h3 className="text-lg font-bold text-gray-800">Bulk Update Attendance</h3>
        <p className="text-sm text-gray-600 mt-1">
          Apply a status to <span className="font-semibold">all employees</span> for{' '}
          <span className="font-semibold">{month} {day} ({weekday})</span>.
        </p>

        <div className="space-y-3 mt-6">
          {bulkStatuses.map(status => {
            const styles = statusStyles[status.code]; // Get styles from the map
            return (
              <button
                key={status.code}
                onClick={() => onConfirm(status.code)}
                // FIX: Use the full static class names from the style map
                className={`w-full text-left p-3 rounded-lg border-2 border-transparent ${styles.hoverBorder} ${styles.hoverBg} transition-colors duration-200 focus:outline-none focus:ring-2 ${styles.ring}`}
              >
                <span className={`font-bold text-lg ${styles.textColor}`}>{status.code}</span>
                <span className="ml-3 text-gray-700">{status.label}</span>
              </button>
            );
          })}
        </div>
        
        <p className="text-xs text-gray-500 mt-4">
            <strong>Warning:</strong> This action will overwrite the existing status for all employees on this day.
        </p>
        
        <div className="mt-6 text-right">
          <Button onClick={onClose} variant="secondary">Cancel</Button>
        </div>
      </div>
    </div>
  );
};

export default BulkUpdateModal;