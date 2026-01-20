import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchEmployeeRecordByDate } from '../../../../../api/attendanceService';

export const useStatusUpdate = (
    employeeId: string | null,
    dateString: string | null,
    isOpen: boolean,
    isWeeklyOffDay: boolean
) => {
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
    const [originalStatus, setOriginalStatus] = useState<string | null>(null);
    const [note, setNote] = useState('');
    const [originalNote, setOriginalNote] = useState<string | null>(null);

    // Data Query
    const { data: record, isLoading: isDataLoading, isError } = useQuery({
        queryKey: ['attendanceDetail', employeeId, dateString],
        queryFn: () => fetchEmployeeRecordByDate(employeeId!, dateString!),
        enabled: isOpen && !!employeeId && !!dateString,
        staleTime: 5 * 60 * 1000,
    });

    // Effects
    useEffect(() => {
        if (!isOpen) return;

        if (record) {
            // Logic to determine effective status
            const hasValidData = record.status && record.status !== '-' && record.status !== 'NA';
            const isActuallyEmpty = !hasValidData && !record.checkInTime;

            if (isActuallyEmpty) {
                const defaultStatus = isWeeklyOffDay ? 'W' : null;
                setSelectedStatus(defaultStatus);
                setOriginalStatus(defaultStatus);
                setOriginalNote(null);
            } else {
                const status = (record.status === 'NA' || record.status === '-') ? null : record.status;
                setSelectedStatus(status);
                setOriginalStatus(status);
                setOriginalNote(record.notes && record.notes !== 'NA' ? record.notes : null);
            }
        } else if (!isDataLoading) {
            // No record found at all
            const defaultStatus = isWeeklyOffDay ? 'W' : null;
            setSelectedStatus(defaultStatus);
            setOriginalStatus(defaultStatus);
            setOriginalNote(null);
        }
        setNote('');
    }, [record, isDataLoading, isOpen, isWeeklyOffDay]);

    // Derived State
    const isStatusChanged = originalStatus !== selectedStatus;
    const isNoteChanged = (originalNote || '') !== note;
    const isUnchanged = !isStatusChanged && !isNoteChanged;
    const isNoteRequired = isStatusChanged && !isWeeklyOffDay;
    const isNoteMissing = isNoteRequired && !note.trim();
    const canSave = selectedStatus && selectedStatus !== '-' && !isUnchanged && !isDataLoading && !isNoteMissing && !isWeeklyOffDay;

    return {
        record,
        isDataLoading,
        isError,
        originalNote,
        selectedStatus,
        setSelectedStatus,
        note,
        setNote,
        isStatusChanged,
        isNoteRequired,
        canSave
    };
};
