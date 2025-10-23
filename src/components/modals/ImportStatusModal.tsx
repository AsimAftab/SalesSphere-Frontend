import React from 'react';
// FIX: Reverted to the correct import path based on your other files
import Button from '../UI/Button/Button';

interface ImportStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: 'processing' | 'success' | 'error';
  message: string;
}

const ImportStatusModal: React.FC<ImportStatusModalProps> = ({ isOpen, onClose, status, message }) => {
  if (!isOpen) return null;

  const statusInfo = {
    processing: { title: 'Processing Import...', color: 'blue' },
    success: { title: 'Import Successful', color: 'green' },
    error: { title: 'Import Failed', color: 'red' },
  };

  const { title} = statusInfo[status];

  const colorClasses: Record<typeof status, string> = {
    processing: 'text-blue-600',
    success: 'text-green-600',
    error: 'text-red-600',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm text-center">
        <h3 className={`text-lg font-bold ${colorClasses[status]}`}>{title}</h3>
        <p className="text-sm text-gray-600 mt-4 whitespace-pre-wrap">{message}</p>
        
        {/* FIX: Added 'flex justify-center' to this div.
          The 'justify-center' prop you had before was not a valid HTML attribute.
        */}
        <div className="mt-6 flex justify-center">
          <Button onClick={onClose} variant={status === 'success' ? 'primary' : 'secondary'}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImportStatusModal;

