import React from 'react';
import {
    AlertCircle,
    CalendarDays,
    Coins,
    IndianRupee,
    Users,
} from 'lucide-react';
import type { PlanFormData, ChangeHandler } from '../types';
import { DropDown } from '@/components/ui';

interface PricingSectionProps {
    formData: PlanFormData;
    errors: Record<string, string>;
    handleChange: ChangeHandler;
}

const PricingSection: React.FC<PricingSectionProps> = ({ formData, errors, handleChange }) => {
    const renderError = (key: string) => {
        if (!errors[key]) return null;
        return (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors[key]}
            </p>
        );
    };

    const inputClass = (hasError: boolean) =>
        `w-full px-4 py-2.5 border rounded-xl outline-none transition-all text-sm ${hasError
            ? 'border-red-500 ring-1 ring-red-100'
            : 'border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
        }`;

    return (
        <div className="space-y-4">
            {/* Row 1: Currency + Billing Cycle */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <span className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                        <Coins className="w-4 h-4 text-gray-400" />
                        Currency <span className="text-red-500">*</span>
                    </span>
                    <DropDown
                        value={formData.price.currency}
                        onChange={(value) => handleChange({ target: { name: 'price.currency', value } })}
                        placeholder="Select currency"
                        error={errors.currency}
                        options={[
                            { value: 'NPR', label: 'NPR (रू)' },
                            { value: 'INR', label: 'INR (₹)' },
                            { value: 'USD', label: 'USD ($)' },
                            { value: 'EUR', label: 'EUR (€)' }
                        ]}
                    />
                    {renderError('currency')}
                </div>

                <div>
                    <span className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-gray-400" />
                        Billing Cycle <span className="text-red-500">*</span>
                    </span>
                    <DropDown
                        value={formData.price.billingCycle}
                        onChange={(value) => handleChange({ target: { name: 'price.billingCycle', value } })}
                        placeholder="Select cycle"
                        error={errors.billingCycle}
                        options={[
                            { value: 'monthly', label: 'Monthly' },
                            { value: 'yearly', label: 'Yearly' }
                        ]}
                    />
                    {renderError('billingCycle')}
                </div>
            </div>

            {/* Row 2: Amount + Max Employees */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="pricing-amount-input" className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                        <IndianRupee className="w-4 h-4 text-gray-400" />
                        Amount <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="pricing-amount-input"
                        type="number"
                        name="price.amount"
                        value={formData.price.amount || ''}
                        onChange={handleChange}
                        min="0"
                        placeholder="0"
                        className={inputClass(!!errors.amount)}
                    />
                    {renderError('amount')}
                </div>

                <div>
                    <label htmlFor="pricing-max-employees-input" className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        Max Employees <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="pricing-max-employees-input"
                        type="number"
                        name="maxEmployees"
                        value={formData.maxEmployees || ''}
                        onChange={handleChange}
                        min="1"
                        placeholder="100"
                        className={inputClass(!!errors.maxEmployees)}
                    />
                    {renderError('maxEmployees')}
                </div>
            </div>
        </div>
    );
};

export default PricingSection;
