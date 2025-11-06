import React, { useState, useMemo, useRef } from 'react';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
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
    // ... (All state, memos, and handlers are unchanged) ...
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
    
    interface ExportRow {
        'S.No.': number;
        'Product Name': string;
        'Category': string;
        'Serial No.': string;
        'Price': string;
        'Stock (Qty)': number;
    }

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

    const handleExportExcel = () => {
        setExportingStatus('excel');
        setTimeout(() => {
            try {
                const dataToExport = filteredProducts.map((product, index) => ({
                    'S.No.': startIndex + index + 1,
                    'Product Name': product.productName,
                    'Category': product.category?.name || 'N/A',
                    'Serial No.': product.serialNo || 'N/A',
                    'Price': `RS ${product.price.toFixed(2)}`,
                    'Stock (Qty)': product.qty,
                }));
                if (dataToExport.length === 0) return;
                const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    
                const columnWidths = (Object.keys(dataToExport[0]) as Array<keyof ExportRow>).map(key => {
                    const maxLength = Math.max(
                        key.length,
                        ...dataToExport.map(row => String(row[key] || "").length)
                    );
                    return { wch: maxLength + 2 };
                });
                worksheet['!cols'] = columnWidths;
    
                const range = XLSX.utils.decode_range(worksheet['!ref']!);
                for (let R = range.s.r; R <= range.e.r; ++R) {
                    for (let C = range.s.c; C <= range.e.c; ++C) {
                        const cell_address = { c: C, r: R };
                        const cell_ref = XLSX.utils.encode_cell(cell_address);
                        if (worksheet[cell_ref]) {
                            worksheet[cell_ref].s = {
                                alignment: { horizontal: "center", vertical: "center", wrapText: true }
                            };
                        }
                    }
                }
    
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
                XLSX.writeFile(workbook, "ProductList.xlsx");
    
            } catch (error) {
                console.error("Failed to generate Excel", error);
            } finally {
                setExportingStatus(null);
            }
        }, 100);
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
                const workbook = XLSX.read(data, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json: any[] = XLSX.utils.sheet_to_json(worksheet);

                if (json.length === 0) {
                    throw new Error("The Excel file is empty or in the wrong format.\n\nRequired columns: 'Product Name', 'Category', 'Price', 'Piece'.");
                }

                const productsToUpdate: BulkProductData[] = json.map(row => {
                    const name = row['Product Name'] || row['name'];
                    const category = row['Category'] || row['category'];
                    const priceString = String(row['Price'] || row['price'] || '0').replace(/[^0-9.]/g, '');
                    const price = parseFloat(priceString);
                    const piece = parseInt(row['Piece'] || row['piece'], 10);

                    if (!name || isNaN(price) || isNaN(piece)) {
                        throw new Error(`Invalid data in row: ${JSON.stringify(row)}\nPlease check column names and data types.`);
                    }

                    return { name, category: category || 'Uncategorized', price, piece };
                });

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
        reader.readAsBinaryString(file);
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
        <div className="flex-1 flex flex-col overflow-hidden p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <h1 className="text-3xl font-bold text-[#202224] text-center md:text-left">Products</h1>
                    <div className="flex flex-col md:flex-row md:items-center gap-4 w-full md:w-auto">
                        <div className="relative">
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
                        <div className="flex justify-center w-full">
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
                                <th className="p-3 font-semibold">Product Name</th>
                                <th className="p-3 font-semibold">Category</th>
                                <th className="p-3 font-semibold">Serial No.</th>
                                <th className="p-3 font-semibold">Price</th>
                                <th className="p-3 font-semibold">Stock (Qty)</th>
                                <th className="p-3 font-semibold rounded-tr-lg">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-900">
                            {currentProducts.map((product, index) => (
                                <tr key={product._id} className="hover:bg-gray-200">
                                    <td className="p-3 whitespace-nowrap text-black">{startIndex + index + 1}</td>
                                    
                                    {/* --- THIS IS THE FIX --- */}
                                    <td className="p-3 whitespace-nowrap">
                                        {product.image?.url ? (
                                            <img 
                                                src={product.image.url} 
                                                alt={product.productName || 'Product'} 
                                                className="h-10 w-10 rounded-md object-cover" 
                                            />
                                        ) : (
                                            <div className="h-10 w-10 rounded-md bg-secondary flex items-center justify-center">
                                                <span className="text-xl font-semibold text-white">
                                                    {product.productName ? product.productName.substring(0, 2).toUpperCase() : '?'}
                                                </span>
                                            </div>
                                        )}
                                    </td>
                                    {/* --- END OF FIX --- */}

                                    <td className="p-3 whitespace-nowrap  text-black">{product.productName}</td>
                                    <td className="p-3 whitespace-nowrap text-black">{product.category?.name || 'N/A'}</td>
                                    <td className="p-3 whitespace-nowrap text-black">{product.serialNo || 'N/A'}</td>
                                    <td className="p-3 whitespace-nowrap text-black">RS {product.price.toFixed(2)}</td>
                                    <td className="p-3 whitespace-nowrap text-black">{product.qty}</td>
                                    <td className="p-3 whitespace-nowrap">
                                        <div className="flex items-center gap-x-3">
                                            <button onClick={() => handleEditClick(product)} className="text-blue-600 transition-colors"><PencilSquareIcon className="h-5 w-5" /></button>
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