import React, { useState, useEffect, useRef } from 'react';
import { X, UploadCloud } from 'lucide-react';
import Button from '../UI/Button/Button';

interface AddProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    // You can add a prop here to handle the form submission, e.g., onAddProduct: (newProductData) => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose }) => {
    // State hooks for all the form fields
    const [productName, setProductName] = useState('');
    const [category, setCategory] = useState('Digital Product');
    const [price, setPrice] = useState<number | string>('');
    const [piece, setPiece] = useState<number | string>('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageError, setImageError] = useState<string | null>(null);
    const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false); 
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Effect to clean up the image object URL when the component unmounts
    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    useEffect(() => {
        if (!isOpen) {
            setProductName('');
            setCategory('Digital Product');
            setPrice('');
            setPiece('');
            setImagePreview(null);
            if(fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    }, [isOpen]);

    if (!isOpen) {
        return null;
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Clean up the previous preview URL if it exists
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
            setImagePreview(URL.createObjectURL(file));
            setImageError(null);
        }
    };

    const handleRemovePhoto = () => {
    if (imagePreview) {
    URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!imagePreview) {
            setImageError('Product image is required.');
            return; // Stop form submission
        }
        const newProductData = {
            name: productName,
            category,
            price: Number(price),
            piece: Number(piece),
            imageUrl: imagePreview, // In a real app, you would upload the file and get back a URL
        };
        console.log('New Product Submitted:', newProductData);
        // Here you would typically call an API to save the new product
        onClose(); // Close the modal after submission
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 font-arimo">
            <div className="relative flex flex-col w-full max-w-lg rounded-lg bg-white shadow-2xl">
                
                {/* --- HEADER --- */}
                <div className="flex-shrink-0 p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-800">Add New Product</h2>
                        <button 
                            onClick={onClose} 
                            className="p-1 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-600 transition-colors"
                            aria-label="Close modal"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* --- FORM --- */}
                <form id="add-product-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
                    {/* Image Upload */}
                    <div className="flex flex-col items-center gap-4">
                        <img 
                            src={imagePreview || "https://placehold.co/100x100/e0e0e0/ffffff?text=Image"}
                            alt="Product Preview" 
                            className="h-24 w-24 rounded-lg object-cover ring-2 ring-offset-2 ring-secondary" 
                            onClick={() => imagePreview && setIsImagePreviewOpen(true)}
                        />
                        <div className="flex items-center gap-4 mt-2">
                            <label htmlFor="image-upload" className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-secondary hover:underline">
                                <UploadCloud size={16} />
                                Upload Product Image
                            </label>
                            {imagePreview && (
                                    <button type="button" onClick={handleRemovePhoto} className="flex items-center gap-1 text-sm font-semibold text-red-600 hover:underline"> 
                                        Remove
                                    </button>
                            )}
                        </div>
                        <input ref={fileInputRef} id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                        {imageError && <p className="text-red-500 text-xs">{imageError}</p>}
                    </div>

                    {/* Form Fields */}
                    <div>
                        <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">Product Name <span className="text-red-500">*</span></label>
                        <input id="productName" type="text" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="e.g., Apple Watch Series 4" className="block w-full rounded-md border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:border-secondary focus:ring-secondary" required />
                    </div>

                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category <span className="text-red-500">*</span></label>
                        <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="block w-full rounded-md border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:border-secondary focus:ring-secondary" required>
                            <option>Digital Product</option>
                            <option>Fashion</option>
                            <option>Mobile</option>
                            <option>Electronic</option>
                            <option>General</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price (RS) <span className="text-red-500">*</span></label>
                            <input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g., 690" className="block w-full rounded-md border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:border-secondary focus:ring-secondary" required />
                        </div>
                        <div>
                            <label htmlFor="piece" className="block text-sm font-medium text-gray-700 mb-1">Piece <span className="text-red-500">*</span></label>
                            <input id="piece" type="number" value={piece} onChange={(e) => setPiece(e.target.value)} placeholder="e.g., 63" className="block w-full rounded-md border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:border-secondary focus:ring-secondary" required />
                        </div>
                    </div>
                </form>

                {/* --- FOOTER --- */}
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
                        form="add-product-form" 
                        variant="secondary" 
                        className="rounded-lg px-6 py-2.5 hover:bg-primary text-white shadow-md transition-colors"
                    >
                        Add Product
                    </Button>
                </div>
            </div>
            {isImagePreviewOpen && imagePreview && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black bg-opacity-75" onClick={() => setIsImagePreviewOpen(false)}>
                    <div className="relative p-2 bg-white rounded-lg shadow-xl" onClick={(e) => e.stopPropagation()}>
                        <img src={imagePreview} alt="Product Preview" className="max-w-[90vw] max-h-[90vh] object-contain rounded-md" />
                        <button 
                            className="absolute top-0 right-0 -mt-3 -mr-3 text-white text-3xl font-bold bg-gray-800 rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-600 focus:outline-none" 
                            onClick={() => setIsImagePreviewOpen(false)}
                        >
                            &times;
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddProductModal;

