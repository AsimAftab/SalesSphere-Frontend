import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Removed unused Link
import illustration from '../../assets/Image/illustration.svg';
import Button from '../../components/UI/Button/Button';
import { contactAdmin } from '../../api/authService';

const ContactAdminPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const fullName = (document.getElementById('fullName') as HTMLInputElement).value;
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const department = (document.getElementById('department') as HTMLInputElement).value;
    const requestType = (document.getElementById('requestType') as HTMLSelectElement).value;
    const message = (document.getElementById('message') as HTMLTextAreaElement).value;

    try {
      await contactAdmin({ fullName, email, department, requestType, message });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'There was an error submitting your request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary p-4 sm:p-6">
      <div className="flex w-full max-w-4xl overflow-hidden rounded-2xl shadow-2xl bg-white">
        <div className="hidden lg:flex w-5/12 items-center justify-center p-12 bg-white">
          <img
            src={illustration}
            alt="Illustration"
            className="w-full h-full rounded-lg shadow-xl"
          />
        </div>

        <div className="w-full lg:w-7/12 p-10 sm:p-12 flex flex-col justify-center">
          {!success ? (
            <>
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900">Contact Admin</h2>
                <p className="mt-2 text-gray-600">
                  Need access or facing an issue? Fill out the form below and our admin will contact you.
                </p>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* ... all form inputs ... */}
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    placeholder="Enter your full name"
                    className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-200 px-4 py-3 text-gray-900 placeholder-gray-600 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email ID
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="name@example.com"
                    className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-200 px-4 py-3 text-gray-900 placeholder-gray-600 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                    Department / Role <span className="text-gray-500">(optional)</span>
                  </label>
                  <input
                    id="department"
                    type="text"
                    placeholder="e.g., Sales, Marketing"
                    className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-200 px-4 py-3 text-gray-900 placeholder-gray-600 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="requestType" className="block text-sm font-medium text-gray-700">
                    Request Type
                  </label>
                  <select
                    id="requestType"
                    required
                    className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-200 px-4 py-3 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="">Select an option</option>
                    <option value="new-account">Request for new account</option>
                    <option value="login-issue">Forgot password / login issue</option>
                    <option value="update-details">Update user details</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Message / Description
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={2}
                    placeholder="Describe your issue or request in detail..."
                    className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-200 px-4 py-3 text-gray-900 placeholder-gray-600 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-600 text-center">{error}</p>
                )}

                <div className="flex justify-center gap-4 pt-4">
                  {/* ✅ FIXED: Reverted to onClick */}
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => navigate('/login')}
                    className="w-full sm:w-fit"
                  >
                    ← Back to Login
                  </Button>
                  <Button
                    variant="secondary"
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-fit"
                  >
                    {loading ? 'Submitting...' : 'Submit'}
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">Message Sent ✅</h2>
              <p className="text-gray-600">
                Your message has been successfully sent. Our admin team will contact you within 24 hours.
              </p>
              {/* ✅ FIXED: Reverted to onClick */}
              <Button
                variant="secondary"
                onClick={() => navigate('/login')}
                className="mt-4"
              >
                ← Back to Login
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactAdminPage;