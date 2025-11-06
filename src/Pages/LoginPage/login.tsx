import React, { useState, useEffect } from 'react'; // <-- 1. Import useEffect
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'; // <-- 2. Import useLocation and useSearchParams
import { EyeIcon, EyeSlashIcon, LockClosedIcon } from '@heroicons/react/20/solid';
import logo from '../../assets/Image/Logo-c.svg';
import illustration from '../../assets/Image/illustration.svg';
import Button from '../../components/UI/Button/Button';
import { loginUser,  forgotPassword , contactAdmin, resetPassword } from '../../api/authService';

// --- LOGIN FORM COMPONENT ---
const LoginForm = ({
  onForgotPasswordClick,
  onContactAdminClick,
}: {
  onForgotPasswordClick: () => void;
  onContactAdminClick: () => void;
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null); // 3. Renamed 'error'
  const [infoMessage, setInfoMessage] = useState<string | null>(null); // 4. New state for info
  const navigate = useNavigate();
  const location = useLocation(); // 5. Get location data

  // 6. Add this useEffect to read the redirect message
  useEffect(() => {
    if (location.state?.fromProtected) {
      setInfoMessage("Please log in to access that page.");
      // Clear the location state so the message disappears on refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  // --- THIS IS THE UPDATED FUNCTION ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoginError(null);
    setInfoMessage(null);
    try {
      // 1. Capture the response from loginUser
      const loginResponse = await loginUser(email, password);
      
      // 2. Check the user's role from the response
      const userRole = loginResponse.data.user.role;

      // 3. Navigate based on the role
      if (userRole === "superadmin" || userRole === "Developer") {
        // Redirect system users to the super admin page
        navigate('/super-admin'); // <-- Or your preferred admin route
      } else {
        // Redirect all other users to the dashboard
        navigate('/dashboard');
      }

    } catch (err) {
      setLoginError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };
  // --- END OF FIX ---

  return (
    <>
      {/* ... (your logo and title divs are unchanged) ... */}
      <div className="flex flex-col items-center text-center mb-8">
        {/* Logo + Name */}
        <a href="#" className="flex items-center justify-center">
          <img className="h-12 w-auto" src={logo} alt="SalesSphere Logo" />
          <span className="ml-2 text-3xl font-bold">
            <span className="text-secondary">Sales</span>
            <span className="text-black">Sphere</span>
          </span>
        </a>

        {/* Tagline */}
        <p className="mt-4 text-xl font-semibold text-gray-800">
          Empower Your Sales Team. Drive Growth.
        </p>

        {/* Log in Heading */}
        <h2 className="mt-6 text-3xl font-semibold text-gray-900">
          Log in
        </h2>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        
        {/* --- 8. ADD THE INFO MESSAGE BOX --- */}
        {infoMessage && (
          <div className="text-center text-blue-700 bg-blue-100 p-4 rounded-lg">
            {infoMessage}
          </div>
        )}

        {/* --- 9. UPDATE THE ERROR BOX to use 'loginError' --- */}
        {loginError && (
          <div className="text-center text-red-700 bg-red-100 p-4 rounded-lg">
            {loginError}
          </div>
        )}
        
        {/* ... (rest of your form inputs are unchanged) ... */}
        <div>
           <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email ID</label>
           <div className="mt-1">
             <input id="email" name="email" type="email" required placeholder="name@example.com" className="block w-full appearance-none rounded-lg border border-gray-300 bg-gray-200 px-4 py-3 text-gray-900 placeholder-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" value={email} onChange={(e) => setEmail(e.target.value)} />
           </div>
         </div>
         <div>
           <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
           <div className="mt-1 relative rounded-lg shadow-sm">
             <input id="password" name="password" type={showPassword ? 'text' : 'password'} required placeholder="Enter Your Password" className="block w-full appearance-none rounded-lg border border-gray-300 bg-gray-200 px-4 py-3 pr-10 text-gray-900 placeholder-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" value={password} onChange={(e) => setPassword(e.target.value)} />
             <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
               {showPassword ? <EyeSlashIcon className="h-5 w-5" aria-hidden="true" /> : <EyeIcon className="h-5 w-5" aria-hidden="true" />}
             </div>
           </div>
         </div>
        <div className="flex items-center justify-end text-sm">
          <button type="button" onClick={onForgotPasswordClick} className="font-medium text-secondary hover:scale-105 transition duration-150">
            Forgot password?
          </button>
        </div>
        <div>
          <Button type="submit" variant="secondary" className="w-full" disabled={loading}>
            {loading ? (
              'Logging in...'
            ) : (
              <span className="inline-flex items-center gap-x-2">
              Login
            </span>
            )}
          </Button>
        </div>
      </form>
      <p className="mt-8 text-center text-sm text-gray-700">
        Don't have an account?{' '}
        <button type="button" onClick={onContactAdminClick} className="font-medium text-secondary hover:scale-105 transition duration-150">
          Contact Admin
        </button>
      </p>
    </>
  );
};

// ... (rest of your file, ForgotPasswordForm, ContactAdminForm, LoginPage, is unchanged) ...

// --- FORGOT PASSWORD FORM COMPONENT ---
const ForgotPasswordForm = ({ onBackToLoginClick }: { onBackToLoginClick: () => void }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError(null);
  setSuccess(null);
  try {
  const res = await forgotPassword(email); // ✅ call your API function
  setSuccess(res.message || 'If that email is registered, Password Reset Link has been sent.');
} catch (err: any) {
  setError(err.message || 'Failed to send reset link. Please try again.');
} finally {
  setLoading(false);
}

};


  return (
    <>
      <div className="mb-6 flex flex-col items-center text-center">
        <LockClosedIcon className="h-10 w-10 text-secondary mb-4" />
        <h2 className="text-3xl font-bold text-gray-900">Forgot Password?</h2>
        <p className="mt-2 text-gray-600">Enter your email to receive a reset link.</p>
      </div>
      {!success ? (
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="reset-email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <div className="mt-1">
              <input
                id="reset-email"
                name="email"
                type="email"
                required
                placeholder="name@example.com"
                className="block w-full appearance-none rounded-lg border border-gray-300 bg-gray-200 px-4 py-3 text-gray-900 placeholder-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          <div className="flex flex-row justify-center items-center gap-4 pt-4">
            <Button
              variant="secondary"
              type="button"
              onClick={onBackToLoginClick}
              className="w-fit"
            >
              <span aria-hidden="true" className="mr-1">&larr;</span> Back to Login
            </Button>
            <Button
              type="submit"
              variant="secondary"
              className="w-fit"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </form>
      ) : (
        <div className="text-center space-y-4">
          <p className="text-green-700 bg-green-100 p-4 rounded-lg">
            {success}
          </p>
          <Button
            variant="secondary"
            type="button"
            onClick={onBackToLoginClick}
            className="w-full"
          >
            <span aria-hidden="true" className="mr-1">&larr;</span> Back to Login
          </Button>
        </div>
      )}
    </>
  );
};

// --- RESET PASSWORD FORM COMPONENT ---
//mock link : http://localhost:5173/login?token=mock-reset-token-12345&email=testuser@example.com
const ResetPasswordForm = ({
  onBackToLoginClick,
  token,
  userEmail
}: {
  onBackToLoginClick: () => void;
  token: string;
  userEmail: string | null;
}) => {
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Validate passwords match
    if (password !== passwordConfirm) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password length
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    try {
      await resetPassword(token, password, passwordConfirm);
      setSuccess(true);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. Please try again or request a new reset link.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-6">
        <div className="flex flex-col items-center">
          <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Password Reset Successful!</h2>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <p className="text-green-800 text-lg font-medium mb-2">
            Your password has been successfully reset.
          </p>
          {userEmail && (
            <p className="text-green-700 text-sm">
              Password updated for: <span className="font-semibold">{userEmail}</span>
            </p>
          )}
        </div>
        <p className="text-gray-600">
          Redirecting you to the login page in 3 seconds...
        </p>
        <Button
          variant="secondary"
          type="button"
          onClick={() => navigate('/login')}
          className="w-full"
        >
          Go to Login Now
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex flex-col items-center text-center">
        <LockClosedIcon className="h-10 w-10 text-secondary mb-4" />
        <h2 className="text-3xl font-bold text-gray-900">Reset Your Password</h2>
        <p className="mt-2 text-gray-600">Enter your new password below</p>
        {userEmail && (
          <p className="mt-2 text-sm text-gray-500">
            Resetting password for: <span className="font-semibold">{userEmail}</span>
          </p>
        )}
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <div className="mt-1 relative rounded-lg shadow-sm">
            <input
              id="new-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="Enter new password (min 8 characters)"
              className="block w-full appearance-none rounded-lg border border-gray-300 bg-gray-200 px-4 py-3 pr-10 text-gray-900 placeholder-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
            />
            <div
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
              ) : (
                <EyeIcon className="h-5 w-5" aria-hidden="true" />
              )}
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
            Confirm New Password
          </label>
          <div className="mt-1 relative rounded-lg shadow-sm">
            <input
              id="confirm-password"
              name="passwordConfirm"
              type={showConfirmPassword ? 'text' : 'password'}
              required
              placeholder="Re-enter new password"
              className="block w-full appearance-none rounded-lg border border-gray-300 bg-gray-200 px-4 py-3 pr-10 text-gray-900 placeholder-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              minLength={8}
            />
            <div
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 cursor-pointer"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
              ) : (
                <EyeIcon className="h-5 w-5" aria-hidden="true" />
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="text-center text-red-700 bg-red-100 p-4 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex flex-row justify-center items-center gap-4 pt-4">
          <Button
            variant="secondary"
            type="button"
            onClick={onBackToLoginClick}
            className="w-full"
          >
            <span aria-hidden="true" className="mr-1">&larr;</span> Back to Login
          </Button>
          <Button
            type="submit"
            variant="secondary"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </div>
      </form>
    </>
  );
};

