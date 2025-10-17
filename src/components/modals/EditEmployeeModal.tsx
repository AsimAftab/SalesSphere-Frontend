import React, { useState, useEffect, useRef } from 'react';
import { X, UploadCloud, Calendar, File as FileIcon} from 'lucide-react';
import Button from '../UI/Button/Button'; 
// Define a placeholder Button component (for self-contained file)

// A type for the employee data structure
export interface EmployeeData {
    id?: string;
    name: string;
    position: string;
    age: number | string;
    gender: string;
    phone: string;
    email: string;
    citizenship: string;
    pan: string;
    address: string;
    dateApplied: string;
    imageUrl?: string;
}

interface EditEmployeeModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData: Partial<EmployeeData> | null;
}

const EditEmployeeModal: React.FC<EditEmployeeModalProps> = ({ isOpen, onClose, initialData }) => {
    // Ref for the date input to programmatically trigger the picker
    const dateInputRef = useRef<HTMLInputElement>(null); 
    
    // State for all form fields
    const [name, setName] = useState('');
    const [position, setPosition] = useState('');
    const [age, setAge] = useState<number | string>('');
    const [gender, setGender] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [citizenship, setCitizenship] = useState('');
    const [pan, setPan] = useState('');
    const [address, setAddress] = useState('');
    const [dateApplied, setDateApplied] = useState('');
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [documents, setDocuments] = useState<File[]>([]);

    useEffect(() => {
        // Load initial data
        if (isOpen && initialData) {
            setName(initialData.name || '');
            setPosition(initialData.position || 'Admin'); // Defaulted to Admin if missing
            setAge(initialData.age || '');
            setGender(initialData.gender || 'Male'); // Defaulted to Male if missing
            setPhone(initialData.phone || '');
            setEmail(initialData.email || '');
            setCitizenship(initialData.citizenship || '');
            setPan(initialData.pan || '');
            setAddress(initialData.address || '');
            setDateApplied(initialData.dateApplied || '');
            setPhotoPreview(initialData.imageUrl || null);
            setDocuments([]);
        }
    }, [isOpen, initialData]);

    // Memory cleanup for image preview URL (Fix replicated from AddEmployeeModal.tsx)
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
        const formData = { name, position, age, gender, phone, email, citizenship, pan, address, dateApplied, documentCount: documents.length };
        console.log('Form saved:', formData);
        onClose();
    };
    
    // Handler to open the date picker when the calendar icon/container is clicked.
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
                        <h2 className="text-xl font-bold text-gray-800">Edit Employee Details</h2>
                        <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-600 transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <form id="edit-employee-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 sm:p-8">
                    <div className="space-y-5">
                        
                        {/* 1. Upload Photo/Photo Preview */}
                        <div className="flex items-center gap-4 border-b pb-4 border-gray-100">
                            <img 
                                src={photoPreview || "https://i.pravatar.cc/150?u=edit_employee_id"} 
                                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://placehold.co/150x150/e0e0e0/ffffff?text=Add+Photo"; }}
                                alt="Employee Avatar" 
                                className="h-16 w-16 rounded-full object-cover ring-2 ring-indigo-300" 
                            />
                            <label htmlFor="photo-upload-edit" className="text-sm font-semibold text-gray-700 cursor-pointer hover:underline">
                                Upload Photo
                            </label>
                            <input id="photo-upload-edit" type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                        </div>

                        {/* --- FORM FIELDS GRID (Two columns on sm+) --- */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                            
                            {/* Row 1: Full Name & Position */}
                            <div>
                                <label htmlFor="name-edit" className="block text-sm font-medium text-gray-700 mb-1">Full Name </label>
                                <input id="name-edit" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Naomi King" className="block w-full appearance-none rounded-md border border-gray-300 bg-gray-100 px-4 py-3 text-gray-900 placeholder-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" />
                            </div>
                            
                            <div>
                                <label htmlFor="position-edit" className="block text-sm font-medium text-gray-700 mb-1">Position </label>
                                <select id="position-edit" value={position} onChange={(e) => setPosition(e.target.value)} className="block w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-3 text-gray-900 placeholder-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                                    <option>Admin</option>
                                    <option>Manager</option>
                                    <option>Sales Rep</option>
                                </select>
                            </div>

                            {/* Row 2: Age & Gender */}
                            <div>
                                <label htmlFor="age-edit" className="block text-sm font-medium text-gray-700 mb-1">Age </label>
                                <input id="age-edit" type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="e.g., 27" className="block w-full appearance-none rounded-md border border-gray-300 bg-gray-100 px-4 py-3 text-gray-900 placeholder-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" />
                            </div>
                            <div>
                                <label htmlFor="gender-edit" className="block text-sm font-medium text-gray-700 mb-1">Gender </label>
                                <select
                                    id="gender-edit"
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                    className="block w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-3 text-gray-900 placeholder-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                >
                                    <option>Male</option>
                                    <option>Female</option>
                                    <option>Other</option>
                                </select>
                            </div>

                            {/* Row 3: Phone & Email */}
                            <div>
                                <label htmlFor="phone-edit" className="block text-sm font-medium text-gray-700 mb-1">Phone Number </label>
                                <input 
                                id="phone-edit" 
                                type="tel" 
                                value={phone} 
                                onChange={(e) => {
                                        const input = e.target.value;
                                        if (/^\d{0,10}$/.test(input)) {
                                        setPhone(input);
                                   }
                                }}
                                placeholder="9800000000" 
                                className="block w-full appearance-none rounded-md border border-gray-300 bg-gray-100 px-4 py-3 text-gray-900 placeholder-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" />
                            </div>
                            <div>
                                <label htmlFor="email-edit" className="block text-sm font-medium text-gray-700 mb-1">Email Address </label>
                                <input id="email-edit" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@company.com" className="block w-full appearance-none rounded-md border border-gray-300 bg-gray-100 px-4 py-3 text-gray-900 placeholder-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" />
                            </div>
                            
                            {/* Row 4: Citizenship Number and PAN Number (Same Row) */}
                            <div>
                                <label htmlFor="citizenship-edit" className="block text-sm font-medium text-gray-700 mb-1">Citizenship Number </label>
                                <input 
                                id="citizenship-edit" 
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
                                className="block w-full appearance-none rounded-md border border-gray-300 bg-gray-100 px-4 py-3 text-gray-900 placeholder-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" />
                            </div>
                            <div>
                                <label htmlFor="pan-edit" className="block text-sm font-medium text-gray-700 mb-1">PAN Number </label>
                                <input 
                                id="pan-edit" 
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
                                className="block w-full appearance-none rounded-md border border-gray-300 bg-gray-100 px-4 py-3 text-gray-900 placeholder-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" />
                            </div>

                            {/* Row 5: Address (Full Row) */}
                            <div className="sm:col-span-2">
                                <label htmlFor="address-edit" className="block text-sm font-medium text-gray-700 mb-1">Address </label>
                                <input id="address-edit" type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Shanti Chowk, Biratnagar, Nepal" className="block w-full appearance-none rounded-md border border-gray-300 bg-gray-100 px-4 py-3 text-gray-900 placeholder-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" />
                            </div>

                            {/* 6. Uploaded Documents (Full Row) */}
                            <div className="sm:col-span-2 pt-3 border-t border-gray-100">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Uploaded Documents </label>
                                <div className="flex items-start gap-4">
                                    <label htmlFor="document-upload-edit" className="flex-shrink-0 flex items-center justify-center w-32 h-20 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-indigo-50/20 transition-colors">
                                        <div className="text-center p-2">
                                            <UploadCloud className="mx-auto h-5 w-5 text-indigo-500" />
                                            <p className="mt-1 text-xs font-medium text-indigo-600">Add Files</p>
                                        </div>
                                        <input id="document-upload-edit" type="file" className="hidden" onChange={handleDocumentChange} multiple />
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

                            {/* 7. Date Applied (Full Row) */}
                            <div className="sm:col-span-2">
                                <label htmlFor="dateApplied-edit" className="block text-sm font-medium text-gray-700 mb-1">Date Applied </label>
                                <div 
                                    className="relative cursor-pointer"
                                    onClick={handleCalendarClick} // Make container clickable to focus input
                                >
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                                    <input 
                                        ref={dateInputRef}
                                        id="dateApplied-edit" 
                                        type="date" // Use native date picker
                                        value={dateApplied} 
                                        onChange={(e) => setDateApplied(e.target.value)} 
                                        className="block w-full appearance-none rounded-md border border-gray-300 bg-gray-100 px-4 py-3 pl-11 pr-4 text-gray-900 placeholder-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm cursor-pointer"
                                    />
                                </div>
                            </div>

                        </div>
                    </div>
                </form>

                {/* --- FOOTER --- */}
                <div className="flex-shrink-0 flex justify-end gap-4 mt-6 p-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                    <Button type="button" onClick={onClose} variant="outline" className="rounded-lg px-6 py-2.5">Cancel</Button>
                    <Button type="submit" form="edit-employee-form" variant="secondary" className="rounded-lg px-6 py-2.5 hover:bg-primary text-white shadow-md transition-colors">Save Changes</Button>
                </div>
            </div>
        </div>
    );
};

