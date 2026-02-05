import { useState, useCallback, useMemo } from 'react';

export interface UseSearchOptions<T> {
  /** Initial search term */
  initialSearchTerm?: string;
  /** Fields to search in (keys of T) */
  searchableFields: (keyof T)[];
  /** Whether search is case-sensitive */
  caseSensitive?: boolean;
  /** Minimum characters to start searching */
  minSearchLength?: number;
  /** Custom search function (overrides default behavior) */
  customSearchFn?: (item: T, searchTerm: string) => boolean;
}

export interface UseSearchReturn<T> {
  /** Current search term */
  searchTerm: string;
  /** Set search term */
  setSearchTerm: (term: string) => void;
  /** Filter data based on search term */
  filterData: (data: T[]) => T[];
  /** Filtered data (if data is passed initially) */
  filteredData: T[];
  /** Clear search term */
  clearSearch: () => void;
  /** Whether search is active (has term >= minLength) */
  isSearchActive: boolean;
}

export function useSearch<T extends Record<string, unknown>>(
  data: T[] = [],
  options: UseSearchOptions<T>
): UseSearchReturn<T> {
  const {
    initialSearchTerm = '',
    searchableFields,
    caseSensitive = false,
    minSearchLength = 1,
    customSearchFn,
  } = options;

  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

  const isSearchActive = searchTerm.length >= minSearchLength;

  const filterData = useCallback(
    (items: T[]): T[] => {
      if (!isSearchActive) {
        return items;
      }

      const normalizedTerm = caseSensitive
        ? searchTerm
        : searchTerm.toLowerCase();

      return items.filter((item) => {
        if (customSearchFn) {
          return customSearchFn(item, searchTerm);
        }

        return searchableFields.some((field) => {
          const value = item[field];
          if (value === null || value === undefined) {
            return false;
          }

          const stringValue = String(value);
          const normalizedValue = caseSensitive
            ? stringValue
            : stringValue.toLowerCase();

          return normalizedValue.includes(normalizedTerm);
        });
      });
    },
    [searchTerm, searchableFields, caseSensitive, customSearchFn, isSearchActive]
  );

  const filteredData = useMemo(() => filterData(data), [filterData, data]);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    filterData,
    filteredData,
    clearSearch,
    isSearchActive,
  };
}

// Simpler version for basic string search
export function useSimpleSearch<T>(
  data: T[],
  searchFn: (item: T, term: string) => boolean,
  initialTerm = ''
): {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredData: T[];
  clearSearch: () => void;
} {
  const [searchTerm, setSearchTerm] = useState(initialTerm);

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    return data.filter((item) => searchFn(item, searchTerm));
  }, [data, searchTerm, searchFn]);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    filteredData,
    clearSearch,
  };
}

export default useSearch;
