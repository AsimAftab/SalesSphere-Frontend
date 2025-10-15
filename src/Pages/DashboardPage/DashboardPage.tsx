import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import Header from '../../components/layout/Header/Header';
import DashboardContent from '../../components/DashboardContent';
import { getFullDashboardData } from '../../api/dashboardService';
import type { DashboardStats, TeamMemberPerformance, AttendanceSummary, SalesTrendData} from '../../api/dashboardService';

// --- MODIFIED: Added 'export' so this type can be imported by other components ---
export interface FullDashboardData {
  stats: DashboardStats;
  teamPerformance: TeamMemberPerformance[];
  attendanceSummary: AttendanceSummary;
  salesTrend: SalesTrendData;
  //liveActivities: LiveActivity[];
}

const DashboardPage: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<FullDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-y-auto">
        <Header />
        <main className="p-4 lg:p-6">
          <DashboardContent data={dashboardData} loading={loading} error={error} />
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;