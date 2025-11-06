import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LockClosedIcon } from '@heroicons/react/20/solid';
import illustration from '../../assets/Image/illustration.svg';
import Button from '../../components/UI/Button/Button';
import { resetPassword } from '../../api/authService';

const ResetPasswordPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear error on new submit

    // ✅ FIX: Added return on a separate line
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      await resetPassword(token!, password, confirm);
      setSuccess(true);
      setTimeout(() => navigate('/login', { replace: true }), 2000);
    } catch (err: any) { // ✅ FIX: Added {} braces
      setError(err.message || 'Reset failed');
    } finally { // ✅ FIX: Added {} braces
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
          {success ? (
            <div className="text-center space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">Password Reset Successful!</h2>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700">New Password</label>
                  <input
                    type="password"
                    className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-200 px-4 py-3"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                  <input
                    type="password"
                    className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-200 px-4 py-3"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                  />
                </div>
                {error && <p className="text-red-700 bg-red-100 p-3 rounded">{error}</p>}
                <div className="flex justify-center gap-4 pt-4">
                  <Button variant="secondary" type="button" onClick={() => navigate('/login')}>
                    ← Back to Login
                  </Button>
                  <Button type="submit" variant="secondary" disabled={loading}>
                    {loading ? 'Resetting...' : 'Reset Password'}
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;