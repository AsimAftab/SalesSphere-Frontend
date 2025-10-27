import React, { useState, useRef, useEffect } from 'react';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/solid';
import Button from '../../components/UI/Button/Button'; 
import { type NewProductData } from '../../api/services/sales/productService';

interface AddProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    // FIX: This prop now expects the exact data type your service needs
    onAddProduct: (productData: NewProductData) => Promise<void>;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onAddProduct }) => {
    const [productName, setProductName] = useState('');
    const [category, setCategory] =useState('Digital Product');
    const [price, setPrice] = useState('');
    const [piece, setPiece] = useState('');
    const [description, setDescription] = useState(''); // Added for completeness
    const [sku, setSku] = useState(''); // Added for completeness
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setProductName('');
            setCategory('Digital Product');
            setPrice('');
            setPiece('');
            setDescription('');
            setSku('');
            setImagePreview(null);
            setErrors({});
            setIsSubmitting(false); // Reset submitting state
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
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
        if (!price || isNaN(Number(price)) || Number(price) <= 0) newErrors.price = 'Please enter a valid price.';
        if (!piece || isNaN(Number(piece)) || !Number.isInteger(Number(piece)) || Number(piece) < 0) newErrors.piece = 'Please enter a valid quantity.';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate() || isSubmitting) return;

        setIsSubmitting(true);
        
        // FIX: Create an object that matches the NewProductData type
        const newProduct: NewProductData = {
            name: productName,
            category: category,
            price: Number(price),
            piece: Number(piece),
            // Set a default if imagePreview is null to satisfy `imageUrl: string`
            imageUrl: imagePreview || 'https://placehold.co/40x40/cccccc/ffffff?text=N/A',
            description: description,
            sku: sku
        };

        try {
            await onAddProduct(newProduct);
            onClose(); // Close modal only on success
        } catch (error) {
            console.error("Submission failed in modal", error);
            // Optionally, set an error to display in the modal
            setErrors({ submit: 'Failed to add product. Please try again.' });
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex flex-col items-center justify-center">
            <div 
              className="w-32 h-32 mb-2 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-secondary transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Product Preview" className="w-full h-full object-cover rounded-md" />
              ) : (
                <div className="text-center">
                  <PhotoIcon className="h-10 w-10 mx-auto text-gray-400" />
                  <span className="text-sm text-gray-500">Upload</span>
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
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md">
                <option>Digital Product</option>
                <option>Fashion</option>
                <option>Mobile</option>
                <option>Electronic</option>
                <option>General</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (RS) *</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className={`w-full p-2 border rounded-md ${errors.price ? 'border-red-500' : 'border-gray-300'}`} />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Piece *</label>
              <input type="number" value={piece} onChange={(e) => setPiece(e.target.value)} className={`w-full p-2 border rounded-md ${errors.piece ? 'border-red-500' : 'border-gray-300'}`} />
              {errors.piece && <p className="text-red-500 text-xs mt-1">{errors.piece}</p>}
            </div>
          </div>
          
          <div className="flex justify-end gap-x-4 pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? 'Adding...' : 'Add Product'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;

