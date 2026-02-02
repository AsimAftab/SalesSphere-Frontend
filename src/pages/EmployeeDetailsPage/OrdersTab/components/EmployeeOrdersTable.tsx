import React from 'react';
import { Link } from 'react-router-dom';
import { type Order } from '@/api/orderService';
import { StatusBadge } from '@/components/ui';

interface EmployeeOrdersTableProps {
    orders: Order[];
    startIndex: number;
    onStatusClick: (order: Order) => void;
    canUpdateStatus?: boolean;
    employeeName?: string;
}


const EmployeeOrdersTable: React.FC<EmployeeOrdersTableProps> = ({ orders, startIndex, onStatusClick, canUpdateStatus = true, employeeName }) => {
    return (
        <div className="hidden md:block bg-white rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead className="bg-secondary text-white text-sm">
                        <tr>
                            <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">S.NO.</th>
                            <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Invoice Number</th>
                            <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Party Name</th>
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
                                <td className="px-5 py-3 text-black text-sm">{order.expectedDeliveryDate ? new Date(order.expectedDeliveryDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}</td>
                                <td className="px-5 py-3 text-black text-sm">RS {order.totalAmount}</td>
                                <td className="px-5 py-4 text-sm">
                                    <Link
                                        to={`/order/${order.id || order._id}`}
                                        state={{
                                            from: 'employee-orders',
                                            employeeId: order.createdBy?._id || order.createdBy?.id,
                                            employeeName: employeeName
                                        }}
                                        className="text-blue-500 hover:underline font-semibold"
                                    >
                                        View Details
                                    </Link>
                                </td>
                                <td className="px-5 py-4"><StatusBadge status={order.status} onClick={() => onStatusClick(order)} disabled={!canUpdateStatus} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EmployeeOrdersTable;
