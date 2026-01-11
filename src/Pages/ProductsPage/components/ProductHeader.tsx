import React from 'react';
import { FunnelIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Upload } from 'lucide-react';
import Button from '../../../components/UI/Button/Button';
import SearchBar from '../../../components/UI/SearchBar/SearchBar';
import ExportActions from '../../../components/UI/Export/ExportActions';

interface ProductHeaderProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    isFilterVisible: boolean;
    setIsFilterVisible: (visible: boolean) => void;
    selectedCount: number;
    onBulkDelete: () => void;
    canCreate: boolean;
    canBulkUpload: boolean;
    canBulkDelete: boolean;
    canExportPdf: boolean;
    canExportExcel: boolean;
    onAddProduct: () => void;
    onBulkUpload: () => void;
    onExportPdf: () => void;
    onExportExcel: () => void;
    exportingStatus: 'pdf' | 'excel' | null;
}

const ProductHeader: React.FC<ProductHeaderProps> = ({
    searchQuery,
    setSearchQuery,
    isFilterVisible,
    setIsFilterVisible,
    selectedCount,
    onBulkDelete,
    canCreate,
    canBulkUpload,
    canBulkDelete,
    canExportPdf,
    canExportExcel,
    onAddProduct,
    onBulkUpload,
    onExportPdf,
    onExportExcel,
    exportingStatus
}) => {
    return (
        <div className="w-full flex flex-col gap-0 mb-8">

            {/* ROW 1: Title and Discovery Controls */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">

                {/* Title and Description */}
                <div className="text-left shrink-0">
                    <h1 className="text-2xl sm:text-3xl font-black text-[#202224]">Products</h1>
                    <p className="text-xs sm:text-sm text-gray-500">View and manage your product inventory.</p>
                </div>

                {/* Discovery Controls (Search, Filter, Export, status) */}
                <div className="flex flex-col xl:flex-row items-center gap-4 w-full xl:w-auto xl:justify-end">
                    {/* Search Bar */}
                    <SearchBar
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="Search by Product Name"
                    />

                    {/* Filter, Export */}
                    <div className="flex items-center justify-between xl:justify-end gap-3 w-full xl:w-auto">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsFilterVisible(!isFilterVisible)}
                                className={`p-2.5 rounded-lg border transition-colors ${isFilterVisible
                                    ? 'bg-secondary text-white border-secondary shadow-md'
                                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                    }`}
                                aria-label="Toggle Filters"
                            >
                                <FunnelIcon className="h-5 w-5" />
                            </button>

                            <ExportActions
                                onExportPdf={canExportPdf ? onExportPdf : undefined}
                                onExportExcel={canExportExcel ? onExportExcel : undefined}
                            />
                        </div>
                    </div>

                    {/* Status Indicator */}
                    <AnimatePresence>
                        {exportingStatus && (
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="text-sm text-blue-600 font-medium animate-pulse whitespace-nowrap"
                            >
                                {exportingStatus === 'pdf' ? 'Generating PDF...' : 'Generating Excel...'}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* ROW 2: Primary Actions (Delete / Bulk Upload / Add) - Right Aligned */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 w-full border-t border-gray-100 mt-4 pt-4">
                <AnimatePresence>
                    {selectedCount > 0 && canBulkDelete && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <Button
                                variant="danger"
                                onClick={onBulkDelete}
                                className="h-11 xl:h-10 w-full sm:w-auto px-4 flex items-center justify-center gap-2 font-bold whitespace-nowrap"
                            >
                                <Trash2 size={16} /> <span>Delete</span> ({selectedCount})
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {canBulkUpload && (
                    <Button
                        variant="secondary"
                        onClick={onBulkUpload}
                        className="h-11 xl:h-10 w-full sm:w-auto px-4 flex items-center justify-center gap-2 border-gray-300 text-gray-700"
                    >
                        <Upload className="h-4 w-4" />
                        <span className="whitespace-nowrap">Bulk Upload</span>
                    </Button>
                )}

                {canCreate && (
                    <Button
                        variant="primary"
                        onClick={onAddProduct}
                        className="h-11 xl:h-10 w-full sm:w-auto px-6 tracking-wider flex items-center justify-center gap-2 shadow-sm"
                    >
                        <span className="whitespace-nowrap">Add Product</span>
                    </Button>
                )}
            </div>
        </div>
    );
};

export default ProductHeader;

