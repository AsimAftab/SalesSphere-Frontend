import { useState } from 'react';

/**
 * Hook for managing leave selection state
 * Single Responsibility: Selection state management only
 */
export const useLeaveSelection = () => {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const toggleRow = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const selectAll = (ids: string[]) => {
        setSelectedIds(ids);
    };

    const clearSelection = () => {
        setSelectedIds([]);
    };

    return {
        selectedIds,
        setSelectedIds,
        toggleRow,
        selectAll,
        clearSelection
    };
};
