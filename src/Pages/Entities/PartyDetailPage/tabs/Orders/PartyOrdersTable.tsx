import React from 'react';
import { Link } from 'react-router-dom';
import { type Order } from '../../types';
import { StatusBadge } from '../../../../../components/ui/StatusBadge/StatusBadge';

interface PartyOrdersTableProps {
    orders: Order[];
    startIndex?: number;
    partyId: string;
}

const PartyOrdersTable: React.FC<PartyOrdersTableProps> = ({ orders, startIndex = 0, partyId }) => {

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-CA');
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
                        {orders.map((order, index) => (
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
                                        state={{ from: 'party-details', partyId: partyId }}
                                        className="text-secondary hover:underline font-semibold"
                                    >
                                        Order Details
                                    </Link>
                                </td>
                                <td className="px-5 py-3 whitespace-nowrap">
                                    <StatusBadge status={order.status} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PartyOrdersTable;
