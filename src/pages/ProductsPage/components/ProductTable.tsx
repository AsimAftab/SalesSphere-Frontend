import React from 'react';
import { Loader2, SquarePen, Trash2 } from 'lucide-react';
import { type Product } from '@/api/productService';

interface ProductTableProps {
    products: Product[];
    selectedIds: string[];
    onToggle: (id: string) => void;
    onSelectAll: (checked: boolean) => void;
    startIndex: number;
    loading: boolean;
    canBulkDelete: boolean;
    canUpdate: boolean;
    canDelete: boolean;
    onEdit: (product: Product) => void;
    onDelete: (product: Product) => void;
    onImageClick: (product: Product) => void;
    formatCurrency: (amount: number) => string;
}

const ProductTable: React.FC<ProductTableProps> = ({
    products,
    selectedIds,
    onToggle,
    onSelectAll,
    startIndex,
    loading,
    canBulkDelete,
    canUpdate,
    canDelete,
    onEdit,
    onDelete,
    onImageClick,
    formatCurrency
}) => {
    return (
        <div className="bg-white rounded-lg shadow-sm overflow-x-auto hidden md:block relative">
            {loading && (
                <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10 rounded-lg">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                </div>
            )}
            <table className="w-full">
                <thead className="bg-secondary text-white text-left text-sm">
                    <tr>
                        {canBulkDelete && (
                            <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">
                                <input
                                    type="checkbox"
                                    className="rounded border-gray-300 w-4 h-4 cursor-pointer"
                                    checked={products.length > 0 && selectedIds.length === products.length}
                                    onChange={(e) => onSelectAll(e.target.checked)}
                                />
                            </th>
                        )}
                        <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">S.No.</th>
                        <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Image</th>
                        <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Serial No.</th>
                        <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Product Name</th>
                        <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Category</th>
                        <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Price</th>
                        <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Stock (Qty)</th>
                        {(canUpdate || canDelete) && (
                            <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Action</th>
                        )}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                    {products.map((product, index) => (
                        <tr key={product.id} className={`${selectedIds.includes(product.id) ? 'bg-blue-100' : 'hover:bg-gray-200'}`}>
                            {canBulkDelete && (
                                <td className="px-5 py-3 text-black text-sm">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(product.id)}
                                        onChange={() => onToggle(product.id)}
                                        className="rounded border-gray-300 w-4 h-4 cursor-pointer"
                                    />
                                </td>
                            )}
                            <td className="px-5 py-3 text-black text-sm">{startIndex + index + 1}</td>
                            <td className="px-5 py-3 text-black text-sm">
                                {product.image?.url ? (
                                    <img src={product.image.url} alt={product.productName} className="h-10 w-10 rounded-md object-cover cursor-pointer" onClick={() => onImageClick(product)} />
                                ) : (
                                    <div className="h-10 w-10 rounded-md bg-secondary flex items-center justify-center text-white font-bold">{product.productName.substring(0, 2).toUpperCase()}</div>
                                )}
                            </td>
                            <td className="px-5 py-3 text-black text-sm">{product.serialNo || 'N/A'}</td>
                            <td className="px-5 py-3 text-black text-sm">{product.productName}</td>
                            <td className="px-5 py-3 text-black text-sm">{product.category?.name || 'N/A'}</td>
                            <td className="px-5 py-3 text-black text-sm">{formatCurrency(product.price)}</td>
                            <td className="px-5 py-3 text-black text-sm">{product.qty}</td>
                            {(canUpdate || canDelete) && (
                                <td className="px-5 py-3 text-black text-sm">
                                    <div className="flex items-center gap-x-3">
                                        {canUpdate && (
                                            <button onClick={() => onEdit(product)} className="text-blue-700 hover:text-blue-900"><SquarePen className="h-5 w-5" /></button>
                                        )}
                                        {canDelete && (
                                            <button onClick={() => onDelete(product)} className="text-red-600 hover:text-red-800"><Trash2 className="h-5 w-5" /></button>
                                        )}
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductTable;
