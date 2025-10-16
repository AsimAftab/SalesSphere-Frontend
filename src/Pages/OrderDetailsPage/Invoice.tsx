import React from 'react';
import { DocumentIcon } from '@heroicons/react/24/solid';
import { type InvoiceData } from './OrderDetailsPage';
interface InvoiceProps {
  orderId?: string;
  data: InvoiceData;
  showTotal: boolean; // <-- ADD THIS NEW PROP
}

const Invoice = React.forwardRef<HTMLDivElement, InvoiceProps>(
  ({ orderId = '2024-05324', data, showTotal }, ref) => {
    
    const totalAmount = data.items.reduce((sum, item) => sum + (item.qty * item.rate), 0);
    
    return (
        <div ref={ref} className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8">
            {/* Header (no change) */}
            <header className="flex justify-between items-start pb-6 mb-6 border-b">
                <div className="flex items-center">
                    <div className="bg-blue-600 text-white p-4 rounded-lg mr-4">
                        <DocumentIcon className="h-8 w-8" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Order Details</h1>
                        <p className="text-sm text-gray-500">ORDER-{orderId}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-sm font-semibold text-gray-600">Issue Date</p>
                    <p className="text-sm text-gray-800">{data.issueDate}</p>
                </div>
            </header>
            
            {/* From & To (no change) */}
            <section className="grid grid-cols-2 gap-8 mb-8">
                <div className="break-words">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">From</h3>
                    <p className="font-bold text-gray-800">{data.from.name}</p>
                    <p className="text-sm text-gray-600">{data.from.address}</p>
                    <p className="text-sm text-gray-600">{data.from.phone}</p>
                    <p className="text-sm text-gray-600">{data.from.email}</p>
                    <p className="text-sm text-gray-600">Tax ID: {data.from.taxId}</p>
                </div>
                <div className="break-words">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Bill To</h3>
                    <p className="font-bold text-gray-800">{data.to.name}</p>
                    <p className="text-sm text-gray-600">{data.to.address}</p>
                    <p className="text-sm text-gray-600">{data.to.phone}</p>
                    <p className="text-sm text-gray-600">{data.to.email}</p>
                </div>
            </section>
            
            {/* Items Table (no change) */}
            <section>
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="p-3 text-sm font-semibold text-gray-600">Description</th>
                            <th className="p-3 text-sm font-semibold text-gray-600 text-center">Qty</th>
                            <th className="p-3 text-sm font-semibold text-gray-600 text-right">Rate</th>
                            <th className="p-3 text-sm font-semibold text-gray-600 text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.items.map((item, index) => (
                            <tr key={index} className="border-b">
                                <td className="p-3">
                                    <p className="font-medium text-gray-800">{item.desc}</p>
                                    <p className="text-xs text-gray-500">{item.detail}</p>
                                </td>
                                <td className="p-3 text-center">{item.qty}</td>
                                <td className="p-3 text-right">${item.rate.toFixed(2)}</td>
                                <td className="p-3 text-right font-medium">${(item.qty * item.rate).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
            
            {/* --- WRAP TOTAL AND FOOTER IN THE 'showTotal' CONDITION --- */}
            {showTotal && (
                <>
                    {/* Total */}
                    <section className="flex justify-end mt-6">
                        <div className="w-full max-w-xs">
                            <div className="flex justify-between py-2 border-b">
                                <span className="font-semibold text-gray-700">Total Amount:</span>
                                <span className="font-bold text-gray-800">${totalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    </section>
                    
                    {/* Footer */}
                    <footer className="text-center mt-12">
                        <p className="font-semibold text-gray-800">Thank you for your business!</p>
                        <p className="text-sm text-gray-500">We appreciate your trust in Digital Solutions Inc.</p>
                    </footer>
                </>
            )}
        </div>
    );
  }
);

export default Invoice;