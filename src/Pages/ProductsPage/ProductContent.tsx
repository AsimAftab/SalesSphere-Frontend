import React, { useState, useMemo, useEffect, useRef } from 'react';
import { MagnifyingGlassIcon, PencilSquareIcon, TrashIcon, ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Loader2, Upload } from 'lucide-react';
import {
  type Product,
  type Category,
  type NewProductFormData,
  type UpdateProductFormData,
  type BulkProductData
} from '../../api/productService';
import Button from '../../components/UI/Button/Button';
import ExportActions from '../../components/UI/ExportActions';
import AddProductModal from '../../components/modals/AddProductModal';
import EditProductModal from '../../components/modals/EditProductModal';
import ConfirmationModal from '../../components/modals/DeleteEntityModal';
import { BulkUploadProductsModal } from '../../components/modals/BulkUploadProductsModal';
import ImagePreviewModal from '../../components/modals/ImagePreviewModal';
import toast from 'react-hot-toast';

interface ProductContentProps {
  data: Product[] | null;
  categories: Category[];
  loading: boolean;
  error: string | null;
  onAddProduct: (productData: NewProductFormData) => Promise<Product>;
  onUpdateProduct: (productId: string, productData: UpdateProductFormData) => Promise<Product>;
  onDeleteProduct: (productId: string) => Promise<any>;
  onBulkUpdate: (products: BulkProductData[]) => Promise<Product[]>;
  onBulkDelete: (productIds: string[]) => Promise<any>;
}

const formatCurrency = (amount: number) => {
  return `RS ${amount.toFixed(2)}`;
};

const containerVariants = {
  hidden: { opacity: 1 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const ProductContentSkeleton: React.FC = () => {
  return (
    <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
      <div className="flex-1 flex flex-col p-4 w-full overflow-x-hidden">
        
        {/* Header Skeleton: Mirrors your Row 1 & Row 2 layout */}
        <div className="flex flex-col gap-6 mb-8 px-1">
          {/* Row 1: Title and Discovery Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <Skeleton width={160} height={36} />
            <div className="flex flex-row flex-wrap items-center justify-start lg:justify-end gap-6 w-full">
              <Skeleton height={40} width={280} borderRadius={999} /> {/* Search bar */}
              <div className="flex items-center gap-6">
                <Skeleton height={40} width={40} borderRadius={8} /> {/* Filter icon */}
                <Skeleton height={40} width={80} borderRadius={8} /> {/* Export icon */}
              </div>
            </div>
          </div>

          {/* Row 2: Add Buttons Row */}
          <div className="flex flex-row items-center justify-end gap-6 w-full border-t border-gray-100 pt-6">
            <Skeleton height={40} width={140} borderRadius={8} /> {/* Bulk Upload */}
            <Skeleton height={40} width={160} borderRadius={8} /> {/* Add Product */}
          </div>
        </div>

        {/* Desktop Table Skeleton (Hidden on Mobile) */}
        <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mx-1">
          <div className="bg-gray-50 px-5 py-4 border-b border-gray-100">
            <Skeleton height={20} width="100%" />
          </div>
          <div className="p-2 space-y-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="px-5 py-2 flex items-center gap-4">
                <Skeleton width={20} height={20} />
                <Skeleton width={40} height={40} borderRadius={8} />
                <Skeleton height={24} containerClassName="flex-1" />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Card Skeleton (Hidden on Desktop) */}
        <div className="md:hidden space-y-4 px-1">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-4">
              <div className="flex items-center gap-4">
                <Skeleton width={64} height={64} borderRadius={12} /> {/* Product Image */}
                <div className="flex-1">
                  <Skeleton width="70%" height={16} className="mb-2" />
                  <Skeleton width="40%" height={12} />
                </div>
                <Skeleton width={20} height={20} borderRadius={4} />
              </div>
              <div className="grid grid-cols-2 gap-4 py-3 border-t border-b border-gray-50">
                <Skeleton height={30} />
                <Skeleton height={30} />
              </div>
              <div className="flex justify-end gap-6 pt-1">
                <Skeleton width={50} height={15} />
                <Skeleton width={50} height={15} />
              </div>
            </div>
          ))}
        </div>

      </div>
    </SkeletonTheme>
  );
};

