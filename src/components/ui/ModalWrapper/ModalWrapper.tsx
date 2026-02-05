import React, { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  backdropVariants,
  scaleVariants,
  slideUpVariants,
  sizeClasses,
  backdropClasses,
  zIndexClasses,
  type ModalSize,
  type BackdropStyle,
  type ModalZIndex,
} from './constants';

// --- Types ---

export type ModalAnimation = 'scale' | 'slideUp' | 'none';

export interface ModalWrapperProps {
  /** Controls modal visibility */
  isOpen: boolean;
  /** Called when modal should close (backdrop click or escape key) */
  onClose: () => void;
  /** Modal content */
  children: React.ReactNode;
  /** Modal width preset */
  size?: ModalSize;
  /** Custom max-width class (overrides size) */
  maxWidth?: string;
  /** Animation style */
  animation?: ModalAnimation;
  /** Backdrop style */
  backdrop?: BackdropStyle;
  /** Whether clicking the backdrop closes the modal */
  closeOnBackdropClick?: boolean;
  /** Whether pressing Escape closes the modal */
  closeOnEscape?: boolean;
  /** Z-index level */
  zIndex?: ModalZIndex;
  /** Additional classes for the backdrop */
  backdropClassName?: string;
  /** Additional classes for the modal container */
  containerClassName?: string;
  /** Lock body scroll when modal is open */
  lockScroll?: boolean;
  /** Prevent closing during async operations */
  isClosingDisabled?: boolean;
}

// --- Component ---

export const ModalWrapper: React.FC<ModalWrapperProps> = ({
  isOpen,
  onClose,
  children,
  size = 'md',
  maxWidth,
  animation = 'scale',
  backdrop = 'default',
  closeOnBackdropClick = true,
  closeOnEscape = true,
  zIndex = 50,
  backdropClassName,
  containerClassName,
  lockScroll = true,
  isClosingDisabled = false,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  const handleEscapeKey = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape' && closeOnEscape && !isClosingDisabled) {
        onClose();
      }
    },
    [closeOnEscape, isClosingDisabled, onClose]
  );

  // Handle backdrop click
  const handleBackdropClick = useCallback(
    (event: React.MouseEvent) => {
      if (
        closeOnBackdropClick &&
        !isClosingDisabled &&
        event.target === event.currentTarget
      ) {
        onClose();
      }
    },
    [closeOnBackdropClick, isClosingDisabled, onClose]
  );

  // Lock body scroll
  useEffect(() => {
    if (!lockScroll) return;

    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen, lockScroll]);

  // Escape key listener
  useEffect(() => {
    if (isOpen && closeOnEscape) {
      document.addEventListener('keydown', handleEscapeKey);
      return () => document.removeEventListener('keydown', handleEscapeKey);
    }
  }, [isOpen, closeOnEscape, handleEscapeKey]);

  // Get animation variants
  const getModalVariants = (): Variants | undefined => {
    switch (animation) {
      case 'scale':
        return scaleVariants;
      case 'slideUp':
        return slideUpVariants;
      case 'none':
        return undefined;
      default:
        return scaleVariants;
    }
  };

  // Build class names
  const backdropClass = cn(
    'fixed inset-0 flex items-center justify-center p-4',
    zIndexClasses[zIndex],
    backdropClasses[backdrop],
    backdropClassName
  );

  const containerClass = cn(
    'bg-white rounded-lg shadow-xl w-full overflow-hidden',
    maxWidth || sizeClasses[size],
    containerClassName
  );

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          key="modal-backdrop"
          className={backdropClass}
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={handleBackdropClick}
        >
          <motion.div
            ref={modalRef}
            key="modal-content"
            className={containerClass}
            variants={getModalVariants()}
            initial={animation !== 'none' ? 'hidden' : undefined}
            animate={animation !== 'none' ? 'visible' : undefined}
            exit={animation !== 'none' ? 'exit' : undefined}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModalWrapper;
