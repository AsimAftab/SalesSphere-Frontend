import React from 'react';
import { useChangePasswordForm } from './hooks/useChangePasswordForm';
import ChangePasswordForm from './components/ChangePasswordForm';
import { FormModal } from '@/components/ui';
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
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Change Password"
      description="Keep your account secure"
      size="md"
      icon={<ShieldCheck className="w-5 h-5 text-blue-600" />}
    >
      <ChangePasswordForm
        form={form}
        onSubmit={submitHandler}
        onCancel={onClose}
        isSubmitting={form.formState.isSubmitting}
      />
    </FormModal>
  );
};

export default ChangePasswordModal;
