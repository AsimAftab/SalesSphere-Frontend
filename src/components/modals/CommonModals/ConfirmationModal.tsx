import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui';
import {
  ModalContainer,
  ModalFooter,
  backdropVariants,
  scaleVariants,
} from '@/components/ui/ModalWrapper';

interface ConfirmationModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonVariant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost' | 'success';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmButtonText = 'Confirm',
  cancelButtonText = 'Cancel',
  confirmButtonVariant = 'primary',
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onCancel}
        >
          <motion.div
            key="modal"
            variants={scaleVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <ModalContainer size="md" className="p-6">
              {title && (
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  {title}
                </h2>
              )}
              <p className="text-sm text-gray-600 mb-6">{message}</p>
              <ModalFooter transparent className="p-0">
                <Button
                  variant="ghost"
                  onClick={onCancel}
                  className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                >
                  {cancelButtonText}
                </Button>
                <Button variant={confirmButtonVariant} onClick={onConfirm}>
                  {confirmButtonText}
                </Button>
              </ModalFooter>
            </ModalContainer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;
