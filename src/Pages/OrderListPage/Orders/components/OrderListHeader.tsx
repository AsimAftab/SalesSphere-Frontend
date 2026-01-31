import React from 'react';
import { motion } from 'framer-motion';
import { FunnelIcon } from '@heroicons/react/24/outline';
import Button from '../../../../components/UI/Button/Button';
import SearchBar from '../../../../components/UI/SearchBar/SearchBar';
import ExportActions from '../../../../components/UI/Export/ExportActions';

interface OrderListHeaderProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    isFilterVisible: boolean;
    onToggleFilters: () => void;
    onExportPdf: () => void;
    onCreateOrder: () => void;
    canCreate?: boolean;
    canExportPdf?: boolean;
}

const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const OrderListHeader: React.FC<OrderListHeaderProps> = ({
    searchTerm,
    onSearchChange,
    isFilterVisible,
    onToggleFilters,
    onExportPdf,
    onCreateOrder,
    canCreate = true,
    canExportPdf = true
}) => {
    return (
        <motion.div variants={itemVariants} className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 px-1">
            <h1 className="text-3xl font-bold text-[#202224] whitespace-nowrap lg:text-left ">Order List</h1>

            {/* Actions Wrapper: Stacks on mobile, horizontal on desktop */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">

                {/* Search Bar: Full width on mobile */}
                <SearchBar
                    value={searchTerm}
                    onChange={onSearchChange}
                    placeholder="Search By Invoice Number or Party"
                    className="w-full sm:w-64 lg:w-80"
                />

                {/* Action Buttons Group: Wraps on small screens to prevent overflow */}
                <div className="flex flex-wrap items-center  sm:justify-end gap-3 w-full sm:w-auto">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onToggleFilters}
                            className={`p-2.5 rounded-lg border transition-all ${isFilterVisible ? 'bg-secondary text-white shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                        >
                            <FunnelIcon className="h-5 w-5" />
                        </button>
                        <ExportActions onExportPdf={canExportPdf ? onExportPdf : undefined} />
                    </div>
                </div>
                {canCreate && (
                    <Button
                        className="w-full sm:w-auto whitespace-nowrap text-sm px-4 h-10 flex-shrink-0"
                        onClick={onCreateOrder}
                    >
                        Create Order
                    </Button>
                )}
            </div>
        </motion.div>
    );
};

export default OrderListHeader;