const ProductContent: React.FC<ProductContentProps> = ({
  data,
  categories,
  loading,
  error,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onBulkUpdate,
  onBulkDelete
}) => {
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isBulkDeleteModalOpen, setBulkDeleteModalOpen] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [exportingStatus, setExportingStatus] = useState<'pdf' | 'excel' | null>(null);
  const [isBulkModalOpen, setBulkModalOpen] = useState(false);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPreviewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewImages, setPreviewImages] = useState<{ url: string, description: string }[]>([]);
  const ITEMS_PER_PAGE = 10;

  const filterDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredProducts = useMemo(() => {
    if (!data) return [];
    return data.filter(product => {
      const matchesSearch = product.productName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategoryIds.length === 0 ||
        (product.category?._id && selectedCategoryIds.includes(product.category._id));
      return matchesSearch && matchesCategory;
    });
  }, [data, searchTerm, selectedCategoryIds]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const toggleSelectProduct = (id: string) => {
    setSelectedProductIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        if (prev.length >= 100) {
          toast.error("Maximum 100 products can be selected for bulk deletion.");
          return prev;
        }
        return [...prev, id];
      }
    });
  };

  const toggleSelectAll = () => {
    if (selectedProductIds.length > 0) {
      setSelectedProductIds([]);
    } else {
      const batchToDelete = filteredProducts.slice(0, 100).map(p => p._id);
      setSelectedProductIds(batchToDelete);
      if (filteredProducts.length > 100) {
        toast.success("First 100 products selected (bulk limit).");
      }
    }
  };

  const handleImageClick = (product: Product) => {
    if (product.image?.url) {
      setPreviewImages([{ url: product.image.url, description: product.productName }]);
      setPreviewModalOpen(true);
    }
  }

  const confirmSingleDelete = async () => {
    if (selectedProduct) {
      await onDeleteProduct(selectedProduct._id);
    }
    setDeleteModalOpen(false);
    setSelectedProduct(null);
  };

  const handleBulkDeleteConfirm = async () => {
    if (selectedProductIds.length > 0) {
      await onBulkDelete(selectedProductIds);
      setSelectedProductIds([]);
      setBulkDeleteModalOpen(false);
    }
  };

  const toggleCategory = (id: string) => {
    setSelectedCategoryIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const clearCategoryFilters = () => {
    setSelectedCategoryIds([]);
  };

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product);
    setDeleteModalOpen(true);
  };

  const handleExportPdf = async () => {
    setExportingStatus('pdf');
    try {
      const { pdf } = await import('@react-pdf/renderer');
      const ProductListPDF = (await import('./ProductListPDF')).default;
      const doc = <ProductListPDF products={filteredProducts} />;
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 100);
      toast.success('PDF opened in new tab!');
    } catch (err) {
      toast.error('Failed to generate PDF.');
    } finally {
      setExportingStatus(null);
    }
  };

  const handleExportExcel = async () => {
    setExportingStatus('excel');
    try {
      const ExcelJS = await import('exceljs');
      const { saveAs } = await import('file-saver');
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Products');
      worksheet.columns = [
        { header: 'S.No.', key: 'sno', width: 8, style: { alignment: { horizontal: 'center' } } },
        { header: 'Product Name', key: 'productName', width: 35 },
        { header: 'Category', key: 'category', width: 25 },
        { header: 'Serial No.', key: 'serialNo', width: 20 },
        { header: 'Stock (Qty)', key: 'qty', width: 12, style: { numFmt: '0', alignment: { horizontal: 'center' } } },
        { header: 'Price', key: 'price', width: 15, style: { numFmt: '"RS" #,##0.00' } },
      ];
      worksheet.getRow(1).eachCell((cell: any) => {
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF3B82F6' } };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      });
      filteredProducts.forEach((product, index) => {
        worksheet.addRow({
          sno: index + 1,
          productName: product.productName,
          category: product.category?.name || 'N/A',
          serialNo: product.serialNo || 'N/A',
          qty: product.qty,
          price: product.price,
        });
      });
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `Products_Export_${new Date().toLocaleDateString()}.xlsx`);
      toast.success('Excel exported successfully!');
    } catch (error) {
      toast.error('Failed to generate Excel.');
    } finally {
      setExportingStatus(null);
    }
  };

  const handleSaveEdit = async (formData: UpdateProductFormData): Promise<Product> => {
    if (!selectedProduct) throw new Error("No product selected");
    const updatedProduct = await onUpdateProduct(selectedProduct._id, formData);
    setEditModalOpen(false);
    setSelectedProduct(null);
    return updatedProduct;
  };

  if (loading && !data) return <ProductContentSkeleton />;
  if (error && !data) return <div className="text-center p-10 text-red-600 bg-red-50 rounded-lg m-4">{error}</div>;

  return (
    <motion.div className="flex-1 flex flex-col overflow-x-hidden" variants={containerVariants} initial="hidden" animate="show">
      {exportingStatus && (
        <div className="w-full p-4 mb-4 text-center bg-blue-100 text-blue-800 rounded-lg">
          {exportingStatus === 'pdf' ? 'Generating PDF...' : 'Generating Excel...'} Please wait.
        </div>
      )}

   <motion.div variants={itemVariants} className="flex flex-col gap-6 mb-6 px-1 md:px-0">
        
        {/* ROW 1: Title (Left) and Discovery Controls (Right) */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-shrink-0">
            <h1 className="text-3xl font-bold text-[#202224]">Products</h1>
          </div>

          <div className="flex flex-col sm:flex-row sm:flex-wrap items-center justify-end gap-3 w-full lg:w-auto">
            {/* Search Bar */}
            <div className="relative w-full sm:w-64">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input 
                          type="search" 
                          value={searchTerm} 
                          onChange={(e) => setSearchTerm(e.target.value)} 
                          placeholder="Search by Product Name" 
                          className="h-10 w-full bg-gray-200 border-none pl-10 pr-4 rounded-full text-sm shadow-sm outline-none focus:ring-2 focus:ring-secondary" />
                      </div>

            {/* Categories Dropdown */}
            <div className="relative w-full sm:w-48" ref={filterDropdownRef}>
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)} 
                className="flex items-center justify-between w-full h-11 px-4 bg-white border border-gray-300 rounded-xl text-sm text-gray-700 hover:border-secondary transition-colors"
              >
                <span className="truncate">
                  {selectedCategoryIds.length === 0 ? "All Categories" : `${selectedCategoryIds.length} Selected`}
                </span>
                <ChevronDownIcon className={`w-4 h-4 text-gray-500 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isFilterOpen && (
                <div className="absolute right-0 z-30 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-72 overflow-hidden flex flex-col w-full sm:w-64">
                  <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Filter</span>
                    {selectedCategoryIds.length > 0 && (
                      <button onClick={clearCategoryFilters} className="text-xs text-blue-600 font-semibold flex items-center gap-1">
                        <XMarkIcon className="w-3 h-3" /> Clear
                      </button>
                    )}
                  </div>
                  <div className="overflow-y-auto py-2 max-h-60">
                    {categories.map((cat) => (
                      <label key={cat._id} className="flex items-center gap-3 px-4 py-2 hover:bg-blue-50 cursor-pointer">
                        <input type="checkbox" checked={selectedCategoryIds.includes(cat._id)} onChange={() => toggleCategory(cat._id)} className="w-4 h-4 rounded text-secondary" />
                        <span className="text-sm text-gray-700">{cat.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Mass Delete */}
            {selectedProductIds.length > 0 && (
              <Button variant="danger" onClick={() => setBulkDeleteModalOpen(true)} className="w-full sm:w-auto h-11 px-4 shadow-sm flex items-center justify-center gap-2">
                <TrashIcon className="h-5 w-5" />
                <span>Delete ({selectedProductIds.length})</span>
              </Button>
            )}

            {/* Export Actions */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
              <ExportActions onExportPdf={handleExportPdf} onExportExcel={handleExportExcel} />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 w-full">
          <Button 
            variant="secondary" 
            onClick={() => setBulkModalOpen(true)} 
            className="w-full sm:w-auto h-11 px-6 border-gray-300 text-gray-700 flex items-center justify-center gap-2"
          >
            <Upload className="h-5 w-5" />
            Bulk Upload
          </Button>

          <Button 
            variant="primary" 
            onClick={() => setAddModalOpen(true)} 
            className="w-full sm:w-auto h-11 px-8 shadow-md"
          >
            Add New Product
          </Button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="w-full">
        {filteredProducts.length === 0 ? (
          <div className="text-center p-10 text-gray-500 bg-white rounded-lg shadow-sm">No Products found.</div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="md:hidden space-y-4 px-1">
              {currentProducts.map((product) => (
                <div key={product._id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center gap-4 mb-3">
                    {product.image?.url ? (
                      <img src={product.image.url} alt={product.productName} className="h-16 w-16 rounded-md object-cover" onClick={() => handleImageClick(product)} />
                    ) : (
                      <div className="h-16 w-16 rounded-md bg-secondary flex items-center justify-center text-white font-bold text-xl">{product.productName.substring(0, 2).toUpperCase()}</div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 leading-tight">{product.productName}</h3>
                      <p className="text-sm text-gray-500">{product.category?.name || 'No Category'}</p>
                      <p className="text-xs text-gray-400 mt-1">SN: {product.serialNo || 'N/A'}</p>
                    </div>
                    <input type="checkbox" checked={selectedProductIds.includes(product._id)} onChange={() => toggleSelectProduct(product._id)} className="h-5 w-5 rounded border-gray-300 text-blue-600" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 py-3 border-t border-b border-gray-50">
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">Price</p>
                      <p className="text-sm font-bold text-blue-600">{formatCurrency(product.price)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">Stock</p>
                      <p className="text-sm font-bold text-gray-900">{product.qty} units</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-4 mt-3">
                    <button onClick={() => handleEditClick(product)} className="flex items-center gap-1 text-blue-700 font-medium text-sm"><PencilSquareIcon className="h-5 w-5" /> Edit</button>
                    <button onClick={() => handleDeleteClick(product)} className="flex items-center gap-1 text-red-600 font-medium text-sm"><TrashIcon className="h-5 w-5" /> Delete</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="bg-white rounded-lg shadow-sm overflow-x-auto hidden md:block relative">
              {loading && data && <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10 rounded-lg"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /></div>}
              <table className="w-full">
                <thead className="bg-secondary text-white text-left text-sm">
                  <tr>
                    <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">
                      <input type="checkbox" className="rounded border-gray-300" checked={selectedProductIds.length > 0 && selectedProductIds.length === Math.min(filteredProducts.length, 100)} onChange={toggleSelectAll} />
                    </th>
                    <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">S.No.</th>
                    <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Image</th>
                    <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Serial No.</th>
                    <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Product Name</th>
                    <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Category</th>
                    <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Price</th>
                    <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Stock (Qty)</th>
                    <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {currentProducts.map((product, index) => (
                    <tr key={product._id} className={`${selectedProductIds.includes(product._id) ? 'bg-blue-100' : 'hover:bg-gray-200'}`}>
                      <td className="px-5 py-3 text-black text-sm"><input type="checkbox" checked={selectedProductIds.includes(product._id)} onChange={() => toggleSelectProduct(product._id)} className="rounded border-gray-300" /></td>
                      <td className="px-5 py-3 text-black text-sm">{startIndex + index + 1}</td>
                      <td className="px-5 py-3 text-black text-sm">
                        {product.image?.url ? (
                          <img src={product.image.url} alt={product.productName} className="h-10 w-10 rounded-md object-cover cursor-pointer" onClick={() => handleImageClick(product)} />
                        ) : (
                          <div className="h-10 w-10 rounded-md bg-secondary flex items-center justify-center text-white font-bold">{product.productName.substring(0, 2).toUpperCase()}</div>
                        )}
                      </td>
                      <td className="px-5 py-3 text-black text-sm">{product.serialNo || 'N/A'}</td>
                      <td className="px-5 py-3 text-black text-sm">{product.productName}</td>
                      <td className="px-5 py-3 text-black text-sm">{product.category?.name || 'N/A'}</td>
                      <td className="px-5 py-3 text-black text-sm">{formatCurrency(product.price)}</td>
                      <td className="px-5 py-3 text-black text-sm">{product.qty}</td>
                      <td className="px-5 py-3 text-black text-sm">
                        <div className="flex items-center gap-x-3">
                          <button onClick={() => handleEditClick(product)} className="text-blue-700"><PencilSquareIcon className="h-5 w-5" /></button>
                          <button onClick={() => handleDeleteClick(product)} className="text-red-600"><TrashIcon className="h-5 w-5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Pagination Section */}
        {filteredProducts.length > 0 && totalPages > 1 && (
          // FIX: Changed from flex-col to flex-row to keep everything on one line like desktop
          <div className="flex flex-row items-center justify-between p-4 sm:p-6 gap-2 text-sm text-gray-500">
            <p className="whitespace-nowrap text-xs sm:text-sm">
              Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, filteredProducts.length)} of {filteredProducts.length}
            </p>
            <div className="flex items-center gap-1 sm:gap-2">
              {currentPage > 1 && <Button onClick={() => setCurrentPage(prev => prev - 1)} variant="secondary" className="px-2 py-1 text-xs">Prev</Button>}
              <span className="flex items-center px-2 font-semibold text-black whitespace-nowrap text-xs sm:text-sm">
                {currentPage} / {totalPages}
              </span>
              {currentPage < totalPages && <Button onClick={() => setCurrentPage(prev => prev + 1)} variant="secondary" className="px-2 py-1 text-xs">Next</Button>}
            </div>
          </div>
        )}
      </motion.div>

      <AddProductModal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} onAddProduct={onAddProduct} categories={categories} />
      <EditProductModal isOpen={isEditModalOpen} onClose={() => { setEditModalOpen(false); setSelectedProduct(null); }} productData={selectedProduct} categories={categories} onSave={handleSaveEdit} />
      <ConfirmationModal isOpen={isDeleteModalOpen} message={`Are you sure you want to delete "${selectedProduct?.productName}"?`} onConfirm={confirmSingleDelete} onCancel={() => { setDeleteModalOpen(false); setSelectedProduct(null); }} confirmButtonText="Delete" confirmButtonVariant="danger" />
      <ConfirmationModal isOpen={isBulkDeleteModalOpen} message={`Are you sure you want to permanently delete ${selectedProductIds.length} selected products? (Max 100 per batch)`} onConfirm={handleBulkDeleteConfirm} onCancel={() => setBulkDeleteModalOpen(false)} confirmButtonText="Mass Delete" confirmButtonVariant="danger" />
      <BulkUploadProductsModal isOpen={isBulkModalOpen} onClose={() => setBulkModalOpen(false)} onBulkUpdate={onBulkUpdate} />
      <ImagePreviewModal isOpen={isPreviewModalOpen} onClose={() => setPreviewModalOpen(false)} images={previewImages} />
    </motion.div>
  );
};

export default ProductContent;