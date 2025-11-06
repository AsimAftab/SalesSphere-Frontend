import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Removed unused Link
import { LockClosedIcon } from '@heroicons/react/20/solid';
import illustration from '../../assets/Image/illustration.svg';
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
    <div className="flex min-h-screen items-center justify-center bg-primary p-4 sm:p-6">
      <div className="flex w-full max-w-4xl overflow-hidden rounded-2xl shadow-2xl bg-white">
        <div className="hidden lg:flex w-5/12 items-center justify-center p-12">
          <img src={illustration} alt="Illustration" className="w-full h-full rounded-lg shadow-xl" />
        </div>

        <div className="w-full lg:w-7/12 p-8 sm:p-12 flex flex-col justify-center">
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
                className="block w-full rounded-lg border border-gray-300 bg-gray-200 px-4 py-3"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {error && <p className="text-sm text-red-600 text-center">{error}</p>}
              <div className="flex justify-center gap-4 pt-4">
                {/* ✅ FIXED: Reverted to onClick */}
                <Button variant="secondary" type="button" onClick={() => navigate('/login')}>
                  ← Back to Login
                </Button>
                <Button type="submit" variant="secondary" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit'}
                </Button>
              </div>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-green-700 bg-green-100 p-4 rounded-lg">{success}</p>
              {/* ✅ FIXED: Reverted to onClick */}
              <Button variant="secondary" onClick={() => navigate('/login')}>
                ← Back to Login
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;