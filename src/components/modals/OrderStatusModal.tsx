import React, { useState } from 'react';
import Button from '../UI/Button/Button';
import { type OrderStatus } from '../../api/orderService';
import { Loader2 } from 'lucide-react';

interface OrderStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newStatus: OrderStatus) => void;
  currentStatus: OrderStatus;
  orderId: string;
  isSaving?: boolean; // <-- FIX: Added this prop
}

// --- FIX: Updated to match API types ---
const availableStatuses: OrderStatus[] = ['pending', 'in progress', 'in transit', 'completed', 'rejected'];

// --- FIX: Updated to match API types ---
const statusStyles: Record<OrderStatus, { text: string; bg: string; ring: string }> = {
    'pending': { text: 'text-blue-600', bg: 'hover:bg-blue-50', ring: 'focus:ring-blue-400' },
    'in progress': { text: 'text-violet-600', bg: 'hover:bg-violet-50', ring: 'focus:ring-violet-400' },
    'in transit': { text: 'text-orange-600', bg: 'hover:bg-orange-50', ring: 'focus:ring-orange-400' },
    'completed': { text: 'text-green-600', bg: 'hover:bg-green-50', ring: 'focus:ring-green-400' },
    'rejected': { text: 'text-red-600', bg: 'hover:bg-red-50', ring: 'focus:ring-red-400' },
};

const OrderStatusModal: React.FC<OrderStatusModalProps> = ({ 
    isOpen, 
    onClose, 
    onSave, 
    currentStatus, 
    orderId, 
    isSaving 
}) => {
  // This state tracks which button was clicked
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>(null);

  if (!isOpen) return null;

  const handleSaveClick = (status: OrderStatus) => {
    setSelectedStatus(status); // Set which button was clicked
    onSave(status);
  }

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
            // --- FIX: Show spinner on the *selected* button ---
            const isSavingThisStatus = isSaving && selectedStatus === status;
            return (
              <button
                key={status}
                onClick={() => handleSaveClick(status)}
                disabled={isSaving} // Disable all buttons while saving
                className={`w-full text-left p-3 rounded-lg border-2 transition-colors duration-200 focus:outline-none focus:ring-2 ${styles.ring} ${isCurrent ? 'border-primary' : `border-transparent ${styles.bg}`} disabled:opacity-50 disabled:cursor-wait`}
              >
                <div className="flex justify-between items-center">
                    <span className={`font-semibold ${styles.text}`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                    {isCurrent && <span className="text-xs text-gray-500 ml-2">(Current)</span>}
                    {isSavingThisStatus && <Loader2 className="h-4 w-4 animate-spin" />}
                </div>
              </button>
            );
          })}
        </div>
        <div className="p-4 bg-gray-50 text-right rounded-b-lg">
          <Button onClick={onClose} variant="secondary" disabled={isSaving}>Cancel</Button>
        </div>
      </div>
    </div>
  );
};

export default OrderStatusModal;