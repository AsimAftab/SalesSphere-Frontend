import React, { useRef } from 'react';
import { type LiveActivity, DashboardMapper } from '@/api/Dashboard';
import { Link } from 'react-router-dom';
import { ChevronRight, MapPin, Wifi } from 'lucide-react';
import { InfoCard, EmptyState } from '@/components/ui';

interface LiveActivitiesCardProps {
  data: LiveActivity[];
}

const LiveActivitiesCard: React.FC<LiveActivitiesCardProps> = ({ data }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <InfoCard
      title="Live Field Activities"
      action={
        <span className="flex items-center text-sm text-blue-600">
          <Wifi size={14} className="mr-1.5" />
          {data.length} Active
        </span>
      }
      scrollableRef={scrollRef}
      showScrollIndicator={data.length > 5}
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
        <div
          ref={scrollRef}
          className="space-y-4 flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] overflow-auto"
        >
          {data.map((activity) => (
          <Link
            to={`/live-tracking/session/${activity.sessionId}`}
            key={activity.sessionId}
            className="flex items-center py-3 px-3 rounded-lg hover:bg-blue-100 transition-all duration-300 group border-b border-gray-100 last:border-0 hover:shadow-sm hover:pl-4 cursor-pointer relative overflow-hidden"
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
                  {DashboardMapper.getInitials(activity.user.name)}
                </span>
              )}

              <div className="overflow-hidden">
                <p className="text-sm font-bold text-gray-700 truncate group-hover:text-blue-800 transition-colors">
                  {activity.user.name}
                </p>
                <p className="text-xs font-semibold text-gray-700 truncate">
                  {DashboardMapper.getDisplayRole(activity.user.role, activity.user.customRoleId?.name)}
                </p>
              </div>
            </div>

            <div className="flex-1 flex-shrink-0 text-right flex items-center justify-end gap-2">
              <p className="text-sm text-gray-700 truncate">
                <span className="font-medium text-gray-600">Beat:</span>{' '}
                {activity.beatPlan.name}
              </p>
              <ChevronRight className="w-4 h-4 text-blue-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out flex-shrink-0" />
            </div>
          </Link>
        ))}
        </div>
      )}
    </InfoCard>
  );
};

export default LiveActivitiesCard;