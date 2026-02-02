import React from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import type { CreateLeaveFormData } from '../common/CreateLeaveSchema';
import { formatDateToLocalISO } from '@/utils/dateUtils';
import { LEAVE_CATEGORIES } from '../common/LeaveConstants';
import { useOrganizationConfig } from '../hooks/useOrganizationConfig';
import { DatePicker, Button, DropDown } from '@/components/ui';

interface CreateLeaveFormProps {
    form: UseFormReturn<CreateLeaveFormData>;
    hasAttemptedSubmit: boolean;
    onSubmit: () => void;
    isPending: boolean;
    onCancel: () => void;
}

const CreateLeaveForm: React.FC<CreateLeaveFormProps> = ({
    form,
    hasAttemptedSubmit,
    onSubmit,
    isPending,
    onCancel
}) => {
    const { control, register, watch, formState: { errors } } = form;
    const startDate = watch('startDate');

    // Fetch organization config for weekly off day
    const { data: orgConfig } = useOrganizationConfig();

    // Convert weeklyOffDay name to day number (0 = Sunday, 1 = Monday, etc.)
    const weeklyOffDayMap: Record<string, number> = {
        'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3,
        'Thursday': 4, 'Friday': 5, 'Saturday': 6
    };
    const disabledDaysOfWeek = orgConfig?.weeklyOffDay
        ? [weeklyOffDayMap[orgConfig.weeklyOffDay]]
        : [];

    return (
        <form onSubmit={onSubmit} className="flex flex-col h-full">
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
                                    error={hasAttemptedSubmit && !!errors.startDate}
                                    isClearable
                                    minDate={new Date()}
                                    disabledDaysOfWeek={disabledDaysOfWeek}
                                />
                            )}
                        />
                        {hasAttemptedSubmit && errors.startDate && <p className="mt-1 text-xs text-red-500">{errors.startDate.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            End Date <span className="text-gray-400 font-normal">(Optional)</span>
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
                                    error={hasAttemptedSubmit && !!errors.endDate}
                                    isClearable
                                    minDate={startDate ? new Date(startDate) : new Date()}
                                    disabledDaysOfWeek={disabledDaysOfWeek}
                                />
                            )}
                        />
                        {hasAttemptedSubmit && errors.endDate && <p className="mt-1 text-xs text-red-500">{errors.endDate.message}</p>}
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
                            <DropDown
                                value={field.value}
                                onChange={field.onChange}
                                options={LEAVE_CATEGORIES.map((cat: { value: string; label: string; color: string; }) => ({
                                    value: cat.value,
                                    label: cat.label,
                                    icon: <div className={`w-2 h-2 rounded-full bg-${cat.color}-500`} />
                                }))}
                                placeholder="Select Leave Category"
                                error={hasAttemptedSubmit && errors.category ? errors.category.message : undefined}
                            />
                        )}
                    />
                    {hasAttemptedSubmit && errors.category && <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>}
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
                        className={`w-full px-4 py-3 border rounded-xl outline-none transition-colors resize-none ${hasAttemptedSubmit && errors.reason ? 'border-red-300 ring-1 ring-red-100' : 'border-gray-200 focus:ring-2 focus:ring-secondary focus:border-secondary'
                            }`}
                    />
                    {hasAttemptedSubmit && errors.reason && <p className="mt-1 text-xs text-red-500">{errors.reason.message}</p>}
                </div>
            </div>

            {/* Footer Buttons */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 flex-shrink-0">
                <Button
                    variant="outline"
                    onClick={onCancel}
                    disabled={isPending}
                    type="button"
                    className="text-gray-700 bg-white border-gray-300 hover:bg-gray-50 font-medium"
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
