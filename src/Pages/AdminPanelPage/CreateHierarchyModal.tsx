import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getEmployees, updateEmployee } from '../../api/employeeService';
import Button from '../../components/UI/Button/Button';
import { X, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

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
    const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
    const [supervisorIds, setSupervisorIds] = useState<string[]>(['']); // Start with one empty supervisor slot

    // Initialize state when initialData provided
    React.useEffect(() => {
        if (isOpen && initialData) {
            setSelectedEmployeeId(initialData.employeeId);
            setSupervisorIds(initialData.supervisorIds.length > 0 ? initialData.supervisorIds : ['']);
        } else if (isOpen && !initialData) {
            // Reset for new creation
            setSelectedEmployeeId('');
            setSupervisorIds(['']);
        }
    }, [isOpen, initialData]);

    // Fetch all employees for dropdowns
    const { data: employeesList } = useQuery({
        queryKey: ['employees-list'],
        queryFn: getEmployees
    });

    const employees = employeesList || []; // getEmployees returns array directly

    const handleAddSupervisor = () => {
        setSupervisorIds([...supervisorIds, '']);
    };

    const handleSupervisorChange = (index: number, value: string) => {
        const newIds = [...supervisorIds];
        newIds[index] = value;
        setSupervisorIds(newIds);
    };

    const handleRemoveSupervisor = (index: number) => {
        const newIds = supervisorIds.filter((_, i) => i !== index);
        setSupervisorIds(newIds);
    };

    const updateHierarchyMutation = useMutation({
        mutationFn: async () => {
            // Filter empty IDs
            const validSupervisors = supervisorIds.filter(id => id !== '');

            // Using updateEmployee named export
            return updateEmployee(selectedEmployeeId, {
                reportsTo: validSupervisors
            } as any); // Casting to any because reportsTo is new in frontend types
        },
        onSuccess: () => {
            toast.success('Hierarchy updated successfully!');
            onSuccess();
            onClose();
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || 'Failed to update hierarchy');
        }
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backbone">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 overflow-hidden transform transition-all">
                {/* Header */}
                <div className="flex justify-between items-start p-6 pb-2">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">
                            {initialData ? 'Edit Hierarchy' : 'Create New Hierarchy'}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                            {initialData ? 'Update employee supervisor relationships.' : 'Create a new employee and their supervisor to the hierarchy.'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {/* Employee Selection */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Employee Name & Role
                        </label>
                        <div className="relative">
                            <select
                                value={selectedEmployeeId}
                                onChange={(e) => setSelectedEmployeeId(e.target.value)}
                                className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm disabled:bg-gray-100 disabled:text-gray-500"
                                disabled={!!initialData} // Lock employee selection during edit
                            >
                                <option value="">Select Employee</option>
                                {employees.map((emp: any) => (
                                    <option key={emp._id} value={emp._id}>
                                        {emp.name} ({typeof emp.role === 'string' ? emp.role : emp.role?.name})
                                    </option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                            </div>
                        </div>
                    </div>

                    {/* Supervisor Selection (Dynamic List) */}
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">
                            Supervisor Name & Role
                        </label>

                        {supervisorIds.map((supId, index) => (
                            <div key={index} className="flex gap-2">
                                <div className="relative flex-1">
                                    <select
                                        value={supId}
                                        onChange={(e) => handleSupervisorChange(index, e.target.value)}
                                        className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
                                        disabled={!selectedEmployeeId}
                                    >
                                        <option value="">Select Supervisor</option>
                                        {employees
                                            .filter((emp: any) => emp._id !== selectedEmployeeId) // Prevent self-selection
                                            .map((emp: any) => (
                                                <option key={emp._id} value={emp._id}>
                                                    {emp.name} ({typeof emp.role === 'string' ? emp.role : emp.role?.name})
                                                </option>
                                            ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
                                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                                    </div>
                                </div>
                                {supervisorIds.length > 1 && (
                                    <button
                                        onClick={() => handleRemoveSupervisor(index)}
                                        className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={handleAddSupervisor}
                            className="w-full py-3 border border-gray-200 rounded-lg text-sm text-gray-600 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Add Another Supervisor
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="text-gray-600"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => updateHierarchyMutation.mutate()}
                        disabled={!selectedEmployeeId || updateHierarchyMutation.isPending}
                        className="min-w-[100px]"
                    >
                        {updateHierarchyMutation.isPending ? 'Saving...' : (initialData ? 'Update' : 'Create')}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CreateHierarchyModal;
