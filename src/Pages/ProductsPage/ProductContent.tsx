import React from 'react';
import { motion } from 'framer-motion';
import { EmptyState } from '../../components/UI/EmptyState/EmptyState';
import {
  type Product,
  type Category,
  type NewProductFormData,
  type BulkProductData,
} from '../../api/productService';

// Domain Logic
import { ProductMapper } from '../../api/productService';

// Modals
import ProductEntityModal from '../../components/modals/Product/ProductEntityModal';
import ConfirmationModal from '../../components/modals/CommonModals/ConfirmationModal';
import { BulkUploadProductsModal } from '../../components/modals/Product/BulkUploadProductsModal';
import ImagePreviewModal from '../../components/modals/CommonModals/ImagePreviewModal';

// Shared UI/Hooks
import FilterBar from '../../components/UI/FilterDropDown/FilterBar';
import FilterDropdown from '../../components/UI/FilterDropDown/FilterDropDown';
import Pagination from "../../components/UI/Page/Pagination";
import productsIcon from "../../assets/Image/icons/products-icon.svg";
// import { useProductViewState } from './useProductViewState'; // Lifted to parent

// Sub-Components
import ProductHeader from './components/ProductHeader';
import ProductTable from './components/ProductTable';
import ProductMobileList from './components/ProductMobileList';
import ProductSkeleton from './components/ProductSkeleton';

import type { useProductViewState } from './useProductViewState';

type ProductViewReturn = ReturnType<typeof useProductViewState>;

interface ProductContentProps {
  state: ProductViewReturn['state'];
  actions: ProductViewReturn['actions'];
  permissions: {
    canCreate: boolean;
    canUpdate: boolean;
    canDelete: boolean;
    canBulkUpload: boolean;
    canBulkDelete: boolean;
    canExportPdf: boolean;
    canExportExcel: boolean;
  };
  categories: Category[];
  onAddProduct: (productData: NewProductFormData) => Promise<Product>;
  onBulkUpdate: (products: BulkProductData[]) => Promise<{ success: boolean; data: Product[] }>;
}

// ... existing variants ...

