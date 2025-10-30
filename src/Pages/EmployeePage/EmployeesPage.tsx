import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import EmployeeContent from './EmployeeContent';
import { getEmployees, type Employee } from '../../api/employeeService';

const EmployeesPage: React.FC = () => {
  const [employeeData, setEmployeeData] = useState<Employee[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getEmployees();
      setEmployeeData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load employees.");
      setEmployeeData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleDataRefresh = () => {
    fetchEmployees();
  };

  return (
    <Sidebar> 
      <EmployeeContent
        data={employeeData}
        loading={loading}
        error={error}
        onDataRefresh={handleDataRefresh}
      />
    </Sidebar>
  );
};

export default EmployeesPage;
