import React from 'react';
import Button from '../UI/Button/Button';
import { type OrderStatus } from '../../api/services/sales/orderService';

interface OrderStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newStatus: OrderStatus) => void;
  currentStatus: OrderStatus;
  orderId: string;
}

const availableStatuses: OrderStatus[] = ['In Progress', 'In Transit', 'Completed', 'Rejected'];

// Style map for Tailwind CSS classes
const statusStyles: Record<OrderStatus, { text: string; bg: string; ring: string }> = {
    'In Progress': { text: 'text-blue-600', bg: 'hover:bg-blue-50', ring: 'focus:ring-blue-400' },
    'In Transit': { text: 'text-yellow-600', bg: 'hover:bg-yellow-50', ring: 'focus:ring-yellow-400' },
    'Completed': { text: 'text-green-600', bg: 'hover:bg-green-50', ring: 'focus:ring-green-400' },
    'Rejected': { text: 'text-red-600', bg: 'hover:bg-red-50', ring: 'focus:ring-red-400' },
};

const OrderStatusModal: React.FC<OrderStatusModalProps> = ({ isOpen, onClose, onSave, currentStatus, orderId }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm">
        <div className="p-6 border-b">
          <h3 className="text-lg font-bold text-gray-800">Update Order Status</h3>
          <p className="text-sm text-gray-600 mt-1">
            Order ID: <span className="font-semibold">{orderId}</span>
          </p>
        </div>
        <div className="p-6 space-y-3">
          {availableStatuses.map(status => {
            const styles = statusStyles[status];
            const isCurrent = status === currentStatus;
            return (
              <button
                key={status}
                onClick={() => onSave(status)}
                className={`w-full text-left p-3 rounded-lg border-2 transition-colors duration-200 focus:outline-none focus:ring-2 ${styles.ring} ${isCurrent ? 'border-primary' : `border-transparent ${styles.bg}`}`}
              >
                <span className={`font-semibold ${styles.text}`}>{status}</span>
                {isCurrent && <span className="text-xs text-gray-500 ml-2">(Current)</span>}
              </button>
            );
          })}
        </div>
        <div className="p-4 bg-gray-50 text-right rounded-b-lg">
          <Button onClick={onClose} variant="secondary">Cancel</Button>
        </div>
      </div>
    </div>
  );
};

export default OrderStatusModal;
