import React, { useState, useEffect, useRef } from 'react'; 
import { X, UploadCloud, Calendar, File as FileIcon } from 'lucide-react';
import Button from '../../components/UI/Button/Button';


interface AddEmployeeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({ isOpen, onClose }) => {
    // Ref for the date input to programmatically trigger the picker
    const dateInputRef = useRef<HTMLInputElement>(null); 

    // State hooks for all required form fields
    const [name, setName] = useState('');
    const [position, setPosition] = useState('Admin'); 
    const [age, setAge] = useState<number | string>('');
    const [gender, setGender] = useState('Male'); 
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [citizenship, setCitizenship] = useState('');
    const [pan, setPan] = useState('');
    const [address, setAddress] = useState('');
    const [dateApplied, setDateApplied] = useState(''); 
    
    // State for file uploads
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [documents, setDocuments] = useState<File[]>([]);

    // Effect to clean up the photo object URL when the modal closes or photo changes
    useEffect(() => {
        return () => {
            if (photoPreview) {
                URL.revokeObjectURL(photoPreview);
            }
        };
    }, [photoPreview]);


    if (!isOpen) {
        return null;
    }

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (photoPreview) {
                URL.revokeObjectURL(photoPreview);
            }
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

    // FUNCTION TO OPEN DOCUMENT PREVIEW
    const handlePreviewDocument = (file: File) => {
        try {
            const url = URL.createObjectURL(file);
            window.open(url, '_blank');
            // Note: browser handles URL revocation when the new tab is closed.
        } catch (error) {
            console.error("Could not preview file:", error);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const newEmployeeData = {
            name, position, age, gender, phone, email, 
            citizenship, pan, address, dateApplied, 
            documentCount: documents.length
        };
        console.log('New Employee Form Submitted:', newEmployeeData);
        
        // Reset form state after successful submission
        setName(''); setPosition('Admin'); setAge(''); setGender('Male');
        setPhone(''); setEmail(''); setCitizenship(''); setPan(''); 
        setAddress(''); setDateApplied(''); setPhotoPreview(null); setDocuments([]);
        
        onClose();
    };

    // New handler to open the date picker when the calendar icon is clicked
    const handleCalendarClick = () => {
        if (dateInputRef.current) {
            dateInputRef.current.showPicker(); // showPicker() is the method to programmatically open the picker for type="date"
        }
    };


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 font-inter">
            
            <div className="relative flex flex-col w-full max-w-2xl max-h-[95vh] rounded-lg bg-white shadow-2xl">
                
                {/* --- HEADER --- */}
                <div className="flex-shrink-0 p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-800">Add New Employee</h2>
                        <button 
                            onClick={onClose} 
                            className="p-1 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-600 transition-colors"
                            aria-label="Close modal"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* --- FORM (Scrollable Area) --- */}
                <form id="add-employee-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 sm:p-8">
                    <div className="space-y-5">
                        {/* --- Photo Upload Section --- */}
                        <div className="flex items-center gap-4 border-b pb-4 border-gray-100">
                            <img 
                                src={photoPreview || "https://i.pravatar.cc/150?u=new_employee_id"}
                                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://placehold.co/150x150/e0e0e0/ffffff?text=Add+Photo"; }}
                                alt="Employee Avatar" 
                                className="h-16 w-16 rounded-full object-cover ring-2 ring-indigo-300" 
                            />
                            <label htmlFor="photo-upload" className="text-sm font-semibold text-gray-700 cursor-pointer hover:underline">
                                Upload Photo
                            </label>
                            <input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                        </div>

