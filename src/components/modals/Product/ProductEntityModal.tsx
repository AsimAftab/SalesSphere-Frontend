import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Product, Category, NewProductFormData, UpdateProductFormData } from '@/api/productService';
import { useProductEntity } from './hooks/useProductEntity';
import ProductEntityForm from './components/ProductEntityForm';
import { ErrorBoundary } from '@/components/ui';
import {
  ModalHeader,
  ModalBody,
  ModalContainer,
  backdropVariants,
  scaleVariants,
} from '@/components/ui/ModalWrapper';

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
  onSuccess,
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
    isEditMode,
  } = useProductEntity({
    isOpen,
    product,
    categories,
    onAdd,
    onUpdate,
    onSuccess: handleSuccess,
  });

  return (
    <ErrorBoundary>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={onClose}
            />

            {/* Modal Content */}
            <motion.div
              variants={scaleVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative z-10"
            >
              <ModalContainer size="md">
                {/* Header */}
                <ModalHeader
                  title={isEditMode ? 'Edit Product' : 'Add New Product'}
                  onClose={onClose}
                  className="bg-gray-50"
                />

                {/* Form Body */}
                <ModalBody scrollable maxHeight="85vh" noPadding>
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
                </ModalBody>
              </ModalContainer>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ErrorBoundary>
  );
};

export default ProductEntityModal;
