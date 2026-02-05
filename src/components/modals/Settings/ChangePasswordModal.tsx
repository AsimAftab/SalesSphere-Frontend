import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChangePasswordForm } from './hooks/useChangePasswordForm';
import ChangePasswordForm from './components/ChangePasswordForm';
import { ErrorBoundary } from '@/components/ui';
import {
  ModalHeader,
  ModalBody,
  ModalContainer,
  backdropVariants,
  scaleVariants,
} from '@/components/ui/ModalWrapper';
import { ShieldCheck } from 'lucide-react';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChangePassword: (
    current: string,
    next: string,
  ) => Promise<{ success: boolean; message: string; field?: 'current' | 'new' }>;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  onChangePassword,
}) => {
  const { form, submitHandler, resetForm } = useChangePasswordForm({
    onChangePassword,
    onSuccess: onClose,
  });

  React.useEffect(() => {
    if (isOpen) resetForm();
  }, [isOpen, resetForm]);

  return (
    <ErrorBoundary>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
              onClick={onClose}
            />

            {/* Modal Content */}
            <motion.div
              variants={scaleVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative z-10"
            >
              <ModalContainer size="md">
                {/* Header - using extracted component */}
                <ModalHeader
                  title="Change Password"
                  subtitle="Keep your account secure"
                  icon={ShieldCheck}
                  iconBgClass="bg-blue-50"
                  iconColorClass="text-blue-600"
                  onClose={onClose}
                />

                {/* Form Body */}
                <ModalBody scrollable noPadding>
                  <ChangePasswordForm
                    form={form}
                    onSubmit={submitHandler}
                    onCancel={onClose}
                    isSubmitting={form.formState.isSubmitting}
                  />
                </ModalBody>
              </ModalContainer>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ErrorBoundary>
  );
};

export default ChangePasswordModal;
