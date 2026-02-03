import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Filter,
    Trash2,
    Upload,
} from 'lucide-react';
import { Button, SearchBar, ExportActions } from '@/components/ui';

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
}) => {
    return (
        <div className="w-full flex flex-col gap-0 mb-8">

            {/* ROW 1: Title and Discovery Controls */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

                {/* Title and Description */}
                <div className="text-left shrink-0">
                    <h1 className="text-2xl sm:text-3xl font-black text-[#202224]">Products</h1>
                    <p className="text-xs sm:text-sm text-gray-500">Inventory overview</p>
                </div>

                {/* Discovery Controls (Search, Filter, Export, Upload, Add) */}
                <div className="flex flex-col lg:flex-row items-center gap-4 w-full lg:w-auto lg:flex-1 lg:justify-end">
                    {/* Search Bar */}
                    <SearchBar
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="Search by Product Name"
                        className="w-full lg:w-56"
                    />

                    {/* Actions Group */}
                    <div className="flex items-center justify-between lg:justify-end gap-3 w-full lg:w-auto">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsFilterVisible(!isFilterVisible)}
                                className={`p-2.5 rounded-lg border transition-colors ${isFilterVisible
                                    ? 'bg-secondary text-white border-secondary shadow-md'
                                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                    }`}
                                aria-label="Toggle Filters"
                            >
                                <Filter className="h-5 w-5" />
                            </button>

                            <ExportActions
                                onExportPdf={canExportPdf ? onExportPdf : undefined}
                                onExportExcel={canExportExcel ? onExportExcel : undefined}
                            />

                            {/* Delete Button (2XL Screens - Inline) */}
                            <AnimatePresence>
                                {selectedCount > 0 && canBulkDelete && (
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

                            {canBulkUpload && (
                                <Button
                                    variant="secondary"
                                    onClick={onBulkUpload}
                                    className="h-10 px-4 flex items-center justify-center gap-2 border-gray-300 text-gray-700"
                                >
                                    <Upload className="h-4 w-4" />
                                    <span className="whitespace-nowrap">Upload</span>
                                </Button>
                            )}

                            {canCreate && (
                                <Button
                                    variant="primary"
                                    onClick={onAddProduct}
                                    className="h-10 px-6 tracking-wider flex items-center justify-center gap-2 shadow-sm"
                                >
                                    <span className="whitespace-nowrap">Add Product</span>
                                </Button>
                            )}
                        </div>
                    </div>

                </div>
            </div>

            {/* ROW 2: Bulk Delete Action (Appears on next line for smaller screens, hidden on 2XL) */}
            <AnimatePresence>
                {selectedCount > 0 && canBulkDelete && (
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
};

export default ProductHeader;

