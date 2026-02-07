import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertCircle,
  Banknote,
  Building2,
  CreditCard,
  IndianRupee,
  Landmark,
  ScanLine,
  X,
} from 'lucide-react';

import type { Collection, NewCollectionData } from '@/api/collectionService';
import { collectionSchema, type CollectionFormData } from './CollectionFormSchema';
import { useFileGallery } from './hooks/useFileGallery';
import { ImageUploadSection, ImagePreviewGallery } from './ImageUploadSection';
import { ChequeDetailsSection } from './ChequeDetailsSection';
import { BankTransferSection } from './BankTransferSection';
import type { PartyOption } from '@/pages/CollectionPage/components/CollectionConstants';
import { DropDown, DatePicker, Button, ErrorBoundary } from '@/components/ui';


/**
 * Props for the CollectionFormModal component.
 */
export interface CollectionFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: NewCollectionData, images: File[]) => Promise<void>;
    isEditMode?: boolean;
    initialData?: Collection;
    /** List of parties available for selection */
    parties: PartyOption[];
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
            paymentMode: undefined,
            receivedDate: undefined,
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
        existingImages,
        setInitialImages,
        removeExistingImage,
        clearAll,
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
                // Populate existing images if any (map string array to objects if needed, assuming Collection has string array)
                // The API type Collection says images: string[]
                if (initialData.images && initialData.images.length > 0) {
                    setInitialImages(initialData.images.map(url => ({ imageUrl: url, url })));
                } else {
                    setInitialImages([]);
                }
            } else {
                // CREATE MODE: Clear all form and file state
                reset({
                    partyId: '',
                    amount: '',
                    paymentMode: undefined,
                    receivedDate: undefined,
                    notes: '',
                    bankName: '',
                    chequeNumber: '',
                    chequeDate: null,
                    chequeStatus: undefined,
                    newImages: [],
                });
                clearAll(); // Reset file gallery state completely
            }
        }
    }, [isOpen, isEditMode, initialData, reset, setInitialImages, clearAll, register]);

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

    const handleRemoveMedia = (index: number) => {
        // Logic: The UI combines [existing... , new...]
        // If index < existing.length -> remove existing
        // else -> remove new (index - existing.length)
        if (index < existingImages.length) {
            removeExistingImage(index);
            // Note: We don't need to sync existing images removal to RHF unless we want to submit 'keptImages' to backend.
            // Currently backend update only takes new files.
        } else {
            const newIndex = index - existingImages.length;
            removeNewFile(newIndex);
            const updatedFiles = newFiles.filter((_, i) => i !== newIndex);
            setValue('newImages', updatedFiles, { shouldValidate: true });
        }
    };

    // 6. Submit Handler
    const onSubmit = (data: CollectionFormData) => {
        // Manual Validations that were complex in Zod (or matching original logic accurately)
        // Image Check removed - Images are now optional.

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

    const showImages = paymentMode && (paymentMode as string) !== '' && paymentMode !== 'Cash';

    return (
        <ErrorBoundary>
            <AnimatePresence>
                {isOpen && (
                    <FormProvider {...methods}>
                        <div
                            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                            onClick={onClose}
                            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClose()}
                            role="button"
                            tabIndex={0}
                        >
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                            />

                            {/* Modal Content */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[95vh] z-10"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Header */}
                                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 flex-shrink-0">
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900">
                                            {isEditMode ? 'Edit Collection' : 'New Collection'}
                                        </h2>
                                        <p className="text-sm text-gray-500 mt-0.5">
                                            {isEditMode ? 'Update the collection details' : 'Record a new payment collection'}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="p-2 rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all duration-200 hover:rotate-90 focus:outline-none"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                {/* Form Body */}
                                <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto custom-scrollbar flex-grow flex flex-col">
                                    <div className="p-6 space-y-6">

                                        {/* 1. Party Name */}
                                        <div className="relative">
                                            <span className="block text-sm font-semibold text-gray-700 mb-2">
                                                Party Name <span className="text-red-500">*</span>
                                            </span>
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
                                                        isSearchable={true}
                                                    />
                                                )}
                                            />
                                            {errors.partyId && <p className="text-red-500 text-[10px] mt-1 ml-1 flex items-center gap-1 font-bold"><AlertCircle size={10} /> {errors.partyId.message}</p>}
                                        </div>

                                        {/* 2. Received Date and Amount */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="relative">
                                                <span className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Received Date <span className="text-red-500">*</span>
                                                </span>
                                                <Controller
                                                    name="receivedDate"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <DatePicker
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                            placeholder="Select date"
                                                            minDate={new Date()}
                                                            error={!!errors.receivedDate}
                                                        />
                                                    )}
                                                />
                                                {errors.receivedDate && <p className="text-red-500 text-[10px] mt-1 ml-1 flex items-center gap-1 font-bold"><AlertCircle size={10} /> {errors.receivedDate.message}</p>}
                                            </div>

                                            <div className="relative">
                                                <label htmlFor="collectionAmount" className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Amount Received <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <IndianRupee className={`absolute left-4 top-1/2 -translate-y-1/2 ${errors.amount ? 'text-red-400' : 'text-gray-400'}`} size={16} />
                                                    <input
                                                        id="collectionAmount"
                                                        type="number"
                                                        step="1"
                                                        min="0"
                                                        {...register('amount')}
                                                        className={`w-full pl-11 pr-4 py-2.5 border rounded-xl outline-none transition-all font-medium text-black ${errors.amount ? 'border-red-300 ring-1 ring-red-100' : 'border-gray-200 focus:ring-2 focus:ring-secondary'}`}
                                                        placeholder="0.00"
                                                    />
                                                </div>
                                                {errors.amount && <p className="text-red-500 text-[10px] mt-1 ml-1 flex items-center gap-1 font-bold"><AlertCircle size={10} /> {errors.amount.message}</p>}
                                            </div>
                                        </div>

                                        {/* 3. Payment Mode */}
                                        <div className="relative">
                                            <span className="block text-sm font-semibold text-gray-700 mb-2">
                                                Payment Mode <span className="text-red-500">*</span>
                                            </span>
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
                                        <div>
                                            <label htmlFor="collectionNotes" className="block text-sm font-semibold text-gray-700 mb-2">
                                                Description <span className="text-gray-400 font-normal">(Optional)</span>
                                            </label>
                                            <textarea
                                                id="collectionNotes"
                                                {...register('notes')}
                                                maxLength={200}
                                                rows={4}
                                                className={`w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-colors resize-none ${errors.notes ? 'border-red-500' : 'border-gray-200'}`}
                                                placeholder="Add any additional details..."
                                            />
                                            {errors.notes && <p className="mt-1 text-xs text-red-500">{errors.notes.message}</p>}
                                        </div>


                                        {/* 6. Images */}
                                        {showImages && !isEditMode && (
                                            <>
                                                <ImageUploadSection
                                                    totalCount={existingImages.length + newFiles.length}
                                                    onFilesAdded={handleImageChange}
                                                    maxFiles={2}
                                                    error={errors.newImages?.message as string}
                                                />
                                                <ImagePreviewGallery
                                                    existingImages={existingImages}
                                                    newPreviews={newPreviews}
                                                    onRemoveExisting={handleRemoveMedia}
                                                    onRemoveNew={(index: number) => handleRemoveMedia(existingImages.length + index)}
                                                />
                                                {errors.newImages && <p className="text-red-500 text-[10px] mt-1 ml-1 flex items-center gap-1 font-bold"><AlertCircle size={10} /> {errors.newImages.message as string}</p>}
                                            </>
                                        )}
                                    </div>

                                    {/* Footer */}
                                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 flex-shrink-0">
                                        <Button
                                            variant="outline"
                                            type="button"
                                            onClick={onClose}
                                            className="text-gray-700 bg-white border-gray-300 hover:bg-gray-50 font-medium"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={isSaving}
                                            variant="secondary"
                                            isLoading={isSaving}
                                        >
                                            {isEditMode ? 'Update Collection' : 'Create Collection'}
                                        </Button>
                                    </div>
                                </form>

                            </motion.div>
                        </div>
                    </FormProvider>
                )}
            </AnimatePresence>
        </ErrorBoundary >
    );
};

export default CollectionFormModal;
