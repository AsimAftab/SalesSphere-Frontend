import React from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import DropDown from '../../components/UI/DropDown/DropDown';
import AuthLayout from './components/AuthLayout';
import AuthAlert from './components/AuthAlert';
import { useLazyImage } from './hooks/useLazyImage';
import { useContactForm, REQUEST_TYPE_OPTIONS } from './hooks/useContactForm';

const ContactAdminPage: React.FC = () => {
  const navigate = useNavigate();
  const { form, updateField, loading, success, error, handleSubmit } = useContactForm();

  const bgImage = useLazyImage(() => import('../../assets/Image/login_decorative_background.svg'));
  const illustrationImage = useLazyImage(() => import('../../assets/Image/login_illustration.svg'));

  return (
    <AuthLayout
      bgImage={bgImage}
      illustrationImage={illustrationImage}
      illustrationAlt="Contact Admin Illustration"
    >
      {!success ? (
        <>
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Contact SalesSphere Admin</h2>
            <p className="mt-2 text-gray-600">
              Need access or facing an issue? Fill out the form below and our admin will contact you.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              label="Full Name"
              type="text"
              required
              placeholder="Enter your full name"
              value={form.fullName}
              onChange={(e) => updateField('fullName', e.target.value)}
            />

            <Input
              label="Email ID"
              type="email"
              required
              placeholder="name@example.com"
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
            />

            <Input
              label="Department / Role"
              type="text"
              placeholder="e.g., Sales, Marketing"
              value={form.department}
              onChange={(e) => updateField('department', e.target.value)}
              helperText="Optional"
            />

            <DropDown
              label="Request Type"
              value={form.requestType}
              onChange={(val) => updateField('requestType', val)}
              placeholder="Select an option"
              triggerClassName="!shadow-none"
              options={REQUEST_TYPE_OPTIONS}
            />

            <div className="w-full">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={2}
                placeholder="Describe your issue or request in detail..."
                value={form.message}
                onChange={(e) => updateField('message', e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none transition-all duration-200 placeholder:text-gray-400 text-gray-900 focus:border-secondary focus:ring-2 focus:ring-secondary"
              />
            </div>

            <AuthAlert message={error} variant="error" />

            <div className="flex justify-center gap-4 pt-4">
              <Button
                variant="secondary"
                type="button"
                onClick={() => navigate('/login')}
                className="w-full sm:w-fit"
              >
                Back to Login
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
          <h2 className="text-3xl font-bold text-gray-900">Message Sent</h2>
          <p className="text-gray-600">
            Your request has been sent. Our admin team will contact you within 24 hours.
          </p>
          <Button
            variant="secondary"
            onClick={() => navigate('/login')}
            className="mt-4"
          >
            Back to Login
          </Button>
        </div>
      )}
    </AuthLayout>
  );
};

export default ContactAdminPage;
