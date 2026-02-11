import { useState, useCallback, useMemo } from 'react';

export type FilterValue = string | number | boolean | string[] | null | undefined;

export interface FilterConfig<T> {
  /** Filter key (matches data property) */
  key: keyof T;
  /** Filter type */
  type: 'exact' | 'includes' | 'range' | 'dateRange' | 'custom';
  /** Custom filter function */
  customFn?: (item: T, value: FilterValue) => boolean;
}

export interface UseFilterOptions<T> {
  /** Filter configurations */
  filters: FilterConfig<T>[];
  /** Initial filter values */
  initialValues?: Record<string, FilterValue>;
}

export interface UseFilterReturn<T> {
  /** Current filter values */
  filterValues: Record<string, FilterValue>;
  /** Set a single filter value */
  setFilter: (key: string, value: FilterValue) => void;
  /** Set multiple filter values */
  setFilters: (values: Record<string, FilterValue>) => void;
  /** Clear a single filter */
  clearFilter: (key: string) => void;
  /** Clear all filters */
  clearAllFilters: () => void;
  /** Filter data based on current values */
  filterData: (data: T[]) => T[];
  /** Filtered data */
  filteredData: T[];
  /** Whether any filter is active */
  hasActiveFilters: boolean;
  /** Number of active filters */
  activeFilterCount: number;
  /** Whether filter panel is visible */
  isFilterVisible: boolean;
  /** Toggle filter panel visibility */
  toggleFilterVisibility: () => void;
  /** Set filter panel visibility */
  setFilterVisible: (visible: boolean) => void;
}

export function useFilter<T extends Record<string, unknown>>(
  data: T[] = [],
  options: UseFilterOptions<T>
): UseFilterReturn<T> {
  const { filters, initialValues = {} } = options;

  const [filterValues, setFilterValues] = useState<Record<string, FilterValue>>(
    initialValues
  );
  const [isFilterVisible, setFilterVisible] = useState(false);

  const setFilter = useCallback((key: string, value: FilterValue) => {
    setFilterValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const setFilters = useCallback((values: Record<string, FilterValue>) => {
    setFilterValues((prev) => ({
      ...prev,
      ...values,
    }));
  }, []);

  const clearFilter = useCallback((key: string) => {
    setFilterValues((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilterValues({});
  }, []);

  const toggleFilterVisibility = useCallback(() => {
    setFilterVisible((prev) => !prev);
  }, []);

  const hasActiveFilters = useMemo(() => {
    return Object.values(filterValues).some(
      (v) => v !== null && v !== undefined && v !== '' && !(Array.isArray(v) && v.length === 0)
    );
  }, [filterValues]);

  const activeFilterCount = useMemo(() => {
    return Object.values(filterValues).filter(
      (v) => v !== null && v !== undefined && v !== '' && !(Array.isArray(v) && v.length === 0)
    ).length;
  }, [filterValues]);

  const filterData = useCallback(
    (items: T[]): T[] => {
      if (!hasActiveFilters) {
        return items;
      }

      return items.filter((item) => {
        return filters.every((config) => {
          const filterValue = filterValues[config.key as string];

          // Skip if no filter value
          if (
            filterValue === null ||
            filterValue === undefined ||
            filterValue === '' ||
            (Array.isArray(filterValue) && filterValue.length === 0)
          ) {
            return true;
          }

          const itemValue = item[config.key];

          // Handle custom filter
          if (config.type === 'custom' && config.customFn) {
            return config.customFn(item, filterValue);
          }

          // Handle exact match
          if (config.type === 'exact') {
            return itemValue === filterValue;
          }

          // Handle includes (for arrays or string contains)
          if (config.type === 'includes') {
            if (Array.isArray(filterValue)) {
              return filterValue.includes(itemValue as string);
            }
            if (typeof itemValue === 'string' && typeof filterValue === 'string') {
              return itemValue.toLowerCase().includes(filterValue.toLowerCase());
            }
            return false;
          }

          // Handle range (for numbers)
          if (config.type === 'range') {
            if (Array.isArray(filterValue) && filterValue.length === 2) {
              const [min, max] = filterValue as unknown as [number, number];
              const numValue = Number(itemValue);
              if (min !== null && numValue < min) return false;
              if (max !== null && numValue > max) return false;
            }
            return true;
          }

          // Handle date range
          if (config.type === 'dateRange') {
            if (Array.isArray(filterValue) && filterValue.length === 2) {
              const [startDate, endDate] = filterValue as [string, string];
              const itemDate = new Date(itemValue as string);
              if (startDate && itemDate < new Date(startDate)) return false;
              if (endDate && itemDate > new Date(endDate)) return false;
            }
            return true;
          }

          return true;
        });
      });
    },
    [filters, filterValues, hasActiveFilters]
  );

  const filteredData = useMemo(() => filterData(data), [filterData, data]);

  return {
    filterValues,
    setFilter,
    setFilters,
    clearFilter,
    clearAllFilters,
    filterData,
    filteredData,
    hasActiveFilters,
    activeFilterCount,
    isFilterVisible,
    toggleFilterVisibility,
    setFilterVisible,
  };
}

export default useFilter;
