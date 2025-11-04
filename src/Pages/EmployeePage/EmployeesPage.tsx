import React from 'react';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import EmployeeContent from './EmployeeContent';
import { getEmployees, type Employee } from '../../api/employeeService';
import { useQuery } from '@tanstack/react-query'; // <-- 1. Import useQuery
import { Loader2 } from 'lucide-react';

// 2. Define a unique key for this query
export const EMPLOYEE_QUERY_KEY = 'employees';

const EmployeesPage: React.FC = () => {

  // 3. Replace all useState/useEffect with useQuery
  const { 
    data: employeeData, 
    isLoading: loading, 
    error 
  } = useQuery<Employee[], Error>({
    queryKey: [EMPLOYEE_QUERY_KEY],
    queryFn: getEmployees,
  });

  // 4. Handle the main loading state
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

  // 5. Pass data down. onDataRefresh is no longer needed.
  return (
    <Sidebar> 
      <EmployeeContent
        data={employeeData || null}
        loading={loading} // This will be false now
        error={error ? error.message : null}
      />
    </Sidebar>
  );
};

export default EmployeesPage;
