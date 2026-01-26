import React from 'react';
import { User, Loader2 } from 'lucide-react';
import CustomButton from '../../../UI/Button/Button';
import DatePicker from '../../../UI/DatePicker/DatePicker';
import DropDown, { type DropDownOption } from '../../../UI/DropDown/DropDown';
import { formatDateToLocalISO } from '../../../../utils/dateUtils';
import type { SimpleSalesperson } from '../../../../api/beatPlanService';

interface AssignBeatPlanFormProps {
    employees: SimpleSalesperson[];
    loading: boolean;
    selectedEmployeeId: string;
    setSelectedEmployeeId: (id: string) => void;
    startDate: string;
    setStartDate: (date: string) => void;
    submitting: boolean;
    onSubmit: () => void;
    onCancel: () => void;
}

const AssignBeatPlanForm: React.FC<AssignBeatPlanFormProps> = ({
    employees,
    loading,
    selectedEmployeeId,
    setSelectedEmployeeId,
    startDate,
    setStartDate,
    submitting,
    onSubmit,
    onCancel
}) => {
    // Format options for DropDown
    const employeeOptions: DropDownOption[] = employees.map(emp => ({
        value: emp._id,
        // Format: Name • Role • Phone (filtering out missing values)
        label: [emp.name, emp.phone].filter(Boolean).join(' • '),
        icon: <User className="w-4 h-4" />
    }));

    return (
        <div className="flex flex-col h-full">
            <div className="p-6 space-y-6 flex-1">
                {/* Employee Selection */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Assign To <span className="text-red-500">*</span>
                    </label>
                    <div className={`relative ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
                        <DropDown
                            value={selectedEmployeeId}
                            onChange={(val) => setSelectedEmployeeId(val)}
                            options={employeeOptions}
                            placeholder="Select an employee"
                            icon={<User className="w-4 h-4" />}
                            isSearchable
                        />
                        {loading && (
                            <div className="absolute right-10 top-1/2 -translate-y-1/2">
                                <Loader2 className="w-4 h-4 animate-spin text-secondary" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Start Date */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Start Date <span className="text-red-500">*</span>
                    </label>
                    <DatePicker
                        value={startDate ? new Date(startDate) : null}
                        onChange={(date) => {
                            const dateString = date ? formatDateToLocalISO(date) : '';
                            setStartDate(dateString);
                        }}
                        placeholder="Select Start Date"
                        minDate={new Date()}
                        isClearable={false}
                        popoverStrategy="relative"
                    />
                </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 flex-shrink-0">
                <CustomButton
                    variant="outline"
                    onClick={onCancel}
                    disabled={submitting}
                    className="text-gray-700 bg-white border-gray-300 hover:bg-gray-50 font-medium"
                >
                    Cancel
                </CustomButton>
                <CustomButton
                    variant="secondary"
                    onClick={onSubmit}
                    disabled={submitting || !selectedEmployeeId || !startDate}
                    isLoading={submitting}
                >
                    {submitting ? 'Assigning...' : 'Assign Plan'}
                </CustomButton>
            </div>
        </div>
    );
};

export default AssignBeatPlanForm;
