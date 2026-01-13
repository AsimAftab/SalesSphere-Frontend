import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Wallet, Building2, AlertCircle, IndianRupee, Banknote, CreditCard, Landmark, ScanLine, Loader2, FileText } from 'lucide-react';

import type { Collection, NewCollectionData } from '../../../api/collectionService';
import { collectionSchema, type CollectionFormData } from './CollectionFormSchema';
import { useFileGallery } from './useFileGallery';
import { ImageUploadSection } from './ImageUploadSection';
import { ChequeDetailsSection } from './ChequeDetailsSection';
import { BankTransferSection } from './BankTransferSection';

import DropDown from '../../UI/DropDown/DropDown';
import DatePicker from '../../UI/DatePicker/DatePicker';
import Button from '../../UI/Button/Button';

export interface CollectionFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: NewCollectionData, images: File[]) => Promise<void>;
    isEditMode?: boolean;
    initialData?: Collection;
    parties: { id: string; companyName: string }[];
    isSaving?: boolean;
}

const PAYMENT_MODE_OPTIONS = [
    { value: 'Cash', label: 'Cash', icon: <Banknote size={18} /> },
    { value: 'Cheque', label: 'Cheque', icon: <CreditCard size={18} /> },
    { value: 'Bank Transfer', label: 'Bank Transfer', icon: <Landmark size={18} /> },
    { value: 'QR Pay', label: 'QR Pay', icon: <ScanLine size={18} /> },
];

