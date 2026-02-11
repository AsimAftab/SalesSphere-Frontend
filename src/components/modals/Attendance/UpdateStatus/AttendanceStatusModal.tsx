import React from 'react';
import type { AttendanceStatusModalProps } from './types';
import CurrentRecordView from './components/CurrentRecordView';
import UpdateForm from './components/UpdateForm';
import { useStatusUpdate } from './hooks/useStatusUpdate';
import RestrictionView from '../common/RestrictionView';
import type { UpdateStatusFormData } from '../common/AttendanceSchema';
import { Button, FormModal } from '@/components/ui';

const AttendanceStatusModal: React.FC<AttendanceStatusModalProps> = ({
    isOpen,
    onClose,
    employeeId,
    employeeName,
    dateString,
    onSave: handleSaveApi,
    isWeeklyOffDay,
    organizationWeeklyOffDay
}) => {
    const {
        form,
        record,
        isDataLoading,
        isError,
        isNoteRequired,
        canSave,
        isStatusChanged
    } = useStatusUpdate(employeeId, dateString, isOpen, isWeeklyOffDay);

    const { control, register, handleSubmit, formState: { errors } } = form;

    const onSubmit = (data: UpdateStatusFormData) => {
        handleSaveApi(data.status, data.note || '');
    };

    const { month, day, formattedWeekday } = React.useMemo(() => {
        if (!dateString) return { month: '', day: '', formattedWeekday: '' };
        const date = new Date(dateString);
        return {
            month: date.toLocaleString('default', { month: 'long' }),
            day: date.getDate().toString(),
            formattedWeekday: date.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' })
        };
    }, [dateString]);

    const footer = !isWeeklyOffDay ? (
        <div className="flex justify-end gap-3">
            <Button
                onClick={onClose}
                variant="outline"
                className="text-gray-700 bg-white border-gray-300 hover:bg-gray-50 font-medium"
            >
                Cancel
            </Button>
            <Button
                onClick={handleSubmit(onSubmit)}
                disabled={!canSave}
                className={`
                    font-medium transition-all duration-200 shadow-sm
                    ${canSave
                        ? 'bg-secondary hover:bg-secondary-600 hover:shadow-md transform hover:-translate-y-0.5 text-white'
                        : 'bg-gray-300 cursor-not-allowed opacity-70 text-white'}
                `}
            >
                Update Status
            </Button>
        </div>
    ) : undefined;

    return (
        <FormModal
            isOpen={isOpen}
            onClose={onClose}
            title="Update Attendance"
            description={<>{employeeName} • <span className="font-medium text-secondary">{month} {day}, {formattedWeekday}</span></>}
            size="md"
            footer={footer}
        >
            <div className="px-6 py-6">
                {isWeeklyOffDay ? (
                    <RestrictionView weekday={organizationWeeklyOffDay} />
                ) : (
                    <div className="space-y-8">
                        <CurrentRecordView
                            record={record}
                            isLoading={isDataLoading}
                            isError={isError}
                            originalNote={record?.notes || null}
                            employeeId={employeeId}
                        />
                        <UpdateForm
                            control={control}
                            register={register}
                            errors={errors}
                            isDisabled={isDataLoading || !!isError}
                            isNoteRequired={isNoteRequired}
                            showNoteInput={isStatusChanged}
                        />
                    </div>
                )}
            </div>
        </FormModal>
    );
};

export default AttendanceStatusModal;
