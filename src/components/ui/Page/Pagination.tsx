import React from 'react';
import { Button } from '@/components/ui';

interface PaginationProps {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalItems,
    itemsPerPage,
    onPageChange,
    className = ""
}) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (totalItems <= itemsPerPage) return null;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 py-4 px-2 sm:px-4 text-sm text-gray-500 ${className}`}>
            <p className="text-xs sm:text-sm whitespace-nowrap text-gray-600">
                Showing {startIndex + 1}-{endIndex} of {totalItems}
            </p>
            <div className="flex items-center gap-2">
                {currentPage > 1 && (
                    <Button
                        onClick={() => onPageChange(currentPage - 1)}
                        variant="secondary"
                        className="px-3 sm:px-4 py-1.5 text-xs font-medium"
                    >
                        Previous
                    </Button>
                )}
                <span className="px-3 font-bold text-gray-900 text-xs sm:text-sm">
                    {currentPage} / {totalPages}
                </span>
                {currentPage < totalPages && (
                    <Button
                        onClick={() => onPageChange(currentPage + 1)}
                        variant="secondary"
                        className="px-3 sm:px-4 py-1.5 text-xs font-medium"
                    >
                        Next
                    </Button>
                )}
            </div>
        </div>
    );
};

export default Pagination;
