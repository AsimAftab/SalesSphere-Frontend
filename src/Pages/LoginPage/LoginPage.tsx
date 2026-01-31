import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Loader2, ArrowLeft } from 'lucide-react';
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
      <div className="flex items-center justify-center mb-8">
        <img className="h-12 w-auto" src={logo} alt="SalesSphere Logo" />
        <span className="ml-2 text-3xl font-bold">
          <span className="text-secondary">Sales</span>
          <span className="text-black">Sphere</span>
        </span>
      </div>

      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Login to your Account
        </h2>
        <p className="text-gray-500 text-sm">
          See what is going on with your business and sales
        </p>
      </div>

      {/* FORM */}
      <form className="space-y-5" onSubmit={handleSubmit}>
        <AuthAlert message={infoMessage} variant="info" />
        <AuthAlert message={loginError} variant="error" />

        <Input
          label="Email"
          type="email"
          required
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <PasswordInput
          label="Password"
          value={password}
          onChange={setPassword}
          placeholder="Enter Your Password"
        />

        {/* FORGOT PASSWORD */}
        <div className="flex justify-end">
          <Link
            to="/forgot-password"
            className="text-sm font-medium text-secondary hover:text-blue-700 transition duration-150"
          >
            Forgot Password?
          </Link>
        </div>

        {/* LOGIN BUTTON */}
        <Button
          type="submit"
          variant="secondary"
          className="w-full py-3 text-base font-medium"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Link
          to="/contact-admin"
          className="font-medium text-secondary hover:text-blue-700 transition duration-150"
        >
          Contact Admin
        </Link>
      </p>

      {/* BACK TO HOME LINK */}
      <p className="mt-4 text-center text-sm text-gray-600">
        <Link
          to="/"
          className="font-medium text-gray-700 hover:text-secondary transition duration-150 inline-flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </p>
    </AuthLayout>
  );
};

export default LoginPage;
