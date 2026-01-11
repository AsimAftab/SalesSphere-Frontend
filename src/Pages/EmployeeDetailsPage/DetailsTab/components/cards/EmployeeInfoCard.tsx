import React from 'react';

interface InfoItem {
  label: string;
  value: string | number;
}

interface EmployeeInfoCardProps {
  details: InfoItem[];
}

const EmployeeInfoCard: React.FC<EmployeeInfoCardProps> = ({ details }) => {
  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
        {details.map((item) => (
          <div key={item.label}>
            <p className="text-md text-gray-500">{item.label}</p>
            <p className="font-semibold text-gray-800 break-words">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeInfoCard;