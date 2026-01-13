import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    X, UploadCloud, Trash2, Wallet, Building2, IndianRupee,
    CreditCard, ClipboardList, AlertCircle, Loader2
} from 'lucide-react';
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
import DropDown from '../UI/DropDown/DropDown';

const BANK_NAMES = [
    "State Bank of India",
    "HDFC Bank",
    "ICICI Bank",
    "Axis Bank",
    "Kotak Mahindra Bank",
    "Punjab National Bank",
    "Bank of Baroda",
    "Canara Bank",
    "Union Bank of India",
    "IndusInd Bank",
    "IDFC First Bank",
    "Yes Bank",
    "Federal Bank",
    "Other"
];

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

        try {
            await onSave(data, images);
            onClose();
        } catch (error: any) {
            setErrors({ submit: error.message || 'Failed to save collection' });
        }
    };

    const showImages = paymentMode !== 'Cash';

    if (!isOpen) return null;

    return (
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
                <form onSubmit={handleSubmit} className="overflow-y-auto custom-scrollbar flex-grow flex flex-col">
                    <div className="p-6 space-y-6">

                        {/* 1. Party Name */}
                        <div className="relative">
                            <label className="block text-xs font-bold text-gray-400 mb-1.5 ml-1 tracking-wider uppercase">
                                Party Name
                            </label>
                            <DropDown
                                value={partyId}
                                onChange={setPartyId}
                                options={parties.map(p => ({ value: p.id, label: p.companyName }))}
                                placeholder="Select a party"
                                icon={<Building2 size={16} />}
                                error={errors.party}
                                disabled={isEditMode}
                            />
                            {errors.party && <p className="text-red-500 text-[10px] mt-1 ml-1 flex items-center gap-1 font-bold"><AlertCircle size={10} /> {errors.party}</p>}
                        </div>

                        {/* 2. Received Date and Amount (Swapped) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                            {/* Received Date */}
                            <div className="relative">
                                <label className="block text-xs font-bold text-gray-400 mb-1.5 ml-1 tracking-wider uppercase">
                                    Received Date
                                </label>
                                <DatePicker
                                    value={receivedDate}
                                    onChange={setReceivedDate}
                                    placeholder="Select date"
                                />
                                {errors.receivedDate && <p className="text-red-500 text-[10px] mt-1 ml-1 flex items-center gap-1 font-bold"><AlertCircle size={10} /> {errors.receivedDate}</p>}
                            </div>

                            {/* Amount Received */}
                            <div className="relative">
                                <label className="block text-xs font-bold text-gray-400 mb-1.5 ml-1 tracking-wider uppercase">
                                    Amount Received
                                </label>
                                <div className="relative">
                                    <IndianRupee className={`absolute left-4 top-1/2 -translate-y-1/2 ${errors.amount ? 'text-red-400' : 'text-gray-400'}`} size={16} />
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className={`w-full pl-11 pr-4 py-2.5 border rounded-xl outline-none transition-all font-medium text-black ${errors.amount ? 'border-red-300 ring-1 ring-red-100' : 'border-gray-200 focus:ring-2 focus:ring-secondary'}`}
                                        placeholder="0.00"
                                    />
                                </div>
                                {errors.amount && <p className="text-red-500 text-[10px] mt-1 ml-1 flex items-center gap-1 font-bold"><AlertCircle size={10} /> {errors.amount}</p>}
                            </div>

                        </div>

                        {/* 3. Payment Mode */}
                        <div className="relative">
                            <label className="block text-xs font-bold text-gray-400 mb-1.5 ml-1 tracking-wider uppercase">
                                Payment Mode
                            </label>
                            <DropDown
                                value={paymentMode}
                                onChange={(val) => handlePaymentModeChange(val as PaymentMode)}
                                options={PAYMENT_MODES.map(m => ({ value: m.value, label: m.label }))}
                                placeholder="Select mode"
                                icon={<CreditCard size={16} />}
                            />
                        </div>

                        {/* Dynamic Fields - Cheque */}
                        {paymentMode === 'Cheque' && (
                            <div className="space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-300">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Cheque Details</h3>

                                <div className="grid grid-cols-1 gap-4">
                                    <div className="relative">
                                        <label className="block text-xs font-bold text-gray-400 mb-1 ml-1 tracking-wider uppercase">Bank Name</label>
                                        <DropDown
                                            value={bankName}
                                            onChange={setBankName}
                                            options={BANK_NAMES.map(b => ({ value: b, label: b }))}
                                            placeholder="Select Bank"
                                            error={errors.bankName}
                                        />
                                        {errors.bankName && <p className="text-red-500 text-[10px] mt-1 ml-1 flex items-center gap-1 font-bold"><AlertCircle size={10} /> {errors.bankName}</p>}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="relative">
                                            <label className="block text-xs font-bold text-gray-400 mb-1 ml-1 tracking-wider uppercase">Cheque Date</label>
                                            <DatePicker
                                                value={chequeDate}
                                                onChange={setChequeDate}
                                                placeholder="Select date"
                                            />
                                            {errors.chequeDate && <p className="text-red-500 text-[10px] mt-1 ml-1 flex items-center gap-1 font-bold"><AlertCircle size={10} /> {errors.chequeDate}</p>}
                                        </div>

                                        <div className="relative">
                                            <label className="block text-xs font-bold text-gray-400 mb-1 ml-1 tracking-wider uppercase">Cheque Number</label>
                                            <input
                                                type="text"
                                                value={chequeNumber}
                                                onChange={(e) => setChequeNumber(e.target.value)}
                                                className={`w-full px-4 py-2.5 border rounded-xl outline-none transition-all font-medium text-black ${errors.chequeNumber ? 'border-red-300 ring-1 ring-red-100' : 'border-gray-200 focus:ring-2 focus:ring-secondary'}`}
                                                placeholder="Enter Number"
                                            />
                                            {errors.chequeNumber && <p className="text-red-500 text-[10px] mt-1 ml-1 flex items-center gap-1 font-bold"><AlertCircle size={10} /> {errors.chequeNumber}</p>}
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <label className="block text-xs font-bold text-gray-400 mb-1 ml-1 tracking-wider uppercase">Status</label>
                                        <DropDown
                                            value={chequeStatus}
                                            onChange={(val) => setChequeStatus(val as ChequeStatus)}
                                            options={CHEQUE_STATUSES.map(s => ({ value: s.value, label: s.label }))}
                                            placeholder="Select Status"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Dynamic Fields - Bank Transfer */}
                        {paymentMode === 'Bank Transfer' && (
                            <div className="space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-300">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Bank Transfer Details</h3>
                                <div className="relative">
                                    <label className="block text-xs font-bold text-gray-400 mb-1 ml-1 tracking-wider uppercase">Bank Name</label>
                                    <DropDown
                                        value={bankName}
                                        onChange={setBankName}
                                        options={BANK_NAMES.map(b => ({ value: b, label: b }))}
                                        placeholder="Select Bank"
                                        error={errors.bankName}
                                    />
                                    {errors.bankName && <p className="text-red-500 text-[10px] mt-1 ml-1 flex items-center gap-1 font-bold"><AlertCircle size={10} /> {errors.bankName}</p>}
                                </div>
                            </div>
                        )}

                        {/* 4. Description (Notes) */}
                        <div className="relative">
                            <div className="flex justify-between items-center mb-1.5 px-1">
                                <label className="text-xs font-bold text-gray-400 tracking-wider uppercase">Description</label>
                                <span className={`text-[10px] font-bold ${notes.length > 200 ? 'text-red-500' : 'text-gray-400'}`}>
                                    {notes.length}/200
                                </span>
                            </div>
                            <div className="relative">
                                <ClipboardList className={`absolute left-4 top-4 ${errors.notes ? 'text-red-400' : 'text-gray-400'}`} size={18} />
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    maxLength={200}
                                    rows={3}
                                    className={`w-full pl-11 pr-4 py-3 border rounded-xl outline-none shadow-sm resize-none transition-all font-medium text-black min-h-[100px] ${errors.notes ? 'border-red-300 ring-1 ring-red-100' : 'border-gray-200 focus:ring-2 focus:ring-secondary'}`}
                                    placeholder="Add any additional details..."
                                />
                            </div>
                            {errors.notes && <p className="text-red-500 text-[10px] mt-1 ml-1 flex items-center gap-1 font-bold"><AlertCircle size={10} /> {errors.notes}</p>}
                        </div>

                        {/* Images */}
                        {showImages && (
                            <div className="pt-2 border-t border-gray-100">
                                <label className="block text-xs font-bold text-gray-400 mb-3 ml-1 tracking-wider uppercase">
                                    Attachments (Max 2)
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    {[0, 1].map((slot) => (
                                        <div key={slot}>
                                            {imagePreviews[slot] ? (
                                                <div className="relative w-full h-32 rounded-xl border border-gray-200 overflow-hidden group">
                                                    <img
                                                        src={imagePreviews[slot]}
                                                        alt={`Preview ${slot + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(slot)}
                                                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div
                                                    className="w-full h-32 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-secondary hover:bg-secondary/5 transition-all gap-2"
                                                    onClick={() => images.length < 2 && fileInputRef.current?.click()}
                                                >
                                                    <UploadCloud size={24} className="text-gray-400" />
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                                                        {slot === 0 ? 'Upload 1' : 'Upload 2'}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    className="hidden"
                                    accept="image/*"
                                />
                                {errors.images && <p className="text-red-500 text-[10px] mt-2 ml-1 flex items-center gap-1 font-bold"><AlertCircle size={10} /> {errors.images}</p>}
                            </div>
                        )}

                        {/* Global Error */}
                        {errors.submit && (
                            <div className="bg-red-50 text-red-500 p-3 rounded-xl text-xs font-bold flex items-center gap-2 border border-red-100">
                                <AlertCircle size={14} />
                                {errors.submit}
                            </div>
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
    );
};

export default CollectionFormModal;