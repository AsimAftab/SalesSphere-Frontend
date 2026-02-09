import React from 'react';
import { Loader2, Percent } from 'lucide-react';
import { Button } from '@/components/ui';
import type { CartItem } from '../../hooks/useTransactionManager';

interface TransactionSummarySectionProps {
    items: CartItem[];
    totals: {
        subtotal: number;
        finalTotal: number;
        discountAmount: number;
        taxAmount: number;
    };
    overallDiscount: number;
    setOverallDiscount: (val: number) => void;
    tax: number;
    setTax: (val: number) => void;
    isSubmitting: boolean;
    onSubmit: () => void;
    onCancel: () => void;
    isOrder: boolean;
}

const TransactionSummarySection: React.FC<TransactionSummarySectionProps> = ({
    items,
    totals,
    overallDiscount,
    setOverallDiscount,
    tax,
    setTax,
    isSubmitting,
    onSubmit,
    onCancel,
    isOrder
}) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 w-full md:w-fit md:ml-auto">

            {/* Right: Calculations */}
            <div className="w-full md:w-80 space-y-4 shrink-0">
                <div className="grid grid-cols-[1fr_80px_minmax(80px,auto)] gap-4 items-center pb-4 border-b border-gray-100">
                    {/* Subtotal */}
                    <div className="text-sm font-medium text-gray-500 col-span-2">Subtotal</div>
                    <div className="text-sm font-bold text-gray-900 text-right">RS {totals.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>

                    {/* Discount */}
                    <div className="text-sm font-medium text-gray-500 whitespace-nowrap">Discount</div>
                    <div className="relative w-20">
                        <input
                            type="number"
                            min="0"
                            max="100"
                            className="w-full pl-3 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-right transition-all"
                            value={overallDiscount}
                            onChange={(e) => {
                                const val = Math.min(100, Math.max(0, Number(e.target.value)));
                                setOverallDiscount(val);
                            }}
                        />
                        <Percent className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                    </div>
                    <div className={`text-sm font-bold text-right ${totals.discountAmount > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                        -RS {totals.discountAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>

                    {/* Tax */}
                    <div className="text-sm font-medium text-gray-500">Tax</div>
                    <div className="relative w-20">
                        <input
                            type="number"
                            min="0"
                            max="100"
                            className="w-full pl-3 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-right transition-all"
                            value={tax}
                            onChange={(e) => {
                                const val = Math.min(100, Math.max(0, Number(e.target.value)));
                                setTax(val);
                            }}
                        />
                        <Percent className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                    </div>
                    <div className="text-sm font-bold text-gray-900 text-right">
                        +RS {totals.taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                </div>

                <div className="flex justify-between items-end pb-2">
                    <span className="text-base font-black uppercase text-gray-800 tracking-wide">Total Amount</span>
                    <span className="text-2xl font-black text-gray-900 tracking-tight leading-none">
                        RS {totals.finalTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                    <Button
                        onClick={onCancel}
                        type="button"
                        variant="outline"
                        disabled={isSubmitting}
                        className="w-32"
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={onSubmit}
                        disabled={isSubmitting || items.length === 0}
                        className="w-40"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Processing...
                            </span>
                        ) : (
                            isOrder ? 'Create Order' : 'Create Estimate'
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default TransactionSummarySection;
