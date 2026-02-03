import React from 'react';
import { Loader2, User } from 'lucide-react';
import { formatDateToLocalISO } from '@/utils/dateUtils';
import type { Employee } from '@/api/employeeService';
import { Button as CustomButton, DatePicker, DropDown, type DropDownOption } from '@/components/ui';

interface AssignBeatPlanFormProps {
    employees: Employee[];
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
    const employeeOptions: DropDownOption[] = employees.map(emp => {
        // Determine role name (handle populated customRoleId or fallback string)
        const roleName = (typeof emp.customRoleId === 'object' && emp.customRoleId?.name)
            ? emp.customRoleId.name
            : emp.role;

        return {
            value: emp._id,
            label: emp.name, // Simple label for search & input display
            data: { ...emp, roleName }, // Pass full data for custom render
            icon: <User className="w-4 h-4" />
        };
    });

    const renderEmployeeOption = (option: DropDownOption) => {
        const emp = option.data;
        if (!emp) return <span>{option.label}</span>;

        return (
            <div className="flex flex-col gap-1 py-1">
                <span className="font-bold text-gray-900 text-sm leading-none">
                    {emp.name}
                </span>
                <div className="flex items-center gap-2 text-sm">
                    <span className="bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-md font-medium">
                        {emp.roleName}
                    </span>
                    {emp.phone && (
                        <>
                            <span className="text-gray-300">•</span>
                            <span className="text-gray-500 font-medium">{emp.phone}</span>
                        </>
                    )}
                </div>
            </div>
        );
    };

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
                            renderOption={renderEmployeeOption}
                            popoverStrategy="relative"
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
