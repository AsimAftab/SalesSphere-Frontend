import React, { useState, useEffect } from 'react';
import { X,UploadCloud,FileIcon} from 'lucide-react';
// FIX: Using the relative path that was corrected in the previous step
import Button from '../UI/Button/Button';
import DatePicker from '../UI/DatePicker/DatePicker';


interface AddEmployeeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (userFormData: FormData, documentFiles: File[]) => void;
}

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
    isOpen,
    onClose,
    onSave
}) => {
    // State for all form fields
    const [name, setName] = useState('');
    const [position, setPosition] = useState('salesperson'); // role is position
    const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null); 
    const [gender, setGender] = useState('Male');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [citizenship, setCitizenship] = useState('');
    const [pan, setPan] = useState('');
    const [address, setAddress] = useState('');
    const [dateJoined, setDateJoined] = useState<Date | null>(null); // State for Date Joined
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [photoFile, setPhotoFile] = useState<File | null>(null); // State for the avatar File object
    const [photoPreview, setPhotoPreview] = useState<string | null>(null); // State for the avatar preview URL
    const [documents, setDocuments] = useState<File[]>([]); // State for the document File objects
    
    const [documentError, setDocumentError] = useState<string | null>(null);
    // NEW STATE: For date picker validation errors
    const [dateError, setDateError] = useState<string | null>(null);


    // Effect to clean up the preview URL to prevent memory leaks
    useEffect(() => {
        let currentPreview = photoPreview;
        return () => { 
            if (currentPreview && currentPreview.startsWith('blob:')) {
                URL.revokeObjectURL(currentPreview);
            }
        };
    }, [photoPreview]);

    // Function to reset all fields when the modal is closed
    const resetForm = () => {
        setName(''); setPosition('salesperson'); 
        setDateOfBirth(null); // Reset dateOfBirth
        setGender('Male');
        setPhone(''); setEmail(''); setCitizenship(''); setPan('');
        setAddress(''); setDateJoined(null);
        setPhotoPreview(null); setPhotoFile(null);
        setDocuments([]);
        setDocumentError(null); 
        setDateError(null); // Reset date error
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    if (!isOpen) return null;

    // --- Event Handlers ---
    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (photoPreview && photoPreview.startsWith('blob:')) {
                URL.revokeObjectURL(photoPreview);
            }
            const url = URL.createObjectURL(file); 
            setPhotoFile(file);
            setPhotoPreview(url);
        } else { 
            setPhotoFile(null); 
            setPhotoPreview(null); 
        }
        e.target.value = '';
    };

    const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        const newFilesArray = files ? Array.from(files) : [];
        const combined = [...documents, ...newFilesArray];
        
        setDocumentError(null);

        if (combined.length > 2) {
             setDocumentError(`You can only upload a maximum of 2 documents per employee.`);
             setDocuments(combined.slice(0, 2));
        } else {
             setDocuments(combined);
        }
        e.target.value = '';
    };

    const handleRemoveDocument = (idx: number) => {
        setDocuments(prev => prev.filter((_, i) => i !== idx));
        setDocumentError(null);
    };

    const handlePreviewDocument = (file: File) => {
        try { 
            const url = URL.createObjectURL(file); 
            window.open(url, '_blank'); 
            setTimeout(() => URL.revokeObjectURL(url), 1000); 
        }
        catch (error) { console.error("File preview failed", error); }
    };

    // --- Form Submission Handler ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setDateError(null);
        let valid = true;

        if (!dateOfBirth) {
            setDateError(prev => (prev || '') + "Date of Birth is required. ");
            valid = false;
        }
        if (!dateJoined) {
            setDateError(prev => (prev || '') + "Date Joined is required.");
            valid = false;
        }

        if (!valid) return;

        const userFormData = new FormData();
        userFormData.append('name', name);
        userFormData.append('role', position);
        userFormData.append('email', email);
        userFormData.append('gender', gender);
        userFormData.append('phone', phone);
        userFormData.append('address', address);
        userFormData.append('panNumber', pan);
        userFormData.append('citizenshipNumber', citizenship);
        userFormData.append('dateOfBirth', dateOfBirth!.toISOString());
        userFormData.append('dateJoined', dateJoined!.toISOString());
        if (photoFile) userFormData.append('avatar', photoFile);

        try {
            setIsSubmitting(true);
            await onSave(userFormData, documents);
            handleClose();
        } catch (err) {
            console.error("Employee creation failed", err);
        } finally {
            setIsSubmitting(false);
        }
        };


    const inputBaseClasses = "block w-full appearance-none rounded-md border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm";
    const inputBgClasses = "bg-white focus:bg-white";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 font-inter">
            <div className="relative flex flex-col w-full max-w-2xl max-h-[95vh] rounded-lg bg-white shadow-2xl">
                <div className="flex-shrink-0 p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-800">Add New Employee</h2>
                        <button onClick={handleClose} className="p-1 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-600 transition-colors" aria-label="Close modal"><X size={20} /></button>
                    </div>
                </div>
                <form id="add-employee-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 sm:p-8">
                    <div className="space-y-5">
                        <div className="flex items-center gap-4 border-b pb-4 border-gray-100">
                            <img src={photoPreview || "https://placehold.co/150x150/e0e0e0/ffffff?text=Add+Photo"} alt="Avatar" className="h-16 w-16 rounded-full object-cover ring-2 ring-indigo-300" />
                            <label htmlFor="photo-upload" className="text-sm font-semibold text-gray-700 cursor-pointer hover:underline">Upload Photo</label>
                            <input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                                {/* Name and Position */}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                                    <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Naomi King" className={`${inputBaseClasses} ${inputBgClasses}`} required />
                                </div>
                                <div>
                                    <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">Role <span className="text-red-500">*</span></label>
                                    <select id="position" value={position} onChange={(e) => setPosition(e.target.value)} className={`${inputBaseClasses} ${inputBgClasses}`} required>
                                        <option value="manager">Manager</option>
                                        <option value="salesperson">Salesperson</option> 
                                    </select>
                                </div>
                                
                                {/* Gender and Phone */}
                                <div>
                                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Gender <span className="text-red-500">*</span></label>
                                    <select id="gender" value={gender} onChange={(e) => setGender(e.target.value)} className={`${inputBaseClasses} ${inputBgClasses}`} required>
                                        <option>Male</option><option>Female</option><option>Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone number <span className="text-red-500">*</span></label>
                                    <input id="phone" type="tel" value={phone} onChange={(e) => { const i = e.target.value; if (/^\d{0,10}$/.test(i)) setPhone(i); }} placeholder="9800000000" maxLength={10} className={`${inputBaseClasses} ${inputBgClasses}`} required />
                                </div>
                                
                                {/* Email and Citizenship */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address <span className="text-red-500">*</span></label>
                                    <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@company.com" className={`${inputBaseClasses} ${inputBgClasses}`} required />
                                </div>
                                <div>
                                    <label htmlFor="citizenship" className="block text-sm font-medium text-gray-700 mb-1">Citizenship Number <span className="text-red-500">*</span></label>
                                    <input id="citizenship" type="text" value={citizenship} onChange={(e) => { const i = e.target.value; if (/^[\d-]{0,20}$/.test(i)) setCitizenship(i); }} placeholder="e.g., 12-34-56-78910" maxLength={20} className={`${inputBaseClasses} ${inputBgClasses}`} required />
                                </div>

                                {/* PAN Number and Address */}
                                <div>
                                    <label htmlFor="pan" className="block text-sm font-medium text-gray-700 mb-1">PAN Number <span className="text-red-500">*</span></label>
                                    <input id="pan" type="text" value={pan} onChange={(e) => { const i = e.target.value; if (/^[a-zA-Z0-9]{0,14}$/.test(i)) setPan(i); }} placeholder="e.g., ABCDE1234F" maxLength={14} className={`${inputBaseClasses} ${inputBgClasses}`} required />
                                </div>
                                
                                <div> 
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address <span className="text-red-500">*</span></label>
                                    <input id="address" type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Shanti Chowk, Biratnagar, Nepal" className={`${inputBaseClasses} ${inputBgClasses}`} required />
                                </div>

                                {/* Date of Birth and Date Joined */}
                                <div>
                                    <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">Date of Birth <span className="text-red-500">*</span></label>
                                    <div> 
                                        <DatePicker 
                                            value={dateOfBirth} 
                                            onChange={setDateOfBirth} 
                                            placeholder="YYYY-MM-DD" 
                                            className={`${inputBaseClasses} ${inputBgClasses} pl-11 pr-4`} 
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="dateJoined" className="block text-sm font-medium text-gray-700 mb-1">Date joined <span className="text-red-500">*</span></label>
                                    <div>
                                        <DatePicker 
                                            value={dateJoined} 
                                            onChange={setDateJoined} 
                                            placeholder="YYYY-MM-DD" 
                                            className={`${inputBaseClasses} ${inputBgClasses} pl-11 pr-4`} 
                                        />
                                    </div>
                                </div>
                        </div>

                        {/* Display custom date error message */}
                        {dateError && (
                            <div className="sm:col-span-2 text-sm text-red-600 font-medium -mt-3">{dateError}</div>
                        )}

                        {/* Document Upload Section (Not required) */}
                        <div className="grid grid-cols-1 gap-x-6 gap-y-5 pt-3 border-t border-gray-100">
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Documents (Max 2)</label>
                                
                                {documentError && (
                                    <p className="text-sm text-red-600 font-medium mb-2">{documentError}</p>
                                )}

                                <div className="flex items-start gap-4">
                                    <label htmlFor="document-upload" className="flex-shrink-0 flex items-center justify-center w-32 h-20 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-indigo-50/20 transition-colors">
                                        <div className="text-center p-2"><UploadCloud size={20} className="mx-auto h-5 w-5 text-indigo-500" /><p className="mt-1 text-xs font-medium text-indigo-600">Add Files</p></div>
                                        <input id="document-upload" type="file" className="hidden" onChange={handleDocumentChange} multiple accept="application/pdf" />
                                    </label>
                                    {documents.length > 0 && (
                                        <div className="flex flex-wrap gap-2 pt-1">
                                            {documents.map((file, index) => (
                                                <div key={index} className="flex items-center gap-2 bg-indigo-100 text-indigo-700 text-xs font-medium px-3 py-1.5 rounded-full border border-indigo-200">
                                                    <FileIcon size={14} className="text-indigo-500" /><span className="truncate max-w-[100px]">{file.name}</span>
                                                    <button type="button" onClick={() => handlePreviewDocument(file)} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 ml-1 underline">Preview</button>
                                                    <button type="button" onClick={() => handleRemoveDocument(index)} className="text-indigo-400 hover:text-indigo-600"><X size={12} /></button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            <div className="flex-shrink-0 flex justify-end gap-4 p-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                    <Button type="button" onClick={handleClose} variant="outline" className="rounded-lg px-6 py-2.5">Cancel</Button>
                    <Button type="submit" form="add-employee-form" variant="secondary" className="rounded-lg px-6 py-2.5" disabled={isSubmitting}>{isSubmitting ? "Adding..." : "Add Employee"}</Button>
                </div>
            </div>
        </div>
    );
};

export default AddEmployeeModal;