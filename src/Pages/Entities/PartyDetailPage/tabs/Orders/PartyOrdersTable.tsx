import React from 'react';
import { Link } from 'react-router-dom';
import { type Order } from '../../types'; // Using strict type from ./types.ts

interface PartyOrdersTableProps {
    orders: Order[];
    startIndex?: number;
}

// Status Badge Component (Matches EmployeeOrdersTable logic)
const StatusBadge = ({ status }: { status: string }) => {
    const statusConfig: Record<string, string> = {
        completed: 'bg-green-100 text-green-700 border-green-200',
        rejected: 'bg-red-100 text-red-700 border-red-200',
        'in transit': 'bg-orange-100 text-orange-700 border-orange-200',
        'in progress': 'bg-purple-100 text-purple-700 border-purple-200',
        pending: 'bg-blue-100 text-blue-700 border-blue-200',
        cancelled: 'bg-red-100 text-red-700 border-red-200',
    };

    const className = statusConfig[status.toLowerCase()] || 'bg-gray-100 text-gray-700 border-gray-200';

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold uppercase rounded-xl border shadow-sm ${className}`}>
            {status}
        </span>
    );
};

const PartyOrdersTable: React.FC<PartyOrdersTableProps> = ({ orders, startIndex = 0 }) => {

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
            });
        } catch {
            return dateString;
        }
    };

    return (
        <div className="hidden md:block lg:col-span-3 bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-secondary text-white text-sm">
                        <tr>
                            <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">S.NO.</th>
                            <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Invoice Number</th>
                            <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Expected Delivery Date</th>
                            <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Total Amount</th>
                            <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">View Details</th>
                            <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {orders.length > 0 ? (
                            orders.map((order, index) => (
                                <tr key={order.id} className="hover:bg-gray-100 transition-colors">
                                    <td className="px-5 py-3 whitespace-nowrap text-black font-medium">
                                        {startIndex + index + 1}
                                    </td>
                                    <td className="px-5 py-3 whitespace-nowrap text-black">
                                        {order.invoiceNumber}
                                    </td>
                                    <td className="px-5 py-3 whitespace-nowrap text-black">
                                        {formatDate(order.expectedDeliveryDate)}
                                    </td>
                                    <td className="px-5 py-3 whitespace-nowrap text-black">
                                        RS {order.totalAmount.toLocaleString('en-IN')}
                                    </td>
                                    <td className="px-5 py-3 whitespace-nowrap text-black">
                                        <Link
                                            to={`/order/${order.id || order._id}`}
                                            className="text-secondary hover:underline font-semibold"
                                        >
                                            Order Details
                                        </Link>
                                    </td>
                                    <td className="px-5 py-3 whitespace-nowrap">
                                        <StatusBadge status={order.status} />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="text-center py-10 text-gray-500 italic">
                                    No orders found for this party.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PartyOrdersTable;
