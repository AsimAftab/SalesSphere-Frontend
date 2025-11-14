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
      {/* --- MODIFIED: New container to align header and buttons on the same line --- */}
      {/* Use flex and justify-between to push the buttons to the right */}
      <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-start">

        {/* Header with responsive text size - Dynamic based on active view */}
        <div className="mb-4 md:mb-0">
          <h1 className="text-2xl md:text-3xl font-bold text-black">
            {activeView === 'employees' ? 'Live Tracking' : 'Territory View'}
          </h1>
          <p className="text-gray-500">
            {activeView === 'employees'
              ? 'Monitor your team in real-time'
              : 'Monitor your team and territory in real-time'}
          </p>
        </div>

        {/* Tab Navigation is now responsive and moved to the right using the parent flex container */}
        <div className="flex flex-col md:flex-row">
          <Button
            onClick={() => setActiveView('employees')}
            variant={activeView === 'employees' ? 'primary' : 'outline'}
            // Responsive classes for width and margin
            className="!rounded-lg !px-6 !py-2 w-full md:w-auto mb-2 md:mb-0 md:mr-2"
          >
            <Users size={18} className="mr-2" />
            Employees Tracking
          </Button>
          <Button
            onClick={() => setActiveView('territory')}
            variant={activeView === 'territory' ? 'primary' : 'outline'}
            // Responsive classes for width
            className="!rounded-lg !px-6 !py-2 w-full md:w-auto"
          >
            <MapPin size={18} className="mr-2" />
            Territory View
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <div>
        {activeView === 'employees' && <EmployeesView />}
        {activeView === 'territory' && <TerritoryView />}
      </div>
    </Sidebar>
  );
};

export default LiveTrackingPage;