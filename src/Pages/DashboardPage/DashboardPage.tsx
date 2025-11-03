import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import DashboardContent from './DashboardContent';
import { getFullDashboardData } from '../../api/dashboardService';
import type { DashboardStats, TeamMemberPerformance, AttendanceSummary, SalesTrendData} from '../../api/dashboardService';

// --- MODIFIED: Added 'export' so this type can be imported by other components ---
export interface FullDashboardData {
  stats: DashboardStats;
  teamPerformance: TeamMemberPerformance[];
  attendanceSummary: AttendanceSummary;
  salesTrend: SalesTrendData[];
  //liveActivities: LiveActivity[];
}

// --- ADDED: A minimal type for the user object from localStorage ---
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

const DashboardPage: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<FullDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null); // <-- 1. ADD USER STATE

  // --- 2. ADD useEffect TO LOAD USER FROM LOCALSTORAGE ---
  useEffect(() => {
    // This runs once when the page loads
    const storedUser = localStorage.getItem('user');
    const storedSystemUser = localStorage.getItem('systemUser');

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else if (storedSystemUser) {
      setUser(JSON.parse(storedSystemUser));
    }
  }, []); // Empty array ensures this runs only once on mount

  // This useEffect fetches the dashboard data (unchanged)
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const data = await getFullDashboardData();
        setDashboardData(data);
      } catch (err) {
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  return (
     <Sidebar>
      <div className="flex flex-col flex-1 overflow-y-auto">
          {/* --- 3. PASS THE USERNAME PROP --- */}
          <DashboardContent 
            data={dashboardData} 
            loading={loading} 
            error={error} 
            userName={user?.name || 'Admin'} // <-- PASS USERNAME
          />
      </div>
    </Sidebar>
  );
};

export default DashboardPage;