import { useState, useMemo, useEffect } from 'react';

interface EntityWithId {
  id: string;
  [key: string]: any;
}

export function useEntityManager<T extends EntityWithId>(
  data: T[] | null,
  searchFields: (keyof T)[]
) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({
    category: [],
    brands: [],
    createdBy: []
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Reset pagination when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeFilters]);

  // ✅ Reactive Filter Engine
  const filteredData = useMemo(() => {
    // Return empty array only if data is null or undefined
    if (!data || !Array.isArray(data)) return [];

    return data.filter((item) => {
      // 1. Search Logic
      const matchesSearch = searchFields.length === 0 || searchFields.some((field) => {
        const value = item[field];
        return String(value || '').toLowerCase().includes(searchTerm.toLowerCase());
      });

      if (!matchesSearch) return false;

      // 2. Dynamic Filter Logic
      return Object.entries(activeFilters).every(([key, selectedValues]) => {
        if (!selectedValues || selectedValues.length === 0) return true;

        const isInterestFilter = key === 'category' || key === 'brands';
        const itemValue = isInterestFilter ? item.interest : item[key];

        if (selectedValues.includes('Not Specified') || selectedValues.includes('None')) {
          if (!itemValue || (Array.isArray(itemValue) && itemValue.length === 0)) return true;
        }

        if (Array.isArray(itemValue)) {
          return itemValue.some(val => {
            if (key === 'category') return selectedValues.includes(val.category);
            if (key === 'brands') return val.brands?.some((b: string) => selectedValues.includes(b));
            return selectedValues.includes(val?.name || val);
          });
        }

        const normalizedValue = itemValue?.name || itemValue;
        return selectedValues.includes(normalizedValue);
      });
    });
    // ✅ data is a critical dependency here to update the list when API finishes
  }, [data, searchTerm, activeFilters, searchFields]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // ✅ Paginated data must also react to filteredData changes
  const paginatedData = useMemo(() => {
    return filteredData.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredData, currentPage]);

  return {
    searchTerm, setSearchTerm,
    activeFilters, setActiveFilters,
    currentPage, setCurrentPage,
    filteredData, paginatedData, totalPages,
    resetFilters: () => {
      setSearchTerm('');
      setActiveFilters({ category: [], brands: [], createdBy: [] });
    }
  };
}