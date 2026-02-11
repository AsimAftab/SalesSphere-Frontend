import React from 'react';
import { CreditCard, FileText, IndianRupee } from 'lucide-react';
import { DropDown, DatePicker } from '@/components/ui';
import { formatDateToLocalISO } from '@/utils/dateUtils';
import type { PaymentFormData, PaymentFormErrors, ChangeHandler } from '../types';
import { PAYMENT_MODE_OPTIONS } from '../constants';

interface PaymentDetailsSectionProps {
    formData: PaymentFormData;
    errors: PaymentFormErrors;
    handleChange: ChangeHandler;
}

const PaymentDetailsSection: React.FC<PaymentDetailsSectionProps> = ({
    formData,
    errors,
    handleChange,
}) => {
    return (
        <>
            {/* Section Header */}
            <div className="md:col-span-2 pb-2 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-secondary" />
                    Payment Details
                </h3>
            </div>

            {/* Row 1: Payment Mode & Amount */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Payment Mode <span className="text-red-500">*</span>
                </label>
                <DropDown
                    value={formData.paymentMode}
                    onChange={(value) => handleChange({ target: { name: 'paymentMode', value } })}
                    options={PAYMENT_MODE_OPTIONS.map((opt) => ({
                        value: opt.value,
                        label: opt.label,
                    }))}
                    placeholder="Select Payment Mode"
                    error={errors.paymentMode}
                    isSearchable={false}
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Amount <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <IndianRupee className="w-4 h-4" />
                    </div>
                    <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        name="amount"
                        value={formData.amount}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (val === '' || /^\d+$/.test(val)) {
                                handleChange({ target: { name: 'amount', value: val === '' ? '' : val } });
                            }
                        }}
                        onKeyDown={(e) => {
                            const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
                            if (allowedKeys.includes(e.key)) return;
                            if ((e.ctrlKey || e.metaKey) && ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase())) return;
                            if (!/^\d$/.test(e.key)) {
                                e.preventDefault();
                            }
                        }}
                        placeholder="Enter amount"
                        className={`w-full pl-10 pr-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-secondary transition-all ${
                            errors.amount
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                : 'border-gray-200 focus:border-secondary'
                        }`}
                    />
                </div>
                {errors.amount && (
                    <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
                )}
            </div>

            {/* Conditional: Other Payment Mode */}
            {formData.paymentMode === 'others' && (
                <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Specify Payment Mode <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="otherPaymentMode"
                        value={formData.otherPaymentMode}
                        onChange={handleChange}
                        placeholder="Enter payment mode details"
                        className={`w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-secondary transition-all ${
                            errors.otherPaymentMode
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                : 'border-gray-200 focus:border-secondary'
                        }`}
                    />
                    {errors.otherPaymentMode && (
                        <p className="text-red-500 text-xs mt-1">{errors.otherPaymentMode}</p>
                    )}
                </div>
            )}

            {/* Row 2: Date Received */}
            <div>
                <span className="block text-sm font-semibold text-gray-700 mb-2">
                    Date Received <span className="text-red-500">*</span>
                </span>
                <DatePicker
                    value={formData.dateReceived ? new Date(formData.dateReceived) : null}
                    onChange={(date) => handleChange({
                        target: {
                            name: 'dateReceived',
                            value: date ? formatDateToLocalISO(date) : ''
                        }
                    })}
                    placeholder="Select Date Received"
                    maxDate={new Date()}
                    className={errors.dateReceived ? 'border-red-300' : ''}
                />
                {errors.dateReceived && (
                    <p className="text-red-500 text-xs mt-1">{errors.dateReceived}</p>
                )}
            </div>

            {/* Empty cell for alignment when 'others' is not selected */}
            {formData.paymentMode !== 'others' && <div />}

            {/* Row 3: Description (Full Width) */}
            <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        Description
                    </div>
                </label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter payment description (optional)"
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all resize-none"
                />
            </div>
        </>
    );
};

export default PaymentDetailsSection;
