import React, { useState } from 'react';
import { type UseFormReturn } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import Button from '../../../UI/Button/Button';
import type { ChangePasswordFormData } from '../common/ChangePasswordSchema';

interface ChangePasswordFormProps {
  form: UseFormReturn<ChangePasswordFormData>;
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

/* -- Reusable password field -- */
const PasswordField: React.FC<{
  label: string;
  error?: string;
  hint?: string;
  autoComplete?: string;
  placeholder?: string;
  registration: ReturnType<UseFormReturn<ChangePasswordFormData>['register']>;
}> = ({ label, error, hint, autoComplete, placeholder, registration }) => {
  const [show, setShow] = useState(false);

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          autoComplete={autoComplete}
          placeholder={placeholder}
          {...registration}
          className={`block w-full rounded-xl border px-4 py-2.5 pr-10 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 bg-gray-50 focus:bg-white ${
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-100'
              : 'border-gray-200 focus:border-secondary focus:ring-2 focus:ring-secondary'
          }`}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
          tabIndex={-1}
        >
          {show ? <Eye size={16} /> : <EyeOff size={16} />}
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </div>
  );
};

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({
  form,
  onSubmit,
  onCancel,
  isSubmitting,
}) => {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={onSubmit} className="flex flex-col">
      <div className="p-6 space-y-5">
        <PasswordField
          label="Current Password"
          error={errors.currentPassword?.message}
          autoComplete="current-password"
          placeholder="Enter current password"
          registration={register('currentPassword')}
        />
        <PasswordField
          label="New Password"
          error={errors.newPassword?.message}
          hint="Min. 8 characters with upper & lower case, number, and special character."
          autoComplete="new-password"
          placeholder="Enter new password"
          registration={register('newPassword')}
        />
        <PasswordField
          label="Confirm New Password"
          error={errors.confirmPassword?.message}
          autoComplete="new-password"
          placeholder="Re-enter new password"
          registration={register('confirmPassword')}
        />
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 flex-shrink-0">
        <Button
          variant="outline"
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="text-gray-700 bg-white border-gray-300 hover:bg-gray-50 font-medium"
        >
          Cancel
        </Button>
        <Button type="submit" variant="secondary" isLoading={isSubmitting}>
          Update Password
        </Button>
      </div>
    </form>
  );
};

export default ChangePasswordForm;
