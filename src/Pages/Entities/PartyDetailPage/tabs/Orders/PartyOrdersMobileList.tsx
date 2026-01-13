import React from 'react';
import { Link } from 'react-router-dom';
import type { Order } from '../../types';

interface PartyOrdersMobileListProps {
    orders: Order[];
}

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

export const PartyOrdersMobileList: React.FC<PartyOrdersMobileListProps> = ({ orders }) => {
    return (
        <div className="md:hidden space-y-4">
            {orders.map((order) => (
                <div key={order.id || order._id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 space-y-3">
                    <div className="flex justify-between items-start">
                        <div>
                            <span className="text-xs text-gray-500 block mb-1">Invoice</span>
                            <span className="font-medium text-gray-900">{order.invoiceNumber}</span>
                        </div>
                        <StatusBadge status={order.status} />
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                            <span className="text-gray-500 text-xs block">Delivery</span>
                            <span className="text-gray-700">
                                {order.expectedDeliveryDate ? new Date(order.expectedDeliveryDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                            </span>
                        </div>
                        <div>
                            <span className="text-gray-500 text-xs block">Amount</span>
                            <span className="text-gray-900 font-semibold">RS {order.totalAmount.toLocaleString('en-IN')}</span>
                        </div>
                    </div>

                    <div className="pt-2 border-t border-gray-50">
                        <Link
                            to={`/order/${order.id || order._id}`}
                            className="block w-full text-center py-2 text-sm font-medium text-secondary bg-secondary/5 rounded-lg hover:bg-secondary/10 transition-colors"
                        >
                            View Details
                        </Link>
                    </div>
                </div>
            ))}
            {orders.length === 0 && (
                <div className="text-center py-8 text-gray-500 italic bg-gray-50 rounded-lg">
                    No orders found
                </div>
            )}
        </div>
    );
};
