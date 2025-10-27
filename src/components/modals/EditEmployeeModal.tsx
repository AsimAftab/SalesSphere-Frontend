import React, { useState, useEffect } from 'react';
import { X, UploadCloud } from 'lucide-react';
import Button from '../../components/UI/Button/Button';
import DatePicker from '../../components/UI/DatePicker/DatePicker'; 
import { type Employee, type UpdateEmployeeData } from '../../api/services/employee/employeeService';

type UserRole = 'manager' | 'salesperson';

interface EditEmployeeModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData: Employee;
    onSave: (userId: string, formData: FormData) => Promise<void> | void; 
}

// Utility to check if an Employee role is one of the editable UserRoles
const getSafeUserRole = (role: Employee['role'] | undefined): UserRole => {
    if (role === 'manager' || role === 'salesperson') {
        return role;
    }
    return 'salesperson'; 
};

// Utility to safely convert ISO string to Date or null
const safeDateConvert = (dateString: string | undefined): Date | null => {
    if (dateString) {
        const date = new Date(dateString);
        if (!isNaN(date.getTime())) return date;
    }
    return null;
}

const EditEmployeeModal: React.FC<EditEmployeeModalProps> = ({
    isOpen,
    onClose,
    initialData,
    onSave
}) => {
    // State for editable fields
    const [name, setName] = useState(initialData.name || '');
    const [email, setEmail] = useState(initialData.email || '');
    const [phone, setPhone] = useState(initialData.phone || '');
    const [address, setAddress] = useState(initialData.address || '');
    const [role, setRole] = useState<UserRole>(getSafeUserRole(initialData.role));
    const [gender, setGender] = useState(initialData.gender || '');
    const [panNumber, setPanNumber] = useState(initialData.panNumber || '');
    const [citizenshipNumber, setCitizenshipNumber] = useState(initialData.citizenshipNumber || '');
    const [dateOfBirth, setDateOfBirth] = useState<Date | null>(safeDateConvert(initialData.dateOfBirth));
    
    // State for Avatar File
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(initialData.avatarUrl || null);

    // Effect to clean up the new photo preview URL on component unmount/initialData change
    useEffect(() => {
        let currentPreview = photoPreview;
        return () => { 
            if (currentPreview && currentPreview.startsWith('blob:')) {
                URL.revokeObjectURL(currentPreview);
            }
        };
    }, [photoPreview]);
    

    // Reset state when initialData or isOpen changes
    useEffect(() => {
        if (isOpen && initialData) {
            setName(initialData.name || '');
            setEmail(initialData.email || '');
            setPhone(initialData.phone || '');
            setAddress(initialData.address || '');
            setRole(getSafeUserRole(initialData.role));
            setGender(initialData.gender || '');
            setPanNumber(initialData.panNumber || '');
            setCitizenshipNumber(initialData.citizenshipNumber || '');
            
            setDateOfBirth(safeDateConvert(initialData.dateOfBirth));
            
            setPhotoFile(null); 
            setPhotoPreview(initialData.avatarUrl || null); 
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

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
            setPhotoPreview(initialData.avatarUrl || null); 
        }
        e.target.value = '';
    };
    
    const handleSaveChanges = async () => {
        const formData = new FormData();
        let changed = false;

        // Helper to append field if it has changed
        const appendIfChanged = (key: keyof UpdateEmployeeData, currentValue: any, initialValue: any) => {
            const initialString = String(initialValue || '');
            const currentString = String(currentValue || '');

            if (currentString !== initialString) {
                formData.append(key as string, currentValue);
                changed = true;
            }
        };

        // 1. Append basic fields
        appendIfChanged('name', name, initialData.name);
        appendIfChanged('email', email, initialData.email);
        appendIfChanged('phone', phone, initialData.phone);
        appendIfChanged('address', address, initialData.address);
        appendIfChanged('role', role, initialData.role);
        appendIfChanged('gender', gender, initialData.gender);
        appendIfChanged('panNumber', panNumber, initialData.panNumber);
        appendIfChanged('citizenshipNumber', citizenshipNumber, initialData.citizenshipNumber);

        // 2. Handle dateOfBirth
        const newDateOfBirthISO = dateOfBirth ? dateOfBirth.toISOString() : '';
        const initialDateOfBirthISO = initialData.dateOfBirth ? new Date(initialData.dateOfBirth).toISOString() : '';
        
        if (newDateOfBirthISO !== initialDateOfBirthISO) {
             formData.append('dateOfBirth', newDateOfBirthISO);
             changed = true;
        }

        // 3. Handle Avatar File
        if (photoFile) {
            formData.append('avatar', photoFile);
            changed = true;
        }

        if (changed) {
            try { 
                await onSave(initialData._id, formData); 
            } 
            catch (error) { 
                console.error("Save failed:", error) 
            }
        } else {
            onClose(); 
        }
    };

    const inputBaseClasses = "block w-full appearance-none rounded-md border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-white";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 font-inter">
            <div className="relative flex flex-col w-full max-w-lg max-h-[95vh] rounded-lg bg-white shadow-2xl">
                <div className="flex-shrink-0 p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-800">Edit Employee Details</h2>
                        <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-600 transition-colors" aria-label="Close modal">
                            <X size={20} />
                        </button>
                    </div>
                </div>
                
                {/* START Form Content Area */}
                <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-5">
                    
                    {/* 1. Avatar Upload Section */}
                    <div className="flex items-center gap-4 border-b pb-4 border-gray-100">
                        <img 
                            src={photoPreview || "https://placehold.co/150x150/e0e0e0/ffffff?text=No+Photo"} 
                            alt="Avatar" 
                            className="h-16 w-16 rounded-full object-cover ring-2 ring-indigo-300" 
                        />
                        <label htmlFor="edit-photo-upload" className="flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer hover:underline">
                            <UploadCloud size={16} className="text-indigo-600" />
                            {photoFile ? 'Change Photo' : 'Update Photo'}
                        </label>
                        <input id="edit-photo-upload" type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                    </div>
                    
                    {/* 2. Main 2-Column Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                        
                        {/* Row 1: Name and Email */}
                        <div>
                            <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input id="edit-name" type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputBaseClasses} />
                        </div>
                        <div>
                            <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input id="edit-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputBaseClasses} />
                        </div>

                        {/* Row 2: Gender and Phone */}
                        <div>
                            <label htmlFor="edit-gender" className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                            <select id="edit-gender" value={gender} onChange={(e) => setGender(e.target.value)} className={inputBaseClasses}>
                                <option>Male</option><option>Female</option><option>Other</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="edit-phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <input id="edit-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputBaseClasses} />
                        </div>

                        {/* Row 3: Citizenship and PAN */}
                        <div>
                             <label htmlFor="edit-citizenship" className="block text-sm font-medium text-gray-700 mb-1">Citizenship Number</label>
                             <input id="edit-citizenship" type="text" value={citizenshipNumber} onChange={(e) => setCitizenshipNumber(e.target.value)} className={inputBaseClasses} />
                        </div>
                        <div>
                             <label htmlFor="edit-pan" className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
                             <input id="edit-pan" type="text" value={panNumber} onChange={(e) => setPanNumber(e.target.value)} className={inputBaseClasses} />
                        </div>

                        {/* Row 4: Address (Full width for better readability) */}
                        <div className="sm:col-span-2">
                            <label htmlFor="edit-address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <input id="edit-address" type="text" value={address} onChange={(e) => setAddress(e.target.value)} className={inputBaseClasses} />
                        </div>

                        {/* Row 5: Date of Birth and Role (Horizontally aligned) */}
                        <div>
                            <label htmlFor="edit-dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                            <DatePicker 
                                value={dateOfBirth} 
                                onChange={setDateOfBirth} 
                                placeholder="YYYY-MM-DD" 
                                className={`${inputBaseClasses} pl-11 pr-4`} 
                            />
                        </div>
                        <div>
                            <label htmlFor="edit-role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                            <select id="edit-role" value={role} onChange={(e) => setRole(e.target.value as UserRole)} className={inputBaseClasses} required >
                                <option value="manager">Manager</option>
                                <option value="salesperson">Salesperson</option>
                            </select>
                        </div>

                        {/* NOTE: Date Joined and Documents section are intentionally omitted */}
                        
                    </div>
                </div>
                {/* END Form Content Area */}

                <div className="flex-shrink-0 flex justify-end gap-4 p-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                    <Button type="button" onClick={onClose} variant="outline" className="rounded-lg px-6 py-2.5">Cancel</Button>
                    <Button type="button" onClick={handleSaveChanges} variant="primary" className="rounded-lg px-6 py-2.5">Save Changes</Button>
                </div>
            </div>
        </div>
    );
};

export default EditEmployeeModal;