const CollectionFormModal: React.FC<CollectionFormModalProps> = ({
    isOpen,
    onClose,
    onSave,
    isEditMode = false,
    initialData,
    parties,
    isSaving = false,
}) => {
    // 1. Setup Form with Zod Resolver
    const methods = useForm<CollectionFormData>({
        resolver: zodResolver(collectionSchema),
        defaultValues: {
            partyId: '',
            amount: '',
            paymentMode: '' as any, // Initial empty state
            receivedDate: new Date(),
            notes: '',
            // Initialize dynamic fields
            bankName: '',
            chequeNumber: '',
            chequeDate: null,
            chequeStatus: undefined,
            newImages: [],
        },
        mode: 'onChange'
    });

    const { register, handleSubmit, control, reset, watch, setValue, formState: { errors } } = methods;

    // 2. Setup Image State
    const {
        newFiles,
        newPreviews,
        addFiles,
        removeNewFile,
        // setInitialImages was unused
    } = useFileGallery(2);

    // 3. Watch Payment Mode for conditional rendering
    const paymentMode = watch('paymentMode');

    // 4. Handle Lifecycle (Reset / Populate)
    useEffect(() => {
        register('newImages'); // Ensure field is registered for manual errors to work robustly

        if (isOpen) {
            if (isEditMode && initialData) {
                reset({
                    partyId: initialData.partyId,
                    amount: initialData.paidAmount.toString(),
                    paymentMode: initialData.paymentMode,
                    receivedDate: initialData.receivedDate ? new Date(initialData.receivedDate) : new Date(),
                    notes: initialData.notes || '',
                    bankName: initialData.bankName || '',
                    chequeNumber: initialData.chequeNumber || '',
                    chequeDate: initialData.chequeDate ? new Date(initialData.chequeDate) : null,
                    chequeStatus: initialData.chequeStatus,
                });
                // Original logic clears images on edit open
                // setInitialImages([]); 
            } else {
                reset({
                    partyId: '',
                    amount: '',
                    paymentMode: '' as any,
                    receivedDate: new Date(),
                    notes: '',
                    bankName: '',
                    chequeNumber: '',
                    chequeDate: null,
                    chequeStatus: undefined,
                });
            }
        }
    }, [isOpen, isEditMode, initialData, reset]);

    // 5. Handle Image Changes (Sync with useFileGallery)
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            addFiles(files);
            // Sync with RHF
            setValue('newImages', [...newFiles, ...files], { shouldValidate: true });
            if (errors.newImages) {
                methods.clearErrors('newImages');
            }
        }
        e.target.value = ''; // Reset input
    };

    const handleRemoveImage = (index: number) => {
        removeNewFile(index);
        const updatedFiles = newFiles.filter((_, i) => i !== index);
        setValue('newImages', updatedFiles, { shouldValidate: true });
    };

    // 6. Submit Handler
    const onSubmit = (data: CollectionFormData) => {
        // Manual Validations that were complex in Zod (or matching original logic accurately)
        // Image Check:
        if (data.paymentMode !== 'Cash' && newFiles.length === 0) {
            // Original logic: "if (paymentMode !== 'Cash' && images.length === 0) error..."
            // We can set an error on a virtual field or just toast? 
            // Better to match original behavior: set error object.
            // With RHF, we can setError 'root' or specific field.
            // Let's assume we want to show it near the image section. 
            // We can use a custom error or just rely on the component checking it.
            // But wait, user wanted "SOLID", so validation should be in schema if possible.
            // But I left schema vague on images. Let's setError manually to replicate exact behavior.
            methods.setError('newImages', {
                type: 'manual',
                message: 'At least one image is required'
            });
            return;
        }

        // --- FIX: Normalize dates to Noon (12:00) to safely ignore timezones ---
        const normalizeDate = (date: Date | null | undefined): string => {
            if (!date) return '';
            const copy = new Date(date);
            copy.setHours(12, 0, 0, 0); // Force Noon Local Time
            return copy.toISOString().split('T')[0];
        };

        const payload: NewCollectionData = {
            partyId: data.partyId,
            paidAmount: Number(data.amount),
            paymentMode: data.paymentMode,
            receivedDate: normalizeDate(data.receivedDate),
            notes: data.notes?.trim() || undefined,

            // Conditional
            ...(data.paymentMode === 'Cheque' && {
                bankName: data.bankName?.trim(),
                chequeNumber: data.chequeNumber?.trim(),
                chequeDate: data.chequeDate ? normalizeDate(data.chequeDate) : undefined,
                chequeStatus: data.chequeStatus,
            }),
            ...(data.paymentMode === 'Bank Transfer' && {
                bankName: data.bankName?.trim(),
            }),
        };

        onSave(payload, newFiles);
    };

    if (!isOpen) return null;

    const showImages = paymentMode && (paymentMode as string) !== '' && paymentMode !== 'Cash';

    return (
        <FormProvider {...methods}>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[95vh]"
                >
                    {/* Header */}
                    <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50 flex-shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center">
                                <Wallet className="text-secondary w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-800 tracking-tight">
                                {isEditMode ? 'Edit Collection' : 'Create Collection'}
                            </h2>
                        </div>
                        <button type="button" onClick={onClose} className="p-2 hover:bg-red-200 rounded-full transition-colors group">
                            <X size={20} className="group-hover:rotate-90 transition-transform text-gray-500" />
                        </button>
                    </div>

                    {/* Form Body */}
                    <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto custom-scrollbar flex-grow flex flex-col">
                        <div className="p-6 space-y-6">

                            {/* 1. Party Name */}
                            <div className="relative">
                                <label className="block text-xs font-bold text-gray-400 mb-1.5 ml-1 tracking-wider uppercase">
                                    Party Name <span className="text-red-500">*</span>
                                </label>
                                <Controller
                                    name="partyId"
                                    control={control}
                                    render={({ field }) => (
                                        <DropDown
                                            value={field.value}
                                            onChange={field.onChange}
                                            options={parties.map(p => ({ value: p.id, label: p.companyName }))}
                                            placeholder="Select a party"
                                            icon={<Building2 size={16} />}
                                            error={errors.partyId?.message}
                                            disabled={isEditMode}
                                        />
                                    )}
                                />
                                {errors.partyId && <p className="text-red-500 text-[10px] mt-1 ml-1 flex items-center gap-1 font-bold"><AlertCircle size={10} /> {errors.partyId.message}</p>}
                            </div>

                            {/* 2. Received Date and Amount */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="relative">
                                    <label className="block text-xs font-bold text-gray-400 mb-1.5 ml-1 tracking-wider uppercase">
                                        Received Date <span className="text-red-500">*</span>
                                    </label>
                                    <Controller
                                        name="receivedDate"
                                        control={control}
                                        render={({ field }) => (
                                            <DatePicker
                                                value={field.value}
                                                onChange={field.onChange}
                                                placeholder="Select date"
                                            />
                                        )}
                                    />
                                    {errors.receivedDate && <p className="text-red-500 text-[10px] mt-1 ml-1 flex items-center gap-1 font-bold"><AlertCircle size={10} /> {errors.receivedDate.message}</p>}
                                </div>

                                <div className="relative">
                                    <label className="block text-xs font-bold text-gray-400 mb-1.5 ml-1 tracking-wider uppercase">
                                        Amount Received <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <IndianRupee className={`absolute left-4 top-1/2 -translate-y-1/2 ${errors.amount ? 'text-red-400' : 'text-gray-400'}`} size={16} />
                                        <input
                                            type="number"
                                            step="0.01"
                                            {...register('amount')}
                                            className={`w-full pl-11 pr-4 py-2.5 border rounded-xl outline-none transition-all font-medium text-black ${errors.amount ? 'border-red-300 ring-1 ring-red-100' : 'border-gray-300 hover:border-secondary focus:border-secondary'}`}
                                            placeholder="0.00"
                                        />
                                    </div>
                                    {errors.amount && <p className="text-red-500 text-[10px] mt-1 ml-1 flex items-center gap-1 font-bold"><AlertCircle size={10} /> {errors.amount.message}</p>}
                                </div>
                            </div>

                            {/* 3. Payment Mode */}
                            <div className="relative">
                                <label className="block text-xs font-bold text-gray-400 mb-1.5 ml-1 tracking-wider uppercase">
                                    Payment Mode <span className="text-red-500">*</span>
                                </label>
                                <Controller
                                    name="paymentMode"
                                    control={control}
                                    render={({ field }) => (
                                        <DropDown
                                            value={field.value}
                                            onChange={(val) => {
                                                field.onChange(val);
                                                // Clear conditional fields on change
                                                if (val !== 'Cheque') {
                                                    setValue('chequeNumber', '');
                                                    setValue('chequeDate', null);
                                                    setValue('chequeStatus', undefined);
                                                }
                                                if (val !== 'Cheque' && val !== 'Bank Transfer') {
                                                    setValue('bankName', '');
                                                }
                                            }}
                                            options={PAYMENT_MODE_OPTIONS}
                                            placeholder="Select Mode"
                                            icon={<CreditCard size={16} />}
                                            error={errors.paymentMode?.message}
                                        />
                                    )}
                                />
                                {errors.paymentMode && <p className="text-red-500 text-[10px] mt-1 ml-1 flex items-center gap-1 font-bold"><AlertCircle size={10} /> {errors.paymentMode.message}</p>}
                            </div>

                            {/* 4. Conditional Sections */}
                            {paymentMode === 'Cheque' && (
                                <ChequeDetailsSection />
                            )}
                            {paymentMode === 'Bank Transfer' && (
                                <BankTransferSection />
                            )}

                            {/* 5. Description */}
                            <div className="relative">
                                <div className="flex justify-between items-center mb-1.5 px-1">
                                    <label className="text-xs font-bold text-gray-400 tracking-wider uppercase">Description</label>
                                    <span className={`text-[10px] font-bold ${(watch('notes')?.length || 0) > 200 ? 'text-red-500' : 'text-gray-400'}`}>
                                        {watch('notes')?.length || 0}/200
                                    </span>
                                </div>
                                <div className="relative">
                                    <FileText className={`absolute left-4 top-4 ${errors.notes ? 'text-red-400' : 'text-gray-400'}`} size={18} />
                                    <textarea
                                        {...register('notes')}
                                        maxLength={200}
                                        rows={3}
                                        className={`w-full pl-11 pr-4 py-3 border rounded-xl outline-none shadow-sm resize-none transition-all font-medium text-black min-h-[100px] ${errors.notes ? 'border-red-300 ring-1 ring-red-100' : 'border-gray-300 hover:border-secondary focus:border-secondary'}`}
                                        placeholder="Add any additional details..."
                                    />
                                </div>
                                {errors.notes && <p className="text-red-500 text-[10px] mt-1 ml-1 flex items-center gap-1 font-bold"><AlertCircle size={10} /> {errors.notes.message}</p>}
                            </div>

                            {/* 6. Images */}
                            {showImages && (
                                <>
                                    <ImageUploadSection
                                        images={newFiles}
                                        imagePreviews={newPreviews}
                                        onFilesAdded={handleImageChange}
                                        onRemove={handleRemoveImage}
                                        maxFiles={2}
                                        error={errors.newImages?.message as string}
                                    />
                                    {errors.newImages && <p className="text-red-500 text-[10px] mt-1 ml-1 flex items-center gap-1 font-bold"><AlertCircle size={10} /> {errors.newImages.message as string}</p>}
                                </>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 flex gap-3 sticky bottom-0 bg-white flex-shrink-0 mt-auto border-t border-gray-100">
                            <Button variant="ghost" type="button" onClick={onClose} className="flex-1 font-bold text-gray-400 hover:bg-gray-100">Cancel</Button>
                            <Button type="submit" disabled={isSaving} className="flex-1 flex justify-center items-center gap-2 font-bold shadow-lg shadow-blue-200">
                                {isSaving ? <Loader2 size={18} className="animate-spin" /> : isEditMode ? 'Update Collection' : 'Create Collection'}
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </FormProvider>
    );
};

export default CollectionFormModal;
