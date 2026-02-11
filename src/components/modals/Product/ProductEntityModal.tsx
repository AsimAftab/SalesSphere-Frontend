import React from 'react';
import type { Product, Category, NewProductFormData, UpdateProductFormData } from '@/api/productService';
import { useProductEntity } from './hooks/useProductEntity';
import ProductEntityForm from './components/ProductEntityForm';
import { FormModal, Button } from '@/components/ui';

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

  const footer = (
    <div className="flex justify-end gap-3 w-full">
      <Button
        type="button"
        variant="outline"
        onClick={onClose}
        disabled={form.formState.isSubmitting}
        className="text-gray-700 bg-white border-gray-300 hover:bg-gray-50 font-medium"
      >
        Cancel
      </Button>
      <Button
        type="submit"
        variant="secondary"
        form="product-form"
        disabled={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting
          ? (isEditMode ? 'Saving...' : 'Adding...')
          : (isEditMode ? 'Save Changes' : 'Add Product')}
      </Button>
    </div>
  );

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit Product' : 'Add New Product'}
      size="md"
      footer={footer}
    >
      <ProductEntityForm
        form={form}
        categories={categories}
        imagePreview={imagePreview}
        imageFile={imageFile}
        onImageChange={handleImageChange}
        onSubmit={onSubmit}
        isEditMode={isEditMode}
      />
    </FormModal>
  );
};

export default ProductEntityModal;
