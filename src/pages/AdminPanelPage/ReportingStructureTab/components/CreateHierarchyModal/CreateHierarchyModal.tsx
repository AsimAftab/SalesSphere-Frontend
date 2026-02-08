import React, { useMemo } from 'react';
import { GitBranch, Plus, Trash2 } from 'lucide-react';
import { useCreateHierarchy } from './useCreateHierarchy';
import { Button, FormModal, DropDown, type DropDownOption } from '@/components/ui';
import type { Employee } from '@/api/employeeService';

interface CreateHierarchyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData?: {
        employeeId: string;
        supervisorIds: string[];
    } | null;
}

const CreateHierarchyModal: React.FC<CreateHierarchyModalProps> = ({ isOpen, onClose, onSuccess, initialData }) => {
    const {
        selectedEmployeeId,
        setSelectedEmployeeId,
        supervisorIds,
        employees,
        handleAddSupervisor,
        handleSupervisorChange,
        handleRemoveSupervisor,
        handleSubmit,
        isPending
    } = useCreateHierarchy(isOpen, onClose, onSuccess, initialData);

    const adminRoles = ['admin', 'superadmin', 'developer'];

    const nonAdminEmployees = useMemo(() =>
        employees.filter((emp: Employee) => !adminRoles.includes(emp.role)),
        [employees]
    );

    const employeeOptions: DropDownOption[] = useMemo(() =>
        nonAdminEmployees.map((emp: Employee) => {
            const roleName = emp.customRoleId && typeof emp.customRoleId === 'object' && emp.customRoleId.name
                ? emp.customRoleId.name
                : emp.role;
            return {
                value: emp.id,
                label: `${emp.name} (${roleName})`,
            };
        }),
        [nonAdminEmployees]
    );

    const supervisorOptions: DropDownOption[] = useMemo(() =>
        employees
            .filter((emp: Employee) => emp.id !== selectedEmployeeId)
            .map((emp: Employee) => {
                const roleName = emp.customRoleId && typeof emp.customRoleId === 'object' && emp.customRoleId.name
                    ? emp.customRoleId.name
                    : emp.role;
                return {
                    value: emp.id,
                    label: `${emp.name} (${roleName})`,
                };
            }),
        [employees, selectedEmployeeId]
    );

    return (
        <FormModal
            isOpen={isOpen}
            onClose={onClose}
            title={initialData ? 'Edit Reporting Structure' : 'Create Reporting Structure'}
            description={initialData ? 'Update the supervisor assignments for this employee' : 'Assign one or more supervisors to an employee'}
            icon={<GitBranch className="w-5 h-5 text-secondary" />}
            size="md"
            footer={
                <div className="flex items-center justify-end gap-3">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isPending}
                        type="button"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => handleSubmit()}
                        disabled={!selectedEmployeeId || isPending}
                    >
                        {isPending ? 'Saving...' : (initialData ? 'Update' : 'Create')}
                    </Button>
                </div>
            }
        >
            <div className="p-6 space-y-5">
                {/* Employee Selection */}
                <DropDown
                    value={selectedEmployeeId}
                    onChange={setSelectedEmployeeId}
                    options={employeeOptions}
                    placeholder="Select an employee"
                    label="Employee"
                    disabled={!!initialData}
                    isSearchable
                    hideScrollbar
                    popoverStrategy="relative"
                />

                {/* Supervisor Selection */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Supervisor(s) <span className="text-red-500">*</span>
                    </label>

                    <div className="space-y-2.5">
                        {supervisorIds.map((supId, index) => (
                            <div key={index} className="flex gap-2 items-start">
                                <div className="flex-1">
                                    <DropDown
                                        value={supId}
                                        onChange={(value) => handleSupervisorChange(index, value)}
                                        options={supervisorOptions}
                                        placeholder="Select a supervisor"
                                        disabled={!selectedEmployeeId}
                                        isSearchable
                                        hideScrollbar
                                        popoverStrategy="relative"
                                    />
                                </div>
                                {supervisorIds.length > 1 && (
                                    <button
                                        onClick={() => handleRemoveSupervisor(index)}
                                        className="mt-1 p-2.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Remove supervisor"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={handleAddSupervisor}
                            disabled={!selectedEmployeeId}
                            className="w-full py-2.5 border border-dashed border-gray-300 rounded-xl text-sm text-gray-500 flex items-center justify-center gap-2 hover:bg-gray-50 hover:border-secondary hover:text-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Plus className="w-4 h-4" />
                            Add Another Supervisor
                        </button>
                    </div>
                </div>
            </div>
        </FormModal>
    );
};

export default CreateHierarchyModal;
