import React from 'react';
import { useOrdersLogic } from './useOrdersLogic';

const OrdersTab: React.FC = () => {
    const { } = useOrdersLogic();

    return (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-lg shadow-sm border border-gray-100 h-96">
            <div className="p-4 bg-blue-50 rounded-full mb-4">
                <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Order History</h3>
            <p className="text-gray-500 text-center max-w-sm">
                No orders found for this employee. Once orders are placed, they will appear here.
            </p>
        </div>
    );
};

export default OrdersTab;
