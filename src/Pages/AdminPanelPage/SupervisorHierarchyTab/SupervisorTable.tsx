import React from 'react';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import type { Employee } from '../../../api/employeeService';

interface SupervisorTableProps {
    employees: Employee[];
    isLoading: boolean;
    onEdit: (employee: Employee) => void;
    onDelete: (employee: Employee | null) => void;
    onViewDetails: (employee: Employee | null) => void;
    getRoleName: (employee: { role: string | { name: string }; customRoleId?: string | { _id?: string; name: string; description?: string } }) => string;
    isDeleting: boolean;
}

const SupervisorTable: React.FC<SupervisorTableProps> = ({
    employees,
    isLoading,
    onEdit,
    onDelete,
    onViewDetails,
    getRoleName,
    isDeleting
}) => {

    // Internal handler safely checking validity before delegating
    const handleDeleteClick = (employee: Employee) => {
        if (!employee.reportsTo || employee.reportsTo.length === 0) {
            toast.error('This employee has no hierarchy to remove.');
            return;
        }
        onDelete(employee);
    };

    const handleViewDetails = (employee: Employee) => {
        // Admin users have no hierarchy to display
        if (employee.role === 'admin') {
            toast.error('Administrators are at the top level of the organization and do not report to any supervisor.');
            return;
        }
        if (!employee.reportsTo || employee.reportsTo.length === 0) {
            toast.error('No reporting structure has been configured for this employee yet.');
            return;
        }
        onViewDetails(employee);
    };

    return (
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
                                <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">Loading hierarchy...</td>
                            </tr>
                        ) : (!employees || employees.length === 0) ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">No employees found.</td>
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
                                            {employee.role === 'admin' ? (
                                                <span className="text-gray-500">Not Applicable</span>
                                            ) : supervisors.length > 0 ? (
                                                supervisors.map((sup) => sup.name).join(', ')
                                            ) : (
                                                <span className="text-gray-400">None</span>
                                            )}
                                        </td>

                                        {/* Supervisor Role Column */}
                                        <td className="px-5 py-3 text-black text-sm">
                                            {employee.role === 'admin' ? (
                                                <span className="text-gray-500">Not Applicable</span>
                                            ) : supervisors.length > 0 ? (
                                                supervisors.map((sup) => getRoleName(sup)).join(', ')
                                            ) : (
                                                <span className="text-gray-400">None</span>
                                            )}
                                        </td>

                                        <td
                                            className="px-5 py-3 text-sm text-blue-600 hover:text-blue-800 cursor-pointer font-bold"
                                            onClick={() => handleViewDetails(employee)}
                                        >
                                            View details
                                        </td>

                                        <td className="px-5 py-3 text-sm">
                                            <div className="flex items-center gap-x-3">
                                                <button
                                                    onClick={() => onEdit(employee)}
                                                    className="text-blue-700"
                                                    title="Edit Hierarchy"
                                                >
                                                    <PencilSquareIcon className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(employee)}
                                                    className="text-red-600"
                                                    title="Delete Hierarchy"
                                                    disabled={isDeleting}
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
    );
};

export default SupervisorTable;
