
import { useMemo } from 'react';

interface UseAttendanceValidationProps {
    status: string | null;
    note: string;
    originalStatus: string | null;
    originalNote: string | null;
    isWeeklyOffDay: boolean;
    isDataLoading: boolean;
}

export const useAttendanceValidation = ({
    status,
    note,
    originalStatus,
    originalNote,
    isWeeklyOffDay,
    isDataLoading
}: UseAttendanceValidationProps) => {

    const validationState = useMemo(() => {
        const isStatusChanged = originalStatus !== status;
        const isNoteChanged = (originalNote || '') !== note;
        const isUnchanged = !isStatusChanged && !isNoteChanged;

        // Logical Rule: Status change on a normal day requires a note? 
        // Based on original code: "isNoteRequired = isStatusChanged && !isWeeklyOffDay"
        const isNoteRequired = isStatusChanged && !isWeeklyOffDay;
        const isNoteMissing = isNoteRequired && !note.trim();

        const canSave =
            status &&
            status !== '-' &&
            !isUnchanged &&
            !isDataLoading &&
            !isNoteMissing &&
            !isWeeklyOffDay;

        return {
            isStatusChanged,
            isNoteChanged,
            isUnchanged,
            isNoteRequired,
            isNoteMissing,
            canSave
        };
    }, [status, note, originalStatus, originalNote, isWeeklyOffDay, isDataLoading]);

    return validationState;
};
