// src/pages/Entities/shared/components/EntityPagination.tsx
import React from 'react';
import Button from '../../../../components/UI/Button/Button';

interface EntityPaginationProps {
  current: number;
  total: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export const EntityPagination: React.FC<EntityPaginationProps> = ({
  current, total, totalItems, itemsPerPage, onPageChange
}) => {
  if (total <= 1) return null;

  const start = (current - 1) * itemsPerPage + 1;
  const end = Math.min(current * itemsPerPage, totalItems);

  return (
    <div className="flex-shrink-0 flex items-center justify-between mt-6 text-sm text-gray-600 pt-4 border-t border-gray-200 px-1">
      <p>Showing {start} - {end} of {totalItems}</p>
      <div className="flex items-center gap-x-2">
        <Button 
          onClick={() => onPageChange(current - 1)} 
          disabled={current === 1}
          variant="secondary"
        >
          Previous
        </Button>
        <span className="font-semibold bg-gray-100 px-3 py-1.5 rounded-md">{current} / {total}</span>
        <Button 
          onClick={() => onPageChange(current + 1)} 
          disabled={current === total}
          variant="secondary"
        >
          Next
        </Button>
      </div>
    </div>
  );
};