import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/20/solid';
import logo from '../../assets/Image/Logo-c.svg';

import Button from '../../components/UI/Button/Button';
import { loginUser, type LoginResponse } from '../../api/authService';
import { useAuth } from '../../api/authService';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  // LAZY LOADED IMAGES
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [illustrationImage, setIllustrationImage] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  /* --- Lazy load BIG images AFTER component mounts --- */
  useEffect(() => {
    import('../../assets/Image/login_decorative_background.svg').then((img) => {
      setBgImage(img.default);
    });

    import('../../assets/Image/login_illustration.svg').then((img) => {
      setIllustrationImage(img.default);
    });
  }, []);

  /* --- Auto-redirect if user already logged in --- */
  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      const userRole = user?.role?.toLowerCase();
      if (userRole === 'superadmin' || userRole === 'super admin' || userRole === 'developer') {
        navigate('/system-admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
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
      const user = response.data?.user;

      if (!user) throw new Error('User data not found after login');

      const userRole = user.role?.toLowerCase();

      if (['superadmin', 'super admin', 'developer'].includes(userRole)) {
        navigate('/system-admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      if (error.response?.status === 429) {
        setLoginError(
          error.response?.data?.message ||
          'Too many login attempts. Try again after 15 minutes.'
        );
      } else {
        setLoginError(
          error.response?.data?.message ||
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
        <div>Loading...</div>
      </div>
    );
  }

  /* --- MAIN LAYOUT --- */
  return (
    <div className="flex min-h-screen bg-gray-900">
      {/* LEFT SECTION */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#1e3a5f] to-[#2d5a7b] relative overflow-hidden">

        {/* Lazy decorative background */}
        {bgImage && (
          <img
            src={bgImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-100 transition-opacity duration-500"
          />
        )}

        <div className="relative flex flex-col items-center justify-center w-full px-12 z-10">
          <div className="flex flex-col items-center max-w-sm">

            {/* Lazy Illustration */}
            {illustrationImage && (
              <img
                src={illustrationImage}
                alt="Welcome Illustration"
                className="w-full h-auto transition-opacity duration-500"
              />
            )}

          </div>
        </div>
      </div>

      {/* RIGHT SECTION — LOGIN FORM */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">

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
            {infoMessage && (
              <div className="text-sm text-blue-700 bg-blue-50 p-3 rounded-lg">
                {infoMessage}
              </div>
            )}

            {loginError && (
              <div className="text-sm text-red-700 bg-red-50 p-3 rounded-lg">
                {loginError}
              </div>
            )}

            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter Your Password"
                  className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </div>
              </div>
            </div>

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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              Back to Home
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;