                        {/* --- MAIN FORM FIELDS GRID (Two columns on sm+) --- */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                            
                            {/* Row 1: Full Name & Position */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                                <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Naomi King" className="block w-full appearance-none rounded-md border border-gray-300 bg-gray-100 px-4 py-3 text-gray-900 placeholder-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" required />
                            </div>
                            <div>
                                <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">Position <span className="text-red-500">*</span></label>
                                <select 
                                    id="position" 
                                    value={position} 
                                    onChange={(e) => setPosition(e.target.value)}
                                    className="block w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-3 text-gray-900 placeholder-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" 
                                    required
                                >
                                    <option>Admin</option>
                                    <option>Manager</option>
                                    <option>Sales Rep</option>
                                </select>
                            </div>

                            {/* Row 2: Age & Gender */}
                            <div>
                                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">Age <span className="text-red-500">*</span></label>
                                <input id="age" type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="e.g., 27" className="block w-full appearance-none rounded-md border border-gray-300 bg-gray-100 px-4 py-3 text-gray-900 placeholder-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" required />
                            </div>
                            <div>
                                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Gender <span className="text-red-500">*</span></label>
                                <select 
                                    id="gender" 
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                    className="block w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-3 text-gray-900 placeholder-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    required
                                >
                                    <option>Male</option>
                                    <option>Female</option>
                                    <option>Other</option>
                                </select>
                            </div>

                            {/* Row 3: Phone & Email */}
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone number <span className="text-red-500">*</span></label>
                                <input
                                    id="phone"
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => {
                                        const input = e.target.value;
                                        if (/^\d{0,10}$/.test(input)) {
                                        setPhone(input);
                                        }
                                    }}
                                    placeholder="9800000000"
                                    maxLength={10}
                                    pattern="\d{10}"
                                    className="block w-full appearance-none rounded-md border border-gray-300 bg-gray-100 px-4 py-3 text-gray-900 placeholder-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    required
                                    />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address <span className="text-red-500">*</span></label>
                                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@company.com" className="block w-full appearance-none rounded-md border border-gray-300 bg-gray-100 px-4 py-3 text-gray-900 placeholder-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" required />
                            </div>

                            {/* Row 4: Citizenship & PAN */}
                            <div>
                                <label htmlFor="citizenship" className="block text-sm font-medium text-gray-700 mb-1">
                                    Citizenship Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="citizenship"
                                    type="text"
                                    value={citizenship}
                                    onChange={(e) => {
                                    const input = e.target.value;
                                    // Allow only digits and hyphens, up to 14 characters
                                    if (/^[\d-]{0,14}$/.test(input)) {
                                        setCitizenship(input);
                                    }
                                    }}
                                    placeholder="xxxxxxxxxxx"
                                    maxLength={14}
                                    pattern="[\d-]{1,14}"
                                    className="block w-full appearance-none rounded-md border border-gray-300 bg-gray-100 px-4 py-3 text-gray-900 placeholder-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="pan" className="block text-sm font-medium text-gray-700 mb-1">
                                    PAN Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="pan"
                                    type="text"
                                    value={pan}
                                    onChange={(e) => {
                                    const input = e.target.value;
                                    // Allow only letters and numbers, up to 14 characters
                                    if (/^[a-zA-Z0-9]{0,14}$/.test(input)) {
                                        setPan(input);
                                    }
                                    }}
                                    placeholder="xxxxxxxxxxx"
                                    maxLength={20}
                                    pattern="[a-zA-Z0-9]{1,14}"
                                    className="block w-full appearance-none rounded-md border border-gray-300 bg-gray-100 px-4 py-3 text-gray-900 placeholder-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    required
                                />
                            </div>

                            {/* Row 5: Address (Full Row) */}
                            <div className="sm:col-span-2">
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address <span className="text-red-500">*</span></label>
                                <input id="address" type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Shanti Chowk, Biratnagar, Nepal" className="block w-full appearance-none rounded-md border border-gray-300 bg-gray-100 px-4 py-3 text-gray-900 placeholder-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" required />
                            </div>
                        </div>
                        
                        {/* --- Upload Documents & Date (Full Rows) --- */}
                        <div className="grid grid-cols-1 gap-x-6 gap-y-5 pt-3 border-t border-gray-100">
                            
                            {/* Row 6: Upload Documents (Full Row) */}
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Documents <span className="text-red-500">*</span></label>
                                <div className="flex items-start gap-4">
                                    <label htmlFor="document-upload" className="flex-shrink-0 flex items-center justify-center w-32 h-20 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-indigo-50/20 transition-colors">
                                        <div className="text-center p-2">
                                            <UploadCloud className="mx-auto h-5 w-5 text-indigo-500" />
                                            <p className="mt-1 text-xs font-medium text-indigo-600">Add Files</p>
                                        </div>
                                        <input id="document-upload" type="file" className="hidden" onChange={handleDocumentChange} multiple />
                                    </label>
                                    {documents.length > 0 && (
                                        <div className="flex flex-wrap gap-2 pt-1">
                                            {documents.map((file, index) => (
                                                <div key={index} className="flex items-center gap-2 bg-indigo-100 text-indigo-700 text-xs font-medium px-3 py-1.5 rounded-full border border-indigo-200">
                                                    <FileIcon size={14} className="text-indigo-500" />
                                                    <span className="truncate max-w-[100px]">{file.name}</span>
                                                    <button 
                                                        type="button" 
                                                        onClick={() => handlePreviewDocument(file)} 
                                                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 ml-1 underline"
                                                    >
                                                        Preview
                                                    </button>
                                                    <button type="button" onClick={() => handleRemoveDocument(index)} className="text-indigo-400 hover:text-indigo-600">
                                                        <X size={12} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Row 7: Date Applied (Full Row) */}
                            <div className="sm:col-span-2">
                                <label htmlFor="dateApplied" className="block text-sm font-medium text-gray-700 mb-1">
                                    Date Applied <span className="text-red-500">*</span>
                                </label>
                                <div 
                                    className="relative cursor-pointer" 
                                    onClick={handleCalendarClick} // Makes entire container clickable
                                    >
                                    {/* Left-side Calendar Icon */}
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" /> 

                                    {/* Date Input */}
                                    <input 
                                        ref={dateInputRef}
                                        id="dateApplied" 
                                        type="date"
                                        value={dateApplied}
                                        onChange={(e) => setDateApplied(e.target.value)}
                                        className="block w-full appearance-none rounded-md border border-gray-300 bg-gray-100 px-4 py-3 pl-11 pr-4 text-gray-900 placeholder-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm cursor-pointer"
                                        required 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

                {/* --- FOOTER (Fixed at the bottom) --- */}
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
                        className="rounded-lg px-6 py-2.5 hover:bg-primary text-white shadow-md transition-colors"
                    >
                        Add Employee
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AddEmployeeModal;
