import React, { useState, useMemo, useEffect, useRef } from 'react'; // Added useEffect, useRef
import { MagnifyingGlassIcon, PencilSquareIcon, TrashIcon, ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline'; // Added XMarkIcon
import { motion} from 'framer-motion';
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
  const ITEMS_PER_PAGE = 10;
  return (
    <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold"><Skeleton width={150} height={36} /></h1>
          <div className="flex flex-col md:flex-row md:items-center md:flex-wrap md:justify-start gap-4 w-full xl:w-auto">
            <Skeleton height={40} width={256} borderRadius={999} />
            <Skeleton height={40} width={100} borderRadius={8} />
            <Skeleton height={40} width={160} borderRadius={8} />
            <Skeleton height={40} width={100} borderRadius={8} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <Skeleton height={40} borderRadius={8} className="mb-2" />
          {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
            <Skeleton key={i} height={50} borderRadius={4} className="mb-1" />
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

  // Ref for handling click outside
  const filterDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
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

  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

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

  // Clear category selections
  const clearCategoryFilters = () => {
    setSelectedCategoryIds([]);
  };

  if (loading && !data) return <ProductContentSkeleton />;
  if (error && !data) return <div className="text-center p-10 text-red-600 bg-red-50 rounded-lg">{error}</div>;
  if (!data && !loading) return <div className="text-center p-10 text-gray-500">No products found.</div>;

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
      const { saveAs } = await import('file-saver');
      const ProductListPDF = (await import('./ProductListPDF')).default;
      const doc = <ProductListPDF products={filteredProducts} />;
      const blob = await pdf(doc).toBlob();
      saveAs(blob, 'ProductList.pdf');
      toast.success('PDF exported successfully!');
    } catch (err) {
      toast.error('Failed to generate PDF. Please try again.');
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
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF3B82F6' },
        };
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFD1D5DB' } },
          left: { style: 'thin', color: { argb: 'FFD1D5DB' } },
          bottom: { style: 'thin', color: { argb: 'FFD1D5DB' } },
          right: { style: 'thin', color: { argb: 'FFD1D5DB' } }
        };
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
      worksheet.eachRow({ includeEmpty: false }, (row: any, rowNumber: number) => {
        if (rowNumber > 1) {
          row.eachCell((cell: any) => {
            cell.border = {
              top: { style: 'thin', color: { argb: 'FFD1D5DB' } },
              left: { style: 'thin', color: { argb: 'FFD1D5DB' } },
              bottom: { style: 'thin', color: { argb: 'FFD1D5DB' } },
              right: { style: 'thin', color: { argb: 'FFD1D5DB' } }
            };
          });
        }
      });
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'ProductList.xlsx');
      toast.success('Excel exported successfully!');
    } catch (error) {
      toast.error('Failed to generate Excel. Please try again.');
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

  return (
    <motion.div className="flex-1 flex flex-col" variants={containerVariants} initial="hidden" animate="show">
      {exportingStatus && (
        <div className="w-full p-4 mb-4 text-center bg-blue-100 text-blue-800 rounded-lg">
          {exportingStatus === 'pdf' ? 'Generating PDF...' : 'Generating Excel...'} Please wait.
        </div>
      )}

      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:flex-wrap md:items-center md:justify-between gap-4 mb-8">
        <div className="flex-shrink-0">
          <h1 className="text-3xl font-bold text-[#202224]">Products</h1>
        </div>

        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by Product Name"
                className="h-10 w-full bg-gray-200 border border-gray-200 pl-10 pr-4 rounded-full text-sm shadow-sm outline-none focus:ring-2 focus:ring-secondary"
              />
          </div>

          <div className="relative w-full sm:w-48" ref={filterDropdownRef}>
            <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="flex items-center justify-between w-full h-10 px-4 bg-white border border-gray-300 rounded-lg text-sm text-gray-700">
              <span className="truncate">{selectedCategoryIds.length === 0 ? "All Categories" : `${selectedCategoryIds.length} Selected`}</span>
              <ChevronDownIcon className={`w-4 h-4 text-gray-500 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>
            {isFilterOpen && (
              <div className="absolute left-0 right-0 z-20 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-72 overflow-hidden flex flex-col">
                <div className="p-2 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                  <span className="text-xs font-semibold text-gray-500 uppercase px-2">Filter</span>
                  {selectedCategoryIds.length > 0 && (
                    <button 
                      onClick={clearCategoryFilters}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium px-2 py-1 flex items-center gap-1"
                    >
                      <XMarkIcon className="w-3 h-3" /> Clear
                    </button>
                  )}
                </div>
                <div className="overflow-y-auto py-1 max-h-56">
                  {categories.map((cat) => (
                    <label key={cat._id} className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 cursor-pointer">
                      <input type="checkbox" checked={selectedCategoryIds.includes(cat._id)} onChange={() => toggleCategory(cat._id)} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                      <span className="text-sm text-gray-600">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {selectedProductIds.length > 0 && (
            <Button variant="danger" onClick={() => setBulkDeleteModalOpen(true)} className="whitespace-nowrap flex items-center gap-2">
              <TrashIcon className="h-5 w-5" /> Mass Delete ({selectedProductIds.length})
            </Button>
          )}
          <ExportActions onExportPdf={handleExportPdf} onExportExcel={handleExportExcel} />
          
          <Button variant="primary" onClick={() => setBulkModalOpen(true)} className="whitespace-nowrap flex items-center gap-2">
            <Upload className="h-5 w-5" /> Bulk Upload
          </Button>

          <Button variant="primary" onClick={() => setAddModalOpen(true)} className="w-full sm:w-auto">Add New Product</Button>

          
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        {filteredProducts.length === 0 ? (
          <div className="text-center p-10 text-gray-500 bg-white rounded-lg shadow-sm">No Products found.</div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-x-auto hidden md:block relative">
            {loading && data && <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10 rounded-lg"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /></div>}
            <table className="w-full">
              <thead className="bg-secondary text-white text-left text-sm">
                <tr>
                  <th className="p-3">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      checked={selectedProductIds.length > 0 && selectedProductIds.length === Math.min(filteredProducts.length, 100)}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="p-3 font-semibold">S.No.</th>
                  <th className="p-3 font-semibold">Image</th>
                  <th className="p-3 font-semibold">Serial No.</th>
                  <th className="p-3 font-semibold">Product Name</th>
                  <th className="p-3 font-semibold">Category</th>
                  <th className="p-3 font-semibold">Price</th>
                  <th className="p-3 font-semibold">Stock (Qty)</th>
                  <th className="p-3 font-semibold rounded-tr-lg">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {currentProducts.map((product, index) => (
                  <tr key={product._id} className={`${selectedProductIds.includes(product._id) ? 'bg-blue-50' : 'hover:bg-gray-200'}`}>
                    <td className="p-3">
                      <input 
                        type="checkbox" 
                        checked={selectedProductIds.includes(product._id)}
                        onChange={() => toggleSelectProduct(product._id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </td>
                    <td className="p-3 text-black">{startIndex + index + 1}</td>
                    <td className="p-3">
                      {product.image?.url ? (
                        <img src={product.image.url} alt={product.productName} className="h-10 w-10 rounded-md object-cover cursor-pointer hover:opacity-80 transition-opacity" onClick={() => handleImageClick(product)} />
                      ) : (
                        <div className="h-10 w-10 rounded-md bg-secondary flex items-center justify-center text-white font-bold">{product.productName.substring(0, 2).toUpperCase()}</div>
                      )}
                    </td>
                    <td className="p-3 text-black">{product.serialNo || 'N/A'}</td>
                    <td className="p-3 text-black font-medium">{product.productName}</td>
                    <td className="p-3 text-black">{product.category?.name || 'N/A'}</td>
                    <td className="p-3 text-black">{formatCurrency(product.price)}</td>
                    <td className="p-3 text-black">{product.qty}</td>
                    <td className="p-3">
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
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 text-sm text-gray-600">
            <p>Showing {startIndex + 1} - {Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length}</p>
            <div className="flex items-center gap-x-2">
              {currentPage > 1 && <Button onClick={() => goToPage(currentPage - 1)} variant="secondary">Previous</Button>}
              <span className="font-semibold">{currentPage} / {totalPages}</span>
              {currentPage < totalPages && <Button onClick={() => goToPage(currentPage + 1)} variant="secondary">Next</Button>}
            </div>
          </div>
        )}
      </motion.div>

      <AddProductModal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} onAddProduct={onAddProduct} categories={categories} />
      <EditProductModal isOpen={isEditModalOpen} onClose={() => { setEditModalOpen(false); setSelectedProduct(null); }} productData={selectedProduct} categories={categories} onSave={handleSaveEdit} />
      
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        message={`Are you sure you want to delete "${selectedProduct?.productName}"?`}
        onConfirm={confirmSingleDelete}
        onCancel={() => { setDeleteModalOpen(false); setSelectedProduct(null); }}
        confirmButtonText="Delete"
        confirmButtonVariant="danger"
      />

      <ConfirmationModal
        isOpen={isBulkDeleteModalOpen}
        message={`Are you sure you want to permanently delete ${selectedProductIds.length} selected products? (Max 100 per batch)`}
        onConfirm={handleBulkDeleteConfirm}
        onCancel={() => setBulkDeleteModalOpen(false)}
        confirmButtonText="Mass Delete"
        confirmButtonVariant="danger"
      />

      <BulkUploadProductsModal isOpen={isBulkModalOpen} onClose={() => setBulkModalOpen(false)} onBulkUpdate={onBulkUpdate} />
      <ImagePreviewModal isOpen={isPreviewModalOpen} onClose={() => setPreviewModalOpen(false)} images={previewImages} />
    </motion.div>
  );
};

export default ProductContent;