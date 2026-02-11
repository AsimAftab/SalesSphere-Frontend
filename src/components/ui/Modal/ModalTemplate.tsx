import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { X } from 'lucide-react';

// Animation variants
const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', damping: 25, stiffness: 300 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: { duration: 0.2 },
  },
};

const slideVariants: Variants = {
  hidden: { opacity: 0, x: '100%' },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', damping: 25, stiffness: 300 },
  },
  exit: {
    opacity: 0,
    x: '100%',
    transition: { duration: 0.2 },
  },
};

// Types
export type ModalSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
export type ModalVariant = 'center' | 'slide';

export interface ModalTemplateProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Close handler */
  onClose: () => void;
  /** Modal title */
  title?: string;
  /** Modal subtitle/description */
  subtitle?: string;
  /** Modal size */
  size?: ModalSize;
  /** Modal variant (center or slide from right) */
  variant?: ModalVariant;
  /** Whether to show close button */
  showCloseButton?: boolean;
  /** Whether clicking backdrop closes modal */
  closeOnBackdropClick?: boolean;
  /** Whether pressing Escape closes modal */
  closeOnEscape?: boolean;
  /** Custom header content (replaces title) */
  customHeader?: React.ReactNode;
  /** Whether to show header */
  showHeader?: boolean;
  /** Modal content */
  children: React.ReactNode;
  /** Additional className for modal container */
  className?: string;
  /** Additional className for content area */
  contentClassName?: string;
  /** Z-index for the modal */
  zIndex?: number;
}

const sizeClasses: Record<ModalSize, string> = {
  xs: 'max-w-xs',
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  full: 'max-w-full mx-4',
};

const slideWidthClasses: Record<ModalSize, string> = {
  xs: 'w-80',
  sm: 'w-96',
  md: 'w-[28rem]',
  lg: 'w-[32rem]',
  xl: 'w-[36rem]',
  '2xl': 'w-[42rem]',
  full: 'w-full',
};

export const ModalTemplate: React.FC<ModalTemplateProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  size = 'md',
  variant = 'center',
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  customHeader,
  showHeader = true,
  children,
  className = '',
  contentClassName = '',
  zIndex = 50,
}) => {
  // Handle escape key
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEscape) {
        onClose();
      }
    },
    [closeOnEscape, onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleEscape]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnBackdropClick) {
      onClose();
    }
  };

  const isSlide = variant === 'slide';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={`fixed inset-0 flex ${
            isSlide ? 'justify-end' : 'items-center justify-center'
          } bg-black bg-opacity-50 p-4`}
          style={{ zIndex }}
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={handleBackdropClick}
        >
          <motion.div
            className={`
              bg-white shadow-xl flex flex-col
              ${isSlide ? `h-full rounded-l-2xl ${slideWidthClasses[size]}` : `rounded-xl w-full ${sizeClasses[size]} max-h-[90vh]`}
              ${className}
            `}
            variants={isSlide ? slideVariants : modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            {showHeader && (customHeader || title) && (
              <div className="flex items-start justify-between px-6 py-4 border-b border-gray-100">
                {customHeader || (
                  <div className="flex-1 min-w-0">
                    {title && (
                      <h2 className="text-lg font-semibold text-gray-800 truncate">
                        {title}
                      </h2>
                    )}
                    {subtitle && (
                      <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
                    )}
                  </div>
                )}
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="p-2 -m-2 ml-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Close modal"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            )}

            {/* Content */}
            <div className={`flex-1 overflow-y-auto ${contentClassName}`}>
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Confirmation Modal Component
export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'danger';
  isLoading?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'primary',
  isLoading = false,
}) => {
  return (
    <ModalTemplate
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      closeOnBackdropClick={!isLoading}
      closeOnEscape={!isLoading}
    >
      <div className="p-6">
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50 ${
              confirmVariant === 'danger'
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-secondary hover:bg-secondary/90'
            }`}
          >
            {isLoading ? 'Loading...' : confirmText}
          </button>
        </div>
      </div>
    </ModalTemplate>
  );
};

export default ModalTemplate;
