import React, { useState, useEffect, useCallback } from 'react';
import { X, UploadCloud, FileIcon, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import Button from '../UI/Button/Button';
import DatePicker from '../UI/DatePicker/DatePicker';
import { type Employee } from '../../api/employeeService';
import { getRoles } from '../../api/roleService';

// --- Types ---
interface Role {
    _id: string;
    name: string;
    description?: string;
    isDefault?: boolean;
}

interface EmployeeFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: 'add' | 'edit';
    initialData?: Employee;
    onSave: (formData: FormData, customRoleId: string, documentFiles?: File[]) => Promise<void>;
}

// --- Utilities ---
const safeDateConvert = (dateString: string | undefined): Date | null => {
    if (dateString) {
        const date = new Date(dateString);
        if (!isNaN(date.getTime())) return date;
    }
    return null;
};

const getInitialRoleId = (employee?: Employee): string => {
    if (!employee?.customRoleId) return '';
    if (typeof employee.customRoleId === 'string') return employee.customRoleId;
    return employee.customRoleId._id || '';
};

// --- Component ---
const EmployeeFormModal: React.FC<EmployeeFormModalProps> = ({
    isOpen,
    onClose,
    mode,
    initialData,
    onSave,
}) => {
    // Fetch available roles
    const { data: rolesResponse, isLoading: isLoadingRoles } = useQuery({
        queryKey: ['roles'],
        queryFn: async () => {
            const response = await getRoles();
            return response.data.data; // Extract Role[] from ApiResponse
        },
        enabled: isOpen,
    });
    const roles: Role[] = rolesResponse || [];

    // Form state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [gender, setGender] = useState('Male');
    const [customRoleId, setCustomRoleId] = useState('');
    const [panNumber, setPanNumber] = useState('');
    const [citizenshipNumber, setCitizenshipNumber] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
    const [dateJoined, setDateJoined] = useState<Date | null>(null);

    // File state
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [documents, setDocuments] = useState<File[]>([]);

    // UI state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Reset form when modal opens/closes or initialData changes
    const resetForm = useCallback(() => {
        if (mode === 'edit' && initialData) {
            setName(initialData.name || '');
            setEmail(initialData.email || '');
            setPhone(initialData.phone || '');
            setAddress(initialData.address || '');
            setGender(initialData.gender || 'Male');
            setCustomRoleId(getInitialRoleId(initialData));
            setPanNumber(initialData.panNumber || '');
            setCitizenshipNumber(initialData.citizenshipNumber || '');
            setDateOfBirth(safeDateConvert(initialData.dateOfBirth));
            setDateJoined(safeDateConvert(initialData.dateJoined));
            setPhotoPreview(initialData.avatarUrl || null);
        } else {
            setName('');
            setEmail('');
            setPhone('');
            setAddress('');
            setGender('Male');
            setCustomRoleId('');
            setPanNumber('');
            setCitizenshipNumber('');
            setDateOfBirth(null);
            setDateJoined(null);
            setPhotoPreview(null);
        }
        setPhotoFile(null);
        setDocuments([]);
        setErrors({});
    }, [mode, initialData]);

    useEffect(() => {
        if (isOpen) resetForm();
    }, [isOpen, resetForm]);

    // Cleanup blob URLs
    useEffect(() => {
        return () => {
            if (photoPreview?.startsWith('blob:')) {
                URL.revokeObjectURL(photoPreview);
            }
        };
    }, [photoPreview]);

    // Event handlers
    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (photoPreview?.startsWith('blob:')) URL.revokeObjectURL(photoPreview);
            setPhotoFile(file);
            setPhotoPreview(URL.createObjectURL(file));
        }
        e.target.value = '';
    };

    const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? Array.from(e.target.files) : [];
        const combined = [...documents, ...files].slice(0, 2);
        setDocuments(combined);
        if (combined.length >= 2 && files.length > 0) {
            setErrors(prev => ({ ...prev, documents: 'Maximum 2 documents allowed' }));
        } else {
            setErrors(prev => {
                const { documents: _, ...rest } = prev;
                return rest;
            });
        }
        e.target.value = '';
    };

    const handleRemoveDocument = (idx: number) => {
        setDocuments(prev => prev.filter((_, i) => i !== idx));
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!name.trim()) newErrors.name = 'Name is required';
        if (!email.trim()) newErrors.email = 'Email is required';
        if (!phone.trim()) newErrors.phone = 'Phone is required';
        else if (!/^\d{10}$/.test(phone)) newErrors.phone = 'Phone must be 10 digits';
        if (!customRoleId) newErrors.customRoleId = 'Role is required';

        if (mode === 'add') {
            if (!dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
            if (!dateJoined) newErrors.dateJoined = 'Date joined is required';
            if (!citizenshipNumber.trim()) newErrors.citizenshipNumber = 'Citizenship is required';
            if (!panNumber.trim()) newErrors.panNumber = 'PAN number is required';
            if (!address.trim()) newErrors.address = 'Address is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('phone', phone);
            formData.append('address', address);
            formData.append('gender', gender);
            formData.append('role', 'user'); // Always create as base 'user'
            // formData.append('customRoleId', customRoleId); // Removed: Handled separately
            formData.append('panNumber', panNumber);
            formData.append('citizenshipNumber', citizenshipNumber);

            if (dateOfBirth) formData.append('dateOfBirth', dateOfBirth.toISOString());
            if (dateJoined) formData.append('dateJoined', dateJoined.toISOString());
            if (photoFile) formData.append('avatar', photoFile);

            await onSave(formData, customRoleId, mode === 'add' ? documents : undefined);
            onClose();
        } catch (err) {
            console.error('Form submission failed:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    const inputClasses = "block w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm bg-white";
    const errorClasses = "mt-1 text-sm text-red-600";
    const labelClasses = "block text-sm font-medium text-gray-700 mb-1";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="relative flex flex-col w-full max-w-2xl max-h-[95vh] rounded-lg bg-white shadow-2xl">
                {/* Header */}
                <div className="flex-shrink-0 p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-800">
                            {mode === 'add' ? 'Add New Employee' : 'Edit Employee'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-1 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-600 transition-colors"
                            aria-label="Close"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form id="employee-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-5">
                        {/* Avatar Upload */}
                        <div className="flex items-center gap-4 border-b pb-4 border-gray-100">
                            <img
                                src={photoPreview || 'https://placehold.co/150x150/e0e0e0/ffffff?text=Photo'}
                                alt="Avatar"
                                className="h-16 w-16 rounded-full object-cover ring-2 ring-indigo-300"
                            />
                            <label htmlFor="photo-upload" className="flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer hover:underline">
                                <UploadCloud size={16} className="text-indigo-600" />
                                {photoFile ? 'Change Photo' : 'Upload Photo'}
                            </label>
                            <input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                        </div>

                        {/* Form Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                            {/* Name */}
                            <div>
                                <label htmlFor="name" className={labelClasses}>Full Name <span className="text-red-500">*</span></label>
                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="John Doe"
                                    className={inputClasses}
                                />
                                {errors.name && <p className={errorClasses}>{errors.name}</p>}
                            </div>

                            {/* Role */}
                            <div>
                                <label htmlFor="customRoleId" className={labelClasses}>Role <span className="text-red-500">*</span></label>
                                <select
                                    id="customRoleId"
                                    value={customRoleId}
                                    onChange={(e) => setCustomRoleId(e.target.value)}
                                    disabled={isLoadingRoles}
                                    className={inputClasses}
                                >
                                    <option value="">
                                        {isLoadingRoles ? 'Loading roles...' : '-- Select Role --'}
                                    </option>
                                    {roles.map((role) => (
                                        <option key={role._id} value={role._id}>
                                            {role.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.customRoleId && <p className={errorClasses}>{errors.customRoleId}</p>}
                            </div>

                            {/* Gender */}
                            <div>
                                <label htmlFor="gender" className={labelClasses}>Gender <span className="text-red-500">*</span></label>
                                <select id="gender" value={gender} onChange={(e) => setGender(e.target.value)} className={inputClasses}>
                                    <option>Male</option>
                                    <option>Female</option>
                                    <option>Other</option>
                                </select>
                            </div>

                            {/* Phone */}
                            <div>
                                <label htmlFor="phone" className={labelClasses}>Phone <span className="text-red-500">*</span></label>
                                <input
                                    id="phone"
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                        setPhone(val);
                                    }}
                                    placeholder="9800000000"
                                    maxLength={10}
                                    className={inputClasses}
                                />
                                {errors.phone && <p className={errorClasses}>{errors.phone}</p>}
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className={labelClasses}>Email <span className="text-red-500">*</span></label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="email@example.com"
                                    className={inputClasses}
                                />
                                {errors.email && <p className={errorClasses}>{errors.email}</p>}
                            </div>

                            {/* Citizenship */}
                            <div>
                                <label htmlFor="citizenshipNumber" className={labelClasses}>
                                    Citizenship Number {mode === 'add' && <span className="text-red-500">*</span>}
                                </label>
                                <input
                                    id="citizenshipNumber"
                                    type="text"
                                    value={citizenshipNumber}
                                    onChange={(e) => setCitizenshipNumber(e.target.value)}
                                    placeholder="12-34-56-78910"
                                    className={inputClasses}
                                />
                                {errors.citizenshipNumber && <p className={errorClasses}>{errors.citizenshipNumber}</p>}
                            </div>

                            {/* PAN */}
                            <div>
                                <label htmlFor="panNumber" className={labelClasses}>
                                    PAN Number {mode === 'add' && <span className="text-red-500">*</span>}
                                </label>
                                <input
                                    id="panNumber"
                                    type="text"
                                    value={panNumber}
                                    onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                                    placeholder="ABCDE1234F"
                                    maxLength={14}
                                    className={inputClasses}
                                />
                                {errors.panNumber && <p className={errorClasses}>{errors.panNumber}</p>}
                            </div>

                            {/* Address */}
                            <div>
                                <label htmlFor="address" className={labelClasses}>
                                    Address {mode === 'add' && <span className="text-red-500">*</span>}
                                </label>
                                <input
                                    id="address"
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="City, Country"
                                    className={inputClasses}
                                />
                                {errors.address && <p className={errorClasses}>{errors.address}</p>}
                            </div>

                            {/* Date of Birth */}
                            <div>
                                <label htmlFor="dateOfBirth" className={labelClasses}>
                                    Date of Birth {mode === 'add' && <span className="text-red-500">*</span>}
                                </label>
                                <DatePicker
                                    value={dateOfBirth}
                                    onChange={setDateOfBirth}
                                    placeholder="YYYY-MM-DD"
                                    className={`${inputClasses} pl-11`}
                                />
                                {errors.dateOfBirth && <p className={errorClasses}>{errors.dateOfBirth}</p>}
                            </div>

                            {/* Date Joined (Add mode only) */}
                            {mode === 'add' && (
                                <div>
                                    <label htmlFor="dateJoined" className={labelClasses}>
                                        Date Joined <span className="text-red-500">*</span>
                                    </label>
                                    <DatePicker
                                        value={dateJoined}
                                        onChange={setDateJoined}
                                        placeholder="YYYY-MM-DD"
                                        className={`${inputClasses} pl-11`}
                                    />
                                    {errors.dateJoined && <p className={errorClasses}>{errors.dateJoined}</p>}
                                </div>
                            )}
                        </div>

                        {/* Document Upload (Add mode only) */}
                        {mode === 'add' && (
                            <div className="pt-3 border-t border-gray-100">
                                <label className={labelClasses}>Upload Documents (Max 2)</label>
                                {errors.documents && <p className={errorClasses}>{errors.documents}</p>}
                                <div className="flex items-start gap-4 mt-2">
                                    <label
                                        htmlFor="document-upload"
                                        className="flex-shrink-0 flex items-center justify-center w-32 h-20 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-indigo-50/20 transition-colors"
                                    >
                                        <div className="text-center p-2">
                                            <UploadCloud size={20} className="mx-auto text-indigo-500" />
                                            <p className="mt-1 text-xs font-medium text-indigo-600">Add Files</p>
                                        </div>
                                        <input
                                            id="document-upload"
                                            type="file"
                                            className="hidden"
                                            onChange={handleDocumentChange}
                                            multiple
                                            accept="application/pdf"
                                        />
                                    </label>
                                    {documents.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {documents.map((file, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-center gap-2 bg-indigo-100 text-indigo-700 text-xs font-medium px-3 py-1.5 rounded-full border border-indigo-200"
                                                >
                                                    <FileIcon size={14} />
                                                    <span className="truncate max-w-[100px]">{file.name}</span>
                                                    <button type="button" onClick={() => handleRemoveDocument(idx)} className="text-indigo-400 hover:text-indigo-600">
                                                        <X size={12} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </form>

                {/* Footer */}
                <div className="flex-shrink-0 flex justify-end gap-4 p-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                    <Button type="button" onClick={onClose} variant="outline" className="rounded-lg px-6 py-2.5">
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        form="employee-form"
                        variant="secondary"
                        className="rounded-lg px-6 py-2.5"
                        disabled={isSubmitting || isLoadingRoles}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                {mode === 'add' ? 'Adding...' : 'Saving...'}
                            </span>
                        ) : (
                            mode === 'add' ? 'Add Employee' : 'Save Changes'
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default EmployeeFormModal;
