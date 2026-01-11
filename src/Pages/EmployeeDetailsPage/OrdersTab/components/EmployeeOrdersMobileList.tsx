import React from 'react';
import { Link } from 'react-router-dom';
import { type Order, type OrderStatus } from '../../../../api/orderService';

interface EmployeeOrdersMobileListProps {
    orders: Order[];
    onStatusClick: (order: Order) => void;
    canUpdateStatus?: boolean;
    employeeName?: string;
}

// Status Badge Component (Reused/Inlined or could be shared)
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
            className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold uppercase rounded-xl border shadow-sm transition-all duration-200 ${disabled ? 'cursor-default' : 'active:scale-95'} ${config.bg} ${config.text} ${config.border}`}
        >
            {status}
        </button>
    );
};

const EmployeeOrdersMobileList: React.FC<EmployeeOrdersMobileListProps> = ({ orders, onStatusClick, canUpdateStatus = true, employeeName }) => {
    return (
        <div className="md:hidden space-y-4 px-1">
            {orders.map((order) => (
                <div key={order.id || order._id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-3">
                    <div className="flex justify-between items-start">
                        <div>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Invoice Number</span>
                            <span className="text-sm font-bold text-gray-900">{order.invoiceNumber}</span>
                        </div>
                        <StatusBadge status={order.status} onClick={() => onStatusClick(order)} disabled={!canUpdateStatus} />
                    </div>
                    <div className="grid grid-cols-2 gap-y-3">
                        <div className="col-span-2">
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Party Name</span>
                            <div className="text-sm text-gray-800 font-medium truncate">{order.partyName}</div>
                        </div>
                        <div>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Delivery Date</span>
                            <div className="text-xs text-gray-600">
                                {order.expectedDeliveryDate
                                    ? new Date(order.expectedDeliveryDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
                                    : '-'}
                            </div>
                        </div>
                        <div>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Total Amount</span>
                            <div className="text-sm font-bold text-secondary">RS {order.totalAmount}</div>
                        </div>
                        <div className="flex items-end justify-end col-span-2 border-t border-gray-50 pt-3 mt-1">
                            <Link
                                to={`/order/${order.id || order._id}`}
                                state={{
                                    from: 'employee-orders',
                                    employeeId: order.createdBy?._id || order.createdBy?.id,
                                    employeeName: employeeName
                                }}
                                className="text-blue-500 text-xs font-bold hover:underline flex items-center gap-1"
                            >
                                View Details →
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default EmployeeOrdersMobileList;
