import React from 'react';
import DropDown from "../../../../ui/DropDown/DropDown";
import type { PlanFormData, ChangeHandler } from '../types';

interface PricingSectionProps {
    formData: PlanFormData;
    errors: Record<string, string>;
    handleChange: ChangeHandler;
}

const PricingSection: React.FC<PricingSectionProps> = ({ formData, errors, handleChange }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 transition-colors">
                    Amount <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <input
                        type="number"
                        name="price.amount"
                        value={formData.price.amount}
                        onChange={handleChange}
                        min="0"
                        placeholder="0"
                        className={`w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-sm bg-gray-50/50 hover:bg-white ${errors.amount ? 'border-red-500 focus:ring-red-200' : 'border-gray-200'}`}
                    />
                </div>
                {errors.amount && <p className="mt-1 text-xs text-red-500 font-medium animate-pulse">{errors.amount}</p>}
            </div>

            <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 transition-colors">
                    Currency <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    {/* Note: DropDown might handle its own styling, but we wrap it for consistency if needed */}
                    <DropDown
                        value={formData.price.currency}
                        onChange={(value) => handleChange({ target: { name: 'price.currency', value } })}
                        options={[
                            { value: 'INR', label: 'INR (₹)' },
                            { value: 'USD', label: 'USD ($)' },
                            { value: 'EUR', label: 'EUR (€)' }
                        ]}
                    />
                </div>
            </div>

            <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 transition-colors">
                    Billing Cycle <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <DropDown
                        value={formData.price.billingCycle}
                        onChange={(value) => handleChange({ target: { name: 'price.billingCycle', value } })}
                        options={[
                            { value: 'monthly', label: 'Monthly' },
                            { value: 'yearly', label: 'Yearly' }
                        ]}
                    />
                </div>
            </div>
        </div>
    );
};

export default PricingSection;
