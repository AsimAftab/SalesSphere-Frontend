import React, { useState, useRef, useEffect } from 'react';
import { X, UploadCloud, Trash2 } from 'lucide-react';
import Button from '../UI/Button/Button';
import {
    type NewCollectionData,
    type Collection,
    PAYMENT_MODES,
    CHEQUE_STATUSES,
    type PaymentMode,
    type ChequeStatus
} from '../../api/collectionService';
import { type Party } from '../../api/partyService';
import DatePicker from '../UI/DatePicker/DatePicker';

interface CollectionFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: NewCollectionData, images: File[]) => Promise<void>;
    initialData?: Collection | null;
    parties: Party[];
    isSaving: boolean;
}

const CollectionFormModal: React.FC<CollectionFormModalProps> = ({
    isOpen,
    onClose,
    onSave,
    initialData,
    parties,
    isSaving,
}) => {
    // Common fields
    const [partyId, setPartyId] = useState('');
    const [amount, setAmount] = useState('');
    const [paymentMode, setPaymentMode] = useState<PaymentMode>('Cash');
    const [receivedDate, setReceivedDate] = useState<Date | null>(new Date());
    const [notes, setNotes] = useState('');

    // Cheque fields
    const [bankName, setBankName] = useState('');
    const [chequeNumber, setChequeNumber] = useState('');
    const [chequeDate, setChequeDate] = useState<Date | null>(null);
    const [chequeStatus, setChequeStatus] = useState<ChequeStatus>('Pending');

    // Images (not for Cash)
    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    // Validation & UI
    const [errors, setErrors] = useState<Record<string, string>>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isEditMode = !!initialData;

    // Reset form when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                populateForm(initialData);
            } else {
                resetForm();
            }
        }
    }, [isOpen, initialData]);

    // Clear images when switching to Cash mode
    useEffect(() => {
        if (paymentMode === 'Cash' && images.length > 0) {
            setImages([]);
            setImagePreviews([]);
        }
    }, [paymentMode]);

    const resetForm = () => {
        setPartyId('');
        setAmount('');
        setPaymentMode('Cash');
        setReceivedDate(new Date()); // Today's date
        setNotes('');
        setBankName('');
        setChequeNumber('');
        setChequeDate(null);
        setChequeStatus('Pending');
        setImages([]);
        setImagePreviews([]);
        setErrors({});
    };

    const populateForm = (data: Collection) => {
        setPartyId(data.partyId);
        setAmount(data.paidAmount.toString());
        setPaymentMode(data.paymentMode);
        setReceivedDate(data.receivedDate ? new Date(data.receivedDate) : null);
        setNotes(data.notes || '');

        if (data.paymentMode === 'Cheque') {
            setBankName(data.bankName || '');
            setChequeNumber(data.chequeNumber || '');
            setChequeDate(data.chequeDate ? new Date(data.chequeDate) : null);
            setChequeStatus(data.chequeStatus || 'Pending');
        } else if (data.paymentMode === 'Bank Transfer') {
            setBankName(data.bankName || '');
        }

        // Note: Can't populate existing images from URLs in edit mode
        // User would need to re-upload if they want to change images
        setImages([]);
        setImagePreviews([]);
        setErrors({});
    };

    const handlePaymentModeChange = (mode: PaymentMode) => {
        setPaymentMode(mode);
        // Clear payment mode specific fields when changing mode
        if (mode !== 'Cheque') {
            setChequeNumber('');
            setChequeDate(null);
            setChequeStatus('Pending');
        }
        if (mode !== 'Cheque' && mode !== 'Bank Transfer') {
            setBankName('');
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (paymentMode === 'Cash') {
            setErrors({ ...errors, images: 'Images not allowed for Cash payments' });
            return;
        }

        const files = Array.from(e.target.files || []);
        if (images.length + files.length > 2) {
            setErrors({ ...errors, images: 'Maximum 2 images allowed' });
            return;
        }

        const newImages = [...images, ...files];
        setImages(newImages);

        // Create previews
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviews((prev) => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });

        // Clear image error if any
        if (errors.images) {
            const { images: _, ...rest } = errors;
            setErrors(rest);
        }
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
        setImagePreviews(imagePreviews.filter((_, i) => i !== index));
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        // Common validations
        if (!partyId) newErrors.party = 'Party is required';
        if (!amount || Number(amount) <= 0) newErrors.amount = 'Valid amount required';
        if (!receivedDate) newErrors.receivedDate = 'Received date is required';
        if (notes.length > 200) newErrors.notes = 'Notes cannot exceed 200 characters';

        // Payment mode specific validations
        if (paymentMode === 'Cheque') {
            if (!bankName.trim()) newErrors.bankName = 'Bank name is required';
            if (!chequeNumber.trim()) newErrors.chequeNumber = 'Cheque number is required';
            if (!chequeDate) newErrors.chequeDate = 'Cheque date is required';
        }

        if (paymentMode === 'Bank Transfer') {
            if (!bankName.trim()) newErrors.bankName = 'Bank name is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate() || isSaving) return;

        const data: NewCollectionData = {
            partyId,
            paidAmount: Number(amount),
            paymentMode,
            receivedDate: receivedDate ? receivedDate.toISOString().split('T')[0] : '',
            notes: notes.trim() || undefined,

            // Conditional fields
            ...(paymentMode === 'Cheque' && {
                bankName: bankName.trim(),
                chequeNumber: chequeNumber.trim(),
                chequeDate: chequeDate ? chequeDate.toISOString().split('T')[0] : '',
                chequeStatus,
            }),

            ...(paymentMode === 'Bank Transfer' && {
                bankName: bankName.trim(),
            }),
        };

        console.log('🚀 Submitting Collection Data:', data);

        try {
            await onSave(data, images);
            onClose();
        } catch (error: any) {
            setErrors({ submit: error.message || 'Failed to save collection' });
        }
    };

    const showImages = paymentMode !== 'Cash';

    // Styling constants from EmployeeFormModal
    const inputClasses = "block w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm bg-white";
    const errorClasses = "mt-1 text-sm text-red-600";
    const labelClasses = "block text-sm font-medium text-gray-700 mb-1";

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="relative flex flex-col w-full max-w-2xl max-h-[95vh] rounded-lg bg-white shadow-2xl">
                {/* Header */}
                <div className="flex-shrink-0 p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-800">
                            {isEditMode ? 'Edit Collection' : 'Create New Collection'}
                        </h2>
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-1 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-600 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">

                    {/* 1. Party Name */}
                    <div>
                        <label className={labelClasses}>
                            Party Name <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={partyId}
                            onChange={(e) => setPartyId(e.target.value)}
                            className={inputClasses}
                            disabled={isEditMode}
                        >
                            <option value="">Select a party</option>
                            {parties.map((party) => (
                                <option key={party.id} value={party.id}>
                                    {party.companyName}
                                </option>
                            ))}
                        </select>
                        {errors.party && <p className={errorClasses}>{errors.party}</p>}
                    </div>

                    {/* 2. Amount and Received Date */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                        <div>
                            <label className={labelClasses}>
                                Amount Received (₹) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className={inputClasses}
                                placeholder="0.00"
                            />
                            {errors.amount && <p className={errorClasses}>{errors.amount}</p>}
                        </div>

                        <div>
                            <label className={labelClasses}>
                                Received Date <span className="text-red-500">*</span>
                            </label>
                            <DatePicker
                                value={receivedDate}
                                onChange={setReceivedDate}
                                placeholder="YYYY-MM-DD"
                                className={inputClasses}
                            />
                            {errors.receivedDate && <p className={errorClasses}>{errors.receivedDate}</p>}
                        </div>
                    </div>

                    {/* 3. Payment Mode (Dropdown) */}
                    <div>
                        <label className={labelClasses}>
                            Payment Mode <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={paymentMode}
                            onChange={(e) => handlePaymentModeChange(e.target.value as PaymentMode)}
                            className={inputClasses}
                        >
                            {PAYMENT_MODES.map((mode) => (
                                <option key={mode.value} value={mode.value}>
                                    {mode.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Dynamic Fields Based on Payment Mode */}
                    {paymentMode === 'Cheque' && (
                        <div className="space-y-5 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <h3 className="text-sm font-bold text-gray-900">Cheque Details</h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                                <div>
                                    <label className={labelClasses}>
                                        Bank Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={bankName}
                                        onChange={(e) => setBankName(e.target.value)}
                                        className={inputClasses}
                                        placeholder="Enter Bank Name"
                                    />
                                    {errors.bankName && <p className={errorClasses}>{errors.bankName}</p>}
                                </div>

                                <div>
                                    <label className={labelClasses}>
                                        Cheque Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={chequeNumber}
                                        onChange={(e) => setChequeNumber(e.target.value)}
                                        className={inputClasses}
                                        placeholder="Enter Cheque Number"
                                    />
                                    {errors.chequeNumber && <p className={errorClasses}>{errors.chequeNumber}</p>}
                                </div>

                                <div>
                                    <label className={labelClasses}>
                                        Cheque Date <span className="text-red-500">*</span>
                                    </label>
                                    <DatePicker
                                        value={chequeDate}
                                        onChange={setChequeDate}
                                        placeholder="YYYY-MM-DD"
                                        className={inputClasses}
                                    />
                                    {errors.chequeDate && <p className={errorClasses}>{errors.chequeDate}</p>}
                                </div>

                                <div>
                                    <label className={labelClasses}>
                                        Cheque Status <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={chequeStatus}
                                        onChange={(e) => setChequeStatus(e.target.value as ChequeStatus)}
                                        className={inputClasses}
                                    >
                                        {CHEQUE_STATUSES.map((status) => (
                                            <option key={status.value} value={status.value}>
                                                {status.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {paymentMode === 'Bank Transfer' && (
                        <div className="space-y-5 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <h3 className="text-sm font-bold text-gray-900">Bank Transfer Details</h3>
                            <div>
                                <label className={labelClasses}>
                                    Bank Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={bankName}
                                    onChange={(e) => setBankName(e.target.value)}
                                    className={inputClasses}
                                    placeholder="Enter Bank Name"
                                />
                                {errors.bankName && <p className={errorClasses}>{errors.bankName}</p>}
                            </div>
                        </div>
                    )}

                    {/* 4. Description (Notes) */}
                    <div>
                        <label className={labelClasses}>
                            Description (Optional, max 200 chars)
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            maxLength={200}
                            rows={3}
                            className={inputClasses}
                            placeholder="Add any additional details..."
                        />
                        <div className="flex justify-between mt-1">
                            {errors.notes && <p className={errorClasses}>{errors.notes}</p>}
                            <p className="text-xs text-gray-500 ml-auto">{notes.length}/200</p>
                        </div>
                    </div>

                    {/* Image Upload Section (Moved to bottom or kept here? User didn't specify, but images usually go near bottom or top. Keeping it here for now or moving it?
                       User sequence ended at 4) Description.
                       I will place Images AFTER description as 'attachments' usually go last.
                    */}
                    {showImages && (
                        <div className="pt-3 border-t border-gray-100">
                            <label className={labelClasses}>
                                Upload Images (Max 2) - Optional
                            </label>
                            <div className="flex items-start gap-4 mt-2">
                                <div className="grid grid-cols-2 gap-4 w-full">
                                    {[0, 1].map((slot) => (
                                        <div key={slot}>
                                            {imagePreviews[slot] ? (
                                                <div className="relative w-full h-32 rounded-lg border-2 border-gray-200 overflow-hidden group">
                                                    <img
                                                        src={imagePreviews[slot]}
                                                        alt={`Preview ${slot + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(slot)}
                                                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div
                                                    className="w-full h-32 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50/20 transition-all"
                                                    onClick={() => images.length < 2 && fileInputRef.current?.click()}
                                                >
                                                    <UploadCloud size={32} className="text-gray-400" />
                                                    <span className="text-xs text-gray-500 mt-1">
                                                        {slot === 0 ? 'Upload Image' : 'Upload Image 2'}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                className="hidden"
                                accept="image/*"
                            />
                            {errors.images && <p className={errorClasses}>{errors.images}</p>}
                        </div>
                    )}

                    {/* Global Error */}
                    {errors.submit && (
                        <p className="text-red-500 text-sm text-center">{errors.submit}</p>
                    )}
                </form>

                {/* Footer */}
                <div className="flex-shrink-0 flex justify-end gap-4 p-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                    <Button type="button" variant="ghost" onClick={onClose} disabled={isSaving}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="secondary" onClick={handleSubmit} disabled={isSaving}>
                        {isSaving
                            ? isEditMode
                                ? 'Updating...'
                                : 'Creating...'
                            : isEditMode
                                ? 'Update Collection'
                                : 'Create Collection'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CollectionFormModal;
