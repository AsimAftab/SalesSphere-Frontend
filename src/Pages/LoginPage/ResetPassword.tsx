import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LockClosedIcon } from '@heroicons/react/20/solid';
import Button from '../../components/UI/Button/Button';
import { resetPassword } from '../../api/authService';

const ResetPasswordPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  // Lazy-loaded images
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [illustrationImage, setIllustrationImage] = useState<string | null>(null);

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ---------------------------
     LAZY LOAD HEAVY IMAGES
  ---------------------------- */
  useEffect(() => {
    import('../../assets/Image/reset_decorative_background.svg').then((img) =>
      setBgImage(img.default)
    );

    import('../../assets/Image/reset_illustration.svg').then((img) =>
      setIllustrationImage(img.default)
    );
  }, []);

  /* ---------------------------
      FORM SUBMIT LOGIC
  ---------------------------- */
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
      setTimeout(() => navigate('/login', { replace: true }), 2000);
    } catch (err: any) {
      setError(err.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-900">

      {/* LEFT SIDE */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#1e3a5f] to-[#2d5a7b] relative overflow-hidden">

        {/* Lazy Background */}
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
                alt="Reset Password Illustration"
                className="w-full h-auto transition-opacity duration-500"
              />
            )}

          </div>
        </div>
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md">

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
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <input
                    type="password"
                    className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                  />
                </div>

                {error && (
                  <p className="text-red-700 bg-red-100 p-3 rounded">{error}</p>
                )}

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

        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
