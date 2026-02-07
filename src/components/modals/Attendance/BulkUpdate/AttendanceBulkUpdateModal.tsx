import React from 'react';
import RestrictionView from '../common/RestrictionView';
import BulkUpdateForm from './components/BulkUpdateForm';
import { useBulkUpdate } from './hooks/useBulkUpdate';
import { type BulkUpdateModalProps } from './types';
import type { BulkUpdateFormData } from '../common/AttendanceSchema';
import { Button, FormModal } from '@/components/ui';

const AttendanceBulkUpdateModal: React.FC<BulkUpdateModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    day,
    weekday,
    month,
    isWeeklyOffDay,
    organizationWeeklyOffDay
}) => {
    const { form } = useBulkUpdate(isOpen);
    const { control, register, handleSubmit, formState: { errors, isValid } } = form;

    const onSubmit = (data: BulkUpdateFormData) => {
        onConfirm(data.status, data.note);
    };

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
                disabled={!isValid}
                className={`
                    font-medium transition-all duration-200 shadow-sm
                    ${isValid
                        ? 'bg-primary hover:bg-primary-600 hover:shadow-md transform hover:-translate-y-0.5 text-white'
                        : 'bg-gray-300 cursor-not-allowed opacity-70 text-white'}
                `}
            >
                Apply Update
            </Button>
        </div>
    ) : undefined;

    return (
        <FormModal
            isOpen={isOpen}
            onClose={onClose}
            title="Bulk Update Attendance"
            description={<>Applying changes for <span className="font-medium text-secondary">{month} {day}, {weekday}</span></>}
            size="md"
            footer={footer}
        >
            <div className="px-6 py-6">
                {isWeeklyOffDay ? (
                    <RestrictionView weekday={organizationWeeklyOffDay} />
                ) : (
                    <BulkUpdateForm
                        day={day}
                        weekday={weekday}
                        month={month}
                        control={control}
                        register={register}
                        errors={errors}
                    />
                )}
            </div>
        </FormModal>
    );
};

export default AttendanceBulkUpdateModal;