// --- CONTACT ADMIN FORM COMPONENT ---
const ContactAdminForm = ({ onBackToLoginClick }: { onBackToLoginClick: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    const res = await contactAdmin({ fullName, email, department, requestType, message });
    setSuccess(true);
    console.log(res.message);(res.message || 'Your message has been sent successfully.');

  } catch (err: any) {
    setError(err.message || 'There was an error submitting your request.');
  } finally {
    setLoading(false);
  }
};


  if (success) {
    return (
      <div className="text-center">
        <p className="text-lg text-green-800 bg-green-100 p-4 rounded-lg">
          ✅ Your message has been sent successfully. The admin team will reach out to
          you within 24 hours.
        </p>
        <div className="mt-8">
          <Button
            variant="secondary"
            onClick={onBackToLoginClick}
            className="w-full"
          >
            <span aria-hidden="true" className="mr-1">&larr;</span> Back to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-bold text-gray-900">Contact Admin</h2>
        <p className="mt-2 text-gray-600">
          Need access or facing an issue? Fill out the form below and our admin will
          contact you.
        </p>
      </div>
      <form className="space-y-3" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <div className="mt-1"><input id="fullName" type="text" required placeholder="Enter your full name" className="block w-full appearance-none rounded-lg border border-gray-300 bg-gray-200 px-4 py-3 text-gray-900 placeholder-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" /></div>
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email ID
          </label>
          <div className="mt-1"><input id="email" type="email" required placeholder="name@example.com" className="block w-full appearance-none rounded-lg border border-gray-300 bg-gray-200 px-4 py-3 text-gray-900 placeholder-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" /></div>
        </div>
        <div>
          <label
            htmlFor="department"
            className="block text-sm font-medium text-gray-700"
          >
            Department / Role <span className="text-gray-500">(optional)</span>
          </label>
          <div className="mt-1"><input id="department" type="text" placeholder="e.g., Sales, Marketing" className="block w-full appearance-none rounded-lg border border-gray-300 bg-gray-200 px-4 py-3 text-gray-900 placeholder-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" /></div>
        </div>
        <div>
          <label
            htmlFor="requestType"
            className="block text-sm font-medium text-gray-700"
          >
            Request Type
          </label>
          <div className="mt-1">
            <select
              id="requestType"
              required
              className="block w-full appearance-none rounded-lg border border-gray-300 bg-gray-200 px-4 py-3 text-gray-900 placeholder-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            >
              <option value="" disabled selected>
                Select an option
              </option>
              <option value="new-account">Request for new account</option>
              <option value="login-issue">Forgot password / login issue</option>
              <option value="update-details">Update user details</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">
            Message / Description
          </label>
          <div className="mt-1"><textarea id="message" required rows={1} placeholder="Describe your issue or request in detail..." className="block w-full appearance-none rounded-lg border border-gray-300 bg-gray-200 px-4 py-3 text-gray-900 placeholder-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"></textarea></div>
        </div>
        
        {error && <p className="text-sm text-red-600 text-center">{error}</p>}
        
        <div className="flex flex-row justify-center items-center gap-4 pt-4">
          <Button
            variant="secondary"
            type="button"
            onClick={onBackToLoginClick}
            className="w-full"
          >
            <span aria-hidden="true" className="mr-1">&larr;</span> Back to Login
          </Button>
          <Button
            variant="secondary"
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </form>
    </>
  );
};

