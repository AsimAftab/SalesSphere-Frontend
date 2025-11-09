import React, { useState, useMemo, useRef } from 'react';
import * as ExcelJS from 'exceljs';
import { MagnifyingGlassIcon, PencilSquareIcon, TrashIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
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
import ImportStatusModal from '../../components/modals/ImportStatusModal';

interface ProductContentProps {
    data: Product[] | null;
    categories: Category[];
    loading: boolean;
    error: string | null;
    onAddProduct: (productData: NewProductFormData) => Promise<Product>;
    onUpdateProduct: (productId: string, productData: UpdateProductFormData) => Promise<Product>;
    onDeleteProduct: (productId: string) => Promise<any>;
    onBulkUpdate: (products: BulkProductData[]) => Promise<Product[]>;
}

// --- ADDED: Helper to format currency consistently ---
const formatCurrency = (amount: number) => {
  // Matches the .toFixed(2) format in your original table
  return `RS ${amount.toFixed(2)}`;
};

const ProductContent: React.FC<ProductContentProps> = ({ 
    data, 
    categories, 
    loading, 
    error, 
    onAddProduct, 
    onUpdateProduct, 
    onDeleteProduct,
    onBulkUpdate
}) => {
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [exportingStatus, setExportingStatus] = useState<'pdf' | 'excel' | null>(null);
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [importStatus, setImportStatus] = useState<'processing' | 'success' | 'error' | null>(null);
    const [importMessage, setImportMessage] = useState('');
    
    const ITEMS_PER_PAGE = 10;

    const filteredProducts = useMemo(() => {
        if (!data) return [];
        setCurrentPage(1); 
        return data.filter(product =>
            product.productName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [data, searchTerm]);

    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentProducts = filteredProducts.slice(startIndex, endIndex);

    const goToPage = (pageNumber: number) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    if (loading) return (
      <div className="flex-1 flex items-center justify-center p-10">
          <p className="text-gray-500">Loading Products...</p>
      </div>
    );
    if (error) return <div className="text-center p-10 text-red-600 bg-red-50 rounded-lg">{error}</div>;
    if (!data) return <div className="text-center p-10 text-gray-500">No products found.</div>;

    const handleEditClick = (product: Product) => {
        setSelectedProduct(product);
        setEditModalOpen(true);
    };

    const handleDeleteClick = (product: Product) => {
        setSelectedProduct(product);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => { 
        if (selectedProduct) {
            await onDeleteProduct(selectedProduct._id); 
        }
        setDeleteModalOpen(false);
        setSelectedProduct(null);
    };
    

    const handleExportPdf = async () => {
        setExportingStatus('pdf');
        try {
            // --- LAZY LOADING ---
            const { pdf } = await import('@react-pdf/renderer');
            const { saveAs } = await import('file-saver');
            const ProductListPDF = (await import('./ProductListPDF')).default;
            // --- END LAZY LOADING ---

            const doc = <ProductListPDF products={filteredProducts} />;
            const blob = await pdf(doc).toBlob();
            saveAs(blob, 'ProductList.pdf');
        } catch (err) {
            console.error("Failed to generate PDF", err);
        } finally {
            setExportingStatus(null);
        }
    };

    const handleExportExcel = async () => {
        setExportingStatus('excel');
        try {
            // --- LAZY LOADING ---
            const ExcelJS = await import('exceljs');
            const { saveAs } = await import('file-saver');
            // --- END LAZY LOADING ---

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
            
            worksheet.getRow(1).eachCell((cell: ExcelJS.Cell) => {
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

            worksheet.eachRow({ includeEmpty: false }, (row: ExcelJS.Row, rowNumber: number) => {
                if (rowNumber > 1) { 
                    row.eachCell((cell: ExcelJS.Cell) => {
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

        } catch (error) {
            console.error("Failed to generate Excel", error);
        } finally {
            setExportingStatus(null);
        }
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setImportStatus('processing');
        setImportMessage('Reading and processing your Excel file...');

        const reader = new FileReader();
        
        reader.onload = async (e) => {
            try {
                const data = e.target?.result;
                if (!data) {
                    throw new Error("Failed to read file buffer.");
                }

                // --- LAZY LOADING ---
                const ExcelJS = await import('exceljs');
                // --- END LAZY LOADING ---

                const workbook = new ExcelJS.Workbook();
                await workbook.xlsx.load(data as ArrayBuffer);

                const worksheet = workbook.worksheets[0];
                if (!worksheet) {
                    throw new Error("No worksheets found in the file.");
                }

                const productsToUpdate: BulkProductData[] = [];
                const headerMap: Record<string, number> = {};

                const headerRow = worksheet.getRow(1);
                if (headerRow.cellCount === 0) {
                     throw new Error("The Excel file is empty.");
                }
                
                headerRow.eachCell((cell: ExcelJS.Cell, colNumber: number) => {
                    headerMap[cell.value as string] = colNumber;
                });

                const requiredHeaders = ['Product Name', 'Category', 'Price', 'Piece'];
                for (const header of requiredHeaders) {
                    if (!headerMap[header]) {
                        throw new Error(`The Excel file is missing the required column: '${header}'.`);
                    }
                }
                
                worksheet.eachRow({ includeEmpty: false }, (row: ExcelJS.Row, rowNumber: number) => {
                    if (rowNumber === 1) return; // Skip header row

                    const name = row.getCell(headerMap['Product Name']).value as string;
                    const category = row.getCell(headerMap['Category']).value as string;
                    
                    const priceCell = row.getCell(headerMap['Price']).value;
                    let price: number;
                    if (typeof priceCell === 'number') {
                        price = priceCell;
                    } else {
                        price = parseFloat(String(priceCell).replace(/[^0-9.]/g, '')) || 0;
                    }

                    const pieceCell = row.getCell(headerMap['Piece']).value;
                    let piece: number;
                     if (typeof pieceCell === 'number') {
                        piece = pieceCell;
                    } else {
                        piece = parseInt(String(pieceCell), 10) || 0;
                    }

                    if (!name || isNaN(price) || isNaN(piece)) {
                        console.warn(`Skipping invalid row: ${rowNumber}`);
                        return;
                    }

                    productsToUpdate.push({
                        name,
                        category: category || 'Uncategorized',
                        price,
                        piece
                    });
                });
                
                if (productsToUpdate.length === 0) {
                    throw new Error("No valid data rows found in the file.");
                }

                await onBulkUpdate(productsToUpdate);

                setImportStatus('success');
                setImportMessage(`${productsToUpdate.length} products were successfully processed. The list has been updated.`);

            } catch (error: any) {
                setImportStatus('error');
                setImportMessage(error.message || 'An unexpected error occurred during import.');
            } finally {
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }
        };

        reader.onerror = () => {
            setImportStatus('error');
            setImportMessage('Failed to read the file.');
        };
        
        reader.readAsArrayBuffer(file);
    };

    const handleSaveEdit = async (formData: UpdateProductFormData): Promise<Product> => {
        if (!selectedProduct) {
            throw new Error("No product selected"); 
        }
        try {
            const updatedProduct = await onUpdateProduct(selectedProduct._id, formData);
            setEditModalOpen(false);
            setSelectedProduct(null);
            return updatedProduct; 
        } catch (error) {
            console.error(error);
            throw error; 
        }
    };


    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            {/* ... (Header JSX is unchanged) ... */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between mb-8 gap-4">
                 <h1 className="text-3xl font-bold text-[#202224] text-center md:text-left">Products</h1>
                  <div className="flex flex-col md:flex-row md:items-center md:flex-wrap md:justify-start gap-4 w-full xl:w-auto">
                      <div className="relative w-full md:w-auto">
                          <MagnifyingGlassIcon className="pointer-events-none absolute inset-y-0 left-3 h-full w-5 text-gray-500" />
                          <input
                              type="search"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              placeholder="Search by Product Name "
                              className="block h-10 w-full md:w-64 border-transparent bg-gray-200 py-0 pl-10 pr-3 text-gray-900 placeholder:text-gray-500 focus:ring-0 sm:text-sm rounded-full"
                          /> 
                      </div>
                  
                      <Button variant="primary" onClick={handleImportClick}>
                          Import
                          <ArrowUpTrayIcon className="h-5 w-5 ml-2" />
                      </Button>
                      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".xlsx, .xls"/>
                      
                      <Button variant="primary" onClick={() => setAddModalOpen(true)}>Add New Product</Button>
                      
                      <div className="flex justify-center md:justify-start w-full md:w-auto">
                          <ExportActions onExportPdf={handleExportPdf} onExportExcel={handleExportExcel} />
                      </div>
                  </div>
            </div>

            {exportingStatus && (
                <div className="w-full p-4 mb-4 text-center bg-blue-100 text-blue-800 rounded-lg">
                    {exportingStatus === 'pdf' ? 'Generating PDF...' : 'Generating Excel...'} Please wait.
                </div>
            )}

            {filteredProducts.length === 0 && !loading ? (
                <div className="text-center p-10 text-gray-500 bg-white rounded-lg shadow-sm">
                    No Products found.
                </div>
            ) : (
            <>
                {/* --- ADDED: Mobile Card View --- */}
                <div className="block md:hidden space-y-4">
                  {currentProducts.map((product) => (
                    <div 
                      key={product._id} 
                      className="bg-white rounded-lg shadow-sm p-4 border border-gray-200"
                    >
                      {/* Card Header */}
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          {/* Image Logic */}
                          {product.image?.url ? (
                            <img 
                              src={product.image.url} 
                              alt={product.productName || 'Product'} 
                              className="h-10 w-10 rounded-md object-cover" 
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-md bg-secondary flex items-center justify-center">
                              <span className="text-lg font-semibold text-white">
                                {product.productName ? product.productName.substring(0, 2).toUpperCase() : '?'}
                              </span>
                            </div>
                          )}
                          {/* Name & Category */}
                          <div>
                            <div className="font-bold text-gray-800">
                              {product.productName}
                            </div>
                            <div className="text-sm text-gray-600">
                              {product.category?.name || 'N/A'}
                            </div>
                          </div>
                        </div>
                        {/* Stock Badge */}
                        <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                          Stock: {product.qty}
                        </span>
                      </div>

                      {/* Card Body */}
                      <div className="border-t border-gray-100 pt-3 text-sm space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Price:</span>
                          <span className="font-medium text-black">
                            {formatCurrency(product.price)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Serial No:</span>
                          <span className="font-medium text-black">
                            {product.serialNo || 'N/A'}
                          </span>
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div className="border-t border-gray-100 mt-3 pt-3 flex justify-end items-center gap-x-4">
                        <button onClick={() => handleEditClick(product)} className="text-blue-700 transition-colors flex items-center gap-1 text-sm">
                          <PencilSquareIcon className="h-5 w-5" /> Edit
                        </button>
                        <button onClick={() => handleDeleteClick(product)} className="text-red-600 transition-colors flex items-center gap-1 text-sm">
                          <TrashIcon className="h-5 w-5" /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* --- MODIFIED: Desktop Table View --- */}
                {/* Added "hidden md:block" to hide this on mobile */}
                <div className="bg-white rounded-lg shadow-sm overflow-x-auto hidden md:block">
                    <table className="w-full">
                        <thead className="bg-secondary text-white text-left text-sm">
                            <tr>
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
                                <tr key={product._id} className="hover:bg-gray-200">
                                    <td className="p-3 whitespace-nowrap text-black">{startIndex + index + 1}</td>
                                    
                                    <td className="p-3 whitespace-nowrap">
                                        {product.image?.url ? (
                                            <img 
                                                src={product.image.url} 
                                                alt={product.productName || 'Product'} 
                                                className="h-10 w-10 rounded-md object-cover" 
                                            />
                                        ) : (
                                            <div className="h-10 w-10 rounded-md bg-secondary flex items-center justify-center">
                                                <span className="text-lg font-semibold text-white">
                                                    {product.productName ? product.productName.substring(0, 2).toUpperCase() : '?'}
                                                </span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-3 whitespace-nowrap text-black">{product.serialNo || 'N/A'}</td>
                                    {/* --- MODIFIED: Added font-medium --- */}
                                    <td className="p-3 whitespace-nowrap text-black font-medium">{product.productName}</td>
                                    <td className="p-3 whitespace-nowrap text-black">{product.category?.name || 'N/A'}</td>
                                    {/* --- MODIFIED: Used formatCurrency --- */}
                                    <td className="p-3 whitespace-nowrap text-black">{formatCurrency(product.price)}</td>
                                    <td className="p-3 whitespace-nowrap text-black">{product.qty}</td>
                                    <td className="p-3 whitespace-nowrap">
                                        <div className="flex items-center gap-x-3">
                                            <button onClick={() => handleEditClick(product)} className="text-blue-700 transition-colors"><PencilSquareIcon className="h-5 w-5" /></button>
                                            <button onClick={() => handleDeleteClick(product)} className="text-red-600 transition-colors"><TrashIcon className="h-5 w-5" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 text-sm text-gray-600">
                    <p>Showing {startIndex + 1} - {Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length}</p>
                    <div className="flex items-center gap-x-2">
                        {currentPage > 1 && (
                            <Button onClick={() => goToPage(currentPage - 1)} variant="secondary">Previous</Button>
                        )}
                        <span className="font-semibold">{currentPage} / {totalPages}</span>
                        {currentPage < totalPages && (
                            <Button onClick={() => goToPage(currentPage + 1)} variant="secondary">Next</Button>
                        )}
                    </div>
                </div>
            )}
            
            {/* ... (All your Modals remain unchanged) ... */}
            <AddProductModal 
                isOpen={isAddModalOpen} 
                onClose={() => setAddModalOpen(false)}
                onAddProduct={onAddProduct}
                categories={categories}
            />
            <EditProductModal 
                isOpen={isEditModalOpen} 
                onClose={() => { setEditModalOpen(false); setSelectedProduct(null); }}
                productData={selectedProduct}
                categories={categories}
                onSave={handleSaveEdit} 
            />
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                message={`Are you sure you want to delete "${selectedProduct?.productName}"?`}
                onConfirm={confirmDelete}
                onCancel={() => { setDeleteModalOpen(false); setSelectedProduct(null); }}
            />
            <ImportStatusModal
                isOpen={!!importStatus}
                onClose={() => setImportStatus(null)}
                status={importStatus || 'processing'}
                message={importMessage}
            />
        </div>
    );
};

export default ProductContent;