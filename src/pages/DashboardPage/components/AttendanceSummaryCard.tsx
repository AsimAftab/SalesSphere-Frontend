import React from 'react';
import { type AttendanceSummary, DashboardMapper } from '@/api/dashboard';
import { InfoCard } from '@/components/ui';

interface AttendanceSummaryCardProps {
  data: AttendanceSummary;
}

const AttendanceSummaryCard: React.FC<AttendanceSummaryCardProps> = ({ data }) => {
  const summary = data || DashboardMapper.INITIAL_ATTENDANCE;
  const rate = summary.attendanceRate;

  const pctColor = rate >= 90 ? 'text-emerald-600' : rate >= 75 ? 'text-blue-600' : rate >= 50 ? 'text-amber-600' : 'text-red-600';
  const barColor = rate >= 90 ? 'bg-emerald-500' : rate >= 75 ? 'bg-blue-500' : rate >= 50 ? 'bg-amber-500' : 'bg-red-500';
  const badgeLabel = rate >= 90 ? 'Excellent' : rate >= 75 ? 'Good' : rate >= 50 ? 'Average' : 'Low';
  const badgeBg = rate >= 90 ? 'bg-emerald-50 text-emerald-700' : rate >= 75 ? 'bg-blue-50 text-blue-700' : rate >= 50 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700';

  const stats = [
    { label: 'Present', value: summary.present, color: 'bg-green-500' },
    { label: 'Half Day', value: summary.halfDay, color: 'bg-purple-500' },
    { label: 'Absent', value: summary.absent, color: 'bg-red-500' },
    { label: 'On Leave', value: summary.onLeave, color: 'bg-yellow-500' },
    { label: 'Weekly Off', value: summary.weeklyOff, color: 'bg-blue-500' },
  ];

  return (
    <InfoCard title="Attendance Summary">
      <div className="flex flex-col h-full">
        {/* Percentage + Bar */}
        <div className="mb-4">
          <div className="flex items-end justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <span className={`text-2xl font-bold leading-none ${pctColor}`}>{DashboardMapper.formatRate(rate)}</span>
              {rate > 0 && <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${badgeBg}`}>{badgeLabel}</span>}
            </div>
            <span className="text-xs font-semibold text-gray-800">{summary.teamStrength} Team Members</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5">
            <div
              className={`${barColor} h-2.5 rounded-full transition-all duration-500`}
              style={{ width: `${rate}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-0.5 flex-1 border-t border-gray-100 pt-3">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${stat.color} flex-shrink-0`} />
                <span className="text-sm text-gray-600">{stat.label}</span>
              </div>
              <span className="text-sm font-bold text-gray-800">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>
    </InfoCard>
  );
};

export default AttendanceSummaryCard;
