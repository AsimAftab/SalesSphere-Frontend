import EmployeeTrackingCard from '../../components/cards/EmployeeTracking_cards/EmployeeTrackingCard';
import { FaUsers, FaPlayCircle, FaPauseCircle, FaStopCircle } from "react-icons/fa";
// --- CORRECTED: Import 'type' for IconType ---
import { type IconType } from "react-icons/lib"; 

// Type definition for StatCard props
type StatCardProps = {
  title: string;
  value: number;
  icon: IconType;
  iconBgColor: string;
  iconColor: string;
};

// Type definition for an Employee
type Employee = {
  id: string;
  name: string;
  role: string;
  status: "Active" | "Inactive" | "Idle";
  checkIn: string;
  lastLocation: string;
  distance: number;
  avatar: string;
  avatarColor: string;
  idleTime?: string;
};

// Updated stats array with icon data
const employeeStats = [
  {
    title: 'Total Employees',
    value: 6,
    icon: FaUsers,
    iconBgColor: 'bg-blue-100',
    iconColor: 'text-blue-500',
  },
  {
    title: 'Active Now',
    value: 3,
    icon: FaPlayCircle,
    iconBgColor: 'bg-green-100',
    iconColor: 'text-green-500',
  },
  {
    title: 'Idle',
    value: 2,
    icon: FaPauseCircle,
    iconBgColor: 'bg-yellow-100',
    iconColor: 'text-yellow-500',
  },
  {
    title: 'Inactive',
    value: 1,
    icon: FaStopCircle,
    iconBgColor: 'bg-red-100',
    iconColor: 'text-red-500',
  },
];

// Typed employee mock data
const employees: Employee[] = [
  // ... your employee data remains the same ...
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'Sales Representative',
    status: 'Active',
    checkIn: '9:15 AM',
    lastLocation: 'Metro Mart Downtown',
    distance: 12.5,
    avatar: 'SJ',
    avatarColor: 'bg-blue-500',
  },
  {
    id: '2',
    name: 'Michael Chen',
    role: 'Field Manager',
    status: 'Idle',
    checkIn: '8:45 AM',
    lastLocation: 'Tech Plaza Office',
    distance: 8.2,
    avatar: 'MC',
    avatarColor: 'bg-yellow-500',
    idleTime: '41m',
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    role: 'Sales Representative',
    status: 'Active',
    checkIn: '9:30 AM',
    lastLocation: 'Central Business District',
    distance: 15.8,
    avatar: 'ER',
    avatarColor: 'bg-blue-500',
  },
  {
    id: '4',
    name: 'David Park',
    role: 'Territory Manager',
    status: 'Active',
    checkIn: '8:30 AM',
    lastLocation: 'Riverside Shopping Center',
    distance: 22.1,
    avatar: 'DP',
    avatarColor: 'bg-blue-500',
  },
  {
    id: '5',
    name: 'Jessica Williams',
    role: 'Sales Representative',
    status: 'Inactive',
    checkIn: '10:00 AM',
    lastLocation: 'Oakwood Industrial Park',
    distance: 5.1,
    avatar: 'JW',
    avatarColor: 'bg-gray-400',
  },
  {
    id: '6',
    name: 'Robert Taylor',
    role: 'Field Supervisor',
    status: 'Idle',
    checkIn: '8:00 AM',
    lastLocation: 'Gateway Business Hub',
    distance: 18.7,
    avatar: 'RT',
    avatarColor: 'bg-yellow-500',
    idleTime: '35m',
  },
];

// --- MODIFIED: StatCard is now responsive ---
const StatCard = ({ title, value, icon: Icon, iconBgColor, iconColor }: StatCardProps) => (
  // Use p-4, which is slightly smaller than p-5
  <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
    {/* Text Content: 
        - min-w-0 allows the div to shrink
        - mr-2 adds space between text and icon
    */}
    <div className="min-w-0 mr-2">
      {/* truncate adds "..." if the text is too long */}
      <p className="text-sm text-gray-500 truncate">{title}</p>
      {/* Responsive text size for the value */}
      <p className="text-2xl md:text-3xl font-bold text-gray-800">{value}</p>
    </div>
    
    {/* Icon:
        - flex-shrink-0 prevents the icon from shrinking
        - Responsive padding and icon size
    */}
    <div className={`p-2 md:p-3 rounded-lg ${iconBgColor} flex-shrink-0`}>
      <Icon className={`h-5 w-5 md:h-6 md:w-6 ${iconColor}`} />
    </div>
  </div>
);


const EmployeesView = () => {
  return (
    <div className="flex flex-col gap-4">
      {/* --- MODIFIED: Stats Cards grid --- */}
      {/* Now grid-cols-2 on mobile and grid-cols-4 on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {employeeStats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            iconBgColor={stat.iconBgColor}
            iconColor={stat.iconColor}
          />
        ))}
      </div>

      {/* --- MODIFIED: Employee Grid --- */}
      {/* Changed to 1 column on mobile, 2 on tablet, 3 on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map((employee) => (
          <EmployeeTrackingCard key={employee.id} employee={employee} />
        ))}
      </div>
    </div>
  );
};

export default EmployeesView;