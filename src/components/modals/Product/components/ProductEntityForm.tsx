import React from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { UploadCloud } from 'lucide-react';
import type { ProductEntityFormData } from '../common/ProductEntitySchema';
import type { Category } from '@/api/productService';
import { CATEGORY_NEW_OPTION, FORM_PLACEHOLDERS } from '../common/ProductConstants';
import { getSafeImageUrl } from '@/utils/security';
import { Button, DropDown } from '@/components/ui';

interface ProductEntityFormProps {
    form: UseFormReturn<ProductEntityFormData>;
    categories: Category[];
    imagePreview: string | null;
    imageFile: File | null;
    onImageChange: (file: File) => void;
    onSubmit: () => void;
    onCancel: () => void;
    isEditMode: boolean;
    isSubmitting: boolean;
}

const ProductEntityForm: React.FC<ProductEntityFormProps> = ({
    form,
    categories,
    imagePreview,
    onImageChange,
    onSubmit,
    onCancel,
    isEditMode,
    isSubmitting
}) => {
    const { register, control, watch, formState: { errors } } = form;
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const selectedCategoryId = watch('categoryId');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) onImageChange(file);
    };

    // Create options for DropDown
    const categoryOptions = [
        ...categories.map(cat => ({ value: cat._id, label: cat.name })),
        CATEGORY_NEW_OPTION
    ];

    return (
        <form onSubmit={onSubmit} className="flex flex-col h-full bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
                {/* Image Upload Section */}
                <div className="flex items-center gap-6 pb-6 border-b border-gray-100">
                    <div className="relative group">
                        <img
                            src={getSafeImageUrl(imagePreview) || 'https://placehold.co/150x150/f3f4f6/9ca3af?text=Product'}
                            alt="Product"
                            className="h-20 w-20 rounded-full object-cover ring-4 ring-gray-50 group-hover:ring-indigo-50 transition-all"
                        />
                        <div className="absolute inset-0 rounded-full ring-1 ring-black/5"></div>
                    </div>
                    <div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/*"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-2 py-2 h-9 text-xs"
                        >
                            <UploadCloud size={14} className="text-indigo-600" />
                            {imagePreview ? 'Change Photo' : 'Upload Photo'}
                        </Button>
                    </div>
                </div>

                {/* Product Name */}
                <div>
                    <label htmlFor="product-name" className="block text-sm font-semibold text-gray-700 mb-2">
                        Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="product-name"
                        type="text"
                        {...register('productName')}
                        placeholder={FORM_PLACEHOLDERS.productName}
                        className={`w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-colors ${errors.productName ? 'border-red-500' : 'border-gray-200'}`}
                    />
                    {errors.productName && <p className="text-red-500 text-xs mt-1">{errors.productName.message}</p>}
                </div>

                {/* Category DropDown */}
                <div>
                    <span className="block text-sm font-semibold text-gray-700 mb-2">
                        Category <span className="text-red-500">*</span>
                    </span>
                    <Controller
                        control={control}
                        name="categoryId"
                        render={({ field }) => (
                            <DropDown
                                value={field.value}
                                onChange={field.onChange}
                                options={categoryOptions}
                                placeholder={FORM_PLACEHOLDERS.categorySelect}
                                error={errors.categoryId?.message}
                                className="w-full"
                            />
                        )}
                    />
                    {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId.message}</p>}
                </div>

                {/* New Category Name Input (Conditional) */}
                {selectedCategoryId === 'OTHER' && (
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 animate-fadeIn">
                        <label htmlFor="new-category-name" className="block text-sm font-semibold text-gray-700 mb-2">
                            New Category Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="new-category-name"
                            type="text"
                            {...register('newCategoryName')}
                            placeholder={FORM_PLACEHOLDERS.newCategoryName}
                            className={`w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-colors bg-white ${errors.newCategoryName ? 'border-red-500' : 'border-gray-200'}`}
                        />
                        {errors.newCategoryName && <p className="text-red-500 text-xs mt-1">{errors.newCategoryName.message}</p>}
                    </div>
                )}

                {/* Price and Qty Grid */}
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="product-price" className="block text-sm font-semibold text-gray-700 mb-2">
                            Price (RS) <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="product-price"
                            type="number"
                            min="0"
                            {...register('price')}
                            onFocus={(e) => e.target.value === '0' && (e.target.value = '')}
                            className={`w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-colors ${errors.price ? 'border-red-500' : 'border-gray-200'}`}
                        />
                        {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="product-qty" className="block text-sm font-semibold text-gray-700 mb-2">
                            Stock (Qty) <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="product-qty"
                            type="number"
                            min="0"
                            {...register('qty')}
                            onFocus={(e) => e.target.value === '0' && (e.target.value = '')}
                            className={`w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-colors ${errors.qty ? 'border-red-500' : 'border-gray-200'}`}
                        />
                        {errors.qty && <p className="text-red-500 text-xs mt-1">{errors.qty.message}</p>}
                    </div>
                </div>

                {/* Serial No */}
                <div>
                    <label htmlFor="product-serial" className="block text-sm font-semibold text-gray-700 mb-2">
                        Serial No. / SKU <span className="text-gray-400 font-normal">(Optional)</span>
                    </label>
                    <input
                        id="product-serial"
                        type="text"
                        {...register('serialNo')}
                        placeholder={FORM_PLACEHOLDERS.serialNo}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-colors"
                    />
                </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex-shrink-0 flex justify-end gap-x-4 p-4 border-t border-gray-100 bg-gray-100">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={onCancel}
                    className="text-gray-700 bg-white border-gray-300 hover:bg-gray-50 font-medium"
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    variant="secondary"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (isEditMode ? 'Saving...' : 'Adding...') : (isEditMode ? 'Save Changes' : 'Add Product')}
                </Button>
            </div>
        </form>
    );
};

export default ProductEntityForm;
