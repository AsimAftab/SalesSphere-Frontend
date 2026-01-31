import React from 'react';
import {
    UserGroupIcon,
    CurrencyRupeeIcon,
    ArrowDownTrayIcon,
    BuildingOfficeIcon,
    UserIcon,
    DocumentCheckIcon // Added for conversion action
} from '@heroicons/react/24/outline';
import { Loader2 } from 'lucide-react';
import Button from '../../../../components/UI/Button/Button';
import { StatusBadge } from '../../../../components/UI/statusBadge/statusBadge';

// --- Props ---
interface EstimateProps {
    data: any;
    onExportPdf: () => void;
    onConvertToOrder: () => void;
    isPrinting: boolean;
    isConverting?: boolean;
    permissions?: {
        canConvertToOrder: boolean;
        canExportPdf: boolean;
    };
}

// --- Helper Functions ---
const formatDateTime = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
};

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(amount);
};

// --- InfoField Helper ---
const InfoField: React.FC<{ label: string; value: string | undefined; }> = ({ label, value }) => (
    <div className="flex flex-col sm:flex-row sm:justify-between">
        <span className="text-gray-500">{label}</span>
        <span className="font-medium text-gray-800 text-left sm:text-right">
            {value || 'N/A'}
        </span>
    </div>
);

// --- Main Estimate Preview Component ---
const EstimatePreview = React.forwardRef<HTMLDivElement, EstimateProps>(
    ({ data, onExportPdf, onConvertToOrder, isPrinting, isConverting, permissions }, ref) => {

        // Global Discount Calculation
        const globalDiscountPercentage = data.discount || 0;
        const globalDiscountAmount = (data.subtotal * globalDiscountPercentage) / 100;

        return (
            <div
                ref={ref}
                className="w-full bg-white md:rounded-xl md:shadow-xl p-6 md:p-10"
            >
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between md:items-start pb-4 border-b border-gray-200">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            {data.estimateNumber}
                        </h1>
                        <div className="mt-3">
                            <StatusBadge status={data.status || 'Pending'} />
                        </div>
                    </div>

                    {/* Action Buttons Row */}
                    <div className="flex flex-col md:flex-row items-center gap-3 mt-4 md:mt-0">
                        {/* Convert to Order Button */}
                        {permissions?.canConvertToOrder && (
                            <Button
                                variant="primary"
                                onClick={onConvertToOrder}
                                disabled={isConverting}
                                className="!py-2 !px-4 flex items-center justify-center w-full md:w-auto bg-green-600 hover:bg-green-700 border-none shadow-sm"
                            >
                                {isConverting ? (
                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                ) : (
                                    <DocumentCheckIcon className="w-5 h-5 mr-2" />
                                )}
                                <span className="font-bold">Convert to Order</span>
                            </Button>
                        )}

                        {/* Download Button */}
                        {permissions?.canExportPdf && (
                            <Button
                                variant="secondary"
                                onClick={onExportPdf}
                                disabled={isPrinting}
                                className="!py-2 !px-3 flex items-center justify-center w-full md:w-auto shadow-sm"
                            >
                                {isPrinting ? (
                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                ) : (
                                    <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
                                )}
                                <span className="font-bold">Download Estimate</span>
                            </Button>
                        )}
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 my-8">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                        <div className="flex items-center gap-3 mb-4">
                            <BuildingOfficeIcon className="w-6 h-6 text-blue-600" />
                            <h3 className="text-lg font-semibold text-gray-800">Organization Details</h3>
                        </div>
                        <div className="space-y-2">
                            <InfoField label="Name" value={data.organizationName} />
                            <InfoField label="Phone" value={data.organizationPhone} />
                            <InfoField label="Address" value={data.organizationAddress} />
                            <InfoField label="PAN/VAT" value={data.organizationPanVatNumber} />
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                        <div className="flex items-center gap-3 mb-4">
                            <UserGroupIcon className="w-6 h-6 text-blue-600" />
                            <h3 className="text-lg font-semibold text-gray-800">Party Details</h3>
                        </div>
                        <div className="space-y-2">
                            <InfoField label="Party Name" value={data.partyName} />
                            <InfoField label="Owner Name" value={data.partyOwnerName} />
                            <InfoField label="Address" value={data.partyAddress} />
                            <InfoField label="PAN/VAT" value={data.partyPanVatNumber} />
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <div className="my-8">
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-orange-600 text-white">
                                <tr>
                                    <th className="py-3.5 pl-4 pr-3 text-center text-sm font-semibold border-r border-white">SN</th>
                                    <th className="px-3 py-3.5 text-center text-sm font-semibold border-r border-white">Item Description</th>
                                    <th className="px-3 py-3.5 text-center text-sm font-semibold border-r border-white">Quantity</th>
                                    <th className="px-3 py-3.5 text-center text-sm font-semibold border-r border-white">Unit Price</th>
                                    <th className="px-3 py-3.5 text-center text-sm font-semibold border-r border-white">Discount</th>
                                    <th className="relative py-3.5 pl-3 pr-4 text-center text-sm font-semibold sm:pr-6">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {data.items && data.items.map((item: any, index: number) => (
                                    <tr key={item.productId || index}>
                                        <td className="whitespace-nowrap py-4 text-sm text-center font-medium text-gray-900 border-r border-gray-200">{index + 1}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-center text-gray-700 border-r border-gray-200">{item.productName}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-center text-gray-700 border-r border-gray-200">{item.quantity}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-center text-gray-700 border-r border-gray-200">RS. {formatCurrency(item.price)}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-center text-gray-700 border-r border-gray-200 font-medium">
                                            {item.discount && item.discount > 0 ? `${item.discount}%` : '-'}
                                        </td>
                                        <td className="whitespace-nowrap py-4 text-center text-sm font-medium text-gray-900">RS. {formatCurrency(item.total)}</td>
                                    </tr>
                                ))}
                                {(!data.items || data.items.length === 0) && (
                                    <tr>
                                        <td colSpan={6} className="text-center p-5 text-gray-500">No items found in this estimate.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pricing & Creation Footer */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    {/* Column 1: Creation Details */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                        <div className="flex items-center gap-3 mb-4">
                            <UserIcon className="w-6 h-6 text-blue-600" />
                            <h3 className="text-lg font-semibold text-gray-800">Creation Details</h3>
                        </div>
                        <div className="space-y-2">
                            <InfoField label="Created By" value={data.createdBy?.name} />
                            <InfoField label="Created On" value={formatDateTime(data.createdAt)} />
                        </div>
                    </div>


                    {/* Column 3: Summary Pricing */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                        <div className="flex items-center gap-3 mb-4">
                            <CurrencyRupeeIcon className="w-6 h-6 text-blue-600" />
                            <h3 className="text-lg font-semibold text-gray-800">Pricing Summary</h3>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-700">Subtotal</span>
                                <span className="font-semibold text-gray-900">RS. {formatCurrency(data.subtotal)}</span>
                            </div>
                            {globalDiscountPercentage > 0 && (
                                <div className="flex justify-between items-center text-red-600">
                                    <span>Discount ({globalDiscountPercentage}%)</span>
                                    <span className="font-semibold">- RS. {formatCurrency(globalDiscountAmount)}</span>
                                </div>
                            )}
                            <div className="border-t border-gray-300 pt-4 flex justify-between items-center">
                                <span className="text-lg font-bold text-[#197ADC]">TOTAL</span>
                                <span className="text-lg font-bold text-[#197ADC]">RS. {formatCurrency(data.totalAmount)}</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
);

export default EstimatePreview;