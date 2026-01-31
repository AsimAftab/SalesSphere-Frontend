import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Loader2, ArrowLeft, Mail, LockKeyhole } from 'lucide-react';
import logo from '../../assets/Image/Logo-c.svg';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import AuthLayout from './components/AuthLayout';
import AuthAlert from './components/AuthAlert';
import PasswordInput from './components/PasswordInput';
import { useLazyImage } from './hooks/useLazyImage';
import { loginUser, type LoginResponse } from '../../api/authService';
import { useAuth } from '../../api/authService';
import { getPostLoginPath } from './utils/getPostLoginPath';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const bgImage = useLazyImage(() => import('../../assets/Image/login_decorative_background.svg'));
  const illustrationImage = useLazyImage(() => import('../../assets/Image/login_illustration.svg'));

  /* --- Auto-redirect if user already logged in --- */
  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      navigate(getPostLoginPath(user?.role), { replace: true });
    }
  }, [isAuthenticated, isAuthLoading, navigate, user]);

  /* --- Show info message after redirect --- */
  useEffect(() => {
    if (location.state?.fromProtected) {
      setInfoMessage('Please log in to access that page.');
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  /* --- Submit Handler --- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoginError(null);
    setInfoMessage(null);

    try {
      const response: LoginResponse = await loginUser(email, password);
      const loggedInUser = response.data?.user;

      if (!loggedInUser) throw new Error('User data not found after login');

      navigate(getPostLoginPath(loggedInUser.role));
    } catch (error: unknown) {
      const axiosErr = error as { response?: { status?: number; data?: { message?: string } } };
      if (axiosErr.response?.status === 429) {
        setLoginError(
          axiosErr.response?.data?.message ||
          'Too many login attempts. Try again after 15 minutes.'
        );
      } else {
        setLoginError(
          axiosErr.response?.data?.message ||
          'Login failed. Please check your credentials.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  /* --- Loading screen while useAuth checks cookies --- */
  if (isAuthLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
      </div>
    );
  }

  /* --- MAIN LAYOUT --- */
  return (
    <AuthLayout
      bgImage={bgImage}
      illustrationImage={illustrationImage}
      illustrationAlt="Welcome Illustration"
    >
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
        <h1 className="text-2xl font-semibold text-gray-900">
          Sign in to your account
        </h1>
        <p className="mt-1.5 text-sm text-gray-500">
          Welcome back! Please enter your details to continue.
        </p>
      </div>

      {/* Alerts */}
      <AuthAlert message={infoMessage} variant="info" />
      <AuthAlert message={loginError} variant="error" />

      {/* FORM */}
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

        <PasswordInput
          label="Password"
          value={password}
          onChange={setPassword}
          placeholder="Enter your password"
          icon={<LockKeyhole className="h-5 w-5" />}
        />

        <div className="flex justify-end pt-1">
          <Link
            to="/forgot-password"
            className="text-sm font-medium text-secondary hover:text-blue-700 transition duration-150"
          >
            Forgot password?
          </Link>
        </div>

        {/* LOGIN BUTTON */}
        <Button
          type="submit"
          variant="secondary"
          className="w-full py-3 text-base font-semibold mt-2"
          disabled={loading}
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing in...
            </span>
          ) : (
            'Sign in'
          )}
        </Button>
      </form>

      {/* Footer links */}
      <div className="mt-8 space-y-3">
        <p className="text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <Link
            to="/contact-admin"
            className="font-semibold text-secondary hover:text-blue-700 transition duration-150"
          >
            Contact SalesSphere
          </Link>
        </p>
        <p className="text-center">
          <Link
            to="/"
            className="text-sm text-gray-400 hover:text-gray-600 transition duration-150 inline-flex items-center gap-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Home
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
