// src/pages/Entities/Shared/components/details/DetailsHeader.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Button from '../../../../../components/ui/Button/Button';

interface Action {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
  icon?: React.ReactNode;
}

interface DetailsHeaderProps {
  title: string;
  backPath: string;
  actions: Action[];
}

export const DetailsHeader: React.FC<DetailsHeaderProps> = ({ title, backPath, actions }) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
    <div className="flex items-center gap-4">
      <Link to={backPath} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
        <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
      </Link>
      <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
    </div>
    <div className="flex flex-col md:flex-row gap-2 md:gap-4">
      {actions.map((action, idx) => (
        <Button 
          key={idx} 
          variant={action.variant || 'primary'} 
          onClick={action.onClick} 
          className={action.className}
        >
          {action.icon}
          {action.label}
        </Button>
      ))}
    </div>
  </div>
);