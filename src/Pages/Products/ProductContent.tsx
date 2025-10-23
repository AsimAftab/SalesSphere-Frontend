import React, { useState, useMemo, useRef } from 'react';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { MagnifyingGlassIcon, PencilSquareIcon, TrashIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';

// --- Project-Specific Components & Services ---
// FIX: Import correct types from service
import { type Product, type NewProductData, type BulkProductData } from '../../api/productService'; 
import Button from '../../components/UI/Button/Button';
import ExportActions from '../../components/UI/ExportActions';
import AddProductModal from '../../components/modals/AddProductModal';
import EditProductModal from '../../components/modals/EditProductModal';
import ConfirmationModal from '../../components/modals/ConfirmationModal';
import ImportStatusModal from '../../components/modals/ImportStatusModal';
import ProductListPDF from './ProductListPDF';


interface ProductContentProps {
    data: Product[] | null;
    loading: boolean;
    error: string | null;
    onAddProduct: (productData: NewProductData) => Promise<void>; // FIX: Use NewProductData
    onUpdateProduct: (productData: Product) => Promise<void>; // FIX: Make this async
    onDeleteProduct: (productId: string) => Promise<void>; // FIX: Use string ID
    onBulkUpdate: (products: BulkProductData[]) => Promise<void>; // FIX: Use BulkProductData
}

const ProductContent: React.FC<ProductContentProps> = ({ data, loading, error, onAddProduct, onUpdateProduct, onDeleteProduct, onBulkUpdate }) => {
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
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
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

    if (loading) return <div className="text-center p-10 text-gray-500">Loading Products...</div>;
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

    // FIX: Make this async to handle promise
    const confirmDelete = async () => { 
        if (selectedProduct) {
            // FIX: Use _id (string)
            await onDeleteProduct(selectedProduct._id); 
        }
        setDeleteModalOpen(false);
        setSelectedProduct(null);
    };
    
    interface ExportRow {
        'S.No.': number;
        'Product Name': string;
        Category: string;
        Price: string;
        Piece: number;
    }

    const handleExportPdf = async () => {
        setExportingStatus('pdf');
        try {
            const doc = <ProductListPDF products={filteredProducts} />;
            const pdfPromise = pdf(doc).toBlob();
            const timerPromise = new Promise(resolve => setTimeout(resolve, 1000));
            const [blob] = await Promise.all([pdfPromise, timerPromise]);
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
                    'Product Name': product.name,
                    'Category': product.category,
                    'Price': `RS ${product.price.toFixed(2)}`,
                    'Piece': product.piece,
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

                // FIX: Map to BulkProductData
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

    // FIX: Make onSave async to match props
    const handleSaveEdit = async (product: Product) => {
        await onUpdateProduct(product);
        setEditModalOpen(false);
        setSelectedProduct(null);
    };

    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-black">Products</h1>
                <div className="flex items-center gap-x-4 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-none">
                        <MagnifyingGlassIcon className="pointer-events-none absolute top-1/2 left-3 h-5 w-5 text-gray-400 -translate-y-1/2" />
                        <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search product name" className="w-full rounded-lg border-white bg-white py-2 pl-10 pr-4 text-sm text-gray-700 focus:border-secondary focus:ring-secondary" />
                    </div>
                    
                    <Button variant="primary" onClick={handleImportClick}>
                        Import
                        <ArrowUpTrayIcon className="h-5 w-5 ml-2" />
                    </Button>
                    
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".xlsx, .xls"/>
                    <Button variant="primary" onClick={() => setAddModalOpen(true)}>Add New Product</Button>
                    <ExportActions onExportPdf={handleExportPdf} onExportExcel={handleExportExcel} />
                </div>
            </div>

            {exportingStatus && (
                <div className="w-full p-4 mb-4 text-center bg-blue-100 text-blue-800 rounded-lg">
                    {exportingStatus === 'pdf' ? 'Generating PDF...' : 'Generating Excel...'} Please wait.
                </div>
            )}

            <div className="bg-primary rounded-lg shadow-sm overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-secondary text-white text-left text-sm">
                        <tr>
                            <th className="p-3 font-semibold">S.No.</th>
                            <th className="p-3 font-semibold">Image</th>
                            <th className="p-3 font-semibold">Product Name</th>
                            <th className="p-3 font-semibold">Category</th>
                            <th className="p-3 font-semibold">Price</th>
                            <th className="p-3 font-semibold">Piece</th>
                            <th className="p-3 font-semibold rounded-tr-lg">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {currentProducts.map((product, index) => (
                            // FIX: Use _id for the key
                            <tr key={product._id} className="hover:shadow-lg hover:scale-[1.02] hover:bg-primary transition-all duration-200 cursor-pointer">
                                <td className="p-3 whitespace-nowrap text-white">{startIndex + index + 1}</td>
                                <td className="p-3 whitespace-nowrap"><img src={product.imageUrl} alt={product.name} className="h-10 w-10 rounded-md object-cover" /></td>
                                <td className="p-3 whitespace-nowrap font-medium text-white">{product.name}</td>
                                <td className="p-3 whitespace-nowrap text-white">{product.category}</td>
                                <td className="p-3 whitespace-nowrap text-white">RS {product.price.toFixed(2)}</td>
                                <td className="p-3 whitespace-nowrowrap text-white">{product.piece}</td>
                                <td className="p-3 whitespace-nowrap">
                                    <div className="flex items-center gap-x-3">
                                        <button onClick={() => handleEditClick(product)} className="text-white hover:text-secondary transition-colors"><PencilSquareIcon className="h-5 w-5" /></button>
                                        <button onClick={() => handleDeleteClick(product)} className="text-white hover:text-red-500 transition-colors"><TrashIcon className="h-5 w-5" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

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
            />
            <EditProductModal 
                isOpen={isEditModalOpen} 
                onClose={() => { setEditModalOpen(false); setSelectedProduct(null); }}
                productData={selectedProduct}
                // FIX: Pass the correct async save handler
                onSave={handleSaveEdit} 
            />
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                message={`Are you sure you want to delete "${selectedProduct?.name}"?`}
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

