import React from 'react';
import { useChangePasswordForm } from './hooks/useChangePasswordForm';
import ChangePasswordForm from './components/ChangePasswordForm';
import { Button, FormModal } from '@/components/ui';
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

  const isSubmitting = form.formState.isSubmitting;
  const footer = (
    <div className="flex justify-end gap-3 w-full">
      <Button
        variant="outline"
        type="button"
        onClick={onClose}
        disabled={isSubmitting}
        className="text-gray-700 bg-white border-gray-300 hover:bg-gray-50 font-medium"
      >
        Cancel
      </Button>
      <Button type="submit" form="change-password-form" variant="secondary" isLoading={isSubmitting}>
        Update Password
      </Button>
    </div>
  );

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Change Password"
      description="Keep your account secure"
      size="md"
      icon={<ShieldCheck className="w-5 h-5 text-blue-600" />}
      footer={footer}
    >
      <ChangePasswordForm
        form={form}
        onSubmit={submitHandler}
      />
    </FormModal>
  );
};

export default ChangePasswordModal;
