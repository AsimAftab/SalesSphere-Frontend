import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { fetchEmployeeRecordByDate } from '@/api/attendanceService';
import { UpdateStatusSchema, type UpdateStatusFormData } from '../../common/AttendanceSchema';

export const useStatusUpdate = (
    employeeId: string | null,
    dateString: string | null,
    isOpen: boolean,
    isWeeklyOffDay: boolean
) => {
    // Initialize Form
    const form = useForm<UpdateStatusFormData>({
        resolver: zodResolver(UpdateStatusSchema),
        defaultValues: {
            status: '',
            note: ''
        }
    });

    const { reset, watch, formState: { isDirty, isValid } } = form;

    // Track original values to determine if status changed
    const [originalStatus, setOriginalStatus] = useState<string>('');

    // Data Query
    const { data: record, isLoading: isDataLoading, isError } = useQuery({
        queryKey: ['attendanceDetail', employeeId, dateString],
        queryFn: () => fetchEmployeeRecordByDate(employeeId!, dateString!),
        enabled: isOpen && !!employeeId && !!dateString,
        staleTime: 5 * 60 * 1000,
    });

    // Effect: Set Default Values when record loads
    useEffect(() => {
        if (!isOpen) return;

        if (record) {
            // Logic to determine effective status
            const isSystemAbsent = record.status === 'A' && !record.checkInTime && !record.markedBy;
            const hasValidData = record.status && record.status !== '-' && record.status !== 'NA' && !isSystemAbsent;
            const isActuallyEmpty = !hasValidData && !record.checkInTime;

            if (isActuallyEmpty) {
                const defaultStatus = isWeeklyOffDay ? 'W' : '';
                setOriginalStatus(defaultStatus);
                reset({
                    status: defaultStatus,
                    note: '',
                });
            } else {
                const status = (record.status === 'NA' || record.status === '-') ? '' : record.status;
                setOriginalStatus(status || '');
                reset({
                    status: status || '',
                    note: (record.notes && record.notes !== 'NA') ? record.notes : '',
                });
            }
        } else if (!isDataLoading) {
            // No record found
            const defaultStatus = isWeeklyOffDay ? 'W' : '';
            setOriginalStatus(defaultStatus);
            reset({
                status: defaultStatus,
                note: '',
            });
        }
    }, [record, isDataLoading, isOpen, isWeeklyOffDay, reset]);

    const currentStatus = watch('status');
    const isStatusChanged = currentStatus !== originalStatus;

    // Logic to reset note when status changes
    useEffect(() => {
        if (isStatusChanged) {
            // If status changed, clear the note (unless it was already cleared by user, but here we force empty start for new status)
            // But we should only do this if the note matches the original note? 
            // Actually user said "it should be empty".
            // We use setValue from form.
            form.setValue('note', '', { shouldValidate: true, shouldDirty: true });
        } else {
            // If status reverted to original, restore original note
            form.setValue('note', record?.notes || '', { shouldValidate: true, shouldDirty: true });
        }
    }, [isStatusChanged, record?.notes, form]); // Dependency on isStatusChanged triggers this only when status change state flips

    // Note is required if status is changed to something that isn't empty
    const isNoteRequired = isStatusChanged && !!currentStatus;

    // Show note input if status is changed OR there is already a note (logic handled in UI but we pass helper here if needed)
    // Actually, UI handles visibility.

    const canSave = isDirty && isValid && !isDataLoading;

    return {
        form,
        record,
        isDataLoading,
        isError,
        isNoteRequired,
        canSave,
        isStatusChanged,
        originalStatus
    };
};
