/**
 * Generic FormModal Component
 *
 * A reusable modal shell for form-based modals.
 * Follows Open/Closed Principle - extensible without modification.
 *
 * Usage:
 * ```tsx
 * <FormModal
 *   isOpen={isOpen}
 *   onClose={onClose}
 *   title="Create Item"
 *   description="Fill in the details below"
 *   size="lg"
 * >
 *   <YourFormComponent />
 * </FormModal>
 * ```
 */

import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

export type FormModalSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

export interface FormModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Close handler */
  onClose: () => void;
  /** Modal title */
  title: string;
  /** Optional description below title */
  description?: React.ReactNode;
  /** Modal size */
  size?: FormModalSize;
  /** Children (form content) */
  children: React.ReactNode;
  /** Whether to show the close button */
  showCloseButton?: boolean;
  /** Whether clicking backdrop closes modal */
  closeOnBackdrop?: boolean;
  /** Custom header content (replaces default title/description) */
  customHeader?: React.ReactNode;
  /** Custom footer content */
  footer?: React.ReactNode;
  /** Additional className for the modal content */
  className?: string;
  /** Icon to show next to title */
  icon?: React.ReactNode;
}

const sizeClasses: Record<FormModalSize, string> = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  '2xl': 'max-w-6xl',
  full: 'max-w-[95vw]',
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0 },
};

export const FormModal: React.FC<FormModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  size = 'lg',
  children,
  showCloseButton = true,
  closeOnBackdrop = true,
  customHeader,
  footer,
  className = '',
  icon,
}) => {
  const handleBackdropClick = () => {
    if (closeOnBackdrop) {
      onClose();
    }
  };

  // Prevent scrolling when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const modalContent = (
    <ErrorBoundary>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={handleBackdropClick}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className={`relative w-full ${sizeClasses[size]} bg-white rounded-2xl shadow-2xl overflow-hidden z-10 ${className}`}
            >
              {/* Header */}
              {customHeader || (
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                  <div className="flex items-center gap-3">
                    {icon && (
                      <div className="flex-shrink-0 p-2 bg-secondary/10 rounded-lg">
                        {icon}
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
                      {description && (
                        <p className="text-sm text-gray-500 mt-0.5">{description}</p>
                      )}
                    </div>
                  </div>
                  {showCloseButton && (
                    <button
                      onClick={onClose}
                      className="p-2 rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all duration-200 hover:rotate-90 focus:outline-none"
                      aria-label="Close modal"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  )}
                </div>
              )}

              {/* Body */}
              <div className="max-h-[75vh] overflow-y-auto">{children}</div>

              {/* Footer (optional) */}
              {footer && (
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/30">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ErrorBoundary>
  );

  if (typeof document === 'undefined') return null;

  return createPortal(modalContent, document.body);
};

export default FormModal;
