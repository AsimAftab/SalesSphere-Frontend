import EmployeeTrackingCard from '../../components/cards/EmployeeTracking_cards/EmployeeTrackingCard';
import {
  FaUsers,
  FaPlayCircle,
  FaCheckCircle,
  FaHourglassHalf,
  FaHistory,
} from 'react-icons/fa';
import { type IconType } from 'react-icons/lib';
import type { ActiveSession } from '../../api/liveTrackingService';
import { Link } from 'react-router-dom';

type StatCardProps = {
  title: string;
  value: number;
  icon: IconType;
  iconBgColor: string;
  iconColor: string;
};

const StatCard = ({
  title,
  value,
  icon: Icon,
  iconBgColor,
  iconColor,
}: StatCardProps) => (
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
    completed: number; 
    pending: number; 
  } | null;
  sessions: ActiveSession[];
}

const getStatsCards = (stats: EmployeesViewProps['stats']) => [
  {
    title: 'Total Employees',
    value: stats?.totalEmployees ?? 0,
    icon: FaUsers,
    iconBgColor: 'bg-purple-100',
    iconColor: 'text-purple-500',
  },
  {
    title: 'Active Now',
    value: stats?.activeNow ?? 0,
    icon: FaPlayCircle,
    iconBgColor: 'bg-blue-100',
    iconColor: 'text-blue-500',
  },
  {
    title: 'Completed',
    value: stats?.completed ?? 0,
    icon: FaCheckCircle,
    iconBgColor: 'bg-green-100',
    iconColor: 'text-green-500',
  },
  {
    title: 'Pending',
    value: stats?.pending ?? 0,
    icon: FaHourglassHalf,
    iconBgColor: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
  },
];

const EmployeesView = ({ stats, sessions }: EmployeesViewProps) => {
  const activeCount = sessions.filter(
    (s) => s.beatPlan.status === 'active'
  ).length;
  const completedCount = sessions.filter(
    (s) => s.beatPlan.status === 'completed'
  ).length;
  const pendingCount = sessions.filter(
    (s) => !['active', 'completed'].includes(s.beatPlan.status)
  ).length;


  const displayStats = {
    totalEmployees: stats?.totalEmployees ?? 0,
    activeNow: activeCount,
    completed: completedCount, 
    pending: pendingCount, 
  };

  
  const statCards = getStatsCards(displayStats);

  const activeOrPendingSessions = sessions.filter(
    (session) => session.beatPlan.status !== 'completed'
  );

  return (
    <div className="flex flex-col gap-4">
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

      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold text-gray-700">Active Sessions</h2>
        <Link
          to="/tracking-history" 
          className="flex items-center gap-2 px-4 py-2 bg-white text-black border border-blue-200 rounded-lg shadow-sm hover:bg-secondary transition-colors hover:text-white"
        >
          <FaHistory size={14} />
          <span>View History</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeOrPendingSessions.map((session) => (
          <Link
            key={session.sessionId}
            to={`/live-tracking/session/${session.sessionId}`}
          >
            <EmployeeTrackingCard
              employee={{
                id: session.user._id,
                name: session.user.name,
                role: session.user.role,
                status:
                  session.beatPlan.status === 'active'
                    ? 'Active'
                    : session.beatPlan.status === 'completed'
                    ? 'Completed'
                    : 'Pending',
                checkIn: new Date(session.sessionStartedAt).toLocaleTimeString(),
                lastLocation:
                  session.currentLocation.address?.formattedAddress ||
                  'Location not available',
                beatPlanName: session.beatPlan.name,
                avatar: session.user.name.substring(0, 1).toUpperCase(),
                avatarColor: 'bg-blue-500',
                avatarUrl: session.user.avatarUrl,
              }}
            />
          </Link>
        ))}
      </div>

      {activeOrPendingSessions.length === 0 && (
        <div className="text-center col-span-full py-10">
          <p className="text-gray-500">
            No employees are actively tracking at the moment.
          </p>
        </div>
      )}
    </div>
  );
};

export default EmployeesView;