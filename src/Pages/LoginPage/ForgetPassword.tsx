import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LockClosedIcon } from '@heroicons/react/20/solid';
import forgotIllustration from '../../assets/Image/forgot_illustration.svg';
import decorativeBackground from '../../assets/Image/forgot_decorative_background.svg';
import Button from '../../components/UI/Button/Button';
import { forgotPassword } from '../../api/authService';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await forgotPassword(email);
      setSuccess(res.message || 'If registered, reset link has been sent.');
    } catch (err: any) {
      setError(err.message || 'Failed to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-900">
      {/* Left Side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#1e3a5f] to-[#2d5a7b] relative overflow-hidden">
        {/* Decorative Background SVG - Positioned absolutely to cover the entire left side */}
        <img 
          src={decorativeBackground} 
          alt="" 
          className="absolute inset-0 w-full h-full object-cover opacity-100"
        />

        {/* Illustration Container - Positioned relatively to appear above decorative background */}
        <div className="relative flex flex-col items-center justify-center w-full px-12 z-10">
          {/* Illustration - Smaller and more compact */}
          <div className="flex flex-col items-center max-w-sm">
            <img
              src={forgotIllustration}
              alt="Forgot Password Illustration"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>

      {/* Right Side - Forgot Password Form */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="mb-6 flex flex-col items-center text-center">
            <LockClosedIcon className="h-10 w-10 text-secondary mb-4" />
            <h2 className="text-3xl font-bold text-gray-900">Forgot Password?</h2>
            <p className="mt-2 text-gray-600">Enter your email to receive a reset link.</p>
          </div>

          {!success ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <input
                type="email"
                required
                placeholder="name@example.com"
                className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {error && <p className="text-sm text-red-600 text-center">{error}</p>}
              <div className="flex justify-center gap-4 pt-4">
                <Button variant="secondary" type="button" onClick={() => navigate('/login')}>
                  Back to Login
                </Button>
                <Button type="submit" variant="secondary" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit'}
                </Button>
              </div>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-green-700 bg-green-100 p-4 rounded-lg">{success}</p>
              <Button variant="secondary" onClick={() => navigate('/login')}>
                Back to Login
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;