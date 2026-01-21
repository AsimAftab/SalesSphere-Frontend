import React, { useState, useMemo } from 'react';
import { type MappingItem } from './useEntityMapping';
import Button from '../../../../components/UI/Button/Button';

interface UnassignedSelectorProps {
    items: MappingItem[];
    onAssign: (ids: string[]) => void;
    title: string;
    isLoading?: boolean;
    // Filter Props
    filterOptions?: string[];
    selectedFilter?: string;
    onFilterChange?: (filter: string) => void;
}

const UnassignedSelector: React.FC<UnassignedSelectorProps> = ({
    items,
    onAssign,
    title,
    isLoading,
    filterOptions = [],
    selectedFilter = '',
    onFilterChange
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    // Filter items based on search and category filter
    const filteredItems = useMemo(() => {
        let result = items;

        // 1. Filter by Category
        if (selectedFilter) {
            result = result.filter(i => i.category === selectedFilter);
        }

        // 2. Filter by Search
        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            result = result.filter(i =>
                i.name.toLowerCase().includes(lower) ||
                (i.subText && i.subText.toLowerCase().includes(lower))
            );
        }

        return result;
    }, [items, searchTerm, selectedFilter]);

    const toggleSelection = (id: string) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setSelectedIds(newSet);
    };

    const handleAssign = () => {
        onAssign(Array.from(selectedIds));
        setSelectedIds(new Set()); // Clear selection after assign
    };

    const selectAll = () => {
        if (selectedIds.size === filteredItems.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filteredItems.map(i => i._id)));
        }
    };

    return (
        <div className="h-full flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            {/* Header / Search / Filter */}
            <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-700">Available to Assign</h3>
                    {/* Filter Dropdown */}
                    {filterOptions.length > 0 && onFilterChange && (
                        <select
                            value={selectedFilter}
                            onChange={(e) => onFilterChange(e.target.value)}
                            className="text-sm border border-gray-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none bg-white"
                        >
                            <option value="">All Types</option>
                            {filterOptions.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    )}
                </div>

                <div className="relative">
                    <input
                        type="text"
                        placeholder={`Search ${title.toLowerCase()}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all"
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1 bg-white">
                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-secondary"></div>
                    </div>
                ) : filteredItems.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 text-sm">
                        {searchTerm || selectedFilter ? 'No matches found.' : 'No available items.'}
                    </div>
                ) : (
                    <>
                        <div className="px-2 py-1 flex items-center">
                            <label className="flex items-center gap-2 text-xs font-medium text-gray-500 cursor-pointer select-none hover:text-secondary">
                                <input
                                    type="checkbox"
                                    checked={filteredItems.length > 0 && selectedIds.size === filteredItems.length}
                                    onChange={selectAll}
                                    className="rounded border-gray-300 text-secondary focus:ring-secondary/20"
                                />
                                Select All ({filteredItems.length})
                            </label>
                        </div>

                        {filteredItems.map(item => (
                            <label
                                key={item._id}
                                className={`
                                    flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition-all select-none
                                    ${selectedIds.has(item._id)
                                        ? 'bg-secondary/5 border-secondary/30'
                                        : 'hover:bg-gray-50 border-transparent'
                                    }
                                `}
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedIds.has(item._id)}
                                    onChange={() => toggleSelection(item._id)}
                                    className="rounded border-gray-300 text-secondary focus:ring-secondary/20 h-4 w-4 mt-0.5"
                                />
                                {item.image && (
                                    <img src={item.image} alt="" className="w-8 h-8 rounded-full object-cover border border-gray-200" />
                                )}
                                <div>
                                    <p className={`text-sm font-medium ${selectedIds.has(item._id) ? 'text-secondary' : 'text-gray-700'}`}>
                                        {item.name}
                                    </p>
                                    {item.subText && (
                                        <p className="text-xs text-gray-400">{item.subText}</p>
                                    )}
                                </div>
                            </label>
                        ))}
                    </>
                )}
            </div>

            {/* Footer Action */}
            <div className="p-4 border-t border-gray-100 bg-gray-50/30 flex justify-between items-center">
                <span className="text-sm text-gray-500">
                    {selectedIds.size} selected
                </span>
                <Button
                    onClick={handleAssign}
                    disabled={selectedIds.size === 0}
                >
                    Assign Selected
                </Button>
            </div>
        </div>
    );
};

export default UnassignedSelector;
