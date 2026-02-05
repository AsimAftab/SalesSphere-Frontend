import React from 'react';
import toast from 'react-hot-toast';
import type { Employee } from '@/api/employeeService';
import { SquarePen, Trash2 } from 'lucide-react';
import { DataTable, textColumn, viewDetailsColumn, type TableColumn, type TableAction } from '@/components/ui';

interface SupervisorTableProps {
    employees: Employee[];
    isLoading: boolean;
    onEdit: (employee: Employee) => void;
    onDelete: (employee: Employee) => void;
    onViewDetails: (employee: Employee) => void;
    getRoleName: (employee: Employee) => string;
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

    const columns: TableColumn<Employee>[] = [
        textColumn('name', 'Employee Name', { className: 'font-medium' }),
        {
            key: 'role',
            label: 'Employee Role',
            render: (_, employee) => getRoleName(employee)
        },
        {
            key: 'supervisorName',
            label: 'Employee Supervisor',
            render: (_, employee) => {
                const supervisors = employee.reportsTo || [];
                if (employee.role === 'admin') {
                    return <span className="text-gray-500">Not Applicable</span>;
                }
                if (supervisors.length > 0) {
                    return supervisors.map((sup) => sup.name).join(', ');
                }
                return <span className="text-gray-400">None</span>;
            }
        },
        {
            key: 'supervisorRole',
            label: 'Supervisor Role',
            render: (_, employee) => {
                const supervisors = employee.reportsTo || [];
                if (employee.role === 'admin') {
                    return <span className="text-gray-500">Not Applicable</span>;
                }
                if (supervisors.length > 0) {
                    return supervisors.map((sup) => getRoleName(sup as Employee)).join(', ');
                }
                return <span className="text-gray-400">None</span>;
            }
        },
        viewDetailsColumn<Employee>('', { onClick: handleViewDetails })
    ];

    const actions: TableAction<Employee>[] = [
        {
            icon: SquarePen,
            onClick: (employee) => onEdit(employee),
            className: 'text-blue-700',
            title: 'Edit Hierarchy'
        },
        {
            icon: Trash2,
            onClick: (employee) => handleDeleteClick(employee),
            className: 'text-red-600',
            title: 'Delete Hierarchy',
            disabled: isDeleting
        }
    ];

    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead className="bg-secondary text-white text-sm">
                            <tr>
                                <th className="px-5 py-3 text-left font-semibold">S.No.</th>
                                <th className="px-5 py-3 text-left font-semibold">Employee Name</th>
                                <th className="px-5 py-3 text-left font-semibold">Employee Role</th>
                                <th className="px-5 py-3 text-left font-semibold">Employee Supervisor</th>
                                <th className="px-5 py-3 text-left font-semibold">Supervisor Role</th>
                                <th className="px-5 py-3 text-left font-semibold">View Details</th>
                                <th className="px-5 py-3 text-left font-semibold">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                                    Loading hierarchy...
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    if (!employees || employees.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead className="bg-secondary text-white text-sm">
                            <tr>
                                <th className="px-5 py-3 text-left font-semibold">S.No.</th>
                                <th className="px-5 py-3 text-left font-semibold">Employee Name</th>
                                <th className="px-5 py-3 text-left font-semibold">Employee Role</th>
                                <th className="px-5 py-3 text-left font-semibold">Employee Supervisor</th>
                                <th className="px-5 py-3 text-left font-semibold">Supervisor Role</th>
                                <th className="px-5 py-3 text-left font-semibold">View Details</th>
                                <th className="px-5 py-3 text-left font-semibold">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                                    No employees found.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    return (
        <DataTable
            data={employees}
            columns={columns}
            keyExtractor={(employee) => employee._id}
            actions={actions}
            className="shadow-sm border border-gray-100"
        />
    );
};

export default SupervisorTable;
