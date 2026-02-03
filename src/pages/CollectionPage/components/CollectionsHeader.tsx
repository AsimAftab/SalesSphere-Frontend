import React from 'react';
import { Filter, Trash2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { SearchBar, Button, ExportActions } from '@/components/ui';

// UI Components

interface CollectionsHeaderProps {
    searchTerm: string;
    setSearchTerm: (val: string) => void;
    isFilterVisible: boolean;
    setIsFilterVisible: (val: boolean) => void;
    selectedCount: number;
    onBulkDelete: () => void;
    onExportPdf: () => void;
    onExportExcel: () => void;
    handleCreate: () => void;
    setCurrentPage: (page: number) => void;
    // Permissions
    permissions: {
        canCreate: boolean;
        canDelete: boolean;
        canBulkDelete: boolean; // Added
        canExportPdf: boolean;
        canExportExcel: boolean;
    };
}

export const CollectionsHeader: React.FC<CollectionsHeaderProps> = ({
    searchTerm,
    setSearchTerm,
    isFilterVisible,
    setIsFilterVisible,
    selectedCount,
    onBulkDelete,
    onExportPdf,
    onExportExcel,
    handleCreate,
    setCurrentPage,
    permissions
}) => (
    <div className="w-full flex flex-col gap-0 mb-8 px-1">

        {/* ROW 1: Title and Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

            {/* Title and Subtitle */}
            <div className="text-left shrink-0">
                <h1 className="text-2xl sm:text-3xl font-black text-[#202224] ">
                    Collection List
                </h1>
                <p className="text-xs sm:text-sm text-gray-500">Manage payment collections.</p>
            </div>


            {/* Actions Wrapper */}
            <div className="flex flex-col lg:flex-row items-center gap-4 w-full lg:w-auto lg:flex-1 lg:justify-end">

                {/* Search Bar */}
                <SearchBar
                    value={searchTerm}
                    onChange={(val) => {
                        setSearchTerm(val);
                        setCurrentPage(1);
                    }}
                    placeholder="Search by Party or Payment Mode"
                    className="w-full lg:w-72 xl:w-80"
                />

                {/* Actions Group */}
                <div className="flex items-center justify-between lg:justify-end gap-3 w-full lg:w-auto">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsFilterVisible(!isFilterVisible)}
                            className={`p-2.5 rounded-lg border transition-colors ${isFilterVisible ? 'bg-secondary text-white border-secondary' : 'bg-white text-gray-600 border-gray-200'
                                }`}
                        >
                            <Filter className="h-5 w-5" />
                        </button>

                        <ExportActions
                            onExportPdf={permissions.canExportPdf ? onExportPdf : undefined}
                            onExportExcel={permissions.canExportExcel ? onExportExcel : undefined}
                        />

                        {/* Delete Button (2XL Screens - Inline) */}
                        <AnimatePresence>
                            {selectedCount > 0 && permissions.canBulkDelete && (
                                <motion.div
                                    initial={{ opacity: 0, width: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, width: 'auto', scale: 1 }}
                                    exit={{ opacity: 0, width: 0, scale: 0.9 }}
                                    className="hidden 2xl:flex items-center overflow-hidden"
                                >
                                    <Button
                                        variant="danger"
                                        onClick={onBulkDelete}
                                        className="h-10 px-4 flex items-center justify-center gap-2 font-bold whitespace-nowrap"
                                    >
                                        <Trash2 size={16} /> <span>Delete</span> ({selectedCount})
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Create Button */}
                    {permissions.canCreate && (
                        <div className="w-full lg:w-auto">
                            <Button
                                onClick={handleCreate}
                                className="h-10 lg:h-10 w-full lg:w-auto px-6 tracking-wider flex items-center justify-center gap-2 shadow-sm"
                            >
                                <span>Create Collection</span>
                            </Button>
                        </div>
                    )}
                </div>

            </div>
        </div>

        {/* ROW 2: Bulk Delete Action (Appears on next line for smaller screens, hidden on 2XL) */}
        <AnimatePresence>
            {selectedCount > 0 && permissions.canBulkDelete && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden 2xl:hidden"
                >
                    <div className="flex items-center justify-end w-full border-t border-gray-100 mt-4 pt-4">
                        <Button
                            variant="danger"
                            onClick={onBulkDelete}
                            className="h-10 px-4 flex items-center justify-center gap-2 font-bold whitespace-nowrap"
                        >
                            <Trash2 size={16} /> <span>Delete</span> ({selectedCount})
                        </Button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);
