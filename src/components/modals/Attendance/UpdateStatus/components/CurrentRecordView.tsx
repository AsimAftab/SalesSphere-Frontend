import React from 'react';
import { DocumentTextIcon, ClockIcon, MapPinIcon, UserIcon } from '@heroicons/react/24/outline';
import type { AttendanceRecord } from '../../../../../api/attendanceService';

const formatTime = (time: string | null | undefined) => {
    if (!time) return 'NA';
    return new Date(time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
};

const GenericSpinner = () => (
    <div className="flex justify-center p-4"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-secondary"></div></div>
);

interface CurrentRecordViewProps {
    record: AttendanceRecord | undefined;
    isLoading: boolean;
    isError: boolean;
    originalNote: string | null;
}

const CurrentRecordView: React.FC<CurrentRecordViewProps> = ({ record, isLoading, isError, originalNote }) => {
    if (isLoading) return <GenericSpinner />;

    if (isError) {
        return (
            <div className="text-red-500 text-sm p-4 bg-red-50 rounded-lg border border-red-200 text-center">
                Failed to load current details.
            </div>
        );
    }

    const hasData = record && !['A', 'L', 'W', '-', 'NA'].includes(record.status);

    return (
        <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 mb-6">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                <DocumentTextIcon className="w-4 h-4" /> Current Record
            </h4>

            {!hasData ? (
                <p className="text-sm text-gray-400 italic text-center py-2">No check-in activity recorded.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                        <p className="text-gray-500 flex items-center gap-1.5"><ClockIcon className="w-3.5 h-3.5" /> Check In</p>
                        <p className="font-medium text-gray-900">{formatTime(record?.checkInTime)}</p>
                        <p className="text-xs text-gray-500 truncate" title={record?.checkInAddress || ''}>
                            <MapPinIcon className="w-3 h-3 inline mr-1" />{record?.checkInAddress || 'No location'}
                        </p>
                    </div>

                    <div className="space-y-1">
                        <p className="text-gray-500 flex items-center gap-1.5"><ClockIcon className="w-3.5 h-3.5" /> Check Out</p>
                        <p className="font-medium text-gray-900">{formatTime(record?.checkOutTime)}</p>
                        <p className="text-xs text-gray-500 truncate" title={record?.checkOutAddress || ''}>
                            <MapPinIcon className="w-3 h-3 inline mr-1" />{record?.checkOutAddress || 'No location'}
                        </p>
                    </div>
                </div>
            )}

            {(record?.markedBy || originalNote) && (
                <div className="mt-4 pt-3 border-t border-gray-200 grid grid-cols-2 gap-4 text-xs">
                    {record?.markedBy && (
                        <div>
                            <span className="text-gray-500 block mb-0.5">Updated By</span>
                            <span className="font-medium text-gray-700 flex items-center gap-1">
                                <UserIcon className="w-3 h-3" /> {record.markedBy.name}
                            </span>
                        </div>
                    )}
                    {originalNote && (
                        <div className="col-span-2">
                            <span className="text-gray-500 block mb-0.5">Previous Note</span>
                            <p className="text-gray-700 italic">"{originalNote}"</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CurrentRecordView;
