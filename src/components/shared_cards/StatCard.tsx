import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string | React.ReactNode;
  iconBgColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, iconBgColor }) => {
  return (
    <div className={`bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 flex items-start justify-between h-full group hover:-translate-y-1`}>
      <div className="flex flex-col justify-between h-full space-y-2">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{title}</p>
        <p className="text-2xl font-bold text-gray-900">
          {/* Ensure value defaults to 0 if null/undefined is passed */}
          {value !== undefined && value !== null ? value : 0}
        </p>
      </div>
      <div className={`rounded-full p-3 flex-shrink-0 ${iconBgColor} group-hover:scale-110 transition-transform duration-300`}>
        {typeof icon === 'string' ? (
          <img src={icon} alt={title} className="h-6 w-6 object-contain" />
        ) : (
          icon
        )}
      </div>
    </div>
  );
};

export default StatCard;