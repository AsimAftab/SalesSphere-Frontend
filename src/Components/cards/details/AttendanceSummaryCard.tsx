import React from 'react';

interface StatItem {
  value: number;
  label: string;
  color: string; // e.g., 'bg-green-500'
}

interface AttendanceSummaryCardProps {
  percentage: number;
  stats: StatItem[];
}

const AttendanceSummaryCard: React.FC<AttendanceSummaryCardProps> = ({ percentage, stats }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Attendance Summary</h3>
      <div className="text-center mb-4">
        <p className="text-4xl font-bold text-blue-600">{percentage}%</p>
        <p className="text-sm text-gray-500">Attendance Ratio</p>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div
          className="bg-blue-600 h-2 rounded-full"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      {/* Stats */}
      <div className="flex justify-around text-center">
        {stats.map((stat) => (
          <div key={stat.label}>
            <p className="text-xl font-bold text-gray-800">{stat.value}</p>
            <div className="flex items-center justify-center gap-1.5 mt-1">
              <span className={`h-2 w-2 rounded-full ${stat.color}`}></span>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendanceSummaryCard;