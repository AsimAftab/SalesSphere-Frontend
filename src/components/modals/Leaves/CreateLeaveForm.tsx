import React, { useState } from 'react';
import { useCreateLeave } from './useCreateLeave';
import { type CreateLeavePayload } from '../../../api/leaveService';
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

const CreateLeaveForm: React.FC<CreateLeaveFormProps> = ({ onCancel, onSuccess }) => {
    const [formData, setFormData] = useState<CreateLeavePayload>({
        startDate: '', // We will manage this as string for API, but use Date objects for DatePicker state
        endDate: '',
        category: 'sick_leave',
        reason: ''
    });

    // Local state for Date objects to work with DatePicker
    const [dates, setDates] = useState<{ start: Date | null; end: Date | null }>({
        start: null,
        end: null
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const { mutate: createLeave, isPending } = useCreateLeave(onSuccess);

    const validate = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.startDate) newErrors.startDate = 'Start Date is required';
        if (!formData.category) newErrors.category = 'Category is required';
        if (!formData.reason.trim()) newErrors.reason = 'Reason is required';

        if (formData.startDate && formData.endDate) {
            if (new Date(formData.endDate) < new Date(formData.startDate)) {
                newErrors.endDate = 'End Date cannot be before Start Date';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        const payload = {
            ...formData,
            endDate: formData.endDate || undefined
        };

        createLeave(payload);
    };

    const handleDateChange = (type: 'start' | 'end', date: Date | null) => {
        setDates(prev => ({ ...prev, [type]: date }));

        // Format to YYYY-MM-DD using local time, NOT UTC to avoid timezone shifts
        // 'en-CA' locale produces YYYY-MM-DD format consistently
        const dateString = date ? date.toLocaleDateString('en-CA') : '';
        setFormData(prev => ({
            ...prev,
            [type === 'start' ? 'startDate' : 'endDate']: dateString
        }));

        if (errors[type === 'start' ? 'startDate' : 'endDate']) {
            setErrors(prev => ({ ...prev, [type === 'start' ? 'startDate' : 'endDate']: '' }));
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <div className="p-6 space-y-6 flex-1">
                {/* Date Selection Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Start Date <span className="text-red-500">*</span>
                        </label>
                        <DatePicker
                            value={dates.start}
                            onChange={(date) => handleDateChange('start', date)}
                            placeholder="Select Start Date"
                            className={errors.startDate ? 'border-red-500' : ''}
                            isClearable
                            minDate={new Date()}
                        />
                        {errors.startDate && <p className="mt-1 text-xs text-red-500">{errors.startDate}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            End Date <span className="text-gray-400 text-xs font-normal">(Optional)</span>
                        </label>
                        <DatePicker
                            value={dates.end}
                            onChange={(date) => handleDateChange('end', date)}
                            placeholder="Select End Date"
                            className={errors.endDate ? 'border-red-500' : ''}
                            isClearable
                            openToDate={dates.start || undefined}
                            minDate={dates.start || new Date()}
                        />
                        {errors.endDate && <p className="mt-1 text-xs text-red-500">{errors.endDate}</p>}
                    </div>
                </div>

                {/* Category Selection */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Leave Category <span className="text-red-500">*</span>
                    </label>
                    <SingleSelect
                        value={formData.category}
                        onChange={(val) => {
                            setFormData(prev => ({ ...prev, category: val }));
                            if (errors.category) setErrors(prev => ({ ...prev, category: '' }));
                        }}
                        options={LEAVE_CATEGORIES}
                        placeholder="Select Category"
                    />
                </div>

                {/* Reason */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Reason <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        name="reason"
                        rows={4}
                        value={formData.reason}
                        onChange={handleChange}
                        placeholder="Please mention the reason for your leave request..."
                        className={`w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-colors resize-none ${errors.reason ? 'border-red-500' : 'border-gray-200'
                            }`}
                    />
                    {errors.reason && <p className="mt-1 text-xs text-red-500">{errors.reason}</p>}
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
