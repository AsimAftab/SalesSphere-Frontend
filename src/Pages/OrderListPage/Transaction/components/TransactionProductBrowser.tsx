import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MagnifyingGlassIcon, XCircleIcon, FunnelIcon, CheckIcon, PlusIcon
} from '@heroicons/react/24/outline';
import { Package, Loader2 } from 'lucide-react';
import type { Product } from '../../../../api/productService';
import type { CartItem } from '../useTransactionManager';

interface TransactionProductBrowserProps {
    products: Product[];
    categories: string[];
    isLoading: boolean;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    selectedCategories: string[];
    onToggleCategory: (cat: string) => void;
    onClearCategories: () => void;
    items: CartItem[]; // Cart Items
    onToggleProduct: (prod: Product) => void;
}

const getInitials = (name: string) => {
    if (!name) return '??';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
        return (parts[0][0] + parts[0][1]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
};

const TransactionProductBrowser: React.FC<TransactionProductBrowserProps> = ({
    products,
    categories,
    isLoading,
    searchTerm,
    setSearchTerm,
    selectedCategories,
    onToggleCategory,
    onClearCategories,
    items,
    onToggleProduct
}) => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const filterRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setIsFilterOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden h-full">
            <div className="p-5 border-b bg-gray-50/50 shrink-0">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <Package className="h-4 w-4 text-blue-500" /> Product List ({products.length})
                </h2>
            </div>

            <div className="flex items-center gap-3 mt-6 mb-4 px-6 shrink-0">
                <div className="relative flex-1 group">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all shadow-sm"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                            <XCircleIcon className="h-4 w-4" />
                        </button>
                    )}
                </div>

                <div className="relative shrink-0" ref={filterRef}>
                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className={`p-2.5 rounded-xl border transition-all shadow-sm ${selectedCategories.length > 0
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'bg-white border-gray-200 text-gray-500 hover:border-blue-300'
                            }`}
                    >
                        <FunnelIcon className="h-5 w-5" />
                    </button>

                    <AnimatePresence>
                        {isFilterOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-2xl z-50 p-2 overflow-hidden"
                            >
                                <div className="max-h-60 overflow-y-auto space-y-1 custom-scrollbar">
                                    {categories.map(cat => (
                                        <label key={cat} className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors group">
                                            <div className={`h-4 w-4 rounded flex items-center justify-center border transition-all ${selectedCategories.includes(cat) ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300 group-hover:border-blue-400'}`}>
                                                {selectedCategories.includes(cat) && <CheckIcon className="h-3 w-3 text-white stroke-[3px]" />}
                                            </div>
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={selectedCategories.includes(cat)}
                                                onChange={() => onToggleCategory(cat)}
                                            />
                                            <span className="text-xs font-bold text-gray-600">{cat}</span>
                                        </label>
                                    ))}
                                </div>
                                {selectedCategories.length > 0 && (
                                    <button
                                        onClick={onClearCategories}
                                        className="w-full mt-2 pt-2 border-t border-gray-50 text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline"
                                    >
                                        Clear Filters
                                    </button>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div className="h-[560px] overflow-y-auto p-4 space-y-3 bg-gray-50/50 custom-scrollbar">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full opacity-40">
                        <Loader2 className="h-8 w-8 animate-spin mb-2" />
                    </div>
                ) : products.length > 0 ? (
                    products.map((p) => {
                        const isInCart = items.some(item => item.productId === p.id);
                        const cartItem = items.find(item => item.productId === p.id);

                        return (
                            <div
                                key={p.id}
                                className={`group p-3 border-2 rounded-2xl flex items-center gap-4 transition-all h-[96px] bg-white ${isInCart
                                    ? 'border-secondary/40 bg-secondary/5 shadow-sm'
                                    : 'border-transparent hover:border-blue-100 hover:shadow-md'
                                    }`}
                            >
                                <div className="h-16 w-16 shrink-0 rounded-xl overflow-hidden border border-gray-100 bg-white flex items-center justify-center relative">
                                    {p.image?.url ? (
                                        <img src={p.image.url} alt="" className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="h-full w-full bg-secondary flex items-center justify-center text-white font-black text-lg uppercase">
                                            {getInitials(p.productName)}
                                        </div>
                                    )}
                                    {isInCart && (
                                        <div className="absolute -top-1 -right-1 bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                                            {cartItem?.quantity}
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-md text-gray-900 truncate tracking-tight">{p.productName}</h3>
                                        {isInCart && <CheckIcon className="h-3.5 w-3.5 text-green-500 stroke-[3px] shrink-0" />}
                                    </div>
                                    <p className="text-sm text-blue-600 font-black uppercase tracking-tighter mb-1">{p.category?.name || 'ITEM'}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-black text-gray-800 flex items-center gap-0.5">
                                            RS {p.price?.toLocaleString()}
                                        </span>
                                        <span className={`text-sm font-bold ${p.qty <= 5 ? 'text-red-500' : 'text-gray-400'}`}>
                                            {p.qty} in stock
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => onToggleProduct(p)}
                                    className={`p-2.5 rounded-xl transition-all shadow-md active:scale-95 text-white shrink-0 ${isInCart ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-600 hover:bg-blue-700'
                                        }`}
                                >
                                    <PlusIcon className={`h-4 w-4 ${isInCart ? 'stroke-[4px]' : 'stroke-[3px]'}`} />
                                </button>
                            </div>
                        );
                    })
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 italic text-sm">
                        <Package className="h-10 w-10 mb-2 opacity-20" />
                        <p>No products found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TransactionProductBrowser;
