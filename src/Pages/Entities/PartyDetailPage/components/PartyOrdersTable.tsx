import React from 'react';
import { Link } from 'react-router-dom';
import { type Order } from '../PartyDetailsContent';

interface PartyOrdersTableProps {
  orders: Order[];
}

/**
 * StatusBadge: Restored to original styling with specific border and text weights
 */
const StatusBadge: React.FC<{ status: string; color: string }> = ({ status, color }) => {
  const colorClasses: Record<string, string> = {
    green: 'bg-green-100 text-green-800 border-green-300',
    red: 'bg-red-100 text-red-800 border-red-300',
    orange: 'bg-orange-100 text-orange-800 border-orange-300',
    blue: 'bg-blue-100 text-blue-800 border-blue-300',
    violet: 'bg-violet-100 text-violet-800 border-violet-300',
    gray: 'bg-gray-100 text-gray-800 border-gray-300',
  };

  return (
    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${colorClasses[color] || colorClasses.gray}`}>
      {status}
    </span>
  );
};

const PartyOrdersTable: React.FC<PartyOrdersTableProps> = ({ orders }) => {
  
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="lg:col-span-3 bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          {/* ✅ RESTORED: Deep blue header from original UI */}
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
                    {index + 1}
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap text-black">
                    {order.invoiceNumber}
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap text-black">
                    {formatDate(order.expectedDeliveryDate)}
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap text-black">
                    {order.totalAmount}
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap text-black">
                    {/* ✅ RESTORED: "Order Details" text and styling */}
                    <Link
                      to={`/order/${order.id || order._id}`}
                      className="text-secondary hover:underline font-semibold"
                    >
                      Order Details
                    </Link>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    <StatusBadge status={order.status} color={order.statusColor} />
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