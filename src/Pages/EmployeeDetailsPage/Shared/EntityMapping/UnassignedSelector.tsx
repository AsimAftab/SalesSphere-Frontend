import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type MappingItem } from './useEntityMapping';
import Button from '../../../../components/UI/Button/Button';
import DropDown from '../../../../components/UI/DropDown/DropDown';
import SearchBar from '../../../../components/UI/SearchBar/SearchBar';
import { EmptyState } from '../../../../components/UI/EmptyState/EmptyState';
import Pagination from '../../../../components/UI/Page/Pagination';
import { Skeleton } from '../../../../components/UI/Skeleton/Skeleton';
import { Plus, ListChecks, Search, ArrowRightLeft, MapPin, Tag } from 'lucide-react';

interface UnassignedSelectorProps {
    items: MappingItem[];
    onAssign: (ids: string[]) => void;
    title: string;
    isLoading?: boolean;
    filterOptions?: string[];
    selectedFilter?: string;
    onFilterChange?: (filter: string) => void;
    filterPlaceholder?: string;
    iconBg?: string;
    iconShadow?: string;
    tagClasses?: string;
    badgeClasses?: string;
}

const ITEMS_PER_PAGE = 10;

const containerVariants = {
    hidden: { opacity: 1 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.03 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 6 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 500, damping: 30 } },
};

