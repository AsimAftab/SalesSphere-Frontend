import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { Product, Category, NewProductFormData, UpdateProductFormData } from '../../../api/productService';
import { useProductEntity } from './hooks/useProductEntity';
import ProductEntityForm from './components/ProductEntityForm';
import ErrorBoundary from '../../UI/ErrorBoundary/ErrorBoundary';

interface ProductEntityModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null; // null = Add Mode, object = Edit Mode
    categories: Category[];
    onAdd: (data: NewProductFormData) => Promise<Product>;
    onUpdate: (data: UpdateProductFormData) => Promise<Product>;
    onSuccess?: () => void; // Optional callback after successful op
}

const ProductEntityModal: React.FC<ProductEntityModalProps> = ({
    isOpen,
    onClose,
    product,
    categories,
    onAdd,
    onUpdate,
    onSuccess
}) => {

    const handleSuccess = () => {
        if (onSuccess) onSuccess();
        onClose();
    };

    const {
        form,
        imagePreview,
        imageFile,
        handleImageChange,
        onSubmit,
        isEditMode
    } = useProductEntity({
        isOpen, // Pass isOpen
        product,
        categories,
        onAdd,
        onUpdate,
        onSuccess: handleSuccess
    });

    return (
        <ErrorBoundary>
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        />

                        {/* Modal Content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden z-10"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">
                                        {isEditMode ? 'Edit Product' : 'Add New Product'}
                                    </h3>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all duration-200 hover:rotate-90"
                                >
                                    <XMarkIcon className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Form Body */}
                            <div className="max-h-[85vh] overflow-y-auto">
                                <ProductEntityForm
                                    form={form}
                                    categories={categories}
                                    imagePreview={imagePreview}
                                    imageFile={imageFile}
                                    onImageChange={handleImageChange}
                                    onSubmit={onSubmit}
                                    onCancel={onClose}
                                    isEditMode={isEditMode}
                                    isSubmitting={form.formState.isSubmitting}
                                />
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </ErrorBoundary>
    );
};

export default ProductEntityModal;
