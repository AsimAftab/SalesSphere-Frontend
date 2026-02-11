import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { AlertCircle, Landmark } from 'lucide-react';
import { type CollectionFormData } from './CollectionFormSchema';
import { useBankNames } from './useBankNames';
import { DropDown } from '@/components/ui';

export const BankTransferSection: React.FC = () => {
    const { control, formState: { errors } } = useFormContext<CollectionFormData>();
    const { options: bankNameOptions } = useBankNames();

    return (
        <div className="space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-300">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Bank Transfer Details</h3>
            <div className="relative">
                <span className="block text-sm font-semibold text-gray-700 mb-2">
                    Bank Name <span className="text-red-500">*</span>
                </span>
                <Controller
                    name="bankName"
                    control={control}
                    render={({ field }) => (
                        <DropDown
                            value={field.value || ''}
                            onChange={field.onChange}
                            options={bankNameOptions}
                            placeholder="Select Bank"
                            icon={<Landmark size={16} />}
                            error={errors.bankName?.message}
                            isSearchable={true}
                        />
                    )}
                />
                {errors.bankName && <p className="text-red-500 text-[10px] mt-1 ml-1 flex items-center gap-1 font-bold"><AlertCircle size={10} /> {errors.bankName.message}</p>}
            </div>
        </div>
    );
};
