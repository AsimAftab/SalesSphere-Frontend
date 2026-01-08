import React from 'react';
import { type TeamMemberPerformance, DashboardMapper } from '../../../api/dashboardService';
import { Users } from 'lucide-react';

interface TeamPerformanceCardProps {
  data: TeamMemberPerformance[];
}

const TeamPerformanceCard: React.FC<TeamPerformanceCardProps> = ({ data }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm h-full flex flex-col">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">
      Team Performance Today
    </h3>

    {(!data || data.length === 0) ? (
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6"> 
        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-blue-50 to-indigo-100 mb-5 shadow-inner">
          <Users size={32} className="text-blue-500" /> 
        </div>
        
        <p className="font-bold text-gray-800 text-lg"> 
          No Team Performance Data
        </p>
        <p className="text-sm text-gray-700 mt-2 max-w-xs"> 
          Currently, no sales or orders have been recorded by the team today.
        </p>
      </div>
    ) : (
      <div className="space-y-4 overflow-y-auto pr-2 flex-1">
        {data.map((member) => (
          <div
            key={member._id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-x-3">
              {member.avatarUrl ? (
                <img
                  src={member.avatarUrl}
                  alt={member.name}
                  className="h-10 w-10 rounded-full object-cover border border-gray-200"
                />
              ) : (
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">
                  {/* CENTRALIZED INITIALS LOGIC */}
                  {DashboardMapper.getInitials(member.name)}
                </span>
              )}

              <div>
                <p className="text-sm font-semibold text-gray-700">
                  {member.name}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {member.role}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <p className="text-sm font-bold text-green-600">
                {/* CENTRALIZED CURRENCY LOGIC */}
                {DashboardMapper.formatCurrency(member.sales)}
              </p>
              <p className="text-xs text-gray-500">{member.orders} orders</p>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default TeamPerformanceCard;