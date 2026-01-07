
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getEmployees } from '../../api/employeeService';
import Button from '../../components/UI/Button/Button';
import CreateHierarchyModal from './CreateHierarchyModal';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

const RoleHierarchyTab: React.FC = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingHierarchy, setEditingHierarchy] = useState<{ employeeId: string; supervisorIds: string[] } | null>(null);

    // Fetch employees
    const { data: employees, isLoading, refetch } = useQuery({
        queryKey: ['employees'],
        queryFn: getEmployees // Use the named export directly
    });

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
                <h2 className="text-lg font-bold text-gray-900">Organizational Hierarchy Mapping</h2>
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
                            ) : (
                                employees.map((employee, index) => {
                                    const supervisors = employee.reportsTo || [];

                                    return (
                                        <tr key={employee._id} className="transition-colors duration-200 hover:bg-gray-200">
                                            <td className="px-5 py-3 text-black text-sm">{index + 1}</td>
                                            <td className="px-5 py-3 text-black text-sm font-medium">{employee.name}</td>
                                            <td className="px-5 py-3 text-black text-sm">{getRoleName(employee)}</td>

                                            {/* Supervisors Column */}
                                            <td className="px-5 py-3 text-black text-sm">
                                                {supervisors.length > 0 ? (
                                                    supervisors.map((sup: any) => sup.name).join(', ')
                                                ) : (
                                                    <span className="text-gray-400 italic">None</span>
                                                )}
                                            </td>

                                            {/* Supervisor Role Column */}
                                            <td className="px-5 py-3 text-black text-sm">
                                                {supervisors.length > 0 ? (
                                                    supervisors.map((sup: any) => getRoleName(sup)).join(', ')
                                                ) : (
                                                    <span className="text-gray-400 italic">None</span>
                                                )}
                                            </td>

                                            <td className="px-5 py-3 text-sm text-blue-600 hover:text-blue-800 cursor-pointer font-bold">
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
                                                        title="Edit"
                                                    >
                                                        <PencilSquareIcon className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => { /* Handle Delete */ }}
                                                        className="text-red-600"
                                                        title="Delete"
                                                    >
                                                        <TrashIcon className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
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
        </div>
    );
};

export default RoleHierarchyTab;
