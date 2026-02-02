import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LockClosedIcon } from '@heroicons/react/20/solid';
import AuthLayout from './components/AuthLayout';
import AuthAlert from './components/AuthAlert';
import PasswordInput from './components/PasswordInput';
import { useLazyImage } from './hooks/useLazyImage';
import { resetPassword } from '@/api/authService';
import { Button } from '@/components/ui';

const REDIRECT_DELAY_MS = 2000;

const ResetPasswordPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bgImage = useLazyImage(() => import('../../assets/images/reset_decorative_background.webp'));
  const illustrationImage = useLazyImage(() => import('../../assets/images/reset_illustration.webp'));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      await resetPassword(token!, password, confirm);
      setSuccess(true);
      setTimeout(() => navigate('/login', { replace: true }), REDIRECT_DELAY_MS);
    } catch (err: unknown) {
      const errObj = err as { message?: string };
      setError(errObj.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      bgImage={bgImage}
      illustrationImage={illustrationImage}
      illustrationAlt="Reset Password Illustration"
    >
      {success ? (
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold text-gray-900">
            Password Reset Successful!
          </h2>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      ) : (
        <>
          <div className="mb-6 flex flex-col items-center text-center">
            <LockClosedIcon className="h-10 w-10 text-secondary mb-4" />
            <h2 className="text-3xl font-bold text-gray-900">Reset Your Password</h2>
            <p className="mt-2 text-gray-600">Enter your new password below</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <PasswordInput
              label="New Password"
              value={password}
              onChange={setPassword}
              placeholder="Enter new password"
            />

            <PasswordInput
              label="Confirm Password"
              value={confirm}
              onChange={setConfirm}
              placeholder="Confirm new password"
            />

            <AuthAlert message={error} variant="error" />

            <div className="flex justify-center gap-4 pt-4">
              <Button
                variant="secondary"
                type="button"
                onClick={() => navigate('/login')}
              >
                Back to Login
              </Button>

              <Button type="submit" variant="secondary" disabled={loading}>
                {loading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </div>
          </form>
        </>
      )}
    </AuthLayout>
  );
};

export default ResetPasswordPage;