const UnassignedSelector: React.FC<UnassignedSelectorProps> = ({
    items,
    onAssign,
    title,
    isLoading,
    filterOptions = [],
    selectedFilter = '',
    onFilterChange,
    filterPlaceholder = 'All Types',
    iconBg = 'from-emerald-500 to-emerald-600',
    iconShadow = 'shadow-emerald-500/25',
    tagClasses = 'bg-secondary/10 text-secondary border-secondary/20',
    badgeClasses = 'text-emerald-600 bg-emerald-50'
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [currentPage, setCurrentPage] = useState(1);

    const filteredItems = useMemo(() => {
        let result = items;
        if (selectedFilter) {
            result = result.filter(i => i.category === selectedFilter);
        }
        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            result = result.filter(i =>
                i.name.toLowerCase().includes(lower) ||
                (i.subText && i.subText.toLowerCase().includes(lower)) ||
                (i.address && i.address.toLowerCase().includes(lower))
            );
        }
        return result;
    }, [items, searchTerm, selectedFilter]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedFilter, items.length]);

    // Sort selected items to the top
    const sortedItems = useMemo(() => {
        return [...filteredItems].sort((a, b) => {
            const aSelected = selectedIds.has(a._id) ? 0 : 1;
            const bSelected = selectedIds.has(b._id) ? 0 : 1;
            return aSelected - bSelected;
        });
    }, [filteredItems, selectedIds]);

    const paginatedItems = sortedItems.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const dropdownOptions = useMemo(() => [
        { value: '', label: filterPlaceholder },
        ...filterOptions.map(opt => ({ value: opt, label: opt }))
    ], [filterOptions, filterPlaceholder]);

    const toggleSelection = (id: string) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedIds(newSet);
    };

    const handleAssign = () => {
        onAssign(Array.from(selectedIds));
        setSelectedIds(new Set());
    };

    const selectAll = () => {
        if (selectedIds.size === filteredItems.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filteredItems.map(i => i._id)));
        }
    };

    const hasActiveFilters = searchTerm || selectedFilter;

    return (
        <div className="h-full flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="px-5 pt-5 pb-4 border-b border-gray-100 bg-gradient-to-b from-gray-50/80 to-white">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${iconBg} flex items-center justify-center text-white shadow-sm ${iconShadow} shrink-0`}>
                            <Plus className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <h3 className="text-base font-semibold text-gray-900 whitespace-nowrap">Available {title}</h3>
                                <motion.span
                                    key={filteredItems.length}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className={`text-sm font-bold px-2.5 py-0.5 rounded-full tabular-nums shrink-0 ${badgeClasses}`}
                                >
                                    {filteredItems.length}
                                </motion.span>
                            </div>
                            <p className="text-sm text-gray-400 mt-0.5">
                                Select to assign
                            </p>
                        </div>
                    </div>
                    <SearchBar
                        value={searchTerm}
                        onChange={setSearchTerm}
                        placeholder="Search by Name or Address"
                    />
                </div>

                {/* Filter summary */}
                <AnimatePresence>
                    {hasActiveFilters && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <p className="text-sm text-gray-400 mt-2 pl-1">
                                Showing <span className="font-medium text-gray-600">{filteredItems.length}</span> of {items.length} results
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Select All + Filter Row */}
            {!isLoading && filteredItems.length > 0 && (
                <div className="px-5 py-2.5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2.5 text-sm font-medium text-gray-600 cursor-pointer select-none hover:text-secondary transition-colors bg-white border border-gray-200 rounded-xl px-4 py-2.5 hover:border-gray-300 shadow-sm min-h-[46px]">
                            <input
                                type="checkbox"
                                checked={filteredItems.length > 0 && selectedIds.size === filteredItems.length}
                                onChange={selectAll}
                                className="rounded border-gray-300 text-secondary focus:ring-secondary/20 h-4 w-4"
                            />
                            Select All
                            <span className="text-sm text-gray-600 font-semibold">({filteredItems.length})</span>
                        </label>
                        <AnimatePresence>
                            {selectedIds.size > 0 && (
                                <motion.span
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="text-xs font-semibold text-white bg-secondary px-2.5 py-1 rounded-lg shadow-sm"
                                >
                                    {selectedIds.size} selected
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </div>
                    {filterOptions.length > 0 && onFilterChange && (
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-600 whitespace-nowrap">Filter by:</span>
                            <DropDown
                                value={selectedFilter}
                                onChange={(value) => onFilterChange(value)}
                                options={dropdownOptions}
                                placeholder={filterPlaceholder}
                                triggerClassName="!text-sm !min-w-[140px]"
                                usePortal
                            />
                        </div>
                    )}
                </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-4 py-3 no-scrollbar bg-gray-50/60">
                {isLoading ? (
                    <div className="space-y-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-3.5 p-3.5 rounded-xl border border-gray-100 bg-white" style={{ opacity: 1 - i * 0.12 }}>
                                <Skeleton className="w-4 h-4 !rounded" />
                                <Skeleton className="w-10 h-10 !rounded-full" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-3/5 !rounded-md" />
                                    <Skeleton className="h-3 w-2/5 !rounded-md" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredItems.length === 0 ? (
                    <EmptyState
                        icon={hasActiveFilters ? <Search className="w-10 h-10" /> : <ListChecks className="w-10 h-10" />}
                        title={hasActiveFilters ? 'No Matches Found' : 'All Assigned'}
                        description={
                            hasActiveFilters
                                ? 'Try adjusting your search or filter criteria.'
                                : `All ${title.toLowerCase()} have already been assigned.`
                        }
                    />
                ) : (
                    <motion.div
                        key={selectedFilter + currentPage}
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="space-y-2.5"
                    >
                        <AnimatePresence mode="popLayout">
                            {paginatedItems.map(item => {
                                const isSelected = selectedIds.has(item._id);
                                return (
                                    <motion.div
                                        key={item._id}
                                        variants={itemVariants}
                                        layout
                                        className={`group rounded-xl border bg-white p-4 transition-all cursor-pointer ${
                                            isSelected
                                                ? 'border-secondary/30 bg-secondary/[0.03] shadow-md'
                                                : 'border-gray-200 hover:border-secondary/30 hover:bg-secondary/[0.03] hover:shadow-md'
                                        }`}
                                        onClick={() => toggleSelection(item._id)}
                                    >
                                        <div className="flex items-start gap-3.5">
                                            {/* Checkbox */}
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => toggleSelection(item._id)}
                                                onClick={(e) => e.stopPropagation()}
                                                className="rounded border-gray-300 text-secondary focus:ring-secondary/20 h-4 w-4 mt-1 shrink-0"
                                            />

                                            {/* Avatar */}
                                            {item.image ? (
                                                <img src={item.image} alt="" className="w-10 h-10 rounded-full object-cover border border-gray-200 shrink-0" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white font-semibold text-sm shadow-sm shrink-0">
                                                    {item.name.charAt(0).toUpperCase()}
                                                </div>
                                            )}

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                {/* Name + tag row */}
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <p className={`text-[15px] font-semibold truncate transition-colors ${isSelected ? 'text-secondary' : 'text-gray-900'}`}>
                                                        {item.name}
                                                    </p>
                                                    {item.category && (
                                                        <span className={`shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-lg border ${tagClasses}`}>
                                                            <Tag className="w-3.5 h-3.5" />
                                                            {item.category}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Sub-text */}
                                                {item.subText && (
                                                    <p className="text-sm text-gray-500 truncate mt-0.5">{item.subText}</p>
                                                )}

                                                {/* Address */}
                                                {item.address && (
                                                    <p className="text-xs text-gray-400 mt-1 flex items-start gap-1.5">
                                                        <MapPin className="w-3.5 h-3.5 shrink-0 text-gray-300 mt-0.5" />
                                                        <span className="break-words">{item.address}</span>
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>

            {/* Pagination */}
            <div className="border-t border-gray-100 bg-white">
                <Pagination
                    currentPage={currentPage}
                    totalItems={filteredItems.length}
                    itemsPerPage={ITEMS_PER_PAGE}
                    onPageChange={setCurrentPage}
                    className="!py-2.5 !px-4"
                />
            </div>

            {/* Footer Action */}
            <div className="px-4 py-3.5 border-t border-gray-100 bg-gradient-to-t from-gray-50/60 to-white flex justify-end">
                <AnimatePresence mode="wait">
                    {selectedIds.size > 0 ? (
                        <motion.div
                            key="active"
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                        >
                            <Button
                                onClick={handleAssign}
                                className="!py-2.5"
                            >
                                <ArrowRightLeft className="w-4 h-4 mr-2" />
                                Assign {selectedIds.size} {title}
                            </Button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="inactive"
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                        >
                            <Button
                                disabled
                                className="!py-2.5"
                            >
                                Select {title} to Assign
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default UnassignedSelector;
