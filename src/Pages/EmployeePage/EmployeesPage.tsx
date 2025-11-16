import React from 'react';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import EmployeeContent from './EmployeeContent';
import { getEmployees, type Employee } from '../../api/employeeService';
import { useQuery } from '@tanstack/react-query'; 
import { Loader2 } from 'lucide-react';

export const EMPLOYEE_QUERY_KEY = 'employees';

const EmployeesPage: React.FC = () => {

  const { 
    data: employeeData, 
    isLoading: loading, 
    error 
  } = useQuery<Employee[], Error>({
    queryKey: [EMPLOYEE_QUERY_KEY],
    queryFn: getEmployees,
  });

  if (loading) {
    return (
      <Sidebar>
        <div className="flex-1 flex items-center justify-center text-gray-500">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-2">Loading Employees...</span>
        </div>
      </Sidebar>
    );
  }

  return (
    <Sidebar> 
      <EmployeeContent
        data={employeeData || null}
        loading={loading} 
        error={error ? error.message : null}
      />
    </Sidebar>
  );
};

export default EmployeesPage;
