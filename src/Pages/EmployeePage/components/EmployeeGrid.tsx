import React from 'react';
import EmployeeCard from '../../../components/ui/ProfileCard/ProfileCard';
import { type Employee } from '../../../api/employeeService';

interface EmployeeGridProps {
    employees: Employee[];
    resolveRoleName: (emp: Employee) => string;
}

const EmployeeGrid: React.FC<EmployeeGridProps> = ({ employees, resolveRoleName }) => {
    return (
        <div className="flex-1 overflow-y-auto overflow-x-hidden pb-6 custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-2 md:px-0">
                {employees.map((employee) => (
                    <EmployeeCard
                        key={employee._id}
                        basePath="/employees"
                        id={employee._id}
                        title={employee.name || 'Unknown Employee'}
                        imageUrl={
                            employee.avatarUrl ||
                            `https://placehold.co/150x150/197ADC/ffffff?text=${(employee.name || 'U').charAt(0)}`
                        }
                        role={resolveRoleName(employee)}
                        phone={employee.phone || 'N/A'}
                        cardType="employee"
                    />
                ))}
            </div>
        </div>
    );
};

export default EmployeeGrid;
