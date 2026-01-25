import React from 'react';
import { Link } from 'react-router-dom';
import type { Order } from '../../types';
import { formatDisplayDate } from '../../../../../utils/dateUtils';

interface PartyOrdersMobileListProps {
    orders: Order[];
    partyId: string;
}

import { StatusBadge } from '../../../../../components/UI/statusBadge/statusBadge';

export const PartyOrdersMobileList: React.FC<PartyOrdersMobileListProps> = ({ orders, partyId }) => {
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
                                {order.expectedDeliveryDate ? formatDisplayDate(order.expectedDeliveryDate) : 'N/A'}
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
                            state={{ from: 'party-details', partyId: partyId }}
                            className="block w-full text-center py-2 text-sm font-medium text-secondary bg-secondary/5 rounded-lg hover:bg-secondary/10 transition-colors"
                        >
                            View Details
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    );
};
