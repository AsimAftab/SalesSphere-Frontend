import { useState, useCallback } from 'react';

export function useTableSelection<T extends { _id?: string; id?: string }>(data: T[]) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleRow = useCallback((id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }, []);

  const selectAll = useCallback((checked: boolean) => {
    if (checked) {
      const allIds = data.map((item) => (item._id || item.id) as string);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  }, [data]);

  const selectMultiple = useCallback((ids: string[]) => {
    setSelectedIds(ids);
  }, []);

  const clearSelection = useCallback(() => setSelectedIds([]), []);

  return { selectedIds, toggleRow, selectAll, clearSelection, selectMultiple };
}
