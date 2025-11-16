import React from 'react';
import { type LiveActivity } from '../../../api/dashboardService';
import { Link } from 'react-router-dom';
import { Wifi, MapPin } from 'lucide-react';

interface LiveActivitiesCardProps {
  data: LiveActivity[];
}

const getInitials = (name: string) => {
  return name ? name.substring(0, 1).toUpperCase() : '';
};

const LiveActivitiesCard: React.FC<LiveActivitiesCardProps> = ({ data }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm h-full flex flex-col">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold text-gray-800">
        Live Field Activities
      </h3>
      <span className="flex items-center text-sm text-blue-600">
        <Wifi size={14} className="mr-1.5" />
        {data.length} Active
      </span>
    </div>

    {data.length === 0 ? (
      <div className="flex-1 flex flex-col items-center justify-center text-center text-blue-400">
        <MapPin size={48} className="mb-3" />
        <p className="text-semi-bold text-gray-800">No Active Employees</p>
        <p className="text-sm text-gray-700">No one is currently on their Beat.</p>
      </div>
    ) : (
      <div className="space-y-4 overflow-y-auto pr-2 flex-1">
        {data.slice(0, 3).map((activity) => (
          <Link
            to={`/live-tracking/session/${activity.sessionId}`}
            key={activity.sessionId}
            // 1. REMOVED justify-between
            className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {/* 2. ADDED fixed width (w-1/2) */}
            <div className="w-1/2 flex items-center gap-x-3 overflow-hidden">
              {activity.user.avatarUrl ? (
                <img
                  src={activity.user.avatarUrl}
                  alt={activity.user.name}
                  className="h-10 w-10 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-white font-semibold text-sm flex-shrink-0">
                  {getInitials(activity.user.name)}
                </span>
              )}

              <div className="overflow-hidden">
                <p className="text-sm font-bold text-gray-700 truncate">
                  {activity.user.name}
                </p>
                {/* Fixed 'font-semi-bold' to 'font-semibold' and added 'capitalize' */}
                <p className="text-xs font-semibold text-gray-700 truncate capitalize">
                  {activity.user.role}
                </p>
              </div>
            </div>

            {/* 3. ADDED fixed width (w-1/2) and text-right */}
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

    <div className="mt-4 pt-4 border-t border-gray-100">
      <Link
        to="/live-tracking"
        className="block w-full text-center text-sm font-medium text-secondary hover:text-secondary"
      >
        View All Live Employees →
      </Link>
    </div>
  </div>
);

export default LiveActivitiesCard;