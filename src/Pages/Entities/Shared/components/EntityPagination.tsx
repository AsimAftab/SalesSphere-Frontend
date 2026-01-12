import React from 'react';
import Pagination from '../../../../components/UI/Page/Pagination';

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
    <Pagination
      currentPage={current}
      totalItems={totalItems}
      itemsPerPage={itemsPerPage}
      onPageChange={onPageChange}
      className="mt-6 border-t border-gray-200 px-1"
    />
  );
};