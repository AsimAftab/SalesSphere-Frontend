import React, { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import Header from '../../components/layout/Header/Header';
import Button from '../../components/UI/Button/Button';
import AddProductModal from '../../components/modals/AddProductModal';
import EditProductModal from '../../components/modals/EditProductModal';
import { MagnifyingGlassIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import ExportActions from '../../components/UI/ExportActions';

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
  const ITEMS_PER_PAGE = 10; // Set to 9 to match the "Showing 1-10 of 78" in the image

  const totalPages = Math.ceil(productsData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = productsData.slice(startIndex, endIndex);

  const handleExportPdf = () => console.log('Exporting Attendance to PDF...');
  const handleExportExcel = () => console.log('Exporting Attendance to Excel...');
  const goToPage = (pageNumber: number) => {
    // Ensure page number is within valid range
    const newPage = Math.max(1, Math.min(pageNumber, totalPages));
    setCurrentPage(newPage);

  
  };

  
  
  return (
    <div className="flex h-screen bg-gray-300 font-arimo">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
          
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
                  className="w-full rounded-lg border-white bg-white py-2 pl-10 pr-4 text-sm text-white focus:border-secondary focus:ring-secondary"
                />
              </div>
              {/* Add New Product Button */}
              <Button variant="secondary" onClick={() => setIsModalOpen(true)}>Add New Product</Button>
              <ExportActions 
                onExportPdf={handleExportPdf}
                onExportExcel={handleExportExcel}
              />
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-primary rounded-lg shadow-sm overflow-x-auto">
            <table className="w-full">
              {/* --- MODIFIED: Table Head --- */}
              <thead className="bg-secondary text-white text-left text-sm">
                <tr>
                  <th className="p-4 font-semibold">S.No.</th>
                  <th className="p-4 font-semibold rounded-tl-lg">Image</th>
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
                    <td className="p-4 whitespace-nowrap"><img src={product.imageUrl} alt={product.name} className="h-10 w-10 rounded-md object-cover" /></td>
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
        </main>
      </div>
      <AddProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
      <EditProductModal 
        isOpen={isModalOpens} 
        onClose={() => setIsModalOpens(false)} 
      />
    </div>
  );
};

export default ProductsPage;

