import React from 'react';
import { Link } from 'react-router-dom';
import { type Order } from '../../../../api/orderService';
import { StatusBadge } from './OrderListTable';

interface OrderListMobileProps {
    orders: Order[];
    onStatusClick: (order: Order) => void;
}

const OrderListMobile: React.FC<OrderListMobileProps> = ({ orders, onStatusClick }) => {
    return (
        <div className="md:hidden space-y-4 px-1">
            {orders.map((order: Order) => (
                <div key={order.id || order._id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-3">
                    <div className="flex justify-between items-start">
                        <div>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Invoice Number</span>
                            <span className="text-sm font-bold text-gray-900">{order.invoiceNumber}</span>
                        </div>
                        <StatusBadge status={order.status} onClick={() => onStatusClick(order)} />
                    </div>
                    <div className="grid grid-cols-2 gap-y-3">
                        <div className="col-span-2">
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Party Name</span>
                            <span className="text-sm text-gray-800 font-medium">{order.partyName}</span>
                        </div>
                        <div>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Created By</span>
                            <span className="text-xs text-gray-600">{order.createdBy?.name || '-'}</span>
                        </div>
                        <div>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Delivery Date</span>
                            <span className="text-xs text-gray-600">{order.expectedDeliveryDate ? new Date(order.expectedDeliveryDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '-'}</span>
                        </div>
                        <div>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Total Amount</span>
                            <span className="text-sm font-bold text-secondary">RS {order.totalAmount}</span>
                        </div>
                        <div className="flex items-end justify-end">
                            <Link to={`/order/${order.id || order._id}`} className="text-blue-500 text-xs font-bold hover:underline">View Details →</Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

OrderListMobile.displayName = 'OrderListMobile';

export default OrderListMobile;