// --- MAIN LOGIN PAGE COMPONENT ---
const LoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get('token');
  const userEmail = searchParams.get('email');

  const [view, setView] = useState<'login' | 'forgotPassword' | 'contactAdmin' | 'resetPassword'>(
    resetToken ? 'resetPassword' : 'login'
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary p-4 sm:p-6">
      <div className="flex w-full max-w-4xl overflow-hidden rounded-tl-2xl rounded-br-2xl rounded-bl-4xl rounded-br-4xl shadow-2xl bg-white">
        <div className="hidden lg:flex w-5/12 flex-col items-center justify-center bg-[#71797E]- p-12">
          <img
            src={illustration}
            alt="Illustration"
            className="w-full h-full rounded-lg shadow-xl"
          />
        </div>
        <div className="w-full lg:w-7/12 p-8 sm:p-12 flex flex-col justify-center">
          {view === 'login' && (
            <LoginForm
              onForgotPasswordClick={() => setView('forgotPassword')}
              onContactAdminClick={() => setView('contactAdmin')}
            />
          )}
          {view === 'forgotPassword' && (
            <ForgotPasswordForm onBackToLoginClick={() => setView('login')} />
          )}
          {view === 'resetPassword' && resetToken && (
            <ResetPasswordForm
              onBackToLoginClick={() => setView('login')}
              token={resetToken}
              userEmail={userEmail}
            />
          )}
          {view === 'contactAdmin' && (
            <ContactAdminForm onBackToLoginClick={() => setView('login')} />
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;