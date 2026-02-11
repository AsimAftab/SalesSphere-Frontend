import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback } from 'react';
import {
  changePasswordSchema,
  type ChangePasswordFormData,
} from '../common/ChangePasswordSchema';

interface UseChangePasswordFormProps {
  onChangePassword: (
    current: string,
    next: string,
  ) => Promise<{ success: boolean; message: string; field?: 'current' | 'new' }>;
  onSuccess: () => void;
}

export const useChangePasswordForm = ({
  onChangePassword,
  onSuccess,
}: UseChangePasswordFormProps) => {
  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    mode: 'onChange',
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const { handleSubmit, reset, setError } = form;

  const resetForm = useCallback(() => {
    reset({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  }, [reset]);

  const onSubmit = async (data: ChangePasswordFormData) => {
    const result = await onChangePassword(data.currentPassword, data.newPassword);
    if (result.success) {
      resetForm();
      onSuccess();
    } else {
      const field = result.field === 'new' ? 'newPassword' : 'currentPassword';
      setError(field, { message: result.message });
    }
  };

  return {
    form,
    submitHandler: handleSubmit(onSubmit),
    resetForm,
  };
};
