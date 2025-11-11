import React from 'react'; // 1. REMOVED: useState and useEffect
import { useQuery } from '@tanstack/react-query';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import DashboardContent from './DashboardContent';
import { getFullDashboardData } from '../../api/dashboardService';
import type { DashboardStats, TeamMemberPerformance, AttendanceSummary, SalesTrendData} from '../../api/dashboardService';
import { useAuth } from '../../hooks/useAuth'; // 2. IMPORTED: useAuth

export interface FullDashboardData {
  stats: DashboardStats;
  teamPerformance: TeamMemberPerformance[];
  attendanceSummary: AttendanceSummary;
  salesTrend: SalesTrendData[];
  //liveActivities: LiveActivity[];
}

// REMOVED: User interface (it's in useAuth)

const DASHBOARD_QUERY_KEY = ['dashboardData'];

const DashboardPage: React.FC = () => {
  // 3. GET user object from the useAuth hook
  const { user } = useAuth(); 

  // 4. Your useQuery logic (this is perfect)
  const { 
    data: dashboardData, 
    isLoading: loading,
    error 
  } = useQuery<FullDashboardData, Error>({
      queryKey: DASHBOARD_QUERY_KEY,
      queryFn: getFullDashboardData,
  });

  return (
     <Sidebar>
         <DashboardContent 
           data={dashboardData || null} 
           loading={loading} 
           error={error ? error.message : null}
           // 5. PASS the user's name from the hook
           userName={user?.name || 'User'} 
         />
     </Sidebar>
  );
};

export default DashboardPage;