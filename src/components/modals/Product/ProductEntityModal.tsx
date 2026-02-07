import React from 'react';
import type { Product, Category, NewProductFormData, UpdateProductFormData } from '@/api/productService';
import { useProductEntity } from './hooks/useProductEntity';
import ProductEntityForm from './components/ProductEntityForm';
import { FormModal } from '@/components/ui';

interface ProductEntityModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  categories: Category[];
  onAdd: (data: NewProductFormData) => Promise<Product>;
  onUpdate: (data: UpdateProductFormData) => Promise<Product>;
  onSuccess?: () => void;
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
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit Product' : 'Add New Product'}
      size="md"
    >
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
    </FormModal>
  );
};

export default ProductEntityModal;
