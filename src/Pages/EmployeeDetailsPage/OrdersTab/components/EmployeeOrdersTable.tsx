import React from 'react';
import { Link } from 'react-router-dom';
import { type Order, type OrderStatus } from '../../../../api/orderService';

interface EmployeeOrdersTableProps {
    orders: Order[];
    startIndex: number;
    onStatusClick: (order: Order) => void;
    canUpdateStatus?: boolean;
    employeeName?: string;
}

// Status Badge Component
const StatusBadge = ({ status, onClick, disabled }: { status: OrderStatus; onClick: () => void; disabled?: boolean }) => {
    const statusConfig: Record<string, { bg: string; text: string; border: string }> = {
        completed: { bg: "bg-green-100", text: "text-green-700", border: "border-green-200" },
        rejected: { bg: "bg-red-100", text: "text-red-700", border: "border-red-200" },
        'in transit': { bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-200" },
        'in progress': { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-200" },
        pending: { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200" },
    };

    const config = statusConfig[status.toLowerCase()] || { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-200" };

    return (
        <button
            onClick={disabled ? undefined : onClick}
            disabled={disabled}
            className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold uppercase rounded-xl border shadow-sm transition-all duration-200 ${disabled ? 'cursor-default' : 'hover:scale-105 active:scale-95'} ${config.bg} ${config.text} ${config.border}`}
        >
            {status}
        </button>
    );
};

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
