import React from 'react';
import { type Product } from '@/api/productService';
import { SquarePen, Trash2 } from 'lucide-react';

interface ProductMobileListProps {
    products: Product[];
    selectedIds: string[];
    onToggle: (id: string) => void;
    canBulkDelete: boolean;
    canUpdate: boolean;
    canDelete: boolean;
    onEdit: (product: Product) => void;
    onDelete: (product: Product) => void;
    onImageClick: (product: Product) => void;
    formatCurrency: (amount: number) => string;
}

const ProductMobileList: React.FC<ProductMobileListProps> = ({
    products,
    selectedIds,
    onToggle,
    canBulkDelete,
    canUpdate,
    canDelete,
    onEdit,
    onDelete,
    onImageClick,
    formatCurrency
}) => {
    return (
        <div className="md:hidden space-y-4 px-1">
            {products.map((product) => (
                <div key={product.id} className={`bg-white p-4 rounded-lg shadow-sm border border-gray-100 ${selectedIds.includes(product.id) ? 'ring-2 ring-blue-500' : ''}`}>
                    <div className="flex items-center gap-4 mb-3">
                        <div className="relative">
                            {product.image?.url ? (
                                <img src={product.image.url} alt={product.productName} className="h-16 w-16 rounded-md object-cover" onClick={() => onImageClick(product)} />
                            ) : (
                                <div className="h-16 w-16 rounded-md bg-secondary flex items-center justify-center text-white font-bold text-xl">{product.productName.substring(0, 2).toUpperCase()}</div>
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-gray-900 leading-tight truncate">{product.productName}</h3>
                            <p className="text-sm text-gray-500 truncate">{product.category?.name || 'No Category'}</p>
                            <p className="text-xs text-gray-400 mt-1">SN: {product.serialNo || 'N/A'}</p>
                        </div>

                        {/* Show checkbox only if bulk delete is allowed */}
                        {canBulkDelete && (
                            <input
                                type="checkbox"
                                checked={selectedIds.includes(product.id)}
                                onChange={() => onToggle(product.id)}
                                className="h-6 w-6 rounded border-gray-300 text-blue-600 focus:ring-blue-500 flex-shrink-0"
                            />
                        )}
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

                    {(canUpdate || canDelete) && (
                        <div className="flex items-center justify-end gap-4 mt-3">
                            {canUpdate && (
                                <button onClick={() => onEdit(product)} className="flex items-center gap-1 text-blue-700 font-medium text-sm p-1 active:bg-blue-50 rounded"><SquarePen className="h-5 w-5" /> Edit</button>
                            )}
                            {canDelete && (
                                <button onClick={() => onDelete(product)} className="flex items-center gap-1 text-red-600 font-medium text-sm p-1 active:bg-red-50 rounded"><Trash2 className="h-5 w-5" /> Delete</button>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ProductMobileList;
