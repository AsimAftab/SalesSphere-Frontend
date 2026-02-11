import React from 'react';
import { Upload } from 'lucide-react';
import { PageHeader, Button } from '@/components/ui';

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
        <PageHeader
            title="Products"
            subtitle="Inventory overview"
            searchTerm={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search by Product Name"
            isFilterVisible={isFilterVisible}
            onFilterToggle={() => setIsFilterVisible(!isFilterVisible)}
            showFilter={true}
            onExportPdf={onExportPdf}
            onExportExcel={onExportExcel}
            selectedCount={selectedCount}
            onBulkDelete={onBulkDelete}
            createButtonLabel="Add Product"
            onCreate={onAddProduct}
            permissions={{
                canCreate,
                canBulkDelete,
                canExportPdf,
                canExportExcel,
            }}
            customActions={
                canBulkUpload ? (
                    <Button
                        variant="secondary"
                        onClick={onBulkUpload}
                        className="h-10 px-4 flex items-center justify-center gap-2 border-gray-300 text-gray-700"
                    >
                        <Upload className="h-4 w-4" />
                        <span className="whitespace-nowrap">Upload</span>
                    </Button>
                ) : undefined
            }
        />
    );
};

export default ProductHeader;
