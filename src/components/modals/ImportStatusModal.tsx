import React from 'react';
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

  const { title, color } = statusInfo[status];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm text-center">
        <h3 className={`text-lg font-bold text-${color}-600`}>{title}</h3>
        <p className="text-sm text-gray-600 mt-4 whitespace-pre-wrap">{message}</p>
        <div className="mt-6">
          <Button onClick={onClose} variant={status === 'success' ? 'primary' : 'secondary'}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImportStatusModal;