export default EditEmployeeModal;


// import React, { useState, useEffect, useRef } from 'react';
// import { X, UploadCloud, Calendar, File as FileIcon, Trash2 } from 'lucide-react';
// // import Button from '../UI/Button/Button'; // Dependency import is resolved by defining the component below

// // Define a placeholder Button component (for self-contained file)
// interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
//     variant?: 'primary' | 'secondary' | 'outline';
//     children: React.ReactNode;
// }

// const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, className = '', ...props }) => {
//     let baseStyles = "font-semibold py-2.5 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
    
//     switch (variant) {
//         case 'secondary':
//             baseStyles += " bg-indigo-600 hover:bg-indigo-700 text-white shadow-md focus:ring-indigo-500";
//             break;
//         case 'outline':
//             baseStyles += " bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-indigo-500";
//             break;
//         case 'primary':
//         default:
//             baseStyles += " bg-blue-600 hover:bg-blue-700 text-white shadow-md focus:ring-blue-500";
//             break;
//     }

//     return (
//         <button className={`${baseStyles} ${className}`} {...props}>
//             {children}
//         </button>
//     );
// };

// // A type for the employee data structure
// export interface EmployeeData {
//     id?: string;
//     name: string;
//     position: string;
//     age: number | string;
//     gender: string;
//     phone: string;
//     email: string;
//     citizenship: string;
//     pan: string;
//     address: string;
//     dateApplied: string;
//     imageUrl?: string;
// }

