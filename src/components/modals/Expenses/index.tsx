import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Building2, IndianRupee, ClipboardList, PenTool } from 'lucide-react';
import { useForm, FormProvider, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { expenseSchema, type ExpenseFormData } from './ExpenseFormSchema';
import ExpenseImageUpload from './components/ExpenseImageUpload';
import DropDown from '../../UI/DropDown/DropDown';
import Button from '../../UI/Button/Button';
import DatePicker from '../../UI/DatePicker/DatePicker';
import ErrorBoundary from '../../UI/ErrorBoundary/ErrorBoundary';
import { type Expense } from '../../../api/expensesService';
import { type Party } from '../../../api/partyService';

interface ExpenseFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (formData: any, receiptFile: File | null) => Promise<void>;
    onDeleteReceipt?: () => Promise<void>;
    initialData?: Expense | null;
    categories?: string[];
    parties?: Party[];
    isSaving: boolean;
    isDeletingReceipt?: boolean;
}

// Explicitly define form data type for useForm to handle nulls correctly if Zod inference is strict
interface IFormInput extends Omit<ExpenseFormData, 'incurredDate'> {
    incurredDate: Date | null;
}

const ExpenseFormModal: React.FC<ExpenseFormModalProps> = ({
    isOpen,
    onClose,
    onSave,
    onDeleteReceipt,
    initialData,
    categories = [],
    parties = [],
    isSaving,
    isDeletingReceipt = false
}) => {
    const [receiptFile, setReceiptFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Use IFormInput to ensure safe null handling for DatePicker
    const methods = useForm<IFormInput>({
        resolver: zodResolver(expenseSchema),
        defaultValues: {
            title: '',
            amount: '',
            incurredDate: null,
            category: '',
            newCategory: '',
            description: '',
            partyId: ''
        }
    });

    const { handleSubmit, control, reset, formState: { errors }, setValue, watch } = methods;
    const selectedCategory = watch('category');
    const isAddingNewCategory = selectedCategory === 'ADD_NEW';

    // Reset form when opening/closing or changing initialData
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setValue('title', initialData.title || '');
                setValue('amount', initialData.amount?.toString() || '');

                // Safe date handling
                const dateVal = initialData.incurredDate ? new Date(initialData.incurredDate) : null;
                setValue('incurredDate', dateVal);

                setValue('category', initialData.category || '');
                setValue('description', initialData.description || '');
                setValue('partyId', initialData.party?.id || (initialData as any).partyId || '');
                setPreviewUrl(initialData.receipt || null);
            } else {
                reset({
                    title: '',
                    amount: '',
                    incurredDate: null,
                    category: '',
                    newCategory: '',
                    description: '',
                    partyId: ''
                });
                setReceiptFile(null);
                setPreviewUrl(null);
            }
        }
    }, [isOpen, initialData, reset, setValue]);

    const handleFileChange = (file: File | null) => {
        if (file) {
            if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
            setReceiptFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleRemoveReceipt = () => {
        const isServerImage = previewUrl && initialData?.receipt === previewUrl;

        if (isServerImage && onDeleteReceipt) {
            onDeleteReceipt();
        } else {
            if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
            setReceiptFile(null);
            setPreviewUrl(null);
        }
    };

    const onSubmit: SubmitHandler<IFormInput> = (data) => {
        let normalizedDate = data.incurredDate;
        if (normalizedDate instanceof Date) {
            const dateCopy = new Date(normalizedDate);
            dateCopy.setHours(12, 0, 0, 0);
            normalizedDate = dateCopy;
        }

        const finalCategory = data.category === 'ADD_NEW' ? data.newCategory : data.category;

        onSave({
            ...data,
            category: finalCategory,
            incurredDate: normalizedDate,
            amount: parseFloat(data.amount)
        }, receiptFile);
    };

    const isEditMode = !!initialData;

    if (!isOpen) return null;

    // Prepare dropdown options
    const categoryOptions = [
        ...categories.map(cat => ({ value: cat, label: cat })),
        {
            value: 'ADD_NEW',
            label: 'Add New Category',
            className: 'text-secondary font-semibold'
        }
    ];

    return (
        <ErrorBoundary>
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
                        >
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex-shrink-0">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900">
                                        {isEditMode ? 'Edit Expense Record' : 'Create New Expense'}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-0.5">
                                        {isEditMode ? 'Update expense details' : 'Record a new business expense'}
                                    </p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all duration-200 hover:rotate-90 focus:outline-none"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <FormProvider {...methods}>
                                <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] flex-grow flex flex-col">
                                    <div className="p-6 space-y-6">

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Expense Title <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <PenTool className={`absolute left-4 top-1/2 -translate-y-1/2 ${errors.title ? 'text-red-400' : 'text-gray-400'}`} size={16} />
                                                <input
                                                    {...methods.register('title')}
                                                    className={`w-full pl-11 pr-4 py-2.5 border rounded-xl outline-none transition-all font-medium text-black ${errors.title ? 'border-red-300 ring-1 ring-red-100' : 'border-gray-200 focus:ring-2 focus:ring-secondary'}`}
                                                    placeholder="Expense Title"
                                                />
                                            </div>
                                            {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Expense Incurred Date <span className="text-red-500">*</span>
                                                </label>
                                                <Controller
                                                    control={control}
                                                    name="incurredDate"
                                                    render={({ field }) => (
                                                        <DatePicker
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                            placeholder="Select date"
                                                            minDate={new Date()}
                                                            error={!!errors.incurredDate}
                                                        />
                                                    )}
                                                />
                                                {errors.incurredDate && <p className="mt-1 text-xs text-red-500">{errors.incurredDate.message}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Amount <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <IndianRupee className={`absolute left-4 top-1/2 -translate-y-1/2 ${errors.amount ? 'text-red-400' : 'text-gray-400'}`} size={16} />
                                                    <input
                                                        type="number"
                                                        step="any"
                                                        min="0"
                                                        onKeyDown={(e) => {
                                                            if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        {...methods.register('amount')}
                                                        className={`w-full pl-11 pr-4 py-2.5 border rounded-xl outline-none transition-all font-medium text-black ${errors.amount ? 'border-red-300 ring-1 ring-red-100' : 'border-gray-200 focus:ring-2 focus:ring-secondary'}`}
                                                        placeholder="0.00"
                                                    />
                                                </div>
                                                {errors.amount && <p className="mt-1 text-xs text-red-500">{errors.amount.message}</p>}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Expense Category <span className="text-red-500">*</span>
                                                </label>
                                                {isAddingNewCategory ? (
                                                    <div className="relative animate-in fade-in slide-in-from-left-2 duration-200">
                                                        <input
                                                            {...methods.register('newCategory')}
                                                            autoFocus
                                                            className={`w-full pl-4 pr-10 py-2.5 border rounded-xl outline-none transition-all font-medium text-black ${errors.newCategory ? 'border-red-300 ring-1 ring-red-100' : 'border-secondary ring-2 ring-secondary'}`}
                                                            placeholder="Enter new category name"
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Escape') {
                                                                    e.stopPropagation();
                                                                    setValue('category', '');
                                                                }
                                                            }}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setValue('category', '')}
                                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 bg-gray-100 text-gray-500 rounded-full hover:bg-gray-200 hover:text-gray-700 transition-colors"
                                                            title="Cancel"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <Controller
                                                        control={control}
                                                        name="category"
                                                        render={({ field }) => (
                                                            <DropDown
                                                                value={field.value}
                                                                onChange={field.onChange}
                                                                options={categoryOptions}
                                                                placeholder="Select Category"
                                                                error={errors.category?.message}
                                                            />
                                                        )}
                                                    />
                                                )}

                                                {(errors.category || (isAddingNewCategory && errors.newCategory)) && (
                                                    <p className="mt-1 text-xs text-red-500">
                                                        {errors.category?.message || errors.newCategory?.message}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Linked Entity <span className="text-gray-400 font-normal">(Optional)</span>
                                                </label>
                                                <Controller
                                                    control={control}
                                                    name="partyId"
                                                    render={({ field }) => (
                                                        <DropDown
                                                            value={field.value || ''}
                                                            onChange={field.onChange}
                                                            options={parties.map(p => ({
                                                                value: p.id,
                                                                label: p.companyName || (p as any).partyName,
                                                                icon: <Building2 size={14} className="text-gray-400" />
                                                            }))}
                                                            placeholder="Select Entity"
                                                            isSearchable
                                                            icon={<Building2 size={16} />}
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Description <span className="text-gray-400 font-normal">(Optional)</span>
                                            </label>
                                            <div className="relative">
                                                <ClipboardList className={`absolute left-4 top-3 ${errors.description ? 'text-red-400' : 'text-gray-400'}`} size={16} />
                                                <textarea
                                                    {...methods.register('description')}
                                                    rows={3}
                                                    className={`w-full pl-11 pr-4 py-3 border rounded-xl outline-none transition-all font-medium text-black resize-none ${errors.description ? 'border-red-300 ring-1 ring-red-100' : 'border-gray-200 focus:ring-2 focus:ring-secondary'}`}
                                                    placeholder="Provide context for this expense..."
                                                />
                                            </div>
                                        </div>

                                        {!isEditMode && (
                                            <ExpenseImageUpload
                                                previewUrl={previewUrl}
                                                onFileChange={handleFileChange}
                                                onRemove={handleRemoveReceipt}
                                                isDeleting={isDeletingReceipt}
                                                error={(errors as any).receipt?.message}
                                            />
                                        )}
                                    </div>

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
                                            disabled={isSaving || isDeletingReceipt}
                                            variant="secondary"
                                            isLoading={isSaving}
                                        >
                                            {isEditMode ? 'Update Expense' : 'Create Expense'}
                                        </Button>
                                    </div>
                                </form>
                            </FormProvider>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </ErrorBoundary>
    );
};

export default ExpenseFormModal;
