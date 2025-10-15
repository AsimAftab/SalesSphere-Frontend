import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Button from '../UI/Button/Button';

interface AddProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    // You can add a prop to handle adding the new product, e.g., onAddProduct: (productData) => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose }) => {
    // State hooks for all the form fields
    const [productName, setProductName] = useState('');
    const [category, setCategory] = useState('Hardware Product');
    const [price, setPrice] = useState<number | string>('');
    const [piece, setPiece] = useState<number | string>('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Effect to clean up the image object URL
    useEffect(() => {
        return () => {
            if (imagePreview) {
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
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newProductData = {
            name: productName,
            category,
            price,
            piece,
            imageUrl: imagePreview,
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
                        <h2 className="text-xl font-bold text-gray-800">Edit Product</h2>
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
                    {/* --- Image Upload Section --- */}
                    <div className="flex flex-col items-center gap-4">
                        <img 
                            src={imagePreview || "https://placehold.co/100x100/e0e0e0/ffffff?text=Image"}
                            alt="Product" 
                            className="h-24 w-24 rounded-lg object-cover ring-2 ring-offset-2 ring-secondary" 
                        />
                        <label htmlFor="image-upload" className="cursor-pointer text-sm font-semibold text-secondary hover:underline">
                            Uploaded Image
                        </label>
                        <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} required />
                    </div>

                    {/* --- Form Fields --- */}
                    <div>
                        <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">Product Name </label>
                        <input id="productName" type="text" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="e.g., Apple Watch" className="block w-full appearance-none rounded-md border border-gray-300 bg-gray-100 px-4 py-3 text-gray-900 placeholder-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"/>
                    </div>

                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category </label>
                        <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="block w-full appearance-none rounded-md border border-gray-300 bg-gray-100 px-4 py-3 text-gray-900 placeholder-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" >
                            <option>Digital Product</option>
                            <option>Fashion</option>
                            <option>Mobile</option>
                            <option>Electronic</option>
                            <option>General</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price (RS)</label>
                            <input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g., 690" className="block w-full appearance-none rounded-md border border-gray-300 bg-gray-100 px-4 py-3 text-gray-900 placeholder-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="piece" className="block text-sm font-medium text-gray-700 mb-1">Piece </label>
                            <input id="piece" type="number" value={piece} onChange={(e) => setPiece(e.target.value)} placeholder="e.g., 63"className="block w-full appearance-none rounded-md border border-gray-300 bg-gray-100 px-4 py-3 text-gray-900 placeholder-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"/>
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
                        form="add-employee-form" 
                        variant="secondary" 
                        className="rounded-lg px-6 py-2.5 hover:bg-indigo-700 text-white shadow-md transition-colors"
                    >
                        Save Changes
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AddProductModal;
