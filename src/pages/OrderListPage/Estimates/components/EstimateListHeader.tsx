import React from 'react';
import { motion } from 'framer-motion';
import { TrashIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { Button, SearchBar, ExportActions } from '@/components/ui';

interface EstimateListHeaderProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    isFilterVisible: boolean;
    onToggleFilters: () => void;
    onExportPdf: () => void;
    onCreateEstimate: () => void;
    selectionCount: number;
    onBulkDelete: () => void;
    canCreate?: boolean;
    canBulkDelete?: boolean;
    canExportPdf?: boolean;
}

const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const EstimateListHeader: React.FC<EstimateListHeaderProps> = ({
    searchTerm,
    onSearchChange,
    isFilterVisible,
    onToggleFilters,
    onExportPdf,
    onCreateEstimate,
    selectionCount,
    onBulkDelete,
    canCreate = true,
    canBulkDelete = true,
    canExportPdf = true
}) => {
    return (
        <motion.div variants={itemVariants} className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 px-1">
            <div className="flex-shrink-0">
                <h1 className="text-3xl font-bold text-[#202224] whitespace-nowrap lg:text-left ">Estimates</h1>
            </div>

            {/* Actions Wrapper: Stacks on mobile, horizontal on desktop */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">

                {/* Search Bar: Full width on mobile */}
                <SearchBar
                    value={searchTerm}
                    onChange={onSearchChange}
                    placeholder="Search Invoice/Party"
                    className="w-full sm:w-64 lg:w-80"
                />

                {/* Action Buttons Group: Filter, Export, and Delete */}
                <div className="flex flex-wrap items-center  sm:justify-end gap-3 w-full sm:w-auto">
                    <div className="flex items-center gap-3">
                        {selectionCount > 0 && canBulkDelete && (
                            <Button variant="danger" onClick={onBulkDelete} className="whitespace-nowrap flex items-center gap-2 h-10 px-3 text-sm">
                                <TrashIcon className="h-5 w-5" />
                                <span>Delete ({selectionCount})</span>
                            </Button>
                        )}

                        <button
                            onClick={onToggleFilters}
                            className={`p-2.5 rounded-lg border transition-all ${isFilterVisible ? 'bg-secondary text-white shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                        >
                            <FunnelIcon className="h-5 w-5" />
                        </button>

                        <ExportActions onExportPdf={canExportPdf ? onExportPdf : undefined} />
                    </div>

                    {/* Create Estimate Button: Full width on mobile */}
                    {canCreate && (
                        <Button
                            className="w-full sm:w-auto whitespace-nowrap text-sm px-4 h-10 flex-shrink-0"
                            onClick={onCreateEstimate}
                        >
                            Create Estimate
                        </Button>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default EstimateListHeader;
