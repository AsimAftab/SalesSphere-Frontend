import React, { useState, useRef, useEffect } from 'react';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/solid';
import Button from '../../components/UI/Button/Button'; 
import { type NewProductFormData, type Category, type Product } from '../../api/productService';
// import toast from 'react-hot-toast'; // No longer needed here

interface AddProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddProduct: (productData: NewProductFormData) => Promise<Product>;
    categories: Category[]; 
    // onCreateCategory prop REMOVED
}

const AddProductModal: React.FC<AddProductModalProps> = ({ 
    isOpen, 
    onClose, 
    onAddProduct,
    categories,
}) => {
    const [productName, setProductName] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState(''); 
    const [newCategoryName, setNewCategoryName] = useState('');
    const [price, setPrice] = useState('');
    const [qty, setQty] = useState('');
    const [serialNo, setSerialNo] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setProductName('');
            setSelectedCategoryId('');
            setNewCategoryName('');
            setPrice('');
            setQty('');
            setSerialNo('');
            setImagePreview(null);
            setImageFile(null);
            setErrors({});
            setIsSubmitting(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImageFile(file); 
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!productName.trim()) newErrors.productName = 'Product name is required.';
        
        if (!selectedCategoryId) {
            newErrors.category = 'Please select a category.';
        } else if (selectedCategoryId === 'OTHER' && !newCategoryName.trim()) {
            newErrors.newCategory = 'New category name is required.';
        }
        
        if (!price || isNaN(Number(price)) || Number(price) <= 0) newErrors.price = 'Please enter a valid price.';
        if (!qty || isNaN(Number(qty)) || !Number.isInteger(Number(qty)) || Number(qty) < 0) newErrors.qty = 'Please enter a valid quantity.';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate() || isSubmitting) return;

        setIsSubmitting(true);
        setErrors({}); 
        
        try {
            let categoryNameToSend: string;
            if (selectedCategoryId === 'OTHER') {
                categoryNameToSend = newCategoryName.trim();
            } else {
                const selectedCategory = categories.find(c => c._id === selectedCategoryId);
                categoryNameToSend = selectedCategory ? selectedCategory.name : '';
            }

            if (!categoryNameToSend) {
                setErrors({ category: 'Invalid category selected.' });
                setIsSubmitting(false);
                return;
            }

            const productData: NewProductFormData = {
                productName: productName.trim(),
                category: categoryNameToSend,
                price: Number(price),
                qty: Number(qty),
                serialNo: serialNo.trim() || undefined,
                image: imageFile || undefined,
            };

            await onAddProduct(productData);
            onClose();
            
        } catch (error: any) {
            console.error("Submission failed in modal", error);
            setErrors({ submit: error.message || 'Failed to add product.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800">Add New Product</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                    <div className="flex flex-col items-center justify-center">
                        <div 
                            className={`w-32 h-32 mb-2 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-secondary transition-colors`}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {imagePreview ? (
                                <img src={imagePreview} alt="Product Preview" className="w-full h-full object-cover rounded-md" />
                            ) : (
                                <div className="text-center">
                                    <PhotoIcon className="h-10 w-10 mx-auto text-gray-400" />
                                    <span className="text-sm text-gray-500">Upload Image</span>
                                </div>
                            )}
                        </div>
                        <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                        <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} className={`w-full p-2 border rounded-md ${errors.productName ? 'border-red-500' : 'border-gray-300'}`} />
                        {errors.productName && <p className="text-red-500 text-xs mt-1">{errors.productName}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                        <select 
                            value={selectedCategoryId} 
                            onChange={(e) => setSelectedCategoryId(e.target.value)} 
                            className={`w-full p-2 border rounded-md ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
                        >
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price (RS) *</label>
                            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className={`w-full p-2 border rounded-md ${errors.price ? 'border-red-500' : 'border-gray-300'}`} />
                            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Stock (Qty) *</label>
                            <input type="number" value={qty} onChange={(e) => setQty(e.target.value)} className={`w-full p-2 border rounded-md ${errors.qty ? 'border-red-500' : 'border-gray-300'}`} />
                            {errors.qty && <p className="text-red-500 text-xs mt-1">{errors.qty}</p>}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Serial No. / SKU (Optional)</label>
                        <input type="text" value={serialNo} onChange={(e) => setSerialNo(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" />
                    </div>
                    {errors.submit && <p className="text-red-500 text-sm text-center">{errors.submit}</p>}
                    <div className="flex justify-end gap-x-4 pt-4">
                        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                        <Button type="submit" variant="secondary" disabled={isSubmitting}>
                            {isSubmitting ? 'Adding...' : 'Add Product'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProductModal;