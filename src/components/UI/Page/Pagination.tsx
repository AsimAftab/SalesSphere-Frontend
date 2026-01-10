import React from 'react';
import Button from '../Button/Button';

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
        <div className={`flex items-center justify-between p-6 text-sm text-gray-500 ${className}`}>
            <p className="hidden sm:block">
                Showing {startIndex + 1} to {endIndex} of {totalItems} entries
            </p>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
                <Button
                    onClick={() => onPageChange(currentPage - 1)}
                    variant="secondary"
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-xs"
                >
                    Previous
                </Button>
                <span className="px-4 font-bold text-gray-900 text-xs">
                    {currentPage} / {totalPages}
                </span>
                <Button
                    onClick={() => onPageChange(currentPage + 1)}
                    variant="secondary"
                    disabled={currentPage >= totalPages}
                    className="px-3 py-1 text-xs"
                >
                    Next
                </Button>
            </div>
        </div>
    );
};

export default Pagination;
