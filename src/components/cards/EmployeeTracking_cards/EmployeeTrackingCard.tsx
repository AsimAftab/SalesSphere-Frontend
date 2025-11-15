// src/components/cards/EmployeeTracking_cards/EmployeeTrackingCard.tsx
import { Clock, MapPin, Route, AlertTriangle } from 'lucide-react';
// 1. REMOVED 'import { Link } from 'react-router-dom';'

// Define the type for the employee prop
// This should match the mock data structure in EmployeesView.tsx
type Employee = {
  id: string;
  name: string;
  role: string;
  status: 'Active' | 'Idle' | 'Inactive';
  checkIn: string;
  lastLocation: string;
  distance: number;
  avatar: string;
  avatarColor: string;
  idleTime?: string; // Optional
};

type EmployeeTrackingCardProps = {
  employee: Employee;
};

// Helper to get status colors
const getStatusClasses = (status: Employee['status']) => {
  switch (status) {
    case 'Active':
      return 'bg-green-100 text-green-700';
    case 'Idle':
      return 'bg-yellow-100 text-yellow-700';
    case 'Inactive':
      return 'bg-gray-100 text-gray-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

const EmployeeTrackingCard = ({ employee }: EmployeeTrackingCardProps) => {
  return (
    // 2. CHANGED Link to div
    <div
      className="block bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg shadow-md overflow-hidden  flex-col justify-between transition-all hover:shadow-lg"
    >
      <div>
        {/* Top Info Section */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center">
            <span
              className={`w-10 h-10 rounded-full ${employee.avatarColor} text-white flex items-center justify-center font-bold mr-3 shadow-sm`}
            >
              {employee.avatar}
            </span>
            <div>
              <h3 className="font-bold text-gray-800">{employee.name}</h3>
              <p className="text-xs text-gray-500">{employee.role}</p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span
              className={`px-3 py-0.5 rounded-full text-xs font-semibold ${getStatusClasses(
                employee.status
              )}`}
            >
              {employee.status}
            </span>
            {employee.status === 'Idle' && employee.idleTime && (
              <span className="mt-1.5 flex items-center text-xs px-2 py-0.5 bg-yellow-400 text-yellow-900 rounded-full font-medium">
                <AlertTriangle size={12} className="mr-1" />
                Idle {employee.idleTime}
              </span>
            )}
          </div>
        </div>

        {/* Map Background Placeholder */}
        <div className="relative h-24 bg-transparent overflow-hidden">
          {/* Wave SVG Background */}
          <svg
            className="absolute bottom-0 w-full h-full text-blue-100 opacity-50"
            fill="currentColor"
            viewBox="0 0 1440 320"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0,160L48,181.3C96,203,192,245,288,256C384,267,480,245,576,213.3C672,181,768,139,864,138.7C960,139,1056,181,1152,192C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>

          {/* Map Pin */}
          <div
            className={`
              absolute w-6 h-6 rounded-full border-4 shadow-lg
              flex items-center justify-center
              ${
                employee.status === 'Active'
                  ? 'bg-blue-500 border-blue-700'
                  : employee.status === 'Idle'
                  ? 'bg-yellow-500 border-yellow-700'
                  : 'bg-gray-400 border-gray-600'
              }
            `}
            style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
          >
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          </div>
        </div>

        {/* Bottom Details Section */}
        <div className="p-4 space-y-2 text-sm z-10 relative bg-white/30 backdrop-blur-sm">
          <div className="flex items-center text-gray-700">
            <Clock size={14} className="mr-2 text-gray-500" />
            <strong className="text-gray-800">Check in:</strong>
            <span className="ml-1">{employee.checkIn}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <MapPin size={14} className="mr-2 text-gray-500" />
            <span className="truncate">{employee.lastLocation}</span>
         </div>
          <div className="flex items-center text-gray-700">
            <Route size={14} className="mr-2 text-gray-500" />
            <strong className="text-gray-800">Distance:</strong>
           <span className="ml-1">{employee.distance} km</span>
          </div>
        </div>
      </div>

      <div
        className="block w-full text-center px-4 py-2 bg-gray-50/50 text-xs text-gray-500 font-medium"
      >
        Click to view detailed map →
      </div>
    </div>
  );
};

export default EmployeeTrackingCard;