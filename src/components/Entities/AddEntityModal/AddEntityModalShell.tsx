import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Button from '../../UI/Button/Button';

interface ModalShellProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  isSaving: boolean;
  submitLabel?: string; // New prop for specific button text
  children: React.ReactNode;
  onSubmit: (e: any) => void;
}

export const ModalShell: React.FC<ModalShellProps> = ({ 
  isOpen, onClose, title, isSaving, submitLabel, children, onSubmit 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[9999]">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b sticky top-0 bg-white z-10">
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-600">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6">
          {/* Grid setup */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {children}
          </div>

          {/* Footer with Dynamic Button Label */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t mt-6">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {/* If saving, show "Creating...", otherwise show specific label */}
              {isSaving ? 'Creating...' : submitLabel || 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};