import React from 'react';
import { Pagination } from '@/components/ui';

interface EntityPaginationProps {
  current: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export const EntityPagination: React.FC<EntityPaginationProps> = ({
  current, totalItems, itemsPerPage, onPageChange
}) => {
  return (
    <div className="mt-4">
      <Pagination
        currentPage={current}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={onPageChange}
      />
    </div>
  );
};