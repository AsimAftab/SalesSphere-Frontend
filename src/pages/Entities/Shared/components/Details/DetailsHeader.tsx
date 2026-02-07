// src/pages/Entities/Shared/components/details/DetailsHeader.tsx
import React from 'react';
import { Button, DetailPageHeader } from '@/components/ui';

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
  <DetailPageHeader
    title={title}
    backPath={backPath}
    backLabel={`Back to ${title.replace(' Details', 's')}`}
    actions={
      <>
        {actions.map((action, idx) => (
          <Button
            key={idx}
            variant={action.variant || 'primary'}
            onClick={action.onClick}
            className={`w-full sm:w-auto h-11 px-6 font-bold shadow-sm ${action.className || ''}`}
          >
            {action.icon}
            {action.label}
          </Button>
        ))}
      </>
    }
  />
);