import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { AlertCircle, Hash, Hourglass, CheckCircle, Upload, ClipboardList, Landmark } from 'lucide-react';
import DatePicker from '../../ui/DatePicker/DatePicker';
import DropDown from '../../ui/DropDown/DropDown';
import { type CollectionFormData } from './CollectionFormSchema';

// Constants
// eslint-disable-next-line react-refresh/only-export-components
export const BANK_NAMES = [
    "State Bank of India", "HDFC Bank", "ICICI Bank", "Punjab National Bank",
    "Axis Bank", "Bank of Baroda", "Kotak Mahindra Bank", "IndusInd Bank", "Canara Bank"
];

const CHEQUE_STATUS_OPTIONS = [
    { value: 'Pending', label: 'Pending', icon: <Hourglass size={16} /> },
    { value: 'Deposited', label: 'Deposited', icon: <Upload size={16} /> },
    { value: 'Cleared', label: 'Cleared', icon: <CheckCircle size={16} /> },
    { value: 'Bounced', label: 'Bounced', icon: <AlertCircle size={16} /> },
];

export const ChequeDetailsSection: React.FC = () => {
    const { control, formState: { errors } } = useFormContext<CollectionFormData>();

    return (
        <div className="space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-300">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Cheque Details</h3>
            <div className="grid grid-cols-1 gap-4">

                {/* Bank Name */}
                <div className="relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Bank Name <span className="text-red-500">*</span>
                    </label>
                    <Controller
                        name="bankName"
                        control={control}
                        render={({ field }) => (
                            <DropDown
                                value={field.value || ''}
                                onChange={field.onChange}
                                options={BANK_NAMES.map(b => ({ value: b, label: b }))}
                                placeholder="Select Bank"
                                icon={<Landmark size={16} />}
                                error={errors.bankName?.message}
                                isSearchable={true}
                            />
                        )}
                    />
                    {errors.bankName && <p className="text-red-500 text-[10px] mt-1 ml-1 flex items-center gap-1 font-bold"><AlertCircle size={10} /> {errors.bankName.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Cheque Date */}
                    <div className="relative">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Cheque Date <span className="text-red-500">*</span>
                        </label>
                        <Controller
                            name="chequeDate"
                            control={control}
                            render={({ field }) => (
                                <DatePicker
                                    value={field.value || null}
                                    onChange={field.onChange}
                                    placeholder="Select date"
                                    minDate={new Date()}
                                />
                            )}
                        />
                        {errors.chequeDate && <p className="text-red-500 text-[10px] mt-1 ml-1 flex items-center gap-1 font-bold"><AlertCircle size={10} /> {errors.chequeDate.message}</p>}
                    </div>

                    {/* Cheque Number */}
                    <div className="relative">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Cheque Number <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Hash className={`absolute left-4 top-1/2 -translate-y-1/2 ${errors.chequeNumber ? 'text-red-400' : 'text-gray-400'}`} size={16} />
                            <Controller
                                name="chequeNumber"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        type="text"
                                        value={field.value || ''}
                                        onChange={field.onChange}
                                        className={`w-full pl-11 pr-4 py-2.5 border rounded-xl outline-none transition-all font-medium text-black ${errors.chequeNumber ? 'border-red-300 ring-1 ring-red-100' : 'border-gray-200 focus:ring-2 focus:ring-secondary'}`}
                                        placeholder="Enter Number"
                                        maxLength={20}
                                    />
                                )}
                            />
                        </div>
                        {errors.chequeNumber && <p className="text-red-500 text-[10px] mt-1 ml-1 flex items-center gap-1 font-bold"><AlertCircle size={10} /> {errors.chequeNumber.message}</p>}
                    </div>
                </div>

                {/* Status */}
                <div className="relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Status <span className="text-red-500">*</span>
                    </label>
                    <Controller
                        name="chequeStatus"
                        control={control}
                        render={({ field }) => (
                            <DropDown
                                value={field.value || ''}
                                onChange={field.onChange}
                                options={CHEQUE_STATUS_OPTIONS}
                                placeholder="Select Status"
                                icon={<ClipboardList size={16} />}
                                error={errors.chequeStatus?.message}
                            />
                        )}
                    />
                    {errors.chequeStatus && <p className="text-red-500 text-[10px] mt-1 ml-1 flex items-center gap-1 font-bold"><AlertCircle size={10} /> {errors.chequeStatus.message}</p>}
                </div>
            </div>
        </div>
    );
};
