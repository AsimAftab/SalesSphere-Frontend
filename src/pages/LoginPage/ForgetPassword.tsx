import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle,
  KeyRound,
  Mail,
} from 'lucide-react';
import logo from '@/assets/images/logo-c.svg';
import AuthLayout from './components/AuthLayout';
import AuthAlert from './components/AuthAlert';
import { useLazyImage } from './hooks/useLazyImage';
import { forgotPassword } from '@/api/authService';
import { Input, Button } from '@/components/ui';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const bgImage = useLazyImage(() => import('../../assets/images/forgot_decorative_background.webp'));
  const illustrationImage = useLazyImage(() => import('../../assets/images/forgot_illustration.webp'));

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
      {!success ? (
        <>
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <img className="h-12 w-auto" src={logo} alt="SalesSphere Logo" />
            <span className="text-3xl font-bold tracking-tight">
              <span className="text-secondary">Sales</span>
              <span className="text-gray-900">Sphere</span>
            </span>
          </div>

          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
              <KeyRound className="h-7 w-7 text-secondary" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Forgot your password?
            </h1>
            <p className="mt-1.5 text-sm text-gray-500">
              No worries. Enter your email and we'll send you a reset link.
            </p>
          </div>

          {/* Alerts */}
          <AuthAlert message={error} variant="error" />

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <Input
              label="Email address"
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="h-5 w-5" />}
            />

            <Button
              type="submit"
              variant="secondary"
              disabled={loading}
              className="w-full py-3 text-base font-semibold mt-2"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 space-y-3">
            <p className="text-center">
              <Link
                to="/login"
                className="text-sm text-gray-400 hover:text-gray-600 transition duration-150 inline-flex items-center gap-1"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Sign in
              </Link>
            </p>
          </div>
        </>
      ) : (
        <div className="text-center">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <img className="h-12 w-auto" src={logo} alt="SalesSphere Logo" />
            <span className="text-3xl font-bold tracking-tight">
              <span className="text-secondary">Sales</span>
              <span className="text-gray-900">Sphere</span>
            </span>
          </div>

          <div className="mb-6">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-7 w-7 text-green-600" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Check your email
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              If an account exists for <span className="font-medium text-gray-700">{email}</span>,
              a reset link has been sent.
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Please check your inbox and spam folder.
            </p>
          </div>

          <Button
            variant="secondary"
            onClick={() => navigate('/login')}
            className="w-full py-3 text-base font-semibold"
          >
            Back to Sign in
          </Button>
        </div>
      )}
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
