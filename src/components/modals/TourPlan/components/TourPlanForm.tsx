import React from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import type { TourPlanFormData } from '../common/TourPlanSchema';
import DatePicker from '../../../UI/DatePicker/DatePicker';
import Button from '../../../UI/Button/Button';

interface TourPlanFormProps {
    form: UseFormReturn<TourPlanFormData>;
    onSubmit: () => void;
    isSaving: boolean;
    onCancel: () => void;
    isEditMode: boolean;
}

const TourPlanForm: React.FC<TourPlanFormProps> = ({
    form,
    onSubmit,
    isSaving,
    onCancel,
    isEditMode
}) => {
    const { register, control, watch, formState: { errors } } = form;
    const purposeLength = watch('purposeOfVisit')?.length || 0;

    return (
        <form onSubmit={onSubmit} className="flex flex-col h-full">
            <div className="p-6 space-y-6 flex-1">
                {/* Destination */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Place of Visit <span className="text-red-500">*</span>
                    </label>
                    <input
                        {...register('placeOfVisit')}
                        placeholder="e.g. Mumbai Regional Office"
                        className={`w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 transition-colors font-medium text-black ${
                            errors.placeOfVisit
                                ? 'border-red-500 focus:ring-red-200 focus:border-red-500'
                                : 'border-gray-200 focus:ring-secondary focus:border-secondary'
                        }`}
                    />
                    {errors.placeOfVisit && (
                        <p className="mt-1 text-xs text-red-500">{errors.placeOfVisit.message}</p>
                    )}
                </div>

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
                                    value={field.value || null}
                                    onChange={(date) => field.onChange(date)}
                                    placeholder="Select Start Date"
                                    error={!!errors.startDate}
                                    minDate={new Date()}
                                    align="left"
                                />
                            )}
                        />
                        {errors.startDate && (
                            <p className="mt-1 text-xs text-red-500">{errors.startDate.message}</p>
                        )}
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
                                    value={field.value || null}
                                    onChange={(date) => field.onChange(date)}
                                    placeholder="Select End Date"
                                    error={!!errors.endDate}
                                    minDate={new Date()}
                                    align='right'
                                />
                            )}
                        />
                        {errors.endDate && (
                            <p className="mt-1 text-xs text-red-500">{errors.endDate.message}</p>
                        )}
                    </div>
                </div>

                {/* Purpose of Visit */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-semibold text-gray-700">
                            Purpose of Visit <span className="text-red-500">*</span>
                        </label>
                        <span className={`text-xs font-medium ${purposeLength > 450 ? 'text-red-500' : 'text-gray-400'}`}>
                            {purposeLength}/500
                        </span>
                    </div>
                    <textarea
                        {...register('purposeOfVisit')}
                        rows={5}
                        placeholder="Clearly state the business objective..."
                        className={`w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 transition-colors resize-none font-medium text-black ${
                            errors.purposeOfVisit
                                ? 'border-red-500 focus:ring-red-200 focus:border-red-500'
                                : 'border-gray-200 focus:ring-secondary focus:border-secondary'
                        }`}
                    />
                    {errors.purposeOfVisit && (
                        <p className="mt-1 text-xs text-red-500">{errors.purposeOfVisit.message}</p>
                    )}
                </div>

                {/* Info Banner */}
                <div className="bg-blue-50/50 p-3 rounded-xl flex items-start gap-3 border border-blue-100/50">
                    <InformationCircleIcon className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-600 leading-relaxed font-medium">
                        Tour plans require administrative review before approval.
                    </p>
                </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 flex-shrink-0">
                <Button
                    variant="outline"
                    onClick={onCancel}
                    disabled={isSaving}
                    type="button"
                    className="text-gray-700 bg-white border-gray-300 hover:bg-gray-50 font-medium"
                >
                    Cancel
                </Button>
                <Button
                    variant="secondary"
                    type="submit"
                    isLoading={isSaving}
                >
                    {isEditMode ? 'Update Tour Plan' : 'Create Tour Plan'}
                </Button>
            </div>
        </form>
    );
};

export default TourPlanForm;
