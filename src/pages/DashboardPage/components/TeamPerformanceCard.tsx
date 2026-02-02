import React from 'react';
import { type TeamMemberPerformance, DashboardMapper } from '@/api/dashboard';
import { Users } from 'lucide-react';
import { InfoCard, EmptyState } from '@/components/ui';

interface TeamPerformanceCardProps {
  data: TeamMemberPerformance[];
}

const TeamPerformanceCard: React.FC<TeamPerformanceCardProps> = ({ data }) => (
  <InfoCard title="Team Performance Today">
    {(!data || data.length === 0) ? (
      <EmptyState
        title="No Team Performance Data"
        description="Currently, no sales or orders have been recorded by the team today."
        icon={<Users className="w-10 h-10 text-blue-200" />}
      />
    ) : (
      <div className="space-y-4 overflow-y-auto pr-2 flex-1">
        {data.map((member, index) => (
          <div
            key={member.userId || index}
            className="flex items-center gap-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {member.avatarUrl ? (
              <img
                src={member.avatarUrl}
                alt={member.name}
                className="h-10 w-10 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-white font-semibold text-sm flex-shrink-0">
                {DashboardMapper.getInitials(member.name)}
              </span>
            )}

            <div className="flex-1 min-w-0 overflow-hidden">
              <p className="text-sm font-bold text-gray-700 truncate">
                {member.name}
              </p>
              <p className="text-xs font-semibold text-gray-700 truncate">
                {DashboardMapper.getDisplayRole(member.role, member.customRole)}
              </p>
            </div>

            <div className="flex flex-col items-end flex-shrink-0 pl-3">
              <p className="text-sm font-bold text-green-600 whitespace-nowrap">
                {DashboardMapper.formatCurrency(member.sales)}
              </p>
              <p className="text-xs text-gray-500 whitespace-nowrap">{member.orders} orders</p>
            </div>
          </div>
        ))}
      </div>
    )}
  </InfoCard >
);

export default TeamPerformanceCard;
