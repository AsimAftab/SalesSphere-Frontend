import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Building,
  Mail,
  MessageSquare,
  User,
} from 'lucide-react';
import logo from '@/assets/images/logo-c.svg';
import AuthLayout from './components/AuthLayout';
import AuthAlert from './components/AuthAlert';
import { useLazyImage } from './hooks/useLazyImage';
import { useContactForm, REQUEST_TYPE_OPTIONS } from './hooks/useContactForm';
import { Input, Button, DropDown } from '@/components/ui';

const ContactAdminPage: React.FC = () => {
  const navigate = useNavigate();
  const { form, updateField, loading, success, error, handleSubmit } = useContactForm();

  const bgImage = useLazyImage(() => import('../../assets/images/login_decorative_background.webp'));
  const illustrationImage = useLazyImage(() => import('../../assets/images/login_illustration.svg'));

  return (
    <AuthLayout
      bgImage={bgImage}
      illustrationImage={illustrationImage}
      illustrationAlt="Contact Us Illustration"
    >
      {!success ? (
        <>
          {/* Logo */}
          <div className="flex items-center justify-center gap-2.5 mb-5">
            <img className="h-10 w-auto" src={logo} alt="SalesSphere Logo" />
            <span className="text-[1.65rem] font-bold tracking-tight">
              <span className="text-secondary">Sales</span>
              <span className="text-primary">Sphere</span>
            </span>
          </div>

          {/* Header */}
          <div className="mb-5 text-center">
            <h1 className="text-[1.65rem] font-semibold text-gray-900 leading-tight">
              Get in Touch
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Need access or have a question? Our team will get back to you within 24 hours.
            </p>
          </div>

          {/* Alerts */}
          <AuthAlert message={error} variant="error" />

          <form className="space-y-3.5" onSubmit={handleSubmit}>
            <Input
              label="Full name"
              type="text"
              required
              placeholder="Enter your full name"
              value={form.fullName}
              onChange={(e) => updateField('fullName', e.target.value)}
              icon={<User className="h-5 w-5" />}
            />

            <Input
              label="Email address"
              type="email"
              required
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
              icon={<Mail className="h-5 w-5" />}
            />

            <Input
              label="Department / Role"
              type="text"
              placeholder="e.g., Sales, Marketing"
              value={form.department}
              onChange={(e) => updateField('department', e.target.value)}
              icon={<Building className="h-5 w-5" />}
            />

            <div className="w-full">
              <span className="block text-sm font-semibold text-gray-700 mb-1.5">
                Request Type
              </span>
              <DropDown
                label=""
                value={form.requestType}
                onChange={(val) => updateField('requestType', val)}
                placeholder="Select an option"
                triggerClassName="!shadow-none"
                options={REQUEST_TYPE_OPTIONS}
              />
            </div>

            <div className="w-full">
              <label htmlFor="contact-description" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="contact-description"
                required
                rows={2}
                placeholder="Describe your issue or request..."
                value={form.message}
                onChange={(e) => updateField('message', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm outline-none transition-all duration-200 placeholder:text-gray-400 text-gray-900 focus:bg-white focus:border-secondary focus:ring-2 focus:ring-secondary"
              />
            </div>

            <Button
              variant="secondary"
              type="submit"
              disabled={loading}
              className="w-full py-3 text-base font-semibold"
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 space-y-2">
            <p className="text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold text-secondary hover:text-blue-700 transition duration-150"
              >
                Sign in
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
        </>
      ) : (
        <div className="text-center">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <img className="h-12 w-auto" src={logo} alt="SalesSphere Logo" />
            <span className="text-3xl font-bold tracking-tight">
              <span className="text-secondary">Sales</span>
              <span className="text-primary">Sphere</span>
            </span>
          </div>

          <div className="mb-6">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
              <MessageSquare className="h-7 w-7 text-green-600" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Request Submitted
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Our team will review your request and get back to you within 24 hours.
            </p>
          </div>

          <Button
            variant="secondary"
            onClick={() => navigate('/login')}
            className="w-full py-3 text-base font-semibold"
          >
            Back to Sign in
          </Button>
        </div>
      )}
    </AuthLayout>
  );
};

export default ContactAdminPage;
