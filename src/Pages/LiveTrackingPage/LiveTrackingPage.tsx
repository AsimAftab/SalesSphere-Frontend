import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import EmployeesView from './EmployeesView';
import TerritoryView from './TerritoryViewPage';
import { Users, MapPin } from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import Button from '../../components/UI/Button/Button';
import { getActiveTrackingData } from '../../api/liveTrackingService';
type View = 'employees' | 'territory';

const LiveTrackingPage = () => {
  const [activeView, setActiveView] = useState<View>('employees');

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['activeTrackingData'],
    queryFn: getActiveTrackingData,
    refetchInterval: 30000,
  });

  // 1. MAP THE STATS from the API to the new prop names
  const mappedStats = data?.stats
    ? {
        totalEmployees: data.stats.totalEmployees,
        activeNow: data.stats.activeNow,
        completed: data.stats.completed, 
        pending: data.stats.pending, 
      }
    : null;

  const sessions = data?.sessions ?? [];

  return (
    <Sidebar>
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

      <div>
        {isLoading && <p>Loading real-time data...</p>}
        {isError && (
          <p className="text-red-500">
            {error?.message || 'Failed to load live tracking data.'}
          </p>
        )}

        {!isLoading && !isError && activeView === 'employees' && (
          // 2. PASS THE NEW 'mappedStats' object
          <EmployeesView stats={mappedStats} sessions={sessions} />
        )}
        {!isLoading && !isError && activeView === 'territory' && (
          <TerritoryView />
        )}
      </div>
    </Sidebar>
  );
};

export default LiveTrackingPage;