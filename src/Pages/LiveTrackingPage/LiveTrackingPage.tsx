// src/pages/LiveTracking/LiveTrackingPage.tsx
import { useState, useEffect } from 'react';
import EmployeesView from './EmployeesView'; // 1. FIXED: Default import
import TerritoryView from './TerritoryViewPage'; // 2. FIXED: Default import
import { Users, MapPin } from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import Button from '../../components/UI/Button/Button';
// --- 3. FIXED: Split value and type imports ---
import { getActiveTrackingData } from '../../api/liveTrackingService';
import type { ActiveSession } from '../../api/liveTrackingService';

type View = 'employees' | 'territory';

interface DerivedStats {
  totalEmployees: number;
  activeNow: number;
  idle: number;
  inactive: number;
}

const LiveTrackingPage = () => {
  const [activeView, setActiveView] = useState<View>('employees');
  const [stats, setStats] = useState<DerivedStats | null>(null);
  const [sessions, setSessions] = useState<ActiveSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const { stats, sessions } = await getActiveTrackingData();
        setStats(stats);
        setSessions(sessions);
        setError(null);
      } catch (err) {
        setError('Failed to load live tracking data.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
    const intervalId = setInterval(loadData, 30000); // Auto-refresh
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Sidebar>
      {/* (Header and tab navigation is unchanged) */}
      <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-start">
        <div className="mb-4 md:mb-0">
          <h1 className="text-2xl md:text-3xl font-bold text-black">
            {activeView === 'employees' ? 'Live Tracking' : 'Territory View'}
          </h1>
          <p className="text-gray-500">
            {activeView === 'employees'
              ? 'Monitor your Team in Real-time'
              : 'Monitor Locations in Real-time'}
          </p>
        </div>
        <div className="flex flex-col md:flex-row">
          <Button
            onClick={() => setActiveView('employees')}
            variant={activeView === 'employees' ? 'primary' : 'outline'}
            className="!rounded-lg !px-6 !py-2 w-full md:w-auto mb-2 md:mb-0 md:mr-2"
          >
            <Users size={18} className="mr-2" />
            Employees Tracking
          </Button>
          <Button
            onClick={() => setActiveView('territory')}
            variant={activeView === 'territory' ? 'primary' : 'outline'}
            className="!rounded-lg !px-6 !py-2 w-full md:w-auto"
          >
            <MapPin size={18} className="mr-2" />
            Territory View
          </Button>
        </div>
      </div>

      {/* (Content Area is unchanged) */}
      <div>
        {isLoading && <p>Loading real-time data...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!isLoading && !error && activeView === 'employees' && (
          <EmployeesView stats={stats} sessions={sessions} />
        )}
        {!isLoading && !error && activeView === 'territory' && (
          <TerritoryView />
        )}
      </div>
    </Sidebar>
  );
};

export default LiveTrackingPage;