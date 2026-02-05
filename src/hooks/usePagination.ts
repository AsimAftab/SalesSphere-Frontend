import { useState, useCallback, useMemo } from 'react';

export interface UsePaginationOptions {
  /** Initial page number (1-indexed) */
  initialPage?: number;
  /** Initial items per page */
  initialPageSize?: number;
  /** Available page size options */
  pageSizeOptions?: number[];
}

export interface UsePaginationReturn<T> {
  /** Current page number (1-indexed) */
  currentPage: number;
  /** Set current page */
  setCurrentPage: (page: number) => void;
  /** Items per page */
  pageSize: number;
  /** Set items per page */
  setPageSize: (size: number) => void;
  /** Total number of pages */
  totalPages: number;
  /** Start index for current page (0-indexed) */
  startIndex: number;
  /** End index for current page (exclusive) */
  endIndex: number;
  /** Paginate an array of data */
  paginate: (data: T[]) => T[];
  /** Go to next page */
  nextPage: () => void;
  /** Go to previous page */
  prevPage: () => void;
  /** Go to first page */
  firstPage: () => void;
  /** Go to last page */
  lastPage: () => void;
  /** Whether there is a next page */
  hasNextPage: boolean;
  /** Whether there is a previous page */
  hasPrevPage: boolean;
  /** Page size options */
  pageSizeOptions: number[];
  /** Reset to first page (useful when filters change) */
  resetPage: () => void;
}

export function usePagination<T = unknown>(
  totalItems: number,
  options: UsePaginationOptions = {}
): UsePaginationReturn<T> {
  const {
    initialPage = 1,
    initialPageSize = 10,
    pageSizeOptions = [10, 25, 50, 100],
  } = options;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalItems / pageSize)),
    [totalItems, pageSize]
  );

  const startIndex = useMemo(
    () => (currentPage - 1) * pageSize,
    [currentPage, pageSize]
  );

  const endIndex = useMemo(
    () => Math.min(currentPage * pageSize, totalItems),
    [currentPage, pageSize, totalItems]
  );

  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  const handleSetCurrentPage = useCallback(
    (page: number) => {
      const validPage = Math.max(1, Math.min(page, totalPages));
      setCurrentPage(validPage);
    },
    [totalPages]
  );

  const handleSetPageSize = useCallback(
    (size: number) => {
      setPageSize(size);
      // Reset to page 1 when page size changes
      setCurrentPage(1);
    },
    []
  );

  const nextPage = useCallback(() => {
    if (hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [hasNextPage]);

  const prevPage = useCallback(() => {
    if (hasPrevPage) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [hasPrevPage]);

  const firstPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const lastPage = useCallback(() => {
    setCurrentPage(totalPages);
  }, [totalPages]);

  const resetPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const paginate = useCallback(
    (data: T[]): T[] => {
      return data.slice(startIndex, endIndex);
    },
    [startIndex, endIndex]
  );

  return {
    currentPage,
    setCurrentPage: handleSetCurrentPage,
    pageSize,
    setPageSize: handleSetPageSize,
    totalPages,
    startIndex,
    endIndex,
    paginate,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    hasNextPage,
    hasPrevPage,
    pageSizeOptions,
    resetPage,
  };
}

export default usePagination;
