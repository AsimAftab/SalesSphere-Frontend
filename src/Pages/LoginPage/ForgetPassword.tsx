import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LockClosedIcon } from '@heroicons/react/20/solid';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import AuthLayout from './components/AuthLayout';
import AuthAlert from './components/AuthAlert';
import { useLazyImage } from './hooks/useLazyImage';
import { forgotPassword } from '../../api/authService';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const bgImage = useLazyImage(() => import('../../assets/Image/forgot_decorative_background.svg'));
  const illustrationImage = useLazyImage(() => import('../../assets/Image/forgot_illustration.svg'));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await forgotPassword(email);
      setSuccess(res.message || 'If registered, a reset link has been sent.');
    } catch (err: unknown) {
      const errObj = err as { message?: string };
      setError(errObj.message || 'Failed to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      bgImage={bgImage}
      illustrationImage={illustrationImage}
      illustrationAlt="Forgot Password Illustration"
    >
      {/* Header */}
      <div className="mb-6 flex flex-col items-center text-center">
        <LockClosedIcon className="h-10 w-10 text-secondary mb-4" />
        <h2 className="text-3xl font-bold text-gray-900">Forgot Password?</h2>
        <p className="mt-2 text-gray-600">
          Enter your email to receive a reset link.
        </p>
      </div>

      {/* Form / Success Message */}
      {!success ? (
        <form className="space-y-6" onSubmit={handleSubmit}>
          <Input
            type="email"
            required
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
              {loading ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </form>
      ) : (
        <div className="text-center space-y-4">
          <AuthAlert message={success} variant="success" />
          <Button variant="secondary" onClick={() => navigate('/login')}>
            Back to Login
          </Button>
        </div>
      )}
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
