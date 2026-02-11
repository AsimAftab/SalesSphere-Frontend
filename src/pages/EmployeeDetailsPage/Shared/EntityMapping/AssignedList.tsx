import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type MappingItem } from './useEntityMapping';
import {
    Inbox,
    Link2,
    MapPin,
    Tag,
    XCircle,
} from 'lucide-react';
import { SearchBar, EmptyState, Pagination, Skeleton } from '@/components/ui';

interface AssignedListProps {
    items: MappingItem[];
    onUnassign: (id: string) => void;
    title: string;
    icon?: React.ReactNode;
    isLoading?: boolean;
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
        transition: { staggerChildren: 0.04 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 500, damping: 30 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
};

const AssignedList: React.FC<AssignedListProps> = ({ items, onUnassign, title, icon, isLoading, iconBg = 'from-secondary to-secondary/80', iconShadow = 'shadow-secondary/25', tagClasses = 'bg-secondary/10 text-secondary border-secondary/20', badgeClasses = 'text-secondary bg-secondary/10' }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const filteredItems = useMemo(() => {
        if (!searchTerm) return items;
        const lower = searchTerm.toLowerCase();
        return items.filter(i =>
            i.name.toLowerCase().includes(lower) ||
            (i.subText && i.subText.toLowerCase().includes(lower)) ||
            (i.address && i.address.toLowerCase().includes(lower))
        );
    }, [items, searchTerm]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, items.length]);

    const paginatedItems = filteredItems.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="h-full flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="px-5 pt-5 pb-4 border-b border-gray-100 bg-gradient-to-b from-gray-50/80 to-white">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${iconBg} flex items-center justify-center text-white shadow-sm ${iconShadow} shrink-0 [&_img]:brightness-0 [&_img]:invert`}>
                            {icon || <Link2 className="w-5 h-5" />}
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <h3 className="text-base font-semibold text-gray-900 whitespace-nowrap">Assigned {title}</h3>
                                <motion.span
                                    key={items.length}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className={`text-sm font-bold px-2.5 py-0.5 rounded-full tabular-nums shrink-0 ${badgeClasses}`}
                                >
                                    {items.length}
                                </motion.span>
                            </div>
                            <p className="text-sm text-gray-400 mt-0.5">
                                Manage current assignments
                            </p>
                        </div>
                    </div>
                    <SearchBar
                        value={searchTerm}
                        onChange={setSearchTerm}
                        placeholder="Search by Name or Address"
                    />
                </div>

                {/* Active filter indicator */}
                <AnimatePresence>
                    {searchTerm && (
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

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-4 py-3 no-scrollbar bg-gray-50/60 min-h-[150px]">
                {isLoading ? (
                    <div className="space-y-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-3.5 p-3.5 rounded-xl border border-gray-100" style={{ opacity: 1 - i * 0.12 }}>
                                <Skeleton className="w-10 h-10 !rounded-full" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-3/5 !rounded-md" />
                                    <Skeleton className="h-3 w-2/5 !rounded-md" />
                                </div>
                                <Skeleton className="h-6 w-16 !rounded-full" />
                            </div>
                        ))}
                    </div>
                ) : filteredItems.length === 0 ? (
                    <EmptyState
                        icon={<div className="[&_img]:w-10 [&_img]:h-10">{icon || <Inbox className="w-10 h-10" />}</div>}
                        title={items.length === 0 ? `No ${title} Assigned` : 'No Results Found'}
                        description={
                            items.length === 0
                                ? `Assign ${title.toLowerCase()} from the available list on the right.`
                                : `No ${title.toLowerCase()} match your current filters. Try adjusting your search criteria.`
                        }
                    />
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="space-y-2.5"
                    >
                        <AnimatePresence mode="popLayout">
                            {paginatedItems.map(item => (
                                <motion.div
                                    key={item._id}
                                    variants={itemVariants}
                                    exit="exit"
                                    layout
                                    className="group rounded-xl border border-gray-200 bg-white p-3 sm:p-4 hover:border-secondary/30 hover:bg-secondary/[0.03] hover:shadow-md transition-all cursor-default"
                                >
                                    <div className="flex items-start gap-2.5 sm:gap-3.5">
                                        {/* Avatar */}
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-secondary flex items-center justify-center text-white font-semibold text-xs sm:text-sm shadow-sm shrink-0">
                                            {item.name.charAt(0).toUpperCase()}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0 overflow-hidden">
                                            {/* Name + tag row */}
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 min-w-0 flex-1">
                                                    <p className="text-sm sm:text-[15px] font-semibold text-gray-900 truncate">{item.name}</p>
                                                    {item.category && (
                                                        <span className={`self-start shrink-0 inline-flex items-center gap-1 text-[10px] sm:text-xs font-semibold px-2 sm:px-3 py-0.5 sm:py-1 rounded-md sm:rounded-lg border ${tagClasses}`}>
                                                            <Tag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                                            {item.category}
                                                        </span>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => onUnassign(item._id)}
                                                    className="shrink-0 p-1 rounded-full text-red-500 hover:bg-red-50 transition-all active:scale-90"
                                                    title={`Remove ${item.name}`}
                                                >
                                                    <XCircle className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                                                </button>
                                            </div>

                                            {/* Sub-text */}
                                            {item.subText && (
                                                <p className="text-xs sm:text-sm text-gray-500 truncate mt-0.5">{item.subText}</p>
                                            )}

                                            {/* Address */}
                                            {item.address && (
                                                <p className="text-[10px] sm:text-xs text-gray-400 mt-1 flex items-start gap-1 sm:gap-1.5">
                                                    <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 text-gray-300 mt-0.5" />
                                                    <span className="line-clamp-2 sm:break-words">{item.address}</span>
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>

            {/* Pagination */}
            <div className="border-t border-gray-100 bg-gray-50/30">
                <Pagination
                    currentPage={currentPage}
                    totalItems={filteredItems.length}
                    itemsPerPage={ITEMS_PER_PAGE}
                    onPageChange={setCurrentPage}
                    className="!py-2.5 !px-4"
                />
            </div>
        </div>
    );
};

export default AssignedList;
