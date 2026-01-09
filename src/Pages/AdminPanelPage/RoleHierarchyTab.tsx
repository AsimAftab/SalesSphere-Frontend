
import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getEmployees, updateEmployee } from '../../api/employeeService';
import Button from '../../components/UI/Button/Button';
import CreateHierarchyModal from './CreateHierarchyModal';
import HierarchyTreeModal from './HierarchyTreeModal';
import ConfirmationModal from '../../components/modals/ConfirmationModal';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const RoleHierarchyTab: React.FC = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingHierarchy, setEditingHierarchy] = useState<{ employeeId: string; supervisorIds: string[] } | null>(null);
    const [selectedEmployeeForTree, setSelectedEmployeeForTree] = useState<any>(null);
    const [employeeToDelete, setEmployeeToDelete] = useState<any>(null);

    // Fetch employees
    const { data: employees, isLoading, refetch } = useQuery({
        queryKey: ['employees'],
        queryFn: getEmployees
    });

    // Delete hierarchy mutation
    const deleteHierarchyMutation = useMutation({
        mutationFn: async (employeeId: string) => {
            return updateEmployee(employeeId, { reportsTo: [] } as any);
        },
        onSuccess: () => {
            toast.success('Hierarchy removed successfully');
            setEmployeeToDelete(null);
            refetch();
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || 'Failed to remove hierarchy');
            setEmployeeToDelete(null);
        }
    });

    const handleDeleteClick = (employee: any) => {
        if (!employee.reportsTo || employee.reportsTo.length === 0) {
            toast.error('This employee has no hierarchy to remove.');
            return;
        }
        setEmployeeToDelete(employee);
    };

    const confirmDeleteHierarchy = () => {
        if (employeeToDelete) {
            deleteHierarchyMutation.mutate(employeeToDelete._id);
        }
    };

    // const employees: Employee[] = employeesResponse?.data?.data || []; // getEmployees returns Employee[] directly now based on the type definition in service file

    // Helper to format role name
    const getRoleName = (emp: any) => {
        if (emp.customRoleId && typeof emp.customRoleId === 'object' && emp.customRoleId.name) {
            return emp.customRoleId.name;
        }
        const role = emp.role;
        if (!role) return 'N/A';
        if (typeof role === 'string') return role.charAt(0).toUpperCase() + role.slice(1);
        return role.name;
    };

    return (
        <div className="flex flex-col h-full p-6  gap-6 overflow-hidden">
            {/* Header Card */}
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-900">Supervisor Hierarchy Mapping</h2>
                <Button
                    variant="primary"
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2"
                >
                    Create New Hierarchy
                </Button>
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead className="bg-secondary text-white text-sm">
                            <tr>
                                <th scope="col" className="px-5 py-3 text-left font-semibold whitespace-nowrap">S.No.</th>
                                <th scope="col" className="px-5 py-3 text-left font-semibold whitespace-nowrap">Employee Name</th>
                                <th scope="col" className="px-5 py-3 text-left font-semibold whitespace-nowrap">Employee Role</th>
                                <th scope="col" className="px-5 py-3 text-left font-semibold whitespace-nowrap">Employee Supervisor</th>
                                <th scope="col" className="px-5 py-3 text-left font-semibold whitespace-nowrap">Supervisor Role</th>
                                <th scope="col" className="px-5 py-3 text-left font-semibold whitespace-nowrap">View Details</th>
                                <th scope="col" className="px-5 py-3 text-left font-semibold whitespace-nowrap">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">Loading hierarchy...</td>
                                </tr>
                            ) : (!employees || employees.length === 0) ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">No employees found.</td>
                                </tr>
                            ) : (() => {
                                // Sort employees: admins first, then others
                                const sortedEmployees = [...employees].sort((a, b) => {
                                    if (a.role === 'admin' && b.role !== 'admin') return -1;
                                    if (a.role !== 'admin' && b.role === 'admin') return 1;
                                    return 0;
                                });
                                return sortedEmployees.map((employee, index) => {
                                    const supervisors = employee.reportsTo || [];

                                    return (
                                        <tr key={employee._id} className="transition-colors duration-200 hover:bg-gray-200">
                                            <td className="px-5 py-3 text-black text-sm">{index + 1}</td>
                                            <td className="px-5 py-3 text-black text-sm font-medium">{employee.name}</td>
                                            <td className="px-5 py-3 text-black text-sm">{getRoleName(employee)}</td>

                                            {/* Supervisors Column */}
                                            <td className="px-5 py-3 text-black text-sm">
                                                {employee.role === 'admin' ? (
                                                    <span className="text-gray-500">Not Applicable</span>
                                                ) : supervisors.length > 0 ? (
                                                    supervisors.map((sup: any) => sup.name).join(', ')
                                                ) : (
                                                    <span className="text-gray-400">None</span>
                                                )}
                                            </td>

                                            {/* Supervisor Role Column */}
                                            <td className="px-5 py-3 text-black text-sm">
                                                {employee.role === 'admin' ? (
                                                    <span className="text-gray-500">Not Applicable</span>
                                                ) : supervisors.length > 0 ? (
                                                    supervisors.map((sup: any) => getRoleName(sup)).join(', ')
                                                ) : (
                                                    <span className="text-gray-400">None</span>
                                                )}
                                            </td>

                                            <td
                                                className="px-5 py-3 text-sm text-blue-600 hover:text-blue-800 cursor-pointer font-bold"
                                                onClick={() => {
                                                    // Admin users have no hierarchy to display
                                                    if (employee.role === 'admin') {
                                                        toast.error('Administrators are at the top level of the organization and do not report to any supervisor.');
                                                        return;
                                                    }
                                                    if (!employee.reportsTo || employee.reportsTo.length === 0) {
                                                        toast.error('No reporting structure has been configured for this employee yet.');
                                                        return;
                                                    }
                                                    setSelectedEmployeeForTree(employee);
                                                }}
                                            >
                                                View details
                                            </td>

                                            <td className="px-5 py-3 text-sm">
                                                <div className="flex items-center gap-x-3">
                                                    <button
                                                        onClick={() => {
                                                            setEditingHierarchy({
                                                                employeeId: employee._id,
                                                                supervisorIds: (employee.reportsTo || []).map((sup: any) => sup._id)
                                                            });
                                                            setIsCreateModalOpen(true);
                                                        }}
                                                        className="text-blue-700"
                                                        title="Edit Hierarchy"
                                                    >
                                                        <PencilSquareIcon className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(employee)}
                                                        className="text-red-600"
                                                        title="Delete Hierarchy"
                                                        disabled={deleteHierarchyMutation.isPending}
                                                    >
                                                        <TrashIcon className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            })()}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isCreateModalOpen && (
                <CreateHierarchyModal
                    isOpen={isCreateModalOpen}
                    onClose={() => {
                        setIsCreateModalOpen(false);
                        setEditingHierarchy(null);
                    }}
                    onSuccess={refetch}
                    initialData={editingHierarchy}
                />
            )}

            {/* Hierarchy Tree Modal */}
            <HierarchyTreeModal
                isOpen={!!selectedEmployeeForTree}
                onClose={() => setSelectedEmployeeForTree(null)}
                employee={selectedEmployeeForTree}
            />

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={!!employeeToDelete}
                title="Remove Hierarchy"
                message={`Are you sure you want to remove the reporting structure for ${employeeToDelete?.name}? This action cannot be undone.`}
                onConfirm={confirmDeleteHierarchy}
                onCancel={() => setEmployeeToDelete(null)}
                confirmButtonText="Remove"
                cancelButtonText="Cancel"
                confirmButtonVariant="danger"
            />
        </div>
    );
};

export default RoleHierarchyTab;
