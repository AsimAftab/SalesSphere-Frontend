import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Phone,
  MessageSquare,
  Clock,
  Route,
  MapPin,
  Coffee,
  Building,
} from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import Button from '../../components/UI/Button/Button';

// Mock data
const employeeData = {
  id: '1',
  name: 'Sarah Johnson',
  role: 'Sales Representative',
  avatar: 'SJ',
  avatarColor: 'bg-blue-500',
  status: 'Active',
  checkIn: '9:15 AM',
  distance: 12.5,
  locationsVisited: 4,
};

const routeHistory = [
  {
    time: '08:30 AM',
    title: 'Office - Start Point',
    icon: Building,
    color: 'text-green-500',
  },
  {
    time: '09:15 AM',
    title: 'First Client Visit - Acme Corp',
    icon: MapPin,
    color: 'text-blue-500',
  },
  {
    time: '10:45 AM',
    title: 'Coffee Break - Central Cafe',
    icon: Coffee,
    color: 'text-blue-500',
  },
  {
    time: '11:30 AM',
    title: 'Metro Mart Downtown',
    isCurrent: true,
    icon: MapPin,
    color: 'text-red-500',
  },
];

const EmployeeTrackingDetailsPage = () => {
  const employee = employeeData;

  return (
    <Sidebar>
      {/* --- MODIFIED: Use min-h-screen for better scrolling on mobile --- */}
      <div className="flex flex-col min-h-screen bg-gray-50">
        {/* Header Bar */}
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Left Side: Back Link & Employee Info */}
              <div className="flex items-center min-w-0"> {/* min-w-0 allows truncation */}
                <Link
                  to="/live-tracking"
                  className="text-gray-500 hover:text-gray-700 mr-3 md:mr-4 flex-shrink-0"
                >
                  <ArrowLeft size={20} />
                </Link>
                <span
                  className={`w-10 h-10 rounded-full ${employee.avatarColor} text-white flex items-center justify-center font-bold mr-3 flex-shrink-0`}
                >
                  {employee.avatar}
                </span>
                <div className="min-w-0"> {/* min-w-0 allows truncation */}
                  {/* --- MODIFIED: Added truncate class for long names --- */}
                  <h1 className="text-base md:text-lg font-bold text-gray-800 truncate">
                    {employee.name}
                  </h1>
                  <p className="text-xs text-green-500 font-semibold">
                    {employee.status}
                  </p>
                </div>
              </div>

              {/* Right Side: Actions */}
              <div className="flex items-center gap-2 md:gap-3">
                {/* --- MODIFIED: Responsive Button --- */}
                <Button variant="outline" className="!rounded-lg !px-3 !py-2 md:!px-4 !text-sm">
                  <Phone size={16} className="md:mr-1.5" />
                  <span className="hidden md:inline">Call</span>
                </Button>
                {/* --- MODIFIED: Responsive Button --- */}
                <Button variant="outline" className="!rounded-lg !px-3 !py-2 md:!px-4 !text-sm">
                  <MessageSquare size={16} className="md:mr-1.5" />
                   <span className="hidden md:inline">Message</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* --- MODIFIED: Main Content is now responsive --- */}
        {/* Stacks vertically on mobile (flex-col) and goes horizontal on large screens (lg:flex-row) */}
        <main className="flex-1 flex flex-col lg:flex-row p-4 lg:p-6 gap-6">
          {/* Left Side: Map */}
          {/* --- MODIFIED: Responsive height and flex behavior --- */}
          <div className="flex-1 relative bg-blue-50 rounded-lg overflow-hidden border border-gray-200 h-[400px] lg:h-auto">
            {/* Faint grid lines */}
            <div className="absolute inset-0 grid grid-rows-10">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="border-t border-blue-100/50"></div>
              ))}
            </div>
            
            {/* Mock Route */}
            <div className="absolute top-[80%] left-[20%] text-green-600 font-medium text-sm">
              Start Point
            </div>
            <div className="absolute top-[80%] left-[20%] w-3 h-3 bg-green-500 rounded-full"></div>
            <div className="absolute top-[60%] left-[35%] w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="absolute top-[50%] left-[50%] w-2 h-2 bg-blue-500 rounded-full"></div>
            
            {/* Current Location */}
            <div className="absolute top-[40%] left-[65%]">
              <div className="bg-white p-2 rounded-md shadow-lg text-center text-xs font-semibold">
                Current Location
                <p className="font-normal text-gray-600">Metro Mart Downtown</p>
              </div>
              <div className="relative w-6 h-6 mt-2 mx-auto">
                <div className="absolute inset-0 bg-red-500 rounded-full animate-ping"></div>
                <div className="relative w-6 h-6 rounded-full border-4 border-red-700 bg-red-500 flex items-center justify-center shadow-lg">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
            
            {/* Zoom Controls */}
            <div className="absolute bottom-4 right-4 flex flex-col gap-1">
              <Button
                variant="outline"
                className="!rounded-md !w-8 !h-8 !p-0 flex items-center justify-center !text-lg"
              >
                +
              </Button>
              <Button
                variant="outline"
                className="!rounded-md !w-8 !h-8 !p-0 flex items-center justify-center !text-lg"
              >
                -
              </Button>
            </div>
          </div>

          {/* Right Side: Sidebar */}
          <aside className="w-full lg:w-80 flex flex-col gap-6">
            {/* Quick Stats */}
            <div className="bg-white p-5 rounded-lg shadow">
              <h3 className="text-sm font-semibold text-gray-500 mb-4">
                Quick Stats
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                  <div className="flex items-center text-gray-700">
                    <Clock size={18} className="text-blue-500 mr-3" />
                    <div>
                      <span className="text-xs">Check in Time</span>
                      <p className="font-bold">{employee.checkIn}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Route size={18} className="text-blue-500 mr-3" />
                    <div>
                      <span className="text-xs">Distance Traveled</span>
                      <p className="font-bold">{employee.distance} km</p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <MapPin size={18} className="text-blue-500 mr-3" />
                    <div>
                      <span className="text-xs">Locations Visited</span>
                      <p className="font-bold">{employee.locationsVisited} today</p>
                    </div>
                  </div>
              </div>
            </div>

            {/* Route History */}
            <div className="bg-white p-5 rounded-lg shadow flex-1">
              <h3 className="text-sm font-semibold text-gray-500 mb-4">
                Route History
              </h3>
              <div className="relative pl-6">
                {/* Timeline line */}
                <div className="absolute left-3 top-1 bottom-1 w-0.5 bg-gray-200"></div>

                {routeHistory.map((item, index) => (
                  <div key={index} className="relative pb-6 last:pb-0"> {/* Added more padding */}
                    {/* --- MODIFIED: Timeline dot positioning --- */}
                    <div className="absolute top-1 -left-1.5 w-4 h-4 rounded-full bg-white border-4 border-gray-200">
                        <item.icon size={16} className={`absolute -top-2 -left-2 ${item.color}`} />
                    </div>

                     {/* --- MODIFIED: Highlight for current item --- */}
                     {item.isCurrent && (
                        <div className="absolute top-1 -left-1.5 w-4 h-4 rounded-full bg-red-100 border-4 border-red-200 animate-pulse"></div>
                     )}

                    <div className="pl-6">
                      <p className="text-xs text-gray-400">{item.time}</p>
                      <p className={`text-sm font-medium ${item.isCurrent ? 'text-red-600' : 'text-gray-700'}`}>
                        {item.title}
                      </p>
                      {item.isCurrent && (
                        <span className="text-xs font-bold text-red-600">
                          Current Location
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </main>
      </div>
    </Sidebar>
  );
};

export default EmployeeTrackingDetailsPage;