import { useState } from 'react';
import EmployeesView from './EmployeesView';
import TerritoryView from './TerritoryView';
import { Users, MapPin } from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import Button from '../../components/UI/Button/Button';

type View = 'employees' | 'territory';

const LiveTrackingPage = () => {
  const [activeView, setActiveView] = useState<View>('employees');

  return (
    <Sidebar>
        {/* --- MODIFIED: Header with responsive text size --- */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-black">Live Tracking</h1>
          <p className="text-gray-500">
            Monitor your team and territory in real-time
          </p>
        </div>

        {/* --- MODIFIED: Tab Navigation is now responsive --- */}
        {/* It stacks vertically on mobile (flex-col) and goes horizontal on medium screens and up (md:flex-row) */}
        <div className="flex flex-col md:flex-row mb-4">
          <Button
            onClick={() => setActiveView('employees')}
            variant={activeView === 'employees' ? 'primary' : 'outline'}
            // --- MODIFIED: Responsive classes for width and margin ---
            className="!rounded-lg !px-6 !py-2 w-full md:w-auto mb-2 md:mb-0 md:mr-2"
          >
            <Users size={18} className="mr-2" />
            Employees Tracking
          </Button>
          <Button
            onClick={() => setActiveView('territory')}
            variant={activeView === 'territory' ? 'primary' : 'outline'}
             // --- MODIFIED: Responsive classes for width ---
            className="!rounded-lg !px-6 !py-2 w-full md:w-auto"
          >
            <MapPin size={18} className="mr-2" />
            Territory View
          </Button>
        </div>

        {/* Content Area (No changes needed here as child components are already responsive) */}
        <div>
          {activeView === 'employees' && <EmployeesView />}
          {activeView === 'territory' && <TerritoryView />}
        </div>
    </Sidebar>
  );
};

export default LiveTrackingPage;