import React from 'react';
import type { AttendanceRecord } from '@/api/attendanceService';
import {
  Clock,
  ExternalLink,
  FileText,
  MapPin,
  User,
} from 'lucide-react';

const formatTime = (time: string | null | undefined) => {
    if (!time) return 'NA';
    return new Date(time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
};

const openMap = (address: string) => {
    if (!address) return;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
};

const GenericSpinner = () => (
    <div className="flex justify-center p-4"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-secondary"></div></div>
);

interface CurrentRecordViewProps {
    record: AttendanceRecord | undefined;
    isLoading: boolean;
    isError: boolean;
    originalNote: string | null;
    employeeId: string | null;
}

const CurrentRecordView: React.FC<CurrentRecordViewProps> = ({ record, isLoading, isError, originalNote, employeeId }) => {
    if (isLoading) return <GenericSpinner />;

    if (isError) {
        return (
            <div className="text-red-500 text-sm p-4 bg-red-50 rounded-lg border border-red-200 text-center">
                Failed to load current details.
            </div>
        );
    }

    const hasData = record && !['A', 'L', 'W', '-', 'NA'].includes(record.status);

    // Determine user-friendly label
    const markedByLabel = record?.markedBy?.id === employeeId ? 'Marked By' : 'Updated By';

    return (
        <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 mb-6">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" /> Current Record
            </h4>

            {!hasData ? (
                <p className="text-sm text-gray-400 italic text-center py-2">No check-in activity recorded.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Check In Card */}
                    <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm transition-shadow hover:shadow-md">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-1.5 bg-green-50 text-green-600 rounded-md">
                                <Clock className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">Check In</span>
                        </div>
                        <p className="text-lg font-bold text-gray-900 mb-1">{formatTime(record?.checkInTime)}</p>
                        <div className="flex items-start gap-1.5 text-xs text-gray-500">
                            <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-gray-400" />
                            <div className="flex-1">
                                <p className="break-words leading-relaxed inline">{record?.checkInAddress || 'No location'}</p>
                                {record?.checkInAddress && (
                                    <button
                                        onClick={() => openMap(record.checkInAddress!)}
                                        className="ml-1.5 inline-flex align-middle text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-sm p-0.5 transition-colors"
                                        title="View on Google Maps"
                                    >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Check Out Card */}
                    <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm transition-shadow hover:shadow-md">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md">
                                <Clock className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">Check Out</span>
                        </div>
                        <p className="text-lg font-bold text-gray-900 mb-1">{formatTime(record?.checkOutTime)}</p>
                        <div className="flex items-start gap-1.5 text-xs text-gray-500">
                            <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-gray-400" />
                            <div className="flex-1">
                                <p className="break-words leading-relaxed inline">{record?.checkOutAddress || 'No location'}</p>
                                {record?.checkOutAddress && (
                                    <button
                                        onClick={() => openMap(record.checkOutAddress!)}
                                        className="ml-1.5 inline-flex align-middle text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-sm p-0.5 transition-colors"
                                        title="View on Google Maps"
                                    >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {(record?.markedBy || originalNote) && (
                <div className="mt-5 pt-4 border-t border-gray-100">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-white border border-gray-100 shadow-sm">
                        {/* Avatar */}
                        {record?.markedBy ? (
                            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center ring-4 ring-white shadow-sm flex-shrink-0">
                                <User className="w-4 h-4" />
                            </div>
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center ring-4 ring-white shadow-sm flex-shrink-0">
                                <FileText className="w-4 h-4" />
                            </div>
                        )}

                        <div className="flex-1 min-w-0">
                            {/* Header Row */}
                            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                {record?.markedBy && (
                                    <span className="text-sm font-bold text-gray-900">
                                        {record.markedBy.name}
                                    </span>
                                )}
                                <span className="px-2 py-0.5 rounded-full bg-gray-100 text-[10px] font-semibold text-gray-500 uppercase tracking-wider border border-gray-200">
                                    {markedByLabel}
                                </span>
                            </div>

                            {/* Note Bubble */}
                            {originalNote && (
                                <div className="relative text-xs text-gray-700 bg-gray-50 p-2.5 rounded-r-lg rounded-bl-lg border border-gray-200/60 break-words whitespace-pre-wrap leading-relaxed shadow-sm">
                                    {originalNote}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CurrentRecordView;
