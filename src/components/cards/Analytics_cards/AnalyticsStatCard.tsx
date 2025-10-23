import React from 'react';

interface AnalyticsStatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  iconBgColor: string;
}

const AnalyticsStatCard: React.FC<AnalyticsStatCardProps> = ({ title, value, icon, iconBgColor }) => {
  return (
    // --- CHANGED: Added justify-between to push items to opposite ends ---
    <div className="bg-white p-6 rounded-lg shadow-sm flex justify-between items-center">
      {/* Text block now comes first */}
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
      </div>
      {/* Icon block now comes second */}
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${iconBgColor}`}>
        {icon}
      </div>
    </div>
  );
};

export default AnalyticsStatCard;