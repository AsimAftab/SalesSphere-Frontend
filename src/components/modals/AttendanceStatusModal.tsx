import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Button from '../../components/UI/Button/Button';
import { fetchEmployeeRecordByDate } from '../../api/attendanceService';

// 1. UPDATED: The 'record' type now expects a 'markedBy' object
export interface AttendanceRecordDetails {
  status: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  checkInAddress: string | null;
  checkOutAddress: string | null;
  notes: string | null;
  markedBy?: { // Made markedBy optional, as it might not always be populated
    _id: string;
    name: string;
    role: string;
  } | null;
}

interface AttendanceStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newStatus: string, note: string) => void; 
  employeeName: string;
  day: number;
  month: string;
  employeeId: string | null;
  dateString: string | null;
}

// 2. FIXED: Gave this object an explicit type
type StatusStyle = {
  textColor: string;
  hoverBorder: string;
  hoverBg: string;
  ring: string;
  bg: string;
  border: string;
};

const statusStyles: Record<string, StatusStyle> = {
  P: {
    textColor: 'text-green-700',
    hoverBorder: 'hover:border-green-500',
    hoverBg: 'hover:bg-green-100',
    ring: 'focus:ring-green-400',
    bg: 'bg-green-50',
    border: 'border-green-500',
  },
  A: {
    textColor: 'text-red-700',
    hoverBorder: 'hover:border-red-500',
    hoverBg: 'hover:bg-red-100',
    ring: 'focus:ring-red-400',
    bg: 'bg-red-50',
    border: 'border-red-500',
  },
  L: {
    textColor: 'text-yellow-700',
    hoverBorder: 'hover:border-yellow-500',
    hoverBg: 'hover:bg-yellow-100',
    ring: 'focus:ring-yellow-400',
    bg: 'bg-yellow-50',
    border: 'border-yellow-500',
  },
  H: {
    textColor: 'text-purple-700',
    hoverBorder: 'hover:border-purple-500',
    hoverBg: 'hover:bg-purple-100',
    ring: 'focus:ring-purple-400',
    bg: 'bg-purple-50',
    border: 'border-purple-500',
  },
  W: {
    textColor: 'text-blue-700',
    hoverBorder: 'hover:border-blue-500',
    hoverBg: 'hover:bg-blue-100',
    ring: 'focus:ring-blue-400',
    bg: 'bg-blue-50',
    border: 'border-blue-500',
  },
  // 3. FIXED: Added the missing 'NA' style definition
  NA: {
    textColor: 'text-gray-700',
    hoverBorder: 'hover:border-gray-500',
    hoverBg: 'hover:bg-gray-100',
    ring: 'focus:ring-gray-400',
    bg: 'bg-gray-50',
    border: 'border-gray-500',
  },
};

// 4. FIXED: Gave this array an explicit type
const statuses: { code: string; label: string }[] = [
  { code: 'P', label: 'Present' },
  { code: 'A', label: 'Absent' },
  { code: 'L', label: 'Leave' },
  { code: 'H', label: 'Half Day' },
  { code: 'W', label: 'Weekly Off' },
];


