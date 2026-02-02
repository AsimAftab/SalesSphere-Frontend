import React from 'react';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import EmployeeContent from './EmployeeContent';
import useEmployeeManager from './useEmployeeManager';
import ErrorBoundary from '../../components/ui/ErrorBoundary/ErrorBoundary';

const EmployeesPage: React.FC = () => {
  const { state, actions, helpers } = useEmployeeManager();

  return (
    <Sidebar>
      <ErrorBoundary>
        <EmployeeContent
          state={state}
          actions={actions}
          helpers={helpers}
        />
      </ErrorBoundary>
    </Sidebar>
  );
};

export default EmployeesPage;
