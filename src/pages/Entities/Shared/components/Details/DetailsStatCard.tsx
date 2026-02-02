import React from 'react';

interface DetailsStatCardProps {
  label: string;
  value: string | number;
  subtitle: string;
  color: 'yellow' | 'blue' | 'green';
  icon: React.ElementType;
}

export const DetailsStatCard: React.FC<DetailsStatCardProps> = ({ 
  label, value, subtitle, color, icon: Icon 
}) => {
  const colorMap = {
    yellow: { bg: 'bg-yellow-100', text: 'text-yellow-500', border: 'border-yellow-200' },
    blue: { bg: 'bg-blue-100', text: 'text-blue-500', border: 'border-blue-200' },
    green: { bg: 'bg-green-100', text: 'text-green-500', border: 'border-green-200' },
  };

  const theme = colorMap[color];

  return (
    /* h-full ensures it matches the height of the column/neighboring card */
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 flex justify-between items-center  min-h-[128px]">
      <div>
        <h3 className="text-xl font-bold text-gray-800 leading-tight">{label}</h3>
        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
      </div>
      <div className="flex items-center shrink-0">
        <span className={`text-4xl font-bold ${theme.text} mr-4`}>{value}</span>
        <div className={`p-3 ${theme.bg} rounded-xl border ${theme.border}`}>
          <Icon className={`h-7 w-7 ${theme.text}`} />
        </div>
      </div>
    </div>
  );
};