// interface EditEmployeeModalProps {
//     isOpen: boolean;
//     onClose: () => void;
//     initialData: Partial<EmployeeData> | null;
// }

// const EditEmployeeModal: React.FC<EditEmployeeModalProps> = ({ isOpen, onClose, initialData }) => {
//     // Ref for the date input to programmatically trigger the picker
//     const dateInputRef = useRef<HTMLInputElement>(null); 
    
//     // State for all form fields
//     const [name, setName] = useState('');
//     const [position, setPosition] = useState('');
//     const [age, setAge] = useState<number | string>('');
//     const [gender, setGender] = useState('');
//     const [phone, setPhone] = useState('');
//     const [email, setEmail] = useState('');
//     const [citizenship, setCitizenship] = useState('');
//     const [pan, setPan] = useState('');
//     const [address, setAddress] = useState('');
//     const [dateApplied, setDateApplied] = useState('');
//     const [photoPreview, setPhotoPreview] = useState<string | null>(null);
//     const [documents, setDocuments] = useState<File[]>([]);

//     useEffect(() => {
//         // Load initial data and set defaults
//         if (isOpen && initialData) {
//             setName(initialData.name || '');
//             setPosition(initialData.position || 'Admin'); 
//             setAge(initialData.age || '');
//             setGender(initialData.gender || 'Male'); 
//             setPhone(initialData.phone || '');
//             setEmail(initialData.email || '');
//             setCitizenship(initialData.citizenship || '');
//             setPan(initialData.pan || '');
//             setAddress(initialData.address || '');
//             setDateApplied(initialData.dateApplied || '');
//             setPhotoPreview(initialData.imageUrl || null);
//             setDocuments([]);
//         }
//     }, [isOpen, initialData]);

