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
    // Check if the employee is a true admin (system admin without a custom role override)
    const isTrueAdmin = (employee: Employee): boolean => {
        const adminRoles = ['admin', 'superadmin', 'developer'];
        if (!adminRoles.includes(employee.role)) return false;
        if (employee.customRoleId && typeof employee.customRoleId === 'object' && employee.customRoleId.name) {
            return adminRoles.includes(employee.customRoleId.name.toLowerCase());
        }
        return true;
    };

    const handleEditClick = (employee: Employee) => {
        if (isTrueAdmin(employee)) {
            toast.error('Admin roles cannot be assigned a supervisor.');
            return;
        }
        onEdit(employee);
    };

    // Internal handler safely checking validity before delegating
    const handleDeleteClick = (employee: Employee) => {
        if (isTrueAdmin(employee)) {
            toast.error('Admin roles cannot be assigned a supervisor.');
            return;
        }
        if (!employee.reportsTo || employee.reportsTo.length === 0) {
            toast.error('This employee has no hierarchy to remove.');
            return;
        }
        onDelete(employee);
    };

    const handleViewDetails = (employee: Employee) => {
        if (isTrueAdmin(employee)) {
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
                if (isTrueAdmin(employee)) {
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
                if (isTrueAdmin(employee)) {
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
            onClick: (employee) => handleEditClick(employee),
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

    return (
        <DataTable
            data={employees}
            columns={columns}
            keyExtractor={(employee) => employee.id || employee._id || ''}
            actions={actions}
            loading={isLoading}
            emptyMessage="No employees found"
            className="shadow-sm border border-gray-100"
        />
    );
};

export default SupervisorTable;
