import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productEntitySchema, type ProductEntityFormData } from '../common/ProductEntitySchema';
import { type Product, type Category, type NewProductFormData, type UpdateProductFormData } from '../../../../api/productService';

import toast from 'react-hot-toast';

export interface UseProductEntityProps {
    isOpen: boolean; // Add isOpen prop
    product?: Product | null;
    categories: Category[];
    onAdd: (data: NewProductFormData) => Promise<Product>;
    onUpdate: (data: UpdateProductFormData) => Promise<Product>;
    onSuccess: () => void;
}

export const useProductEntity = ({ isOpen, product, categories, onAdd, onUpdate, onSuccess }: UseProductEntityProps) => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const form = useForm<ProductEntityFormData>({
        resolver: zodResolver(productEntitySchema),
        defaultValues: {
            productName: '',
            categoryId: '',
            newCategoryName: '',
            price: 0,
            qty: 0,
            serialNo: '',
        }
    });

    // Reset/Populate form on mode change or modal open
    useEffect(() => {
        if (!isOpen) return; // Don't reset if modal is closed (optional, but good for performance)

        if (product) {
            form.reset({
                productName: product.productName,
                categoryId: product.category._id,
                newCategoryName: '',
                price: product.price,
                qty: product.qty,
                serialNo: product.serialNo || '',
            });
            setImagePreview(product.image.url);
            setImageFile(null);
        } else {
            form.reset({
                productName: '',
                categoryId: '',
                newCategoryName: '',
                price: 0,
                qty: 0,
                serialNo: '',
            });
            setImagePreview(null);
            setImageFile(null);
        }
    }, [isOpen, product, form]);

    const handleImageChange = (file: File) => {
        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };



    const onSubmit = async (data: ProductEntityFormData) => {
        try {
            // Category Logic
            let categoryNameToSend = '';
            if (data.categoryId === 'OTHER') {
                categoryNameToSend = data.newCategoryName?.trim() || '';
            } else {
                const selectedCategory = categories.find(c => c._id === data.categoryId);
                categoryNameToSend = selectedCategory ? selectedCategory.name : '';
            }

            if (product) {
                // Update Logic
                const updatePayload: UpdateProductFormData = {};
                // ... check for changes ...
                if (data.productName !== product.productName) updatePayload.productName = data.productName;
                if (data.price !== product.price) updatePayload.price = data.price;
                if (data.qty !== product.qty) updatePayload.qty = data.qty;
                if ((data.serialNo || '') !== (product.serialNo || '')) updatePayload.serialNo = data.serialNo;

                // Optimized category update check
                if (data.categoryId === 'OTHER') {
                    updatePayload.category = data.newCategoryName?.trim();
                } else if (data.categoryId !== product.category._id) {
                    updatePayload.category = categoryNameToSend;
                }

                if (imageFile) updatePayload.image = imageFile;

                if (Object.keys(updatePayload).length === 0) {
                    toast('No changes detected.', { icon: 'ℹ️' });
                    onSuccess();
                    return;
                }

                await onUpdate(updatePayload);
                // Notification handled by mutation hook

            } else {
                // Add Logic
                const newProductData: NewProductFormData = {
                    productName: data.productName,
                    category: categoryNameToSend,
                    price: data.price,
                    qty: data.qty,
                    serialNo: data.serialNo || undefined,
                    image: imageFile || undefined,
                };
                await onAdd(newProductData);
                // Notification handled by mutation hook
            }
            onSuccess();
        } catch (error: any) {
            console.error('Operation failed', error);
            const errorMessage = error.message || 'Operation failed';
            // If it's a specific field error (like duplicate name), we could setsetError here
            if (errorMessage.toLowerCase().includes('name')) {
                form.setError('productName', { message: errorMessage });
            } else {
                toast.error(errorMessage);
            }
        }
    };

    return {
        form,
        imagePreview,
        imageFile,
        handleImageChange,
        onSubmit: form.handleSubmit(onSubmit),
        isEditMode: !!product
    };
};
