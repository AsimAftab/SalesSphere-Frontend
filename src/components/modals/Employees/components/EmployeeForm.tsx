import React, { useState, useRef } from 'react';
import { Controller, type UseFormReturn } from 'react-hook-form';
import { FileIcon, UploadCloud, X } from 'lucide-react';
import type { EmployeeFormData } from '../common/EmployeeSchema';
import { formatDateToLocalISO } from '@/utils/dateUtils';
import { getSafeImageUrl } from '@/utils/security';
import { DatePicker, Button, DropDown } from '@/components/ui';

interface Role {
    _id: string;
    name: string;
}

interface EmployeeFormProps {
    form: UseFormReturn<EmployeeFormData>;
    roles: Role[];
    isLoadingRoles: boolean;
    onSubmit: () => void;
    onCancel: () => void;
    isSubmitting: boolean;
    mode: 'add' | 'edit';
    initialAvatarUrl?: string;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
    form,
    roles,
    isLoadingRoles,
    onSubmit,
    onCancel,
    isSubmitting,
    mode,
    initialAvatarUrl
}) => {
    const { register, control, formState: { errors }, watch, setValue } = form;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const photoInputRef = useRef<HTMLInputElement>(null);

    // Local state for previews (purely UI concern)
    const [photoPreview, setPhotoPreview] = useState<string | null>(initialAvatarUrl || null);

    // Watch files for UI updates
    const watchedDocuments = watch('documents') || [];

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (photoPreview?.startsWith('blob:')) URL.revokeObjectURL(photoPreview);
            const previewUrl = URL.createObjectURL(file);
            setPhotoPreview(previewUrl);
            setValue('photoFile', file, { shouldValidate: true });
        }
    };

    const handlePhotoUploadClick = () => {
        photoInputRef.current?.click();
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? Array.from(e.target.files) : [];
        if (files.length > 0) {
            const currentDocs = watchedDocuments || [];
            if (currentDocs.length + files.length <= 2) {
                setValue('documents', [...currentDocs, ...files], { shouldValidate: true });
            }
        }
        e.target.value = ''; // Reset input
    };

    const removeDocument = (index: number) => {
        const currentDocs = watchedDocuments || [];
        const newDocs = currentDocs.filter((_, i) => i !== index);
        setValue('documents', newDocs, { shouldValidate: true });
    };

    // Base classes without focus/border colors that might conflict
    const inputClassesLink = "block w-full rounded-xl border px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition-colors sm:text-sm";

    // Helper to generate full class string
    const getInputClass = (hasError: boolean) => {
        return `${inputClassesLink} ${hasError
            ? 'border-red-500 focus:border-red-500 focus:ring-0'
            : 'border-gray-200 focus:border-secondary focus:ring-2 focus:ring-secondary'}`;
    };

    const labelClasses = "block text-sm font-semibold text-gray-700 mb-1.5";
    const errorClasses = "mt-1.5 text-xs font-medium text-red-500";

    // Safe Image URL calculation to satisfy security scanners
    const safeAvatarUrl = getSafeImageUrl(photoPreview) || 'https://placehold.co/150x150/f3f4f6/9ca3af?text=Photo';

    return (
        <form onSubmit={onSubmit} className="flex flex-col">
            <div className="p-6 space-y-6">

                {/* Avatar Section */}
                <div className="flex items-center gap-6 pb-6 border-b border-gray-100">
                    <div className="relative group">
                        <img
                            src={safeAvatarUrl}
                            alt="Avatar"
                            className="h-20 w-20 rounded-full object-cover ring-4 ring-gray-50 group-hover:ring-indigo-50 transition-all"
                        />
                        <div className="absolute inset-0 rounded-full ring-1 ring-black/5"></div>
                    </div>
                    <div>
                        <input
                            ref={photoInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handlePhotoChange}
                        />
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handlePhotoUploadClick}
                            className="flex items-center gap-2 py-2 h-9 text-xs"
                        >
                            <UploadCloud size={14} className="text-indigo-600" />
                            {photoPreview ? 'Change Photo' : 'Upload Photo'}
                        </Button>
                    </div>
                </div>

                {/* Form Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                    {/* Name */}
                    <div>
                        <label className={labelClasses}>Full Name <span className="text-red-500">*</span></label>
                        <input
                            {...register('name')}
                            placeholder="e.g. Vikrant Kumar"
                            className={getInputClass(!!errors.name)}
                        />
                        {errors.name && <p className={errorClasses}>{errors.name.message}</p>}
                    </div>

                    {/* Role */}
                    <div>
                        <label className={labelClasses}>Role <span className="text-red-500">*</span></label>
                        <Controller
                            control={form.control}
                            name="customRoleId"
                            render={({ field }) => (
                                <DropDown
                                    value={field.value}
                                    onChange={field.onChange}
                                    options={roles.map(role => ({ value: role._id, label: role.name }))}
                                    placeholder={isLoadingRoles ? 'Loading...' : 'Select Role'}
                                    error={errors.customRoleId?.message}
                                    disabled={isLoadingRoles}
                                />
                            )}
                        />
                        {errors.customRoleId && <p className={errorClasses}>{errors.customRoleId.message}</p>}
                    </div>

                    {/* Date Joined - Moved Up */}
                    <div>
                        <label className={labelClasses}>Date Joined <span className="text-red-500">*</span></label>
                        <Controller
                            control={control}
                            name="dateJoined"
                            render={({ field }) => (
                                <DatePicker
                                    value={field.value ? new Date(field.value) : null}
                                    onChange={(date) => field.onChange(date ? formatDateToLocalISO(date) : '')}
                                    placeholder="Select Date Joined"
                                    className={errors.dateJoined ? 'border-red-300' : ''}
                                />
                            )}
                        />
                        {errors.dateJoined && <p className={errorClasses}>{errors.dateJoined.message}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <label className={labelClasses}>Email <span className="text-red-500">*</span></label>
                        <input
                            type="email"
                            {...register('email')}
                            placeholder="e.g. john@example.com"
                            className={getInputClass(!!errors.email)}
                        />
                        {errors.email && <p className={errorClasses}>{errors.email.message}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                        <label className={labelClasses}>Phone <span className="text-red-500">*</span></label>
                        <input
                            type="tel"
                            {...register('phone')}
                            placeholder="e.g. 98XXXXXXXX"
                            maxLength={10}
                            className={getInputClass(!!errors.phone)}
                        />
                        {errors.phone && <p className={errorClasses}>{errors.phone.message}</p>}
                    </div>

                    {/* Date of Birth */}
                    <div>
                        <label className={labelClasses}>Date of Birth <span className="text-red-500">*</span></label>
                        <Controller
                            control={control}
                            name="dateOfBirth"
                            render={({ field }) => (
                                <DatePicker
                                    value={field.value ? new Date(field.value) : null}
                                    onChange={(date) => field.onChange(date ? formatDateToLocalISO(date) : '')}
                                    placeholder="Select Date of Birth"
                                    className={errors.dateOfBirth ? 'border-red-300' : ''}
                                    align="right"
                                />
                            )}
                        />
                        {errors.dateOfBirth && <p className={errorClasses}>{errors.dateOfBirth.message}</p>}
                    </div>

                    {/* Gender */}
                    <div>
                        <label className={labelClasses}>Gender <span className="text-red-500">*</span></label>
                        <Controller
                            control={form.control}
                            name="gender"
                            render={({ field }) => (
                                <DropDown
                                    value={field.value}
                                    onChange={field.onChange}
                                    options={[
                                        { value: 'Male', label: 'Male' },
                                        { value: 'Female', label: 'Female' },
                                        { value: 'Other', label: 'Other' }
                                    ]}
                                    placeholder="Select Gender"
                                    error={errors.gender?.message}
                                />
                            )}
                        />
                        {errors.gender && <p className={errorClasses}>{errors.gender.message}</p>}
                    </div>

                    {/* Address */}
                    <div>
                        <label className={labelClasses}>Address <span className="text-red-500">*</span></label>
                        <input
                            {...register('address')}
                            placeholder="e.g. 123 Main St, City, Country"
                            className={getInputClass(!!errors.address)}
                        />
                        {errors.address && <p className={errorClasses}>{errors.address.message}</p>}
                    </div>

                    {/* Citizenship */}
                    <div>
                        <label className={labelClasses}>Citizenship No. <span className="text-red-500">*</span></label>
                        <input
                            {...register('citizenshipNumber')}
                            placeholder="e.g. 37-02-74-08374"
                            className={getInputClass(!!errors.citizenshipNumber)}
                        />
                        {errors.citizenshipNumber && <p className={errorClasses}>{errors.citizenshipNumber.message}</p>}
                    </div>

                    {/* PAN */}
                    <div>
                        <label className={labelClasses}>PAN No. <span className="text-red-500">*</span></label>
                        <input
                            {...register('panNumber')}
                            placeholder="e.g. ABCDE1234F"
                            className={getInputClass(!!errors.panNumber)}
                            onChange={(e) => {
                                e.target.value = e.target.value.toUpperCase();
                                register('panNumber').onChange(e);
                            }}
                        />
                        {errors.panNumber && <p className={errorClasses}>{errors.panNumber.message}</p>}
                    </div>
                </div>

                {/* Docs Upload */}
                {mode === 'add' && (
                    <div className="pt-6 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-semibold text-gray-700">
                                Documents <span className="text-gray-400 text-sm font-normal">(Optional - Max 2)</span>
                            </label>

                            {watchedDocuments.length < 2 ? (
                                <>
                                    <input
                                        type="file"
                                        multiple
                                        accept=".pdf"
                                        className="hidden"
                                        ref={fileInputRef}
                                        onChange={handleDocumentChange}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleUploadClick}
                                        className="flex items-center gap-2 py-2 h-9 text-xs"
                                    >
                                        <UploadCloud size={14} className="text-indigo-600" />
                                        Upload
                                    </Button>
                                </>
                            ) : (
                                <div className="px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-lg flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                    <span className="text-xs text-blue-700 font-medium">Limit reached (2/2)</span>
                                </div>
                            )}
                        </div>

                        {errors.documents && <p className={errorClasses}>{errors.documents.message as string}</p>}

                        {/* File Gallery */}
                        {watchedDocuments.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                                {watchedDocuments.map((file: File, idx: number) => (
                                    <div key={idx} className="group relative aspect-square w-24 h-24">
                                        {/* File Card */}
                                        <div className="w-full h-full rounded-2xl border-2 border-blue-200 shadow-sm bg-blue-50/30 flex flex-col items-center justify-center p-2 text-center overflow-hidden">
                                            <div className="mb-1 p-1.5 bg-white rounded-full shadow-sm">
                                                <FileIcon size={20} className="text-blue-500" />
                                            </div>
                                            <span className="text-[10px] font-medium text-gray-600 line-clamp-2 w-full break-all leading-tight">
                                                {file.name}
                                            </span>
                                        </div>

                                        {/* Badge */}
                                        <div className="absolute -top-2 -left-2 bg-blue-500/90 backdrop-blur-sm text-[10px] text-white px-2 py-0.5 rounded-full font-bold shadow-sm ring-2 ring-white">
                                            NEW
                                        </div>

                                        {/* Remove Button */}
                                        <button
                                            type="button"
                                            onClick={() => removeDocument(idx)}
                                            className="absolute -top-2 -right-2 bg-white text-red-500 rounded-full p-1.5 shadow-lg border border-red-50 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95"
                                        >
                                            <X size={14} strokeWidth={3} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>


            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 flex-shrink-0">
                <Button
                    variant="outline"
                    onClick={onCancel}
                    disabled={isSubmitting}
                    type="button"
                    className="text-gray-700 bg-white border-gray-300 hover:bg-gray-50 font-medium"
                >
                    Cancel
                </Button>
                <Button
                    variant="secondary"
                    type="submit"
                    isLoading={isSubmitting}
                >
                    {mode === 'add' ? 'Add Employee' : 'Save Changes'}
                </Button>
            </div>
        </form>
    );
};

export default EmployeeForm;
