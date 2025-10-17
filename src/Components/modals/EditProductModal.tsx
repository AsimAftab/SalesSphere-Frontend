import React, { useState, useEffect, useRef} from 'react';
import { X, UploadCloud } from 'lucide-react';
import Button from '../UI/Button/Button';

interface EditProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    // You can add a prop to handle adding the new product, e.g., onAddProduct: (productData) => void;
}

const EditProductModal: React.FC<EditProductModalProps> = ({ isOpen, onClose }) => {
    // State hooks for all the form fields
    const [productName, setProductName] = useState('');
    const [category, setCategory] = useState('Hardware Product');
    const [price, setPrice] = useState<number | string>('');
    const [piece, setPiece] = useState<number | string>('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);('https://placehold.co/100x100/3b82f6/ffffff?text=Watch');
    const [imageError, setImageError] = useState<string | null>(null);
    const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Cleanup for blob URLs to prevent memory leaks
        return () => {
        if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
        }
        };
    }, [imagePreview]);

    useEffect(() => {
        if (!isOpen) {
        setProductName('Apple Watch');
        setCategory('Hardware Product');
        setPrice(690);
        setPiece(63);
        setImagePreview('https://placehold.co/100x100/3b82f6/ffffff?text=Watch');
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
        if (!imagePreview) {
            setImageError('Product image is required.');
            return; // Stop form submission
        }
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
                <form id="edit-product-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
                    {/* --- Image Upload Section --- */}
                    <div className="flex flex-col items-center gap-4">
                        <img 
                            src={imagePreview || "https://placehold.co/100x100/e0e0e0/ffffff?text=Image"}
                            alt="Product" 
                            className="h-24 w-24 rounded-lg object-cover ring-2 ring-offset-2 ring-secondary" 
                            onClick={() => imagePreview && setIsImagePreviewOpen(true)}
                        />
                        <div className="flex items-center gap-4 mt-2">
                            <label htmlFor="image-upload" className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-secondary hover:underline">
                                <UploadCloud size={16} />
                                Uploaded Image
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
                        form="edit-employee-form" 
                        variant="secondary" 
                        className="rounded-lg px-6 py-2.5 hover:bg-primary text-white shadow-md transition-colors"
                    >
                        Save Changes
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

export default EditProductModal;
