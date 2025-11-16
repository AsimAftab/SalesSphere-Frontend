// src/pages/LiveTracking/EmployeesView.tsx
import EmployeeTrackingCard from '../../components/cards/EmployeeTracking_cards/EmployeeTrackingCard';
import {
  FaUsers,
  FaPlayCircle,
  FaPauseCircle,
  FaStopCircle,
} from 'react-icons/fa';
import { type IconType } from 'react-icons/lib';
import type { ActiveSession } from '../../api/liveTrackingService';
import { Link } from 'react-router-dom'; // 1. IMPORT Link

// (StatCardProps, StatCard component, EmployeesViewProps, and getStatsCards are unchanged)
type StatCardProps = {
  title: string;
  value: number;
  icon: IconType;
  iconBgColor: string;
  iconColor: string;
};

const StatCard = ({ title, value, icon: Icon, iconBgColor, iconColor }: StatCardProps) => (
  <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
    <div className="min-w-0 mr-2">
      <p className="text-sm text-gray-500 truncate">{title}</p>
      <p className="text-2xl md:text-3xl font-bold text-gray-800">{value}</p>
    </div>
    <div className={`p-2 md:p-3 rounded-lg ${iconBgColor} flex-shrink-0`}>
      <Icon className={`h-5 w-5 md:h-6 md:w-6 ${iconColor}`} />
    </div>
  </div>
);

interface EmployeesViewProps {
  stats: {
    totalEmployees: number;
    activeNow: number;
    idle: number;
    inactive: number;
  } | null;
  sessions: ActiveSession[];
}

const getStatsCards = (stats: EmployeesViewProps['stats']) => [
  {
    title: 'Total Employees',
    value: stats?.totalEmployees ?? 0,
    icon: FaUsers,
    iconBgColor: 'bg-blue-100',
    iconColor: 'text-blue-500',
  },
  {
    title: 'Active Now',
    value: stats?.activeNow ?? 0,
    icon: FaPlayCircle,
    iconBgColor: 'bg-green-100',
    iconColor: 'text-green-500',
  },
  {
    title: 'Idle',
    value: stats?.idle ?? 0,
    icon: FaPauseCircle,
    iconBgColor: 'bg-yellow-100',
    iconColor: 'text-yellow-500',
  },
  {
    title: 'Inactive',
    value: stats?.inactive ?? 0,
    icon: FaStopCircle,
    iconBgColor: 'bg-red-100',
    iconColor: 'text-red-500',
  },
];

const EmployeesView = ({ stats, sessions }: EmployeesViewProps) => {
  const statCards = getStatsCards(stats);

  return (
    <div className="flex flex-col gap-4">
      {/* (Stats Cards grid is unchanged) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {statCards.map((stat) => (
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sessions.map((session) => (
          <Link
            key={session.sessionId} 
            to={`/live-tracking/session/${session.sessionId}`}
          >
            <EmployeeTrackingCard
              employee={{
                id: session.user._id,
                name: session.user.name,
                role: session.user.role,
                status: 'Active',
                checkIn: new Date(session.sessionStartedAt).toLocaleTimeString(),
                lastLocation: session.currentLocation.address?.formattedAddress || 'Location not available', 
                beatPlanName: session.beatPlan.name, 
                avatar: session.user.name.substring(0, 2).toUpperCase(),
                avatarColor: 'bg-blue-500',
              }}
            />
          </Link>
        ))}
      </div>
      {/* --- END OF FIX --- */}

      {sessions.length === 0 && (
        <div className="text-center col-span-full py-10">
          <p className="text-gray-500">No employees are actively tracking at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default EmployeesView;