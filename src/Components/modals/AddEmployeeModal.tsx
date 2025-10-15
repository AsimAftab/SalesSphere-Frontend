import React, { useState } from 'react';
import { X, UploadCloud, Calendar, File as FileIcon, Trash2 } from 'lucide-react';
import Button from '../../components/UI/Button/Button';

interface AddEmployeeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({ isOpen, onClose }) => {
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [documents, setDocuments] = useState<File[]>([]);

    if (!isOpen) {
        return null;
    }

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            setDocuments(prevDocs => [...prevDocs, ...Array.from(files)]);
        }
    };
    
    const handleRemoveDocument = (indexToRemove: number) => {
        setDocuments(prevDocs => prevDocs.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            
            <div className="relative flex flex-col w-full max-w-2xl max-h-[95vh] rounded-lg bg-white shadow-xl">
                
                {/* --- UPDATED HEADER (More Compact) --- */}
                <div className="flex-shrink-0 p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-800">Add New Employee</h2>
                        <button 
                            onClick={onClose} 
                            className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                            aria-label="Close modal"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* --- FORM (Scrollable Area) --- */}
                <form id="add-employee-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 sm:p-8">
                    <div className="space-y-5">
                        {/* --- Upload Photo Section --- */}
                        <div className="flex items-center gap-4">
                            <img 
                                src={photoPreview || "https://i.pravatar.cc/150?u=new"}
                                alt="Employee" 
                                className="h-16 w-16 rounded-full object-cover" 
                            />
                            <label htmlFor="photo-upload" className="text-sm font-medium text-gray-600 cursor-pointer">
                                Upload Photo
                            </label>
                            <input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                        </div>

                        {/* --- UPDATED FORM FIELDS GRID --- */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                            {/* Row 1: Full Name */}
                            <div className="sm:col-span-2">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-600 mb-1">Full Name <span className="text-red-500">*</span></label>
                                <input id="name" type="text" placeholder="Naomi King" className="block w-full appearance-none rounded-md border border-gray-300 bg-gray-100 px-4 py-3 text-gray-900 placeholder-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" required />
                            </div>

                            {/* Row 2: Age & Gender */}
                            <div>
                                <label htmlFor="age" className="block text-sm font-medium text-gray-600 mb-1">Age <span className="text-red-500">*</span></label>
                                <input id="age" type="number" placeholder="e.g., 27" className="block w-full appearance-none rounded-md border border-gray-300 bg-gray-100 px-4 py-3 text-gray-900 placeholder-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" required />
                            </div>
                            <div>
                                <label htmlFor="gender" className="block text-sm font-medium text-gray-600 mb-1">
                                    Gender <span className="text-red-500">*</span>
                                </label>
                                <div className="relative mt-1 z-20">
                                    <select 
                                    id="gender" 
                                    className="block w-full appearance-none rounded-md border border-gray-300 bg-gray-100 px-4 py-3 text-gray-900 placeholder-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" 
                                    required
                                    defaultValue=""
                                    >
                                    <option value="" disabled>Select a gender</option>
                                    <option>Male</option>
                                    <option>Female</option>
                                    <option>Other</option>
                                    </select>
                                </div>
                            </div>

                            {/* Row 3: Phone & Email */}
                             <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-600 mb-1">Phone number <span className="text-red-500">*</span></label>
                                <input id="phone" type="tel" placeholder="9800000000" className="block w-full appearance-none rounded-md border border-gray-300 bg-gray-100 px-4 py-3 text-gray-900 placeholder-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" required />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">Email Address <span className="text-red-500">*</span></label>
                                <input id="email" type="email" placeholder="example@gmail.com" className="block w-full appearance-none rounded-md border border-gray-300 bg-gray-100 px-4 py-3 text-gray-900 placeholder-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" required />
                            </div>

                            {/* Row 4: Citizenship & PAN */}
                             <div>
                                <label htmlFor="citizenship" className="block text-sm font-medium text-gray-600 mb-1">Citizenship Number <span className="text-red-500">*</span></label>
                                <input id="citizenship" type="text" placeholder="xxxxxxxxxxx" className="block w-full appearance-none rounded-md border border-gray-300 bg-gray-100 px-4 py-3 text-gray-900 placeholder-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" required />
                            </div>
                             <div>
                                <label htmlFor="pan" className="block text-sm font-medium text-gray-600 mb-1">PAN Number <span className="text-red-500">*</span></label>
                                <input id="pan" type="text" placeholder="xxxxxxxxxxx" className="block w-full appearance-none rounded-md border border-gray-300 bg-gray-100 px-4 py-3 text-gray-900 placeholder-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" required />
                            </div>

                            {/* Row 5: Address */}
                            <div className="sm:col-span-2">
                                <label htmlFor="address" className="block text-sm font-medium text-gray-600 mb-1">Address <span className="text-red-500">*</span></label>
                                <input id="address" type="text" placeholder="Shanti Chowk, Biratnagar, Nepal" className="block w-full appearance-none rounded-md border border-gray-300 bg-gray-100 px-4 py-3 text-gray-900 placeholder-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" required />
                            </div>
                        </div>
                        
                        {/* --- Upload Documents & Date --- */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-gray-600 mb-1">Upload Documents <span className="text-red-500">*</span></label>
                                <div className="flex items-start gap-4">
                                    <label htmlFor="document-upload" className="flex-shrink-0 flex items-center justify-center w-32 px-4 py-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                        <div className="text-center">
                                            <UploadCloud className="mx-auto h-8 w-8 text-gray-400" />
                                            <p className="mt-1 text-sm text-gray-500">Add Files</p>
                                        </div>
                                        <input id="document-upload" type="file" className="hidden" onChange={handleDocumentChange} multiple />
                                    </label>
                                    {documents.length > 0 && (
                                        <div className="flex flex-wrap gap-2 pt-2">
                                            {documents.map((file, index) => (
                                                <div key={index} className="flex items-center gap-2 bg-gray-100 text-gray-700 text-sm font-medium px-3 py-1.5 rounded-full">
                                                    <FileIcon size={16} className="text-gray-500" />
                                                    <span className="truncate max-w-[120px]">{file.name}</span>
                                                    <button type="button" onClick={() => handleRemoveDocument(index)} className="text-gray-400 hover:text-gray-600">
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="dateApplied" className="block text-sm font-medium text-gray-600 mb-1">
                                    Date Applied <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    {/* This icon's position is correct */}
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" />
                                    
                                    {/* The fix is to add padding-left (pl-10) to the input */}
                                    <input 
                                    id="dateApplied" 
                                    type="text" 
                                    defaultValue="October 15, 2025" 
                                    className="w-full rounded-lg border-gray-300 bg-white py-2 pl-10 pr-3 shadow-sm focus:border-blue-500 focus:ring-blue-500" 
                                    required 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

                {/* --- FOOTER (Fixed at the bottom) --- */}
                <div className="flex-shrink-0 flex justify-end gap-4 mt-6 p-3 border-t border-gray-200">
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
                        className="rounded-lg px-6 py-2.5"
                    >
                        Add
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AddEmployeeModal;