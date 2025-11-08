import React, { useState, useMemo, useRef } from 'react';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import * as ExcelJS from 'exceljs';
import type { Cell, Row } from 'exceljs';

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
import ProductListPDF from './ProductListPDF'; 

interface ProductContentProps {
    data: Product[] | null;
    categories: Category[];
    loading: boolean;
    error: string | null;
    // --- FIX: Updated Promise return types ---
    onAddProduct: (productData: NewProductFormData) => Promise<Product>;
    onUpdateProduct: (productId: string, productData: UpdateProductFormData) => Promise<Product>;
    onDeleteProduct: (productId: string) => Promise<any>;
    onBulkUpdate: (products: BulkProductData[]) => Promise<Product[]>;
}

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
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Products');
            
            worksheet.columns = [
                { header: 'S.No.', key: 'sno', width: 8, style: { alignment: { horizontal: 'center' } } },
                { header: 'Product Name', key: 'productName', width: 35 },
                { header: 'Category', key: 'category', width: 25 },
                { header: 'Serial No.', key: 'serialNo', width: 20 },
                { header: 'Price', key: 'price', width: 15, style: { numFmt: '"RS" #,##0.00' } },
                { header: 'Stock (Qty)', key: 'qty', width: 12, style: { numFmt: '0', alignment: { horizontal: 'center' } } },
            ];
            
            // --- FIX: Added type 'Cell' ---
            worksheet.getRow(1).eachCell((cell: Cell) => {
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
                    price: product.price,
                    qty: product.qty,
                });
            });

            // --- FIX: Added types 'Row' and 'Cell' ---
            worksheet.eachRow({ includeEmpty: false }, (row: Row, rowNumber: number) => {
                if (rowNumber > 1) { 
                    row.eachCell((cell: Cell) => {
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

    // --- REFACTORED handleFileChange to use exceljs ---
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
                
                // --- FIX: Added type 'Cell' ---
                headerRow.eachCell((cell: Cell, colNumber: number) => {
                    headerMap[cell.value as string] = colNumber;
                });

                const requiredHeaders = ['Product Name', 'Category', 'Price', 'Piece'];
                for (const header of requiredHeaders) {
                    if (!headerMap[header]) {
                        throw new Error(`The Excel file is missing the required column: '${header}'.`);
                    }
                }
                
                // --- FIX: Added type 'Row' ---
                worksheet.eachRow({ includeEmpty: false }, (row: Row, rowNumber: number) => {
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
    // --- END REFACTOR ---

    // --- FIX: This function MUST return a Promise<Product> ---
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
                        {/* AFTER */}
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
                <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
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
                                    <td className="p-3 whitespace-nowrap font-medium text-black">{product.productName}</td>
                                    <td className="p-3 whitespace-nowrap text-black">{product.category?.name || 'N/A'}</td>
                                    <td className="p-3 whitespace-nowrap text-black">RS {product.price.toFixed(2)}</td>
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