import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom'; // Import Link
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/20/solid';
import logo from '../../assets/Image/Logo-c.svg';
import illustration from '../../assets/Image/illustration.svg'; // Import illustration
import Button from '../../components/UI/Button/Button';
import { loginUser, getStoredUser } from '../../api/authService';

// This is now a single component containing all logic and layout
const LoginPage: React.FC = () => {
  // --- Logic from LoginForm ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.fromProtected) {
      setInfoMessage('Please log in to access that page.');
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]); // Added location.pathname to dependency array

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoginError(null);
    setInfoMessage(null);

    try {
      await loginUser(email, password);

      // Get the stored user from localStorage (loginUser stores it there and notifies listeners)
      const storedUser = getStoredUser();

      if (!storedUser) {
        throw new Error('User data not found after login');
      }

      // Navigate based on role
      const userRole = storedUser.role?.toLowerCase();
      if (userRole === 'superadmin' || userRole === 'developer') {
        navigate('/super-admin');
      } else {
        navigate('/dashboard');
      }
    } catch {
      setLoginError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };
  // --- End of Logic from LoginForm ---

  return (
    // --- Layout from LoginPage ---
    <div className="flex min-h-screen items-center justify-center bg-primary p-4 sm:p-6">
      <div className="flex w-full max-w-4xl overflow-hidden rounded-tl-2xl rounded-br-2xl rounded-bl-4xl rounded-br-4xl shadow-2xl bg-white">
        <div className="hidden lg:flex w-5/12 flex-col items-center justify-center p-12">
          <img
            src={illustration}
            alt="Illustration"
            className="w-full h-full rounded-lg shadow-xl"
          />
        </div>
        <div className="w-full lg:w-7/12 p-8 sm:p-12 flex flex-col justify-center">
          
          {/* --- JSX from LoginForm --- */}
          <>
            <div className="flex flex-col items-center text-center mb-8">
              <a href="#" className="flex items-center">
                <img className="h-12 w-auto" src={logo} alt="SalesSphere Logo" />
                <span className="ml-2 text-3xl font-bold">
                  <span className="text-secondary">Sales</span><span className="text-black">Sphere</span>
                </span>
              </a>
              <p className="mt-4 text-xl font-semibold text-gray-800">
                Empower Your Sales Team. Drive Growth.
              </p>
              <h2 className="mt-6 text-3xl font-semibold text-gray-900">Log in</h2>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {infoMessage && (
                <div className="text-center text-blue-700 bg-blue-100 p-4 rounded-lg">{infoMessage}</div>
              )}
              {loginError && (
                <div className="text-center text-red-700 bg-red-100 p-4 rounded-lg">{loginError}</div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">Email ID</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-200 px-4 py-3 text-gray-900"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <div className="mt-1 relative rounded-lg shadow-sm">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter Your Password"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-200 px-4 py-3 pr-10 text-gray-900"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </div>
                </div>
              </div>

              <div className="flex justify-end text-sm">
                {/* Changed to Link for better accessibility and routing */}
                <Link
                  to="/forgot-password"
                  className="font-medium text-secondary hover:scale-105 transition duration-150"
                >
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" variant="secondary" className="w-full" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </form>

            <p className="mt-8 text-center text-sm text-gray-700">
              Don’t have an account?{' '}
              {/* Changed to Link for better accessibility and routing */}
              <Link
                to="/contact-admin"
                className="font-medium text-secondary hover:scale-105 transition duration-150"
              >
                Contact Admin
              </Link>
            </p>
          </>
          {/* --- End of JSX from LoginForm --- */}

        </div>
      </div>
    </div>
  );
};

export default LoginPage;