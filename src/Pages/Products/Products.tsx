import React, { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import Button from '../../components/UI/Button/Button';
import AddProductModal from '../../components/modals/AddProductModal';
import EditProductModal from '../../components/modals/EditProductModal';
import { MagnifyingGlassIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import ExportActions from '../../components/UI/ExportActions';

// --- IMPORTS FOR EXPORT ---
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import ProductListPDF from './ProductListPDF';  

// Mock data to populate the product table, without the 'colors' property
const productsData = [
  { id: 1, imageUrl: 'https://placehold.co/40x40/1F2937/FFF?text=AW', name: 'Apple Watch Series 4', category: 'Digital Product', price: 690, piece: 63 },
  { id: 2, imageUrl: 'https://placehold.co/40x40/1F2937/FFF?text=MH', name: 'Microsoft Headsquare', category: 'Digital Product', price: 190, piece: 13 },
  { id: 3, imageUrl: 'https://placehold.co/40x40/1F2937/FFF?text=WD', name: 'Women\'s Dress', category: 'Fashion', price: 640, piece: 635 },
  { id: 4, imageUrl: 'https://placehold.co/40x40/1F2937/FFF?text=SA', name: 'Samsung A50', category: 'Mobile', price: 400, piece: 67 },
  { id: 5, imageUrl: 'https://placehold.co/40x40/1F2937/FFF?text=C', name: 'Camera', category: 'Electronic', price: 420, piece: 52 },
  { id: 6, imageUrl: 'https://placehold.co/40x40/1F2937/FFF?text=MH', name: 'Microsoft Headsquare', category: 'Digital Product', price: 190, piece: 13 },
  { id: 7, imageUrl: 'https://placehold.co/40x40/1F2937/FFF?text=WD', name: 'Women\'s Dress', category: 'Fashion', price: 640, piece: 635 },
  // Adding more mock data to reach a total of 78 items to simulate pagination
  ...Array.from({ length: 71 }, (_, i) => ({ id: i + 8, imageUrl: `https://placehold.co/40x40/333/FFF?text=P${i+8}`, name: `Product ${i+8}`, category: 'General', price: 100 + i*5, piece: 20 + i })),
];

const ProductsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpens, setIsModalOpens] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [exportingStatus, setExportingStatus] = useState<'pdf' | 'excel' | null>(null);
  const ITEMS_PER_PAGE = 10; // Set to 9 to match the "Showing 1-10 of 78" in the image

  // --- PDF EXPORT LOGIC ---
  const handleExportPdf = async () => {
    setExportingStatus('pdf');
    try {
        const doc = <ProductListPDF products={productsData} />;
        const pdfPromise = pdf(doc).toBlob();
        const timerPromise = new Promise(resolve => setTimeout(resolve, 1000));
        const [blob] = await Promise.all([pdfPromise, timerPromise]);
        saveAs(blob, 'ProductList.pdf');
    } catch (error) {
        console.error("Failed to generate PDF", error);
    } finally {
        setExportingStatus(null);
    }
  };

  // --- EXCEL EXPORT LOGIC ---
  interface ProductExportRow {
    'S.No.': number;
    'Product Name': string;
    'Category': string;
    'Price': string;
    'Piece': number;
  }

  const handleExportExcel = () => {
        setExportingStatus('excel');
        setTimeout(() => {
            try {
                // 2. Map your product data to the new interface
                const dataToExport: ProductExportRow[] = productsData.map((product, index) => ({
                    'S.No.': index + 1,
                    'Product Name': product.name,
                    'Category': product.category,
                    'Price': `RS ${product.price.toFixed(2)}`,
                    'Piece': product.piece,
                }));

                const worksheet = XLSX.utils.json_to_sheet(dataToExport);

                // 3. Apply the same logic for column widths and centering
                const columnWidths = (Object.keys(dataToExport[0]) as Array<keyof ProductExportRow>).map(key => {
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

  const totalPages = Math.ceil(productsData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = productsData.slice(startIndex, endIndex);

  const goToPage = (pageNumber: number) => {
    // Ensure page number is within valid range
    const newPage = Math.max(1, Math.min(pageNumber, totalPages));
    setCurrentPage(newPage);
  };

  return (
    <Sidebar>
      <div className="flex-1 flex flex-col overflow-hidden">
          {/* Page Header and Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h1 className="text-3xl font-bold text-black">Products</h1>
            <div className="flex items-center gap-x-4 w-full sm:w-auto">
              {/* Search Input */}
              <div className="relative flex-1 sm:flex-none">
                <MagnifyingGlassIcon className="pointer-events-none absolute top-1/2 left-3 h-5 w-5 text-gray-400 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search product name"
                  className="w-full rounded-lg border-white bg-white py-2 pl-10 pr-4 text-sm text-gray-700 focus:border-secondary focus:ring-secondary"
                />
              </div>
              {/* Add New Product Button */}
              <Button variant="secondary" onClick={() => setIsModalOpen(true)}>Add New Product</Button>
              {/* Export Actions */}
              <ExportActions 
                onExportPdf={handleExportPdf}
                onExportExcel={handleExportExcel}
              />
            </div>
          </div>

          {/* --- LOADING INDICATOR --- */}
          {exportingStatus && (
            <div className="w-full p-4 mb-4 text-center bg-blue-100 text-blue-800 rounded-lg">
                {exportingStatus === 'pdf' ? 'Generating PDF... Please wait.' : 'Generating EXCEL... Please wait.'}
            </div>
          )}  

          {/* Products Table */}
          <div className="bg-primary rounded-lg shadow-sm overflow-x-auto">
            <table className="w-full">
              {/* --- MODIFIED: Table Head --- */}
              <thead className="bg-secondary text-white text-left text-sm">
                <tr>
                  <th className="p-4 font-semibold">S.No.</th>
                  <th className="p-4 font-semibold">Image</th>
                  <th className="p-4 font-semibold">Product Name</th>
                  <th className="p-4 font-semibold">Category</th>
                  <th className="p-4 font-semibold">Price</th>
                  <th className="p-4 font-semibold">Piece</th>
                  <th className="p-4 font-semibold rounded-tr-lg">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {/* --- MODIFIED: Table Body --- */}
                {currentProducts.map((product, index) => (
                  <tr key={product.id} className="hover:shadow-lg hover:scale-[1.02] hover:bg-primary transition-all duration-200 cursor-pointer">
                    <td className="p-4 whitespace-nowrap text-white">{startIndex + index + 1}</td>
                    {/* <-- NEW: Image Cell --> */}
                    <td className="p-4 whitespace-nowrap">
                      <img src={product.imageUrl} alt={product.name} className="h-10 w-10 rounded-md object-cover" />
                    </td>
                    <td className="p-4 whitespace-nowrap font-medium text-white">{product.name}</td>
                    <td className="p-4 whitespace-nowrap text-white">{product.category}</td>
                    <td className="p-4 whitespace-nowrap text-white">RS {product.price.toFixed(2)}</td>
                    <td className="p-4 whitespace-nowrap text-white">{product.piece}</td>
                    <td className="p-4 whitespace-nowrap">
                      <div className="flex items-center gap-x-3">
                        <button onClick={() => setIsModalOpens(true)} className="text-white hover:text-secondary transition-colors"><PencilSquareIcon className="h-5 w-5 " /></button>
                        <button className="text-white hover:text-red-600 transition-colors"><TrashIcon className="h-5 w-5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between mt-6 text-sm text-gray-600">
            <p>
              Showing {startIndex + 1} - {Math.min(endIndex, productsData.length)} of {productsData.length}
            </p>
            <div className="flex items-center gap-x-2">
              <Button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} variant="secondary">Previous</Button>
              <span className="font-semibold">{currentPage} / {totalPages}</span>
              <Button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} variant="secondary">Next</Button>
            </div>
          </div>
      </div>
      <AddProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
      <EditProductModal 
        isOpen={isModalOpens} 
        onClose={() => setIsModalOpens(false)} 
      />
    </Sidebar>
  );
};

export default ProductsPage;

