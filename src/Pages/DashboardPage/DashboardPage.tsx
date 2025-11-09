import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query'; // 1. IMPORTED useQuery
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import DashboardContent from './DashboardContent';
import { getFullDashboardData } from '../../api/dashboardService';
import type { DashboardStats, TeamMemberPerformance, AttendanceSummary, SalesTrendData} from '../../api/dashboardService';

export interface FullDashboardData {
  stats: DashboardStats;
  teamPerformance: TeamMemberPerformance[];
  attendanceSummary: AttendanceSummary;
  salesTrend: SalesTrendData[];
  //liveActivities: LiveActivity[];
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

// 2. ADDED a query key for TanStack Query
const DASHBOARD_QUERY_KEY = ['dashboardData'];

const DashboardPage: React.FC = () => {
  // 3. REMOVED data, loading, and error states
  
  // This state for the user is fine, as it's from localStorage (client-side)
  const [user, setUser] = useState<User | null>(null); 

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedSystemUser = localStorage.getItem('systemUser');

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else if (storedSystemUser) {
      setUser(JSON.parse(storedSystemUser));
    }
  }, []);

  // 4. REPLACED the data-fetching useEffect with useQuery
  const { 
    data: dashboardData, 
    isLoading: loading, // Renamed isLoading to 'loading' to match your prop
    error 
  } = useQuery<FullDashboardData, Error>({
      queryKey: DASHBOARD_QUERY_KEY,
      queryFn: getFullDashboardData,
  });

  return (
     <Sidebar>
       <div className="flex flex-col flex-1 overflow-y-auto">
         {/* 5. PASS props from useQuery directly to the content component */}
         <DashboardContent 
           data={dashboardData || null} 
           loading={loading} 
           error={error ? error.message : null} // Pass the error message
           userName={user?.name || 'Admin'}
         />
       </div>
     </Sidebar>
  );
};

export default DashboardPage;