const formatDisplayTime = (time: string | null | undefined) => {
  if (!time) return 'NA';
  return new Date(time).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

const formatDisplayAddress = (address: string | null | undefined) => {
  if (!address) return 'NA';
  return address;
};


const AttendanceStatusModal: React.FC<AttendanceStatusModalProps> = ({
  isOpen,
  onClose,
  onSave,
  employeeName,
  day,
  month,
  employeeId,
  dateString,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [note, setNote] = useState(''); 
  
  const [originalStatus, setOriginalStatus] = useState<string | null>(null);
  const [originalNote, setOriginalNote] = useState<string | null>(null);

  const { 
    data: recordData, 
    isLoading: isDetailsLoading,
    isError,
  } = useQuery({
    queryKey: ['attendanceDetail', employeeId, dateString],
    queryFn: () => fetchEmployeeRecordByDate(employeeId!, dateString!),
    enabled: isOpen && !!employeeId && !!dateString,
    staleTime: 5 * 60 * 1000, 
  });

  const record = recordData?.data;

  useEffect(() => {
    if (isOpen) {
      if (record) {
        setSelectedStatus(record.status);
        setOriginalStatus(record.status);
        setOriginalNote(record.notes || null); 
      } else if (!isDetailsLoading) {
        setSelectedStatus('NA');
        setOriginalStatus('NA');
        setOriginalNote(null);
      }
      setNote('');
    }
  }, [record, isDetailsLoading, isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (selectedStatus && selectedStatus !== 'NA') {
      onSave(selectedStatus, note);
    }
  };

  const isStatusChanged = originalStatus !== selectedStatus;
  const isNoteChanged = (originalNote || '') !== note;
  const isUnchanged = !isStatusChanged && !isNoteChanged; 
  const isNoteMissing = isStatusChanged && !note.trim();
  
  const noCheckInStatuses = ['A', 'L', 'W', 'NA'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
        <h3 className="text-lg font-bold text-gray-800">Update Status</h3>
        <p className="text-sm text-gray-600 mt-1">
          For <span className="font-semibold">{employeeName}</span> on{' '}
          <span className="font-semibold">
            {month} {day}
          </span>
        </p>
        
        <div className="mt-4 rounded-md border border-gray-200 bg-gray-50 p-4 min-h-[160px]">
          <h4 className="text-base font-medium text-gray-900 mb-3">
            Current Record
          </h4>
          {isDetailsLoading ? (
            <div className="flex items-center justify-center h-24">
              <p className="text-gray-500">Loading details...</p>
            </div>
          ) : isError ? (
            <div className="flex items-center justify-center h-24">
              <p className="text-red-500">Error loading details.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700">
              <div>
                <span className="font-semibold">Check-in:</span>{' '}
                {noCheckInStatuses.includes(record?.status || '')
                  ? 'Not Checked In'
                  : formatDisplayTime(record?.checkInTime)}
              </div>
              <div>
                <span className="font-semibold">Check-out:</span>{' '}
                {noCheckInStatuses.includes(record?.status || '')
                  ? 'Not Checked Out'
                  : formatDisplayTime(record?.checkOutTime)}
              </div>
              {/* Change col-span-3 to col-span-2 on the next 3 divs */}
              <div className="col-span-2"> 
                <span className="font-semibold">Location (In):</span>{' '}
                {formatDisplayAddress(record?.checkInAddress)}
              </div>
              <div className="col-span-2">
                <span className="font-semibold">Location (Out):</span>{' '}
                {formatDisplayAddress(record?.checkOutAddress)}
              </div>
              <div  className="col-span-2">
                <span className="font-semibold">Marked By:</span>{' '}
                {record?.markedBy?.name || 'NA'}
              </div>
              <div className="col-span-2">
                <span className="font-semibold">Note:</span>{' '}
                {originalNote || 'NA'}
              </div>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-3 gap-3 mt-6">
          {statuses.map((status) => {
            const styles = statusStyles[status.code];
            const isSelected = selectedStatus === status.code;
            return (
              <button
                key={status.code}
                onClick={() => setSelectedStatus(status.code)}
                disabled={isDetailsLoading}
                className={`w-full text-left p-3 rounded-lg border-2 ${
                  isSelected ? styles.border : 'border-gray-200'
                } ${isSelected ? styles.bg : 'bg-white'} ${
                  styles.hoverBorder
                } ${
                  styles.hoverBg
                } transition-colors duration-200 focus:outline-none focus:ring-2 ${
                  styles.ring
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <span className={`font-bold text-lg ${styles.textColor}`}>
                  {status.code}
                </span>
                <span className="ml-3 text-gray-700">{status.label}</span>
              </button>
            );
          })}
        </div>
        
        <div className="mt-4">
          <label
            htmlFor="adminNote"
            className="block text-sm font-medium text-gray-700"
          >
            Update Note 
            {isStatusChanged && <span className="text-red-500">* (Required)</span>}
          </label>
          <div className="mt-1">
            <textarea
              id="adminNote"
              rows={3}
              value={note} 
              onChange={(e) => setNote(e.target.value)}
              disabled={isDetailsLoading}
              // 5. FIXED: Corrected border color
              className={`block w-full shadow-sm sm:text-sm rounded-md focus:ring-primary focus:border-primary resize-y disabled:bg-gray-100 ${
                isNoteMissing
                  ? 'border-red-500 ring-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300' 
              }`}
              placeholder="Reason for change (required if status is updated)"
            />
          </div>
        </div>
        
        <div className="mt-6 flex justify-end gap-3">
          <Button onClick={onClose} variant="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            variant="primary"
            disabled={
              !selectedStatus || 
              selectedStatus === 'NA' || 
              isUnchanged || 
              isDetailsLoading || 
              isNoteMissing
            }
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceStatusModal;