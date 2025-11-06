import React, { useState, useEffect, useRef } from 'react';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/solid';
import Button from '../UI/Button/Button';
import { 
    type Product, 
    type Category, 
    type UpdateProductFormData 
} from '../../api/productService';
import toast from 'react-hot-toast';

interface EditProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    productData: Product | null;
    categories: Category[];
    onSave: (formData: UpdateProductFormData) => Promise<Product>;
    // onCreateCategory prop REMOVED
}

const EditProductModal: React.FC<EditProductModalProps> = ({ 
    isOpen, 
    onClose, 
    productData, 
    categories,
    onSave,
}) => {
    // ... (rest of the component is unchanged) ...
    const [productName, setProductName] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [newCategoryName, setNewCategoryName] = useState('');
    const [price, setPrice] = useState<number | string>('');
    const [qty, setQty] = useState<number | string>('');
    const [serialNo, setSerialNo] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const originalImagePreview = useRef<string | null>(null);

    useEffect(() => {
        if (isOpen && productData) {
            setProductName(productData.productName);
            setSelectedCategoryId(productData.category._id);
            setPrice(productData.price);
            setQty(productData.qty);
            setSerialNo(productData.serialNo || '');
            setImagePreview(productData.image.url);
            originalImagePreview.current = productData.image.url;
            setNewCategoryName('');
            setImageFile(null);
            setErrors({});
            setIsSubmitting(false);
        }
    }, [isOpen, productData]);

    useEffect(() => {
        return () => {
            if (imagePreview && imagePreview.startsWith('blob:')) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    if (!isOpen) {
        return null;
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (imagePreview && imagePreview.startsWith('blob:')) {
                URL.revokeObjectURL(imagePreview);
            }
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };
    
    const handleRemovePhoto = () => {
        if (imagePreview && imagePreview.startsWith('blob:')) {
            URL.revokeObjectURL(imagePreview);
        }
        setImagePreview(originalImagePreview.current);
        setImageFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!productName.trim()) newErrors.productName = 'Product name is required.';
        if (!selectedCategoryId) newErrors.category = 'Please select a category.';
        if (selectedCategoryId === 'OTHER' && !newCategoryName.trim()) {
            newErrors.newCategory = 'New category name is required.';
        }
        if (!price || isNaN(Number(price)) || Number(price) <= 0) newErrors.price = 'Please enter a valid price.';
        if (!qty || isNaN(Number(qty)) || !Number.isInteger(Number(qty)) || Number(qty) < 0) newErrors.qty = 'Please enter a valid quantity.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate() || isSubmitting || !productData) return;

        setIsSubmitting(true);
        setErrors({});

        try {
            let categoryNameToSend: string | undefined = undefined;

            if (selectedCategoryId === 'OTHER') {
                categoryNameToSend = newCategoryName.trim();
            } else if (selectedCategoryId !== productData.category._id) {
                const selectedCategory = categories.find(c => c._id === selectedCategoryId);
                categoryNameToSend = selectedCategory ? selectedCategory.name : '';
            }
            
            const updatePayload: UpdateProductFormData = {};

            if (productName.trim() !== productData.productName) {
                updatePayload.productName = productName.trim();
            }
            if (categoryNameToSend) {
                updatePayload.category = categoryNameToSend;
            }
            if (Number(price) !== productData.price) {
                updatePayload.price = Number(price);
            }
            if (Number(qty) !== productData.qty) {
                updatePayload.qty = Number(qty);
            }
            if (serialNo.trim() !== (productData.serialNo || '')) {
                updatePayload.serialNo = serialNo.trim();
            }
            if (imageFile) {
                updatePayload.image = imageFile;
            }

            if (Object.keys(updatePayload).length === 0) {
                toast('No changes detected.', { icon: 'ℹ️' });
                onClose();
                return;
            }

            await onSave(updatePayload);
            onClose();
            
        } catch (error: any) {
            console.error("Submission failed in modal", error);
            setErrors({ submit: error.message || 'Failed to update product.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 font-arimo">
            <div className="relative flex flex-col w-full max-w-md rounded-lg bg-white shadow-2xl">
                
                <div className="flex-shrink-0 p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-800">Edit Product</h2>
                        <button 
                            onClick={onClose} 
                            className="p-1 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-600 transition-colors"
                            aria-label="Close modal"
                        >
                            <XMarkIcon className="h-6 w-6" /> 
                        </button>
                    </div>
                </div>

                <form id="edit-product-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
                    {/* ... (rest of form JSX is unchanged) ... */}
                    <div className="flex flex-col items-center gap-4">
                        <img 
                            src={imagePreview || "https://placehold.co/100x100/e0e0e0/ffffff?text=N/A"}
                            alt="Product Preview" 
                            className="h-24 w-24 rounded-lg object-cover ring-2 ring-offset-2 ring-secondary" 
                        />
                         <div className="flex items-center gap-4 mt-2">
                            <label htmlFor="edit-image-upload" className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-secondary hover:underline">
                                <PhotoIcon className="h-5 w-5" />
                                Change Image
                            </label>
                            {imageFile && (
                                <button type="button" onClick={handleRemovePhoto} className="flex items-center gap-1 text-sm font-semibold text-red-600 hover:underline"> 
                                    Undo
                                </button>
                            )}
                        </div>
                        <input ref={fileInputRef} id="edit-image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </div>
                    <div>
                        <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">Product Name <span className="text-red-500">*</span></label>
                        <input id="productName" type="text" value={productName} onChange={(e) => setProductName(e.target.value)} className={`block w-full rounded-md border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:border-secondary focus:ring-secondary ${errors.productName ? 'border-red-500' : 'border-gray-300'}`} required />
                        {errors.productName && <p className="text-red-500 text-xs mt-1">{errors.productName}</p>}
                    </div>
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category <span className="text-red-500">*</span></label>
                        <select id="category" value={selectedCategoryId} onChange={(e) => setSelectedCategoryId(e.target.value)} className={`block w-full rounded-md border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:border-secondary focus:ring-secondary ${errors.category ? 'border-red-500' : 'border-gray-300'}`} required>
                            <option value="" disabled>Select a category</option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat._id}>
                                    {cat.name}
                                </option>
                            ))}
                            <option value="OTHER">-- Add New Category --</option>
                        </select>
                        {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                    </div>
                    {selectedCategoryId === 'OTHER' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">New Category Name *</label>
                            <input 
                                type="text" 
                                value={newCategoryName} 
                                onChange={(e) => setNewCategoryName(e.target.value)} 
                                className={`w-full p-2 border rounded-md ${errors.newCategory ? 'border-red-500' : 'border-gray-300'}`} 
                                placeholder="Enter new category name"
                            />
                            {errors.newCategory && <p className="text-red-500 text-xs mt-1">{errors.newCategory}</p>}
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price (RS) <span className="text-red-500">*</span></label>
                            <input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} className={`block w-full rounded-md border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:border-secondary focus:ring-secondary ${errors.price ? 'border-red-500' : 'border-gray-300'}`} required />
                            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                        </div>
                        <div>
                            <label htmlFor="qty" className="block text-sm font-medium text-gray-700 mb-1">Stock (Qty) <span className="text-red-500">*</span></label>
                            <input id="qty" type="number" value={qty} onChange={(e) => setQty(e.target.value)} className={`block w-full rounded-md border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:border-secondary focus:ring-secondary ${errors.qty ? 'border-red-500' : 'border-gray-300'}`} required />
                            {errors.qty && <p className="text-red-500 text-xs mt-1">{errors.qty}</p>}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Serial No. / SKU (Optional)</label>
                        <input type="text" value={serialNo} onChange={(e) => setSerialNo(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" />
                    </div>
                    {errors.submit && <p className="text-red-500 text-sm text-center">{errors.submit}</p>}
                </form>

                <div className="flex-shrink-0 flex justify-end gap-4 mt-4 p-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                    <Button 
                        type="button" 
                        onClick={onClose} 
                        variant="outline" 
                        className="rounded-lg px-6 py-2.5"
                    >
                        Cancel
                    </Button>
                    <Button 
                        type="submit" 
                        form="edit-product-form" 
                        variant="secondary" 
                        className="rounded-lg px-6 py-2.5 hover:bg-primary text-white shadow-md transition-colors"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default EditProductModal;