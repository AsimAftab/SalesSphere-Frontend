import React from 'react';
import { Link } from 'react-router-dom';
import { type Order } from '../../../../api/orderService';

interface OrderListTableProps {
    orders: Order[];
    startIndex: number;
    onStatusClick: (order: Order) => void;
    canUpdateStatus?: boolean;
}

import { StatusBadge } from '../../../../components/UI/statusBadge';

const OrderListTable: React.FC<OrderListTableProps> = ({ orders, startIndex, onStatusClick, canUpdateStatus = true }) => {
    return (
        <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead className="bg-secondary text-white text-sm">
                        <tr>
                            <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">S.NO.</th>
                            <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Invoice Number</th>
                            <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Party Name</th>
                            <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Created By</th>
                            <th className="px-5 py-4 text-left font-semibold whitespace-nowrap">Delivery Date</th>
                            <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Total Amount</th>
                            <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Details</th>
                            <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {orders.map((order: Order, index: number) => (
                            <tr key={order.id || order._id} className="hover:bg-gray-200 transition-colors">
                                <td className="px-5 py-3 text-black text-sm">{startIndex + index + 1}</td>
                                <td className="px-5 py-3 text-black text-sm">{order.invoiceNumber}</td>
                                <td className="px-5 py-3 text-black text-sm">{order.partyName}</td>
                                <td className="px-5 py-3 text-black text-sm">{order.createdBy?.name || '-'}</td>
                                <td className="px-5 py-3 text-black text-sm">{order.expectedDeliveryDate ? new Date(order.expectedDeliveryDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}</td>
                                <td className="px-5 py-3 text-black text-sm">RS {order.totalAmount}</td>
                                <td className="px-5 py-4 text-sm"><Link to={`/order/${order.id || order._id}`} className="text-blue-500 hover:underline font-semibold">View Details</Link></td>
                                <td className="px-5 py-4"><StatusBadge status={order.status} onClick={() => onStatusClick(order)} disabled={!canUpdateStatus} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

OrderListTable.displayName = 'OrderListTable';

export default OrderListTable;