const containerVariants = {
  hidden: { opacity: 1 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const ProductContent: React.FC<ProductContentProps> = ({
  state,
  actions,
  permissions,
  categories,
  onAddProduct,
  onBulkUpdate
}) => {
  // Logic lifted to parent

  if (state.isLoading) return (
    <ProductSkeleton
      rows={10}
      isFilterVisible={state.isFilterVisible}
      canBulkDelete={permissions.canBulkDelete}
      canUpdate={permissions.canUpdate}
      canDelete={permissions.canDelete}
      canCreate={permissions.canCreate}
      canBulkUpload={permissions.canBulkUpload}
      canExport={permissions.canExportPdf || permissions.canExportExcel}
    />
  );

  // ... Error handling ...

  return (
    <motion.div
      className="flex-1 flex flex-col overflow-x-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* 1. Header Section */}
      <ProductHeader
        searchQuery={state.searchTerm}
        setSearchQuery={actions.filters.setSearch}
        isFilterVisible={state.isFilterVisible}
        setIsFilterVisible={actions.filters.toggleVisibility}
        selectedCount={state.selectedIds.length}
        onBulkDelete={actions.modals.openBulkDelete}
        canCreate={permissions.canCreate}
        canBulkUpload={permissions.canBulkUpload}
        canBulkDelete={permissions.canBulkDelete}
        canExportPdf={permissions.canExportPdf}
        canExportExcel={permissions.canExportExcel}
        onAddProduct={actions.modals.openAdd}
        onBulkUpload={actions.modals.openBulkUpload}
        onExportPdf={actions.export.pdf}
        onExportExcel={actions.export.excel}
        exportingStatus={state.exportingStatus}
      />

      {/* 2. Filter Bar */}
      <div className="px-1 md:px-0">
        <FilterBar
          isVisible={state.isFilterVisible}
          onClose={actions.filters.toggleVisibility}
          onReset={actions.filters.reset}
        >
          <FilterDropdown
            label="Categories"
            options={categories.map(c => c.name)}
            selected={categories
              .filter(c => state.selectedCategoryIds.includes(c._id))
              .map(c => c.name)}
            onChange={actions.filters.handleCategoryChange}
          />
          <FilterDropdown
            label="Created By"
            options={state.creators}
            selected={state.selectedCreators}
            onChange={actions.filters.handleCreatorChange}
          />
        </FilterBar>
      </div>

      {/* 3. Main Data View */}
      <motion.div variants={itemVariants} className="w-full">
        {state.filteredProducts.length === 0 ? (
          <EmptyState
            title="No Products Found"
            description={state.searchTerm || state.selectedCategoryIds.length > 0
              ? "No products match your current filters. Try adjusting your search criteria."
              : "No product records available. Create your first product to get started."}
            icon={
              <img
                src={productsIcon}
                alt="No Products"
                className="w-16 h-16 opacity-50 filter grayscale"
              />
            }
          />
        ) : (
          <>
            {/* Desktop Table */}
            <ProductTable
              products={state.currentProducts}
              selectedIds={state.selectedIds}
              onToggle={actions.data.toggleRow}
              onSelectAll={actions.data.selectAll}
              startIndex={state.startIndex}
              loading={false}
              canBulkDelete={permissions.canBulkDelete}
              canUpdate={permissions.canUpdate}
              canDelete={permissions.canDelete}
              onEdit={actions.modals.openEdit}
              onDelete={actions.modals.openDelete}
              onImageClick={actions.modals.openPreview}
              formatCurrency={ProductMapper.formatCurrency}
            />

            {/* Mobile List */}
            <ProductMobileList
              products={state.currentProducts}
              selectedIds={state.selectedIds}
              onToggle={actions.data.toggleRow}
              canBulkDelete={permissions.canBulkDelete}
              canUpdate={permissions.canUpdate}
              canDelete={permissions.canDelete}
              onEdit={actions.modals.openEdit}
              onDelete={actions.modals.openDelete}
              onImageClick={actions.modals.openPreview}
              formatCurrency={ProductMapper.formatCurrency}
            />
          </>
        )}

        {/* 4. Pagination */}
        <Pagination
          currentPage={state.currentPage}
          totalItems={state.totalPages * state.ITEMS_PER_PAGE} // Approximate or pass total items if available
          itemsPerPage={state.ITEMS_PER_PAGE}
          onPageChange={actions.data.setPage}
        />
      </motion.div>

      {/* 5. Modals - Using grouped modals visibility state */}
      {permissions.canCreate && (
        <ProductEntityModal
          isOpen={state.modals.add}
          onClose={actions.modals.closeAdd}
          product={null}
          categories={categories}
          onAdd={onAddProduct}
          onUpdate={actions.data.saveEdit}
        />
      )}

      {permissions.canUpdate && (
        <ProductEntityModal
          isOpen={state.modals.edit}
          onClose={actions.modals.closeEdit}
          product={state.selectedProduct}
          categories={categories}
          onAdd={onAddProduct}
          onUpdate={actions.data.saveEdit}
        />
      )}

      {permissions.canDelete && (
        <ConfirmationModal
          isOpen={state.modals.delete}
          message={`Are you sure you want to delete "${state.selectedProduct?.productName}"?`}
          onConfirm={actions.data.confirmSingleDelete}
          onCancel={actions.modals.closeDelete}
          confirmButtonText="Delete"
          confirmButtonVariant="danger"
        />
      )}

      {permissions.canBulkDelete && (
        <ConfirmationModal
          isOpen={state.modals.bulkDelete}
          message={`Are you sure you want to permanently delete ${state.selectedIds.length} products?`}
          onConfirm={actions.data.confirmBulkDelete}
          onCancel={actions.modals.closeBulkDelete}
          confirmButtonText="Mass Delete"
          confirmButtonVariant="danger"
        />
      )}

      {permissions.canBulkUpload && (
        <BulkUploadProductsModal
          isOpen={state.modals.bulkUpload}
          onClose={actions.modals.closeBulkUpload}
          onBulkUpdate={onBulkUpdate}
        />
      )}

      <ImagePreviewModal
        isOpen={state.modals.preview}
        onClose={actions.modals.closePreview}
        images={state.previewImages}
      />
    </motion.div>
  );
};

export default ProductContent;