import React from 'react';
import {
  UserGroupIcon,
  CurrencyRupeeIcon,
  BuildingOfficeIcon,
  UserIcon,
  TruckIcon
} from '@heroicons/react/24/outline';
import ExportActions from '../../../../components/UI/Export/ExportActions';
import { StatusBadge } from '../../../../components/UI/statusBadge/statusBadge';
import { type InvoiceData } from '../../../../api/orderService';
import { formatDisplayDate, formatDisplayDateTime } from '../../../../utils/dateUtils';

// --- Props ---
interface InvoiceProps {
  data: InvoiceData;
  onExportPdf: () => void;
  isPrinting: boolean;
  permissions?: {
    canExportPdf: boolean;
  };
}

// --- Helper Functions ---
const formatDeliveryDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  const day = date.toLocaleDateString('en-US', { weekday: 'long' });
  return `${day}, ${formatDisplayDate(dateString)}`;
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

// --- InfoField Helper ---
const InfoField: React.FC<{ label: string; value: string | undefined; }> = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-xs text-gray-400 uppercase tracking-wider">{label}</span>
    <span className="font-medium text-gray-800 mt-0.5">{value || 'N/A'}</span>
  </div>
);

// --- Main Invoice Preview Component ---
const InvoicePreview = React.forwardRef<HTMLDivElement, InvoiceProps>(
  ({ data, onExportPdf,permissions }, ref) => {

    // Global Discount Calculation for the Summary
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
              {data.invoiceNumber}
            </h1>
            <div className="mt-3">
              <StatusBadge status={data.status || 'Pending'} />
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mt-4 md:mt-0">
            {permissions?.canExportPdf && (
              <ExportActions onExportPdf={onExportPdf} />
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
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
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
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
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
              <thead className="bg-[#197ADC] text-white">
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
                {data.items && data.items.map((item, index) => (
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
                    <td colSpan={6} className="text-center p-5 text-gray-500">No items found in this invoice.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pricing & Creation Footer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {/* Column 1: Creation Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-4">
              <UserIcon className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-800">Creation Details</h3>
            </div>
            <div className="space-y-2">
              <InfoField label="Created By" value={data.createdBy?.name} />
              <InfoField label="Created On" value={formatDisplayDateTime(data.createdAt)} />
            </div>
          </div>

          {/* Column 2: Delivery Details */}
          <div className="bg-yellow-50 border border-yellow-500 rounded-lg p-5">
            <div className="flex items-center gap-3 mb-4">
              <TruckIcon className="w-6 h-6 text-yellow-600" />
              <h3 className="text-lg font-semibold text-gray-800">Delivery Details</h3>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Expected Delivery Date</p>
              <p className="text-lg font-bold text-yellow-700">
                {formatDeliveryDate(data.expectedDeliveryDate)}
              </p>
            </div>
          </div>

          {/* Column 3: Summary Pricing */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-4">
              <CurrencyRupeeIcon className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-800">Pricing</h3>
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

export default InvoicePreview;