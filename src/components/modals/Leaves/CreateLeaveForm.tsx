import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateLeave } from './useCreateLeave';
import { createLeaveSchema, type CreateLeaveFormData } from './CreateLeaveSchema';
import DatePicker from '../../UI/DatePicker/DatePicker';
import Button from '../../UI/Button/Button';
import SingleSelect from '../../UI/SingleSelect/SingleSelect';

interface CreateLeaveFormProps {
    onCancel: () => void;
    onSuccess: () => void;
}

const LEAVE_CATEGORIES = [
    { value: 'sick_leave', label: 'Sick Leave', color: 'red' },
    { value: 'maternity_leave', label: 'Maternity Leave', color: 'purple' },
    { value: 'paternity_leave', label: 'Paternity Leave', color: 'blue' },
    { value: 'compassionate_leave', label: 'Compassionate Leave', color: 'orange' },
    { value: 'religious_holidays', label: 'Religious Holiday', color: 'green' },
    { value: 'family_responsibility', label: 'Family Responsibility', color: 'yellow' },
    { value: 'miscellaneous', label: 'Miscellaneous', color: 'gray' },
];

// Helper to get YYYY-MM-DD from a local Date object safely
const formatDateToLocalISO = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const CreateLeaveForm: React.FC<CreateLeaveFormProps> = ({ onCancel, onSuccess }) => {
    const { control, handleSubmit, register, watch, formState: { errors } } = useForm<CreateLeaveFormData>({
        resolver: zodResolver(createLeaveSchema),
        defaultValues: {
            startDate: '',
            endDate: '',
            category: 'sick_leave',
            reason: ''
        }
    });

    const startDate = watch('startDate');
    const { mutate: createLeave, isPending } = useCreateLeave(onSuccess);

    const onSubmit = (data: CreateLeaveFormData) => {
        const payload = {
            ...data,
            endDate: data.endDate || undefined
        };
        createLeave(payload);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
            <div className="p-6 space-y-6 flex-1">
                {/* Date Selection Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Start Date <span className="text-red-500">*</span>
                        </label>
                        <Controller
                            control={control}
                            name="startDate"
                            render={({ field }) => (
                                <DatePicker
                                    value={field.value ? new Date(field.value) : null}
                                    onChange={(date) => {
                                        const dateString = date ? formatDateToLocalISO(date) : '';
                                        field.onChange(dateString);
                                    }}
                                    placeholder="Select Start Date"
                                    className={errors.startDate ? 'border-red-500' : ''}
                                    isClearable
                                    minDate={new Date()}
                                />
                            )}
                        />
                        {errors.startDate && <p className="mt-1 text-xs text-red-500">{errors.startDate.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            End Date <span className="text-gray-400 text-xs font-normal">(Optional)</span>
                        </label>
                        <Controller
                            control={control}
                            name="endDate"
                            render={({ field }) => (
                                <DatePicker
                                    value={field.value ? new Date(field.value) : null}
                                    onChange={(date) => {
                                        const dateString = date ? formatDateToLocalISO(date) : '';
                                        field.onChange(dateString);
                                    }}
                                    placeholder="Select End Date"
                                    className={errors.endDate ? 'border-red-500' : ''}
                                    isClearable
                                    openToDate={startDate ? new Date(startDate) : undefined}
                                    minDate={startDate ? new Date(startDate) : new Date()}
                                />
                            )}
                        />
                        {errors.endDate && <p className="mt-1 text-xs text-red-500">{errors.endDate.message}</p>}
                    </div>
                </div>

                {/* Category Selection */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Leave Category <span className="text-red-500">*</span>
                    </label>
                    <Controller
                        control={control}
                        name="category"
                        render={({ field }) => (
                            <SingleSelect
                                value={field.value}
                                onChange={field.onChange}
                                options={LEAVE_CATEGORIES}
                                placeholder="Select Category"
                            />
                        )}
                    />
                    {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>}
                </div>

                {/* Reason */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Reason <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        {...register('reason')}
                        rows={4}
                        placeholder="Please mention the reason for your leave request..."
                        className={`w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-colors resize-none ${errors.reason ? 'border-red-500' : 'border-gray-200'
                            }`}
                    />
                    {errors.reason && <p className="mt-1 text-xs text-red-500">{errors.reason.message}</p>}
                </div>
            </div>

            {/* Footer Buttons */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 flex-shrink-0">
                <Button
                    variant="ghost"
                    onClick={onCancel}
                    disabled={isPending}
                    type="button"
                >
                    Cancel
                </Button>
                <Button
                    variant="secondary"
                    type="submit"
                    isLoading={isPending}
                >
                    Submit Request
                </Button>
            </div>
        </form>
    );
};

export default CreateLeaveForm;
