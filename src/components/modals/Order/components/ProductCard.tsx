/**
 * Product Card Component
 * 
 * Single product card for the product picker grid.
 * Follows Single Responsibility Principle - only renders one product card.
 */

import React from 'react';
import { Minus, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui';
import type { Product } from '@/api/productService';
import type { CartItem } from '@/pages/OrderListPage/Transaction/hooks/useTransactionManager';

interface ProductCardProps {
    product: Product;
    cartItem?: CartItem;
    onAdd: (product: Product) => void;
    onRemove: (productId: string) => void;
    onUpdateQuantity: (productId: string, quantity: number) => void;
}

const getInitials = (name: string) => {
    if (!name) return '??';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
};

export const ProductCard: React.FC<ProductCardProps> = ({
    product,
    cartItem,
    onAdd,
    onRemove,
    onUpdateQuantity
}) => {
    const isInCart = !!cartItem;
    const isLowStock = product.qty <= 5;

    return (
        <div
            className={`relative rounded-2xl border-2 transition-all duration-200 bg-white ${isInCart
                ? 'border-secondary shadow-lg shadow-secondary/10'
                : 'border-gray-100 hover:border-gray-200 hover:shadow-lg'
                }`}
        >
            {/* Card Content */}
            <div className="p-4">
                {/* Top Section: Image + Product Info */}
                <div className="flex gap-3 mb-3">
                    {/* Product Image */}
                    <div className="h-14 w-14 shrink-0 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center">
                        {product.image?.url ? (
                            <img src={product.image.url} alt="" className="h-full w-full object-cover" />
                        ) : (
                            <div className="h-full w-full bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center text-gray-400 font-bold text-sm">
                                {getInitials(product.productName)}
                            </div>
                        )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 text-sm leading-tight line-clamp-1" title={product.productName}>
                            {product.productName}
                        </h4>
                        {product.serialNo && product.serialNo !== 'N/A' && (
                            <p className="text-[11px] font-semibold text-gray-600 mt-0.5">
                                S.No: {product.serialNo}
                            </p>
                        )}
                        {/* Stock Badge */}
                        <span className={`inline-flex items-center mt-1.5 px-2 py-0.5 text-[11px] font-bold rounded-md ${isLowStock
                            ? 'bg-red-100 text-red-700'
                            : 'bg-emerald-100 text-emerald-700'
                            }`}>
                            {isLowStock ? 'Low Stock' : 'In Stock'} • {product.qty}
                        </span>
                    </div>

                    {/* Cart Quantity Indicator */}
                    {isInCart && (
                        <div className="shrink-0 h-7 w-7 rounded-full bg-secondary text-white flex items-center justify-center text-xs font-bold shadow-sm">
                            {cartItem.quantity}
                        </div>
                    )}
                </div>

                {/* Category & Price Row */}
                <div className="flex items-center justify-between py-2 px-1 mb-3 border-t border-gray-100">
                    <span className="text-xs text-gray-600 font-semibold">
                        {product.category?.name || 'Uncategorized'}
                    </span>
                    <span className="text-base font-black text-gray-900">
                        RS {product.price?.toLocaleString()}
                    </span>
                </div>

                {/* Action Section */}
                {isInCart ? (
                    <div className="space-y-2">
                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between bg-gray-50 rounded-xl p-2 border border-gray-100">
                            <span className="text-xs font-medium text-gray-500 pl-1">Qty:</span>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => onUpdateQuantity(product.id, Math.max(1, (cartItem?.quantity || 1) - 1))}
                                    className="h-8 w-8 flex items-center justify-center rounded-lg bg-white border border-gray-200 hover:bg-gray-100 transition-colors text-gray-600"
                                    type="button"
                                >
                                    <Minus className="h-3.5 w-3.5" />
                                </button>
                                <input
                                    type="number"
                                    min="1"
                                    value={cartItem?.quantity || ''}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (val === '') {
                                            onUpdateQuantity(product.id, 1);
                                        } else {
                                            const num = parseInt(val);
                                            if (!isNaN(num) && num > 0) {
                                                onUpdateQuantity(product.id, num);
                                            }
                                        }
                                    }}
                                    onBlur={(e) => {
                                        const num = parseInt(e.target.value);
                                        if (isNaN(num) || num < 1) {
                                            onUpdateQuantity(product.id, 1);
                                        }
                                    }}
                                    className="w-12 h-8 text-center font-bold text-sm bg-white border border-gray-200 rounded-lg outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                                <button
                                    onClick={() => onUpdateQuantity(product.id, (cartItem?.quantity || 1) + 1)}
                                    className="h-8 w-8 flex items-center justify-center rounded-lg bg-secondary hover:bg-secondary/90 transition-colors text-white"
                                    type="button"
                                >
                                    <Plus className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        </div>
                        {/* Remove Button */}
                        <button
                            onClick={() => onRemove(product.id)}
                            className="w-full h-9 bg-red-50 text-red-600 rounded-xl text-xs font-semibold border border-red-100 hover:bg-red-100 hover:border-red-200 transition-all flex items-center justify-center gap-1.5"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                            Remove
                        </button>
                    </div>
                ) : (
                    <Button
                        variant="primary"
                        onClick={() => onAdd(product)}
                        className="w-full"
                    >
                        Add to Cart
                    </Button>
                )}
            </div>
        </div>
    );
};

export default ProductCard;
