import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import type { CartItem } from '../useTransactionManager';
import { ShoppingCart, Trash2 } from 'lucide-react';

interface TransactionCartProps {
    items: CartItem[];
    totals: {
        subtotal: number;
        finalTotal: number;
        discountAmount: number;
    };
    overallDiscount: number;
    setOverallDiscount: (val: number) => void;
    onUpdateItem: (index: number, field: keyof CartItem, val: string | number) => void;
    onRemoveItem: (id: string) => void;
}

const TransactionCart: React.FC<TransactionCartProps> = ({
    items,
    totals,
    overallDiscount,
    setOverallDiscount,
    onUpdateItem,
    onRemoveItem
}) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden h-full">
            {/* Header Section */}
            <div className="p-5 border-b bg-gray-50/50 text-gray-800 flex justify-between items-center shrink-0">
                <h2 className="text-lg font-bold flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-blue-500" /> Active Cart
                </h2>
                <span className="text-xs font-black bg-blue-100 text-blue-600 px-2.5 py-1 rounded-full uppercase tracking-widest">
                    {items.length} {items.length === 1 ? 'Item' : 'Items'}
                </span>
            </div>

            {/* --- SCROLLABLE CART AREA --- */}
            <div className="h-[488px] overflow-y-auto p-4 space-y-3 bg-gray-50/30 custom-scrollbar">
                <AnimatePresence mode="popLayout">
                    {items.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="h-full flex flex-col items-center justify-center text-gray-800 py-10 opacity-60"
                        >
                            <ShoppingCart className="h-16 w-16 mb-2" />
                            <p className="text-sm font-bold uppercase tracking-widest text-center leading-relaxed">
                                Your cart is empty.<br />
                                <span className="text-sm font-medium normal-case">Add products from Product List</span>
                            </p>
                        </motion.div>
                    ) : (
                        items.map((item, index) => {
                            // Calculate individual row subtotal
                            const rowSubtotal = (item.price * item.quantity) * (1 - (item.discount / 100));

                            return (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    key={item.productId}
                                    className="p-3 bg-white border border-gray-200 rounded-xl relative group shadow-sm flex flex-col justify-between hover:border-secondary transition-colors"
                                >
                                    {/* Remove Item Button */}
                                    <button
                                        onClick={() => onRemoveItem(item.productId)}
                                        className="absolute -top-2 -right-2 bg-white text-red-500 hover:bg-red-50 p-1.5 rounded-full shadow-md border opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>

                                    <p className="font-bold text-sm text-gray-800 pr-6 truncate leading-tight">
                                        {item.productName}
                                    </p>

                                    {/* 3-Column Input Grid */}
                                    <div className="grid grid-cols-3 gap-2 mt-2">
                                        <div className="space-y-1">
                                            <label htmlFor={`quantity-${item.productId}`} className="text-xs font-black text-gray-400 uppercase tracking-widest block text-center">Quantity</label>
                                            <input
                                                id={`quantity-${item.productId}`}
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) => onUpdateItem(index, 'quantity', Math.max(1, Number(e.target.value)))}
                                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-1 py-1.5 text-xs font-bold text-center outline-none focus:ring-0 focus:border-secondary transition-all hide-spinner"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label htmlFor={`rate-${item.productId}`} className="text-xs font-black text-gray-400 uppercase tracking-widest block text-center">Rate</label>
                                            <input
                                                id={`rate-${item.productId}`}
                                                type="number"
                                                min="0"
                                                value={item.price}
                                                onChange={(e) => onUpdateItem(index, 'price', Math.max(0, Number(e.target.value)))}
                                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-1 py-1.5 text-xs font-bold text-center outline-none focus:ring-0 focus:border-secondary transition-all hide-spinner"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label htmlFor={`discount-${item.productId}`} className="text-xs font-black text-red-400 uppercase tracking-widest block text-center">Disc %</label>
                                            <input
                                                id={`discount-${item.productId}`}
                                                type="number"
                                                min="0"
                                                max="100"
                                                placeholder="0"
                                                value={item.discount || ''}
                                                onChange={(e) => onUpdateItem(index, 'discount', Math.min(100, Math.max(0, Number(e.target.value))))}
                                                className={`w-full bg-gray-50 border rounded-lg px-1 py-1.5 text-xs font-bold text-center outline-none focus:ring-0 focus:border-secondary transition-all hide-spinner ${item.discount > 0 ? 'text-red-500 border-red-200' : 'text-gray-700 border-gray-200'
                                                    }`}
                                            />
                                        </div>
                                    </div>

                                    {/* Row Subtotal Display */}
                                    <div className="mt-2 pt-2 border-t border-gray-50 flex justify-between items-center">
                                        <span className="text-sm font-black uppercase text-gray-700  tracking-tighter">Item Subtotal</span>
                                        <span className="text-sm font-black text-secondary">
                                            RS {rowSubtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </AnimatePresence>
            </div>

            {/* Summary Totals */}
            <div className="p-6 bg-gray-50 border-t border-gray-200 space-y-4 shrink-0">
                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-gray-800 uppercase tracking-widest">
                        <span>Subtotal</span>
                        <span className="text-gray-800 font-black">Rs {totals.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest transition-colors">
                        <div className="flex items-center gap-3">
                            <span className={overallDiscount > 0 ? 'text-red-500' : 'text-gray-500'}>Discount</span>
                            <div className="relative group">
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={overallDiscount || ''}
                                    placeholder="0"
                                    onChange={(e) => {
                                        const val = Math.min(100, Math.max(0, Number(e.target.value)));
                                        setOverallDiscount(val);
                                    }}
                                    className={`w-16 pl-2 pr-6 py-1.5 border rounded-lg bg-white text-center font-black outline-none focus:ring-0 focus:border-secondary transition-all appearance-none hide-spinner ${overallDiscount > 0
                                        ? 'text-red-500 border-red-200'
                                        : 'text-gray-400 border-gray-200'
                                        }`}
                                />
                                <span className={`absolute right-2 top-1/2 -translate-y-1/2 text-[10px] pointer-events-none transition-colors ${overallDiscount > 0 ? 'text-red-500' : 'text-gray-400'
                                    }`}>
                                    %
                                </span>
                            </div>
                        </div>

                        <span className={`font-black text-sm transition-colors ${overallDiscount > 0 ? 'text-red-500' : 'text-gray-400'}`}>
                            - Rs {totals.discountAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                    </div>
                </div>
                <div className="pt-4 border-t border-gray-200 flex justify-between items-end">
                    <span className="text-xl font-black text-gray-800 uppercase leading-none">Total Amount</span>
                    <span className="text-xl font-black text-gray-800 tracking-tighter leading-none">
                        Rs {totals.finalTotal.toLocaleString()}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default TransactionCart;
