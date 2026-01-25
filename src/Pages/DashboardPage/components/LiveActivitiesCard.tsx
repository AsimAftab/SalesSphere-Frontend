import React from 'react';
import { type LiveActivity, DashboardMapper } from '../../../api/dashboardService';
import { Link } from 'react-router-dom';
import { Wifi, MapPin } from 'lucide-react';
import InfoCard from '../../../components/UI/shared_cards/InfoCard';
import { EmptyState } from '../../../components/UI/EmptyState/EmptyState';

interface LiveActivitiesCardProps {
  data: LiveActivity[];
}

const LiveActivitiesCard: React.FC<LiveActivitiesCardProps> = ({ data }) => (
  <InfoCard
    title="Live Field Activities"
    action={
      <span className="flex items-center text-sm text-blue-600">
        <Wifi size={14} className="mr-1.5" />
        {data.length} Active
      </span>
    }
    footer={
      <Link
        to="/live-tracking"
        className="block w-full text-center text-sm font-medium text-secondary hover:text-blue-700 hover:underline transition-all"
      >
        View All Live Employees →
      </Link>
    }
  >
    {data.length === 0 ? (
      <EmptyState
        title="No Active Field Staff"
        description="There are currently no employees active on their Beats."
        icon={<MapPin className="w-10 h-10 text-blue-200" />}
      />
    ) : (
      <div className="space-y-4 overflow-y-auto pr-2 flex-1">
        {data.slice(0, 5).map((activity) => (
          <Link
            to={`/live-tracking/session/${activity.sessionId}`}
            key={activity.sessionId}
            className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-1/2 flex items-center gap-x-3 overflow-hidden">
              {activity.user.avatarUrl ? (
                <img
                  src={activity.user.avatarUrl}
                  alt={activity.user.name}
                  className="h-10 w-10 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-white font-semibold text-sm flex-shrink-0">
                  {/* CENTRALIZED INITIALS LOGIC */}
                  {DashboardMapper.getInitials(activity.user.name)}
                </span>
              )}

              <div className="overflow-hidden">
                <p className="text-sm font-bold text-gray-700 truncate">
                  {activity.user.name}
                </p>
                <p className="text-xs font-semibold text-gray-700 truncate">
                  {DashboardMapper.getDisplayRole(activity.user.role)}
                </p>
              </div>
            </div>

            <div className="w-1/2 flex-shrink-0 text-right">
              <p className="text-sm text-gray-700 truncate">
                <span className="font-medium text-gray-600">Beat:</span>{' '}
                {activity.beatPlan.name}
              </p>
            </div>
          </Link>
        ))}
      </div>
    )}
  </InfoCard>
);

export default LiveActivitiesCard;