import React from 'react';
import Button from '../UI/Button/Button';

interface ConfirmationModalProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm mx-4">
        <h2 className="text-lg font-semibold text-gray-600 mb-4">Confirm Deletion</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-4 ">
          <Button variant="secondary"  onClick={onCancel}>Cancel</Button>
          <Button
          variant="secondary"  
          onClick={onConfirm}
           className="hover:bg-red-600 hover:border-red-600 hover:text-white focus:bg-secondary focus:ring-secondary"
          >Delete</Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
