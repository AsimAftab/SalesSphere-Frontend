import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    PlusIcon, 
    MagnifyingGlassIcon,
    UserIcon,
    ArrowLeftIcon,
    ShoppingCartIcon,
    TrashIcon,
    XCircleIcon,
    ChevronDownIcon,
    FunnelIcon,
    CheckIcon
} from '@heroicons/react/24/outline';
import { Loader2, Package} from 'lucide-react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

// APIs & Components
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import Button from '../../components/UI/Button/Button';
import DatePicker from '../../components/UI/DatePicker/DatePicker'; 
import { getParties } from '../../api/partyService'; 
import { getProducts } from '../../api/productService';
import apiClient from '../../api/api';

// --- Animation Variants ---
const itemVariants = {
    hidden: { opacity: 1 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const TransactionSkeleton = () => (
    <div className="w-full">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4 px-1">
            <div className="flex items-center gap-4">
                <Skeleton circle width={48} height={48} />
                <div>
                    <Skeleton width={200} height={32} />
                    <Skeleton width={250} height={16} className="mt-2" />
                </div>
            </div>
            <Skeleton width={160} height={44} borderRadius={12} />
        </div>

        {/* 3 Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Column 1: Form Details */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col h-[650px] shadow-sm">
                <div className="mb-8">
                    <Skeleton width={180} height={24} className="mb-6" />
                    
                    <div className="space-y-6">
                        <div>
                            <Skeleton width={100} height={14} className="mb-2" />
                            <Skeleton height={48} borderRadius={12} />
                        </div>
                        <div>
                            <Skeleton width={120} height={14} className="mb-2" />
                            <Skeleton height={48} borderRadius={12} />
                        </div>
                    </div>
                </div>

                <div className="mt-auto pt-6 border-t border-gray-50">
                    <Skeleton width={100} height={20} className="mb-4" />
                    <div className="space-y-3">
                        <div className="flex justify-between"><Skeleton width={120} height={16} /> <Skeleton width={60} height={16} /></div>
                        <div className="flex justify-between"><Skeleton width={100} height={16} /> <Skeleton width={80} height={16} /></div>
                    </div>
                </div>
            </div>

            {/* Column 2: Product Browser */}
            <div className="bg-white rounded-2xl border border-gray-100 flex flex-col h-[650px] overflow-hidden shadow-sm">
                <div className="p-5 border-b flex justify-between items-center bg-gray-50/30">
                    <Skeleton width={150} height={24} />
                </div>
                
                {/* Search & Filter Bar Skeleton */}
                <div className="p-6 flex gap-3 border-b border-gray-50">
                    <Skeleton className="flex-1" height={42} borderRadius={12} /> 
                    <Skeleton width={42} height={42} borderRadius={12} />
                </div>

                <div className="p-4 space-y-4 overflow-hidden">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex gap-4 items-center p-3 border border-gray-50 rounded-2xl">
                            <Skeleton width={64} height={64} borderRadius={12} />
                            <div className="flex-1">
                                <Skeleton width="70%" height={18} />
                                <Skeleton width="40%" height={12} className="mt-2" />
                                <div className="flex justify-between mt-2">
                                    <Skeleton width={50} height={14} />
                                    <Skeleton width={70} height={14} />
                                </div>
                            </div>
                            <Skeleton width={36} height={36} borderRadius={10} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Column 3: Active Cart */}
            <div className="bg-white rounded-2xl border border-gray-100 h-[650px] flex flex-col shadow-sm">
                <div className="p-5 border-b flex justify-between items-center bg-gray-50/30">
                    <Skeleton width={120} height={24} />
                    <Skeleton width={60} height={20} borderRadius={20} />
                </div>

                <div className="flex-1 flex flex-col items-center justify-center space-y-4 px-6 text-center">
                    <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center">
                        <ShoppingCartIcon className="h-10 w-10 text-gray-200" />
                    </div>
                    <div className="w-full">
                        <Skeleton width="60%" height={16} className="mx-auto" />
                        <Skeleton width="80%" height={12} className="mt-2 mx-auto" />
                    </div>
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-200 space-y-4">
                    <div className="space-y-3">
                        <div className="flex justify-between"><Skeleton width={80} height={14} /> <Skeleton width={100} height={14} /></div>
                        <div className="flex justify-between items-center">
                            <Skeleton width={60} height={14} /> 
                            <Skeleton width={80} height={32} borderRadius={8} />
                        </div>
                    </div>
                    <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                        <Skeleton width={120} height={24} />
                        <Skeleton width={100} height={28} />
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const CreateTransactionPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const queryClient = useQueryClient();
    
    const mode = searchParams.get('type') === 'estimate' ? 'estimate' : 'order';
    const isOrder = mode === 'order';

    // --- State ---
    const [selectedPartyId, setSelectedPartyId] = useState('');
    const [deliveryDate, setDeliveryDate] = useState<Date | null>(null); 
    const [overallDiscount, setOverallDiscount] = useState(0);
    const [partyDropdownOpen, setPartyDropdownOpen] = useState(false);
    const [partySearch, setPartySearch] = useState('');

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [items, setItems] = useState<any[]>([]);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const filterRef = useRef<HTMLDivElement>(null);

    const getInitials = (name: string) => {
        if (!name) return '??';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[0][1]).toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    };

    // --- Effects ---
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setPartyDropdownOpen(false);
            }
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setIsFilterOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // --- Data Fetching ---
    const { data: parties, isLoading: partiesLoading } = useQuery({ 
        queryKey: ['parties'], 
        queryFn: getParties 
    });
    
    const { data: productsResponse, isLoading: productsLoading } = useQuery({ 
        queryKey: ['products'], 
        queryFn: () => getProducts() 
    });

    const productsList = productsResponse?.data || [];

    const categories = useMemo(() => {
        const cats = productsList.map((p: any) => p.category?.name).filter(Boolean);
        return Array.from(new Set(cats)) as string[];
    }, [productsList]);

    // // UPDATED FILTER: Now also removes items that are already in the cart
    // const filteredProducts = useMemo(() => {
    //     return productsList.filter((p: any) => {
    //         const matchesSearch = p.productName.toLowerCase().includes(searchTerm.toLowerCase());
    //         const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(p.category?.name);
    //         const notInCart = !items.some(item => item.productId === p._id);
    //         return matchesSearch && matchesCategory && notInCart;
    //     });
    // }, [productsList, searchTerm, selectedCategories, items]);


    const filteredProducts = useMemo(() => {
    const list = productsList.filter((p: any) => {
        const matchesSearch = p.productName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(p.category?.name);
        return matchesSearch && matchesCategory;
    });

    // NEW: Sort logic to bring "In Cart" items to the top
    return [...list].sort((a, b) => {
        const aInCart = items.some(item => item.productId === a._id);
        const bInCart = items.some(item => item.productId === b._id);
        
        if (aInCart && !bInCart) return -1; // a comes first
        if (!aInCart && bInCart) return 1;  // b comes first
        return 0; // maintain original order otherwise
    });
}, [productsList, searchTerm, selectedCategories, items]); // Added 'items' as a dependency 

    // --- Totals calculation ---
    const totals = useMemo(() => {
        const subtotal = items.reduce((acc, item) => {
            const itemTotal = (item.price * item.quantity) * (1 - (item.discount / 100));
            return acc + itemTotal;
        }, 0);
        const discountAmount = (subtotal * overallDiscount) / 100;
        const finalTotal = subtotal - discountAmount;
        return { subtotal, finalTotal, discountAmount };
    }, [items, overallDiscount]);

    const toggleCategory = (cat: string) => {
        setSelectedCategories(prev => 
            prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
        );
    };

    // // --- Handlers ---
    // const toggleProduct = (prod: any) => {
    //     setItems([...items, { 
    //         productId: prod._id, 
    //         quantity: 1, 
    //         price: prod.price || 0, 
    //         discount: 0, 
    //         productName: prod.productName,
    //         maxQty: prod.qty || 0 
    //     }]);
    // };

    const toggleProduct = (prod: any) => {
        const existingItemIndex = items.findIndex(item => item.productId === prod._id);

        if (existingItemIndex > -1) {
            // Item exists: Increment quantity
            const newItems = [...items];
            const currentQty = Number(newItems[existingItemIndex].quantity);
            newItems[existingItemIndex] = { 
                ...newItems[existingItemIndex], 
                quantity: currentQty + 1 
            };
            setItems(newItems);
            toast.success(`Increased ${prod.productName} quantity`);
        } else {
            // Item doesn't exist: Add new entry
            setItems([...items, { 
                productId: prod._id, 
                quantity: 1, 
                price: prod.price || 0, 
                discount: 0, 
                productName: prod.productName,
                maxQty: prod.qty || 0 
            }]);
        }
    };

    const removeItem = (id: string) => {
        setItems(prev => prev.filter(i => i.productId !== id));
    };

    const updateItem = (index: number, field: string, value: any) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
    };

    const mutation = useMutation({
        mutationFn: async (payload: any) => {
            const endpoint = isOrder ? '/invoices' : '/invoices/estimates';
            return apiClient.post(endpoint, payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: isOrder ? ['orders'] : ['estimates'] });
            toast.success(`${isOrder ? 'Order' : 'Estimate'} created successfully!`);
            navigate(`/order-lists?tab=${isOrder ? 'orders' : 'estimates'}`);
        },
        onError: (err: any) => toast.error(err.response?.data?.message || "Error")
    });

    const handleSubmit = () => {
        if (!selectedPartyId) return toast.error("Select a party");
        if (isOrder && !deliveryDate) return toast.error("Select delivery date");
        if (items.length === 0) return toast.error("Add products");

        mutation.mutate({
            partyId: selectedPartyId,
            discount: overallDiscount,
            items: items.map(i => ({ ...i, quantity: Number(i.quantity), price: Number(i.price) })),
            ...(isOrder && { expectedDeliveryDate: deliveryDate?.toISOString() })
        });
    };

    return (
        <Sidebar>
                <SkeletonTheme baseColor="#f3f4f6" highlightColor="#ffffff">
                    <div className="p-1 min-h-screen">
                    {/* Render Skeleton if loading */}
                    {(partiesLoading || productsLoading) ? (
                        <TransactionSkeleton />
                    ) : (
                        <motion.div
                
                            variants={itemVariants}
                            initial="hidden"
                            animate="show"
                        >
                            {/* Header Section */}
                            <motion.div 
                                className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4"
                                variants={itemVariants}
                            >
                                <div className="flex items-center gap-4">
                                    <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                                        <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
                                    </button>
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-800">
                                            Create {isOrder ? 'Order' : 'Estimate'}
                                        </h1>
                                        <p className="text-sm text-gray-500">Configure details and add products</p>
                                    </div>
                                </div>
                                <Button 
                                    onClick={handleSubmit} 
                                    disabled={mutation.isPending}
                                    className="w-full sm:w-auto"
                                >
                                    {mutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : `Create ${isOrder ? 'Order' : 'Estimate'}`}
                                </Button>
                            </motion.div>

                            <motion.div 
                                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                                variants={itemVariants}
                            >

                                {/* Column 1: Details */}
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden h-full">
                                    <div className="p-5 border-b bg-gray-50/50 shrink-0">
                                        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                            <UserIcon className="h-5 w-5 text-blue-500" />{isOrder ? 'Order' : 'Estimate'} Details
                                        </h2>
                                    </div>
                                    <div className="p-6 space-y-6 overflow-y-auto flex-1">
                                        <div className="relative" ref={dropdownRef}>
                                            <label className="text-sm text-gray-800  tracking-widest mb-1.5 block">Select Party</label>
                                            <button
                                                type="button"
                                                onClick={() => setPartyDropdownOpen(!partyDropdownOpen)}
                                                className="w-full flex justify-between items-center p-3 border border-gray-200 rounded-xl text-sm bg-white  transition-all shadow-sm focus:ring-2 focus:ring-secondary"
                                            >
                                                <span className="font-semibold text-gray-400">
                                                    {selectedPartyId ? parties?.find((p: any) => p.id === selectedPartyId)?.companyName : "Choose party..."}
                                                </span>
                                                {partiesLoading ? <Loader2 className="h-4 w-4 animate-spin text-blue-500" /> : <ChevronDownIcon className={`h-4 w-4 text-gray-400 transition-transform ${partyDropdownOpen ? 'rotate-180' : ''}`} />}
                                            </button>

                                            {partyDropdownOpen && (
                                                <div className="absolute w-full mt-2 border border-gray-100 bg-white rounded-xl shadow-2xl z-50 max-h-64 overflow-hidden flex flex-col">
                                                    <div className="p-3 bg-gray-50 border-b">
                                                        <input autoFocus type="text" placeholder="Search party..." value={partySearch} onChange={(e) => setPartySearch(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-secondary" />
                                                    </div>
                                                    <div className="overflow-y-auto">
                                                        {parties?.filter((p: any) => p.companyName.toLowerCase().includes(partySearch.toLowerCase())).map((p: any) => (
                                                            <div key={p.id} onClick={() => { setSelectedPartyId(p.id); setPartyDropdownOpen(false); setPartySearch(''); }} className="px-4 py-3 text-sm font-medium text-gray-600 cursor-pointer hover:bg-blue-50 transition-colors border-b border-gray-50 last:border-0">
                                                                {p.companyName}
                                                                
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {isOrder && (
                                            <div>
                                                <label className="text-sm  text-gray-800  tracking-widest mb-1.5 block">Expected Delivery</label>
                                                <DatePicker value={deliveryDate} onChange={(date) => setDeliveryDate(date)} className="w-full p-3 border border-gray-200 rounded-xl bg-white text-sm" />
                                            </div>
                                        )}

                                        <div className="border-t pt-4 mt-auto">
                                        <h3 className="text-md font-semibold text-gray-700 mb-2">Summary</h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Total Unique Items:</span>
                                                <span className="font-medium">{items.length}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Gross Subtotal:</span>
                                                <span className="font-medium text-blue-600">Rs {totals.subtotal.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                            
                                    </div>
                                </div>

                                {/* Column 2: Enhanced Product Browser (Shows ~5 Products) */}
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden h-full">
                                    <div className="p-5 border-b bg-gray-50/50 shrink-0">
                                        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                            <Package className="h-4 w-4 text-blue-500" /> Product List ({filteredProducts.length})
                                        </h2>
                                    </div>

                                    {/* FIXED LAYOUT: 
                                    - Added px-6 to create side gaps on the left and right.
                                    - Search bar and filter icon are now perfectly centered between those gaps.
                                    */}
                                    <div className="flex items-center gap-3 mt-6 mb-4 px-6 shrink-0"> 
                                        <div className="relative flex-1 group">
                                            {/* Search Icon positioned inside the bar */}
                                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                            
                                            <input 
                                                type="text" 
                                                placeholder="Search products..." 
                                                value={searchTerm} 
                                                onChange={(e) => setSearchTerm(e.target.value)} 
                                                className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all shadow-sm" 
                                            />

                                            {/* Clear button appears only when typing */}
                                            {searchTerm && (
                                                <button
                                                    onClick={() => setSearchTerm('')}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                                                >
                                                    <XCircleIcon className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>

                                        {/* Filter Section - Restored to clear TS warnings */}
                                        <div className="relative shrink-0" ref={filterRef}>
                                            <button 
                                                onClick={() => setIsFilterOpen(!isFilterOpen)} 
                                                className={`p-2.5 rounded-xl border transition-all shadow-sm ${
                                                    selectedCategories.length > 0 
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
                                                        {/* Uses 'categories' variable */}
                                                        <div className="max-h-60 overflow-y-auto space-y-1 custom-scrollbar">
                                                            {categories.map(cat => (
                                                                <label key={cat} className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors group">
                                                                    <div className={`h-4 w-4 rounded flex items-center justify-center border transition-all ${
                                                                        selectedCategories.includes(cat) ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300 group-hover:border-blue-400'
                                                                    }`}>
                                                                        {/* Uses 'CheckIcon' variable */}
                                                                        {selectedCategories.includes(cat) && <CheckIcon className="h-3 w-3 text-white stroke-[3px]" />}
                                                                    </div>
                                                                    {/* Uses 'toggleCategory' function */}
                                                                    <input 
                                                                        type="checkbox" 
                                                                        className="hidden" 
                                                                        checked={selectedCategories.includes(cat)} 
                                                                        onChange={() => toggleCategory(cat)} 
                                                                    />
                                                                    <span className="text-xs font-bold text-gray-600">{cat}</span>
                                                                </label>
                                                            ))}
                                                        </div>
                                                        {selectedCategories.length > 0 && (
                                                            <button 
                                                                onClick={() => setSelectedCategories([])} 
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

                                    {/* Scrollable container showing exactly 5 items */}
                                    <div className="h-[560px] overflow-y-auto p-4 space-y-3 bg-gray-50/50 custom-scrollbar">
                                        {productsLoading ? (
                                            <div className="flex flex-col items-center justify-center h-full opacity-40">
                                                <Loader2 className="h-8 w-8 animate-spin mb-2" />
                                            </div>
                                        ) : filteredProducts.length > 0 ? (
                                            filteredProducts.map((p: any) => {
                                                const isInCart = items.some(item => item.productId === p._id);
                                                // Get quantity from cart for display (Optional improvement)
                                                const cartItem = items.find(item => item.productId === p._id);
                                                
                                                return (
                                                    <div 
                                                        key={p._id} 
                                                        className={`group p-3 border-2 rounded-2xl flex items-center gap-4 transition-all h-[96px] bg-white ${
                                                            isInCart 
                                                            ? 'border-secondary/40 bg-secondary/5 shadow-sm' 
                                                            : 'border-transparent hover:border-blue-100 hover:shadow-md'
                                                        }`}
                                                    >
                                                        {/* Image / Initials Section */}
                                                        <div className="h-16 w-16 shrink-0 rounded-xl overflow-hidden border border-gray-100 bg-white flex items-center justify-center relative">
                                                            {p.image?.url ? (
                                                                <img src={p.image.url} alt="" className="h-full w-full object-cover" />
                                                            ) : (
                                                                <div className="h-full w-full bg-secondary flex items-center justify-center text-white font-black text-lg uppercase">
                                                                    {getInitials(p.productName)}
                                                                </div>
                                                            )}
                                                            {/* Quantity Badge on Image if in cart */}
                                                            {isInCart && (
                                                                <div className="absolute -top-1 -right-1 bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                                                                    {cartItem?.quantity}
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Info Section */}
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
                                                            onClick={() => toggleProduct(p)} 
                                                            className={`p-2.5 rounded-xl transition-all shadow-md active:scale-95 text-white shrink-0 ${
                                                                isInCart ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-600 hover:bg-blue-700'
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

                                {/* Column 3: Summary / Selected Items */}
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden h-full">
                                    {/* Header Section */}
                                    <div className="p-5 border-b bg-gray-50/50 text-gray-800 flex justify-between items-center shrink-0">
                                        <h2 className="text-lg font-bold flex items-center gap-2">
                                            <ShoppingCartIcon className="h-5 w-5 text-blue-500" /> Active Cart
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
                                                    <ShoppingCartIcon className="h-16 w-16 mb-2" />
                                                    <p className="text-sm font-bold uppercase tracking-widest text-center leading-relaxed">
                                                        Your cart is empty.<br/>
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
                                                                onClick={() => removeItem(item.productId)} 
                                                                className="absolute -top-2 -right-2 bg-white text-red-500 hover:bg-red-50 p-1.5 rounded-full shadow-md border opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                                            >
                                                                <TrashIcon className="h-4 w-4" />
                                                            </button>

                                                            <p className="font-bold text-sm text-gray-800 pr-6 truncate leading-tight">
                                                                {item.productName}
                                                            </p>

                                                            {/* 3-Column Input Grid */}
                                                            <div className="grid grid-cols-3 gap-2 mt-2">
                                                                <div className="space-y-1">
                                                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest block text-center">Quantity</label>
                                                                    <input 
                                                                        type="number" 
                                                                        min="1" 
                                                                        value={item.quantity} 
                                                                        onChange={(e) => updateItem(index, 'quantity', Math.max(1, Number(e.target.value)))}
                                                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-1 py-1.5 text-xs font-bold text-center outline-none focus:ring-0 focus:border-secondary transition-all hide-spinner" 
                                                                    />
                                                                </div>

                                                                <div className="space-y-1">
                                                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest block text-center">Rate</label>
                                                                    <input 
                                                                        type="number" 
                                                                        min="0" 
                                                                        value={item.price} 
                                                                        onChange={(e) => updateItem(index, 'price', Math.max(0, Number(e.target.value)))}
                                                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-1 py-1.5 text-xs font-bold text-center outline-none focus:ring-0 focus:border-secondary transition-all hide-spinner" 
                                                                    />
                                                                </div>

                                                                <div className="space-y-1">
                                                                    <label className="text-xs font-black text-red-400 uppercase tracking-widest block text-center">Disc %</label>
                                                                    <input 
                                                                        type="number" 
                                                                        min="0"
                                                                        max="100"
                                                                        placeholder="0"
                                                                        value={item.discount || ''} 
                                                                        onChange={(e) => updateItem(index, 'discount', Math.min(100, Math.max(0, Number(e.target.value))))}
                                                                        className={`w-full bg-gray-50 border rounded-lg px-1 py-1.5 text-xs font-bold text-center outline-none focus:ring-0 focus:border-secondary transition-all hide-spinner ${
                                                                            item.discount > 0 ? 'text-red-500 border-red-200' : 'text-gray-700 border-gray-200'
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

                                    {/* Summary Totals - Now pinned to the bottom because of flex-1 above */}
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
                                                        /* Dynamic styling: 
                                                        - 'text-red-500 border-red-200' if set
                                                        - 'text-gray-400 border-gray-200' if zero
                                                        - 'appearance-none' and 'hide-spinner' to remove arrows
                                                        */
                                                        className={`w-16 pl-2 pr-6 py-1.5 border rounded-lg bg-white text-center font-black outline-none focus:ring-0 focus:border-secondary transition-all appearance-none hide-spinner ${
                                                            overallDiscount > 0 
                                                            ? 'text-red-500 border-red-200' 
                                                            : 'text-gray-400 border-gray-200'
                                                        }`}
                                                    />
                                                    {/* Percentage symbol color also toggles */}
                                                    <span className={`absolute right-2 top-1/2 -translate-y-1/2 text-[10px] pointer-events-none transition-colors ${
                                                        overallDiscount > 0 ? 'text-red-500' : 'text-gray-400'
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
                            </motion.div>
                    </motion.div>
                )}
            </div>
        </SkeletonTheme>
    </Sidebar>
    );
};

export default CreateTransactionPage;