import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Button from '../../../UI/Button/Button';

interface ModalShellProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string; // New subtitle prop
  isSaving: boolean;
  submitLabel?: string;
  children: React.ReactNode;
  onSubmit: (e: any) => void;
}

export const ModalShell: React.FC<ModalShellProps> = ({
  isOpen, onClose, title, subtitle, isSaving, submitLabel, children, onSubmit
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh] z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 flex-shrink-0">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all duration-200 hover:rotate-90 focus:outline-none"
              >
                <X size={24} />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={onSubmit} className="overflow-y-auto custom-scrollbar flex-grow flex flex-col">
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {children}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 flex-shrink-0">
                <Button
                  variant="outline"
                  type="button"
                  onClick={onClose}
                  disabled={isSaving}
                  className="text-gray-700 bg-white border-gray-300 hover:bg-gray-50 font-medium"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSaving}
                  variant="secondary"
                  isLoading={isSaving}
                >
                  {isSaving ? 'Creating...' : submitLabel || 'Create'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};