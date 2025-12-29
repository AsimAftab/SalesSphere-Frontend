import React, { useState, useEffect, useRef } from 'react';
import Button from '../UI/Button/Button';
import { type OrderStatus } from '../../api/orderService';
import { Loader2, Check } from 'lucide-react';

interface OrderStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newStatus: OrderStatus) => void;
  currentStatus: OrderStatus;
  orderId: string;
  isSaving?: boolean;
}

const availableStatuses: OrderStatus[] = ['pending', 'in progress', 'in transit', 'completed', 'rejected'];

const statusStyles: Record<OrderStatus, { text: string; bg: string; activeBorder: string }> = {
  'pending': { text: 'text-blue-600', bg: 'bg-blue-50', activeBorder: 'border-blue-400' },
  'in progress': { text: 'text-violet-600', bg: 'bg-violet-50', activeBorder: 'border-violet-400' },
  'in transit': { text: 'text-orange-600', bg: 'bg-orange-50', activeBorder: 'border-orange-400' },
  'completed': { text: 'text-green-600', bg: 'bg-green-50', activeBorder: 'border-green-400' },
  'rejected': { text: 'text-red-600', bg: 'bg-red-50', activeBorder: 'border-red-400' },
};

const OrderStatusModal: React.FC<OrderStatusModalProps> = ({ 
    isOpen, 
    onClose, 
    onSave, 
    currentStatus, 
    orderId, 
    isSaving 
}) => {
  const [tempStatus, setTempStatus] = useState<OrderStatus>(currentStatus);
  // 1. Create a ref for the modal card
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) setTempStatus(currentStatus);
  }, [isOpen, currentStatus]);

  // 2. Add Event Listener to detect clicks outside modalRef
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node) && !isSaving) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, onClose, isSaving]);

  if (!isOpen) return null;

  const handleConfirmSave = () => {
    onSave(tempStatus);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      {/* 3. Attach the ref to the inner card */}
      <div 
        ref={modalRef} 
        className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">Update Order Status</h3>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">
            Order ID: <span className="text-gray-900">{orderId}</span>
          </p>
        </div>

        {/* Status Selection List */}
        <div className="p-4 space-y-2">
          {availableStatuses.map(status => {
            const styles = statusStyles[status];
            const isSelected = tempStatus === status;
            const isCurrentlyInDb = status === currentStatus;

            return (
              <button
                key={status}
                type="button"
                onClick={() => setTempStatus(status)}
                disabled={isSaving}
                className={`
                  w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all duration-200
                  ${isSelected ? `${styles.activeBorder} ${styles.bg}` : 'border-gray-100 hover:border-gray-200 bg-white'}
                  ${isSaving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${styles.text.replace('text', 'bg')}`} />
                  <span className={`text-sm font-bold uppercase tracking-tight ${isSelected ? styles.text : 'text-gray-600'}`}>
                    {status}
                  </span>
                  {isCurrentlyInDb && (
                    <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-bold">CURRENT</span>
                  )}
                </div>
                {isSelected && <Check size={16} className={styles.text} strokeWidth={3} />}
              </button>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-gray-100 flex items-center justify-end gap-3 border-t border-gray-100">
          <Button
            variant="ghost"
            onClick={onClose}
            className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmSave} 
            disabled={isSaving || tempStatus === currentStatus}
            className="text-xs font-bold tracking-widest px-6 min-w-[140px] flex justify-center"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderStatusModal;