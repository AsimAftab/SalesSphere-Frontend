import React from 'react';
import { Link } from 'react-router-dom';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string | React.ReactNode;
  iconBgColor: string;
  link?: string;
  className?: string; // Allow custom classes to be merged
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, iconBgColor, link, className = '' }) => {
  const baseClasses = `rounded-lg bg-white border-2 border-gray-100 shadow-sm relative transition-all duration-300 ease-in-out p-6 flex items-start justify-between h-full group ${className}`;
  const hoverClasses = link ? 'cursor-pointer hover:border-blue-500 hover:z-10' : '';

  const Content = (
    <>
      <div className="flex flex-col justify-between h-full space-y-2">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-pre-line">{title}</p>
        <p className="text-2xl font-bold text-gray-900">
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
    </>
  );

  if (link) {
    return (
      <Link to={link} className={`${baseClasses} ${hoverClasses}`}>
        {Content}
      </Link>
    );
  }

  return (
    <div className={baseClasses}>
      {Content}
    </div>
  );
};

export default StatCard;