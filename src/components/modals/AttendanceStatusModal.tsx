// src/components/modals/AttendanceStatusModal.tsx

import React from 'react';
import Button from '../../components/UI/Button/Button';

interface AttendanceStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newStatus: string) => void;
  employeeName: string;
  day: number;
  month: string;
}

// FIX: Create a style map with full Tailwind class names
const statusStyles: Record<string, { textColor: string; hoverBorder: string; hoverBg: string; ring: string }> = {
    P: { textColor: 'text-green-500', hoverBorder: 'hover:border-green-500', hoverBg: 'hover:bg-green-50', ring: 'focus:ring-green-400' },
    A: { textColor: 'text-red-500', hoverBorder: 'hover:border-red-500', hoverBg: 'hover:bg-red-50', ring: 'focus:ring-red-400' },
    L: { textColor: 'text-yellow-500', hoverBorder: 'hover:border-yellow-500', hoverBg: 'hover:bg-yellow-50', ring: 'focus:ring-yellow-400' },
    H: { textColor: 'text-purple-500', hoverBorder: 'hover:border-purple-500', hoverBg: 'hover:bg-purple-50', ring: 'focus:ring-purple-400' },
    W: { textColor: 'text-blue-500', hoverBorder: 'hover:border-blue-500', hoverBg: 'hover:bg-blue-50', ring: 'focus:ring-blue-400' },
};

const statuses = [
  { code: 'P', label: 'Present' },
  { code: 'A', label: 'Absent' },
  { code: 'L', label: 'Leave' },
  { code: 'H', label: 'Half Day' },
  { code: 'W', label: 'Weekly Off' },
];

const AttendanceStatusModal: React.FC<AttendanceStatusModalProps> = ({ isOpen, onClose, onSave, employeeName, day, month }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
        <h3 className="text-lg font-bold text-gray-800">Update Status</h3>
        <p className="text-sm text-gray-600 mt-1">
          For <span className="font-semibold">{employeeName}</span> on <span className="font-semibold">{month} {day}</span>
        </p>
        <div className="grid grid-cols-2 gap-3 mt-6">
          {statuses.map(status => {
            const styles = statusStyles[status.code]; // Get styles from the map
            return (
              <button
                key={status.code}
                onClick={() => onSave(status.code)}
                // FIX: Use the full static class names from the style map
                className={`w-full text-left p-3 rounded-lg border-2 border-transparent ${styles.hoverBorder} ${styles.hoverBg} transition-colors duration-200 focus:outline-none focus:ring-2 ${styles.ring}`}
              >
                <span className={`font-bold text-lg ${styles.textColor}`}>{status.code}</span>
                <span className="ml-3 text-gray-700">{status.label}</span>
              </button>
            );
          })}
        </div>
        <div className="mt-6 text-right">
          <Button onClick={onClose} variant="secondary">Cancel</Button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceStatusModal;