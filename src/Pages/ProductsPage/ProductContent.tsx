import React from 'react';
import { motion } from 'framer-motion';
import {
  type Product,
  type Category,
  type NewProductFormData,
  type UpdateProductFormData,
  type BulkProductData
} from '../../api/productService';

// Domain Logic
import { ProductMapper } from '../../api/productService';

// Modals
import AddProductModal from '../../components/modals/AddProductModal';
import EditProductModal from '../../components/modals/EditProductModal';
import ConfirmationModal from '../../components/modals/ConfirmationModal';
import { BulkUploadProductsModal } from '../../components/modals/BulkUploadProductsModal';
import ImagePreviewModal from '../../components/modals/ImagePreviewModal';

// Shared UI/Hooks
import FilterBar from '../../components/UI/FilterDropDown/FilterBar';
import FilterDropdown from '../../components/UI/FilterDropDown/FilterDropDown';
import { useProductViewState } from './useProductViewState';

// Sub-Components
import ProductHeader from './components/ProductHeader';
import ProductTable from './components/ProductTable';
import ProductMobileList from './components/ProductMobileList';
import ProductSkeleton from './components/ProductSkeleton';

interface ProductContentProps {
  data: Product[] | null;
  categories: Category[];
  loading: boolean;
  error: string | null;
  hasPermission: (module: string, feature: string) => boolean;
  onAddProduct: (productData: NewProductFormData) => Promise<Product>;
  onUpdateProduct: (productId: string, productData: UpdateProductFormData) => Promise<Product>;
  onDeleteProduct: (productId: string) => Promise<any>;
  onBulkUpdate: (products: BulkProductData[]) => Promise<any>;
  onBulkDelete: (productIds: string[]) => Promise<any>;
}

const containerVariants = {
  hidden: { opacity: 1 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const ProductContent: React.FC<ProductContentProps> = ({
  data,
  categories,
  loading,
  error,
  hasPermission,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onBulkUpdate,
  onBulkDelete
}) => {
  // Logic separated into the view state hook
  const { state, actions } = useProductViewState({
    data,
    categories,
    onUpdateProduct,
    onDeleteProduct,
    onBulkDelete
  });

  // Permissions Centralized
  const permissions = {
    canCreate: hasPermission('products', 'create'),
    canUpdate: hasPermission('products', 'update'),
    canDelete: hasPermission('products', 'delete'),
    canBulkUpload: hasPermission('products', 'bulkUpload'),
    canBulkDelete: hasPermission('products', 'bulkDelete'),
    canExportPdf: hasPermission('products', 'exportPdf'),
    canExportExcel: hasPermission('products', 'exportExcel'),
  };

  // Loading State with Skeleton
  if (loading) return (
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

  // Error State
  if (error && !data) return (
    <div className="text-center p-10 text-red-600 bg-red-50 rounded-lg m-4">
      {error}
    </div>
  );

  return (
    <motion.div
      className="flex-1 flex flex-col overflow-x-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* 1. Header Section - Passing grouped actions */}
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
        </FilterBar>
      </div>

      {/* 3. Main Data View */}
      <motion.div variants={itemVariants} className="w-full">
        {state.filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="bg-gray-100 rounded-full p-6 mb-4">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Products Found</h3>
            <p className="text-gray-500 text-center max-w-md">
              {state.searchTerm || state.selectedCategoryIds.length > 0
                ? "No products match your current filters. Try adjusting your search criteria."
                : "No product records available. Create your first product to get started."}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table - Actions passed from sub-objects */}
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
        {state.filteredProducts.length > state.ITEMS_PER_PAGE && (
          <div className="flex flex-row items-center justify-between p-4 sm:p-6 gap-2 text-sm text-gray-500">
            <p className="whitespace-nowrap text-xs sm:text-sm">
              Showing {state.startIndex + 1} to {Math.min(state.currentPage * state.ITEMS_PER_PAGE, state.filteredProducts.length)} of {state.filteredProducts.length}
            </p>
            <div className="flex items-center gap-1 sm:gap-2">
              {state.currentPage > 1 && (
                <button
                  onClick={() => actions.data.setPage(prev => prev - 1)}
                  className="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200 text-gray-700"
                >
                  Previous
                </button>
              )}
              <span className="flex items-center px-2 font-semibold text-black whitespace-nowrap text-xs sm:text-sm">
                {state.currentPage} / {state.totalPages}
              </span>
              {state.currentPage < state.totalPages && (
                <button
                  onClick={() => actions.data.setPage(prev => prev + 1)}
                  className="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200 text-gray-700"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        )}
      </motion.div>

      {/* 5. Modals - Using grouped modals visibility state */}
      {permissions.canCreate && (
        <AddProductModal
          isOpen={state.modals.add}
          onClose={actions.modals.closeAdd}
          onAddProduct={onAddProduct}
          categories={categories}
        />
      )}

      {permissions.canUpdate && (
        <EditProductModal
          isOpen={state.modals.edit}
          onClose={actions.modals.closeEdit}
          productData={state.selectedProduct}
          categories={categories}
          onSave={actions.data.saveEdit}
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