//     // Memory cleanup for image preview URL (Crucial to prevent memory leaks)
//     useEffect(() => {
//         return () => {
//             if (photoPreview) {
//                 URL.revokeObjectURL(photoPreview);
//             }
//         };
//     }, [photoPreview]);


//     if (!isOpen) {
//         return null;
//     }

//     const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0];
//         if (file) {
//             if (photoPreview) {
//                 URL.revokeObjectURL(photoPreview);
//             }
//             setPhotoPreview(URL.createObjectURL(file));
//         }
//     };

//     const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const files = e.target.files;
//         if (files) {
//             setDocuments(prevDocs => [...prevDocs, ...Array.from(files)]);
//         }
//     };
    
//     const handleRemoveDocument = (indexToRemove: number) => {
//         setDocuments(prevDocs => prevDocs.filter((_, index) => index !== indexToRemove));
//     };
    
//     // FUNCTION TO OPEN DOCUMENT PREVIEW
//     const handlePreviewDocument = (file: File) => {
//         try {
//             const url = URL.createObjectURL(file);
//             window.open(url, '_blank');
//             // Note: browser handles URL revocation when the new tab is closed.
//         } catch (error) {
//             console.error("Could not preview file:", error);
//         }
//     };

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         const formData = { name, position, age, gender, phone, email, citizenship, pan, address, dateApplied, documentCount: documents.length };
//         console.log('Form saved:', formData);
//         onClose();
//     };
    
//     // Handler to open the date picker (focuses the input, allowing type="date" to take over)
//     const handleCalendarClick = () => { 
//         if (dateInputRef.current) {
//             dateInputRef.current.focus(); 
//         }
//     };

//     return (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 font-inter">
//             <div className="relative flex flex-col w-full max-w-2xl max-h-[95vh] rounded-lg bg-white shadow-2xl">
                
//                 {/* --- HEADER --- */}
//                 <div className="flex-shrink-0 p-4 border-b border-gray-200">
//                     <div className="flex items-center justify-between">
//                         <h2 className="text-xl font-bold text-gray-800">Edit Employee Details</h2>
//                         <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-600 transition-colors">
//                             <X size={20} />
//                         </button>
//                     </div>
//                 </div>

//                 <form id="edit-employee-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 sm:p-8">
//                     <div className="space-y-5">
                        
//                         {/* 1. Upload Photo/Photo Preview (Profile Image Preview is handled here) */}
//                         <div className="flex items-center gap-4 border-b pb-4 border-gray-100">
//                             <img 
//                                 src={photoPreview || "https://i.pravatar.cc/150?u=edit_employee_id"} 
//                                 onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://placehold.co/150x150/e0e0e0/ffffff?text=Add+Photo"; }}
//                                 alt="Employee Avatar" 
//                                 className="h-16 w-16 rounded-full object-cover ring-2 ring-indigo-300" 
//                             />
//                             <label htmlFor="photo-upload-edit" className="text-sm font-semibold text-indigo-600 cursor-pointer hover:underline">
//                                 Upload Photo
//                             </label>
//                             <input id="photo-upload-edit" type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
//                         </div>

//                         {/* --- FORM FIELDS GRID (Two columns on sm+) --- */}
//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                            
//                             {/* Row 1: Full Name & Position */}
//                             <div>
//                                 <label htmlFor="name-edit" className="block text-sm font-medium text-gray-700 mb-1">Full Name </label>
//                                 <input id="name-edit" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Naomi King" className="w-full rounded-md border-gray-300 bg-gray-50 px-4 py-2.5 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
//                             </div>
                            
//                             <div>
//                                 <label htmlFor="position-edit" className="block text-sm font-medium text-gray-700 mb-1">Position </label>
//                                 <select id="position-edit" value={position} onChange={(e) => setPosition(e.target.value)} className="w-full rounded-md border-gray-300 bg-gray-50 px-4 py-2.5 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
//                                     <option>Admin</option>
//                                     <option>Manager</option>
//                                     <option>Sales Rep</option>
//                                     <option>Marketing Analyst</option>
//                                 </select>
//                             </div>

//                             {/* Row 2: Age & Gender */}
//                             <div>
//                                 <label htmlFor="age-edit" className="block text-sm font-medium text-gray-700 mb-1">Age </label>
//                                 <input id="age-edit" type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="e.g., 27" className="w-full rounded-md border-gray-300 bg-gray-50 px-4 py-2.5 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
//                             </div>
//                             <div>
//                                 <label htmlFor="gender-edit" className="block text-sm font-medium text-gray-700 mb-1">Gender </label>
//                                 <select
//                                     id="gender-edit"
//                                     value={gender}
//                                     onChange={(e) => setGender(e.target.value)}
//                                     className="w-full rounded-md border-gray-300 bg-gray-50 px-4 py-2.5 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                                 >
//                                     <option>Male</option>
//                                     <option>Female</option>
//                                     <option>Other</option>
//                                 </select>
//                             </div>

//                             {/* Row 3: Phone & Email (with input filtering from AddModal) */}
//                             <div>
//                                 <label htmlFor="phone-edit" className="block text-sm font-medium text-gray-700 mb-1">Phone Number </label>
//                                 <input 
//                                 id="phone-edit" 
//                                 type="tel" 
//                                 value={phone} 
//                                 onChange={(e) => {
//                                     const input = e.target.value;
//                                     if (/^\d{0,10}$/.test(input)) {
//                                     setPhone(input);
//                                     }
//                                 }}
//                                 placeholder="9800000000" 
//                                 className="w-full rounded-md border-gray-300 bg-gray-50 px-4 py-2.5 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
//                             </div>
//                             <div>
//                                 <label htmlFor="email-edit" className="block text-sm font-medium text-gray-700 mb-1">Email Address </label>
//                                 <input id="email-edit" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@company.com" className="w-full rounded-md border-gray-300 bg-gray-50 px-4 py-2.5 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
//                             </div>
                            
//                             {/* Row 4: Citizenship Number and PAN Number (with input filtering from AddModal) */}
//                             <div>
//                                 <label htmlFor="citizenship-edit" className="block text-sm font-medium text-gray-700 mb-1">Citizenship Number </label>
//                                 <input 
//                                 id="citizenship-edit" 
//                                 type="text" 
//                                 value={citizenship} 
//                                 onChange={(e) => {
//                                     const input = e.target.value;
//                                     if (/^[\d-]{0,14}$/.test(input)) {
//                                         setCitizenship(input);
//                                     }
//                                 }}
//                                 placeholder="xxxxxxxxxxx" 
//                                 className="w-full rounded-md border-gray-300 bg-gray-50 px-4 py-2.5 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
//                             </div>
//                             <div>
//                                 <label htmlFor="pan-edit" className="block text-sm font-medium text-gray-700 mb-1">PAN Number </label>
//                                 <input 
//                                 id="pan-edit" 
//                                 type="text" 
//                                 value={pan} 
//                                 onChange={(e) => {
//                                     const input = e.target.value;
//                                     if (/^[a-zA-Z0-9]{0,14}$/.test(input)) {
//                                         setPan(input);
//                                     }
//                                 }}
//                                 placeholder="xxxxxxxxxxx" 
//                                 className="w-full rounded-md border-gray-300 bg-gray-50 px-4 py-2.5 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
//                             </div>

//                             {/* Row 5: Address (Full Row) */}
//                             <div className="sm:col-span-2">
//                                 <label htmlFor="address-edit" className="block text-sm font-medium text-gray-700 mb-1">Address </label>
//                                 <input id="address-edit" type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Shanti Chowk, Biratnagar, Nepal" className="w-full rounded-md border-gray-300 bg-gray-50 px-4 py-2.5 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
//                             </div>

//                             {/* 6. Uploaded Documents (Full Row) */}
//                             <div className="sm:col-span-2 pt-3 border-t border-gray-100">
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Uploaded Documents </label>
//                                 <div className="flex items-start gap-4">
//                                     <label htmlFor="document-upload-edit" className="flex-shrink-0 flex items-center justify-center w-32 h-20 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-indigo-50/20 transition-colors">
//                                         <div className="text-center p-2">
//                                             <UploadCloud className="mx-auto h-5 w-5 text-indigo-500" />
//                                             <p className="mt-1 text-xs font-medium text-indigo-600">Add Files</p>
//                                         </div>
//                                         <input id="document-upload-edit" type="file" className="hidden" onChange={handleDocumentChange} multiple />
//                                     </label>
                                    
//                                     {/* Document List with Preview Button */}
//                                     {documents.length > 0 && (
//                                         <div className="flex flex-wrap gap-2 pt-1">
//                                             {documents.map((file, index) => (
//                                                 <div key={index} className="flex items-center gap-2 bg-indigo-100 text-indigo-700 text-xs font-medium px-3 py-1.5 rounded-full border border-indigo-200">
//                                                     <FileIcon size={14} className="text-indigo-500" />
//                                                     <span className="truncate max-w-[80px]">{file.name}</span>
                                                    
//                                                     {/* PREVIEW BUTTON */}
//                                                     <button 
//                                                         type="button" 
//                                                         onClick={() => handlePreviewDocument(file)} 
//                                                         className="text-xs font-bold text-indigo-600 hover:text-indigo-800 ml-1 underline"
//                                                     >
//                                                         Preview
//                                                     </button>
                                                    
//                                                     <button type="button" onClick={() => handleRemoveDocument(index)} className="text-indigo-400 hover:text-indigo-600 ml-1">
//                                                         <X size={12} />
//                                                     </button>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>

//                             {/* 7. Date Applied (Full Row - Fixed UX) */}
//                             <div className="sm:col-span-2">
//                                 <label htmlFor="dateApplied-edit" className="block text-sm font-medium text-gray-700 mb-1">Date Applied </label>
//                                 <div 
//                                     className="relative cursor-pointer"
//                                     onClick={handleCalendarClick} // Make container clickable to focus input
//                                 >
//                                     <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
//                                     <input 
//                                         ref={dateInputRef}
//                                         id="dateApplied-edit" 
//                                         type="date" // Use native date picker
//                                         value={dateApplied} 
//                                         onChange={(e) => setDateApplied(e.target.value)} 
//                                         className="w-full rounded-md border-gray-300 bg-gray-50 pl-11 pr-4 py-2.5 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm cursor-pointer" 
//                                     />
//                                 </div>
//                             </div>

//                         </div>
//                     </div>
//                 </form>

//                 {/* --- FOOTER --- */}
//                 <div className="flex-shrink-0 flex justify-end gap-4 mt-6 p-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
//                     <Button type="button" onClick={onClose} variant="outline" className="rounded-lg px-6 py-2.5">Cancel</Button>
//                     <Button type="submit" form="edit-employee-form" variant="secondary" className="rounded-lg px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-colors">Save Changes</Button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default EditEmployeeModal;
