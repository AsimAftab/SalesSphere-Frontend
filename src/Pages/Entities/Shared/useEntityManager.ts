// src/pages/Entities/shared/useEntityManager.ts
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
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Reset to first page whenever search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeFilters]);

  const filteredData = useMemo(() => {
    if (!data) return [];

    return data.filter((item) => {
      // 1. Search Logic
      const matchesSearch = searchFields.length === 0 || searchFields.some((field) => {
        const value = item[field];
        return String(value || '').toLowerCase().includes(searchTerm.toLowerCase());
      });

      if (!matchesSearch) return false;

      // 2. Dynamic Filter Logic
      return Object.entries(activeFilters).every(([key, selectedValues]) => {
        if (!selectedValues.length) return true;
        
        const itemValue = item[key];

        // Handle "None" selection for empty/missing values
        if (selectedValues.includes('None')) {
          if (!itemValue || (Array.isArray(itemValue) && itemValue.length === 0)) {
            return true;
          }
        }

        // Handle Arrays (like interests or categories)
        if (Array.isArray(itemValue)) {
          return itemValue.some(val => 
            selectedValues.includes(val.category || val?.name || val)
          );
        }

        // Handle Objects (like createdBy) or primitive strings
        const normalizedValue = itemValue?.name || itemValue;
        return selectedValues.includes(normalizedValue);
      });
    });
  }, [data, searchTerm, activeFilters, searchFields]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const resetFilters = () => {
    setSearchTerm('');
    setActiveFilters({});
  };

  return {
    searchTerm,
    setSearchTerm,
    activeFilters,
    setActiveFilters,
    currentPage,
    setCurrentPage,
    filteredData,
    paginatedData,
    totalPages,
    resetFilters,
  };
}