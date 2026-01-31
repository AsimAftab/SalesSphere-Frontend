import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { AxiosError } from 'axios';
import { useAuth } from '../../../api/authService';
import { getParties } from '../../../api/partyService';
import { getProducts } from '../../../api/productService';
import type { Product } from '../../../api/productService';
import apiClient from '../../../api/api';

export interface CartItem {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    discount: number;
    maxQty: number;
}

export interface Party {
    id: string;
    companyName: string;
}

interface TransactionPayload {
    partyId: string;
    discount: number;
    items: CartItem[];
    expectedDeliveryDate?: string;
}

export const useTransactionManager = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const queryClient = useQueryClient();
    const { hasPermission } = useAuth();

    const paramType = searchParams.get('type');
    const canCreateOrder = hasPermission('invoices', 'create');
    const canCreateEstimate = hasPermission('estimates', 'create');

    // Logic: 
    // 1. If type is explicitly 'estimate', default to estimate.
    // 2. If type is NOT estimate (implicit order), but user CANNOT create orders AND CAN create estimates, force estimate.
    // 3. Otherwise default to order (standard behavior).
    let isEstimateMode = paramType === 'estimate';

    if (!isEstimateMode) {
        if (!canCreateOrder && canCreateEstimate) {
            isEstimateMode = true;
        }
    }

    const isOrder = !isEstimateMode;

    // --- State ---
    const [selectedPartyId, setSelectedPartyId] = useState('');
    const [deliveryDate, setDeliveryDate] = useState<Date | null>(null);
    const [overallDiscount, setOverallDiscount] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [items, setItems] = useState<CartItem[]>([]);

    // --- Data Fetching ---
    const { data: parties, isLoading: partiesLoading } = useQuery({
        queryKey: ['parties'],
        queryFn: getParties
    });

    const { data: productsResponse, isLoading: productsLoading } = useQuery({
        queryKey: ['products'],
        queryFn: () => getProducts()
    });

    const productsList: Product[] = useMemo(() => productsResponse || [], [productsResponse]);

    // --- Derived State ---
    const categories = useMemo(() => {
        const cats = productsList.map((p) => p.category?.name).filter((name): name is string => !!name);
        return Array.from(new Set(cats));
    }, [productsList]);

    const filteredProducts = useMemo(() => {
        const list = productsList.filter((p) => {
            const matchesSearch = p.productName.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategories.length === 0 || (p.category?.name && selectedCategories.includes(p.category.name));
            return matchesSearch && matchesCategory;
        });

        // Sort: In-cart items first
        return [...list].sort((a, b) => {
            const aInCart = items.some(item => item.productId === a.id);
            const bInCart = items.some(item => item.productId === b.id);
            if (aInCart && !bInCart) return -1;
            if (!aInCart && bInCart) return 1;
            return 0;
        });
    }, [productsList, searchTerm, selectedCategories, items]);

    const totals = useMemo(() => {
        const subtotal = items.reduce((acc, item) => {
            const itemTotal = (item.price * item.quantity) * (1 - (item.discount / 100));
            return acc + itemTotal;
        }, 0);
        const discountAmount = (subtotal * overallDiscount) / 100;
        const finalTotal = subtotal - discountAmount;
        return { subtotal, finalTotal, discountAmount };
    }, [items, overallDiscount]);

    // --- Actions ---
    const toggleCategory = (cat: string) => {
        setSelectedCategories(prev =>
            prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
        );
    };

    const toggleProduct = (prod: Product) => {
        const prodId = prod.id;
        const existingItemIndex = items.findIndex(item => item.productId === prodId);

        if (existingItemIndex > -1) {
            const newItems = [...items];
            const currentQty = Number(newItems[existingItemIndex].quantity);
            newItems[existingItemIndex] = {
                ...newItems[existingItemIndex],
                quantity: currentQty + 1
            };
            setItems(newItems);
            toast.success(`Increased ${prod.productName} quantity`);
        } else {
            setItems([...items, {
                productId: prodId,
                quantity: 1,
                price: prod.price || 0,
                discount: 0,
                productName: prod.productName,
                maxQty: prod.qty || 0
            }]);
            toast.success(`Added ${prod.productName}`);
        }
    };

    const removeItem = (id: string) => {
        setItems(prev => prev.filter(i => i.productId !== id));
    };

    const updateItem = (index: number, field: keyof CartItem, value: string | number) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
    };

    const mutation = useMutation({
        mutationFn: async (payload: TransactionPayload) => {
            const endpoint = isOrder ? '/invoices' : '/invoices/estimates';
            return apiClient.post(endpoint, payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: isOrder ? ['orders'] : ['estimates'] });
            toast.success(`${isOrder ? 'Order' : 'Estimate'} created successfully!`);
            navigate(`/order-lists?tab=${isOrder ? 'orders' : 'estimates'}`);
        },
        onError: (err: AxiosError<{ message: string }>) => toast.error(err.response?.data?.message || "Error creating transaction")
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

    return {
        state: {
            isOrder,
            selectedPartyId,
            deliveryDate,
            overallDiscount,
            searchTerm,
            selectedCategories,
            items,
            parties: parties as Party[] | undefined,
            partiesLoading,
            productsLoading,
            categories,
            filteredProducts,
            totals,
            isSubmitting: mutation.isPending
        },
        actions: {
            setSelectedPartyId,
            setDeliveryDate,
            setOverallDiscount,
            setSearchTerm,
            setSelectedCategories,
            toggleCategory,
            toggleProduct,
            removeItem,
            updateItem,
            handleSubmit
        }
    };
};
