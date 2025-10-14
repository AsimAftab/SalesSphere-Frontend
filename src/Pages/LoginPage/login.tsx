import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon, LockClosedIcon, ArrowLeftIcon } from '@heroicons/react/20/solid';
import logo from '../../assets/Image/logo.png';
import illustration from '../../assets/Image/illustration.svg';
import Button from '../../Components/UI/Button/Button';
import { loginUser } from '../../api/authService';

// --- LOGIN FORM COMPONENT (Your original form) ---
const LoginForm = ({ onForgotPasswordClick }: { onForgotPasswordClick: () => void }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const data = await loginUser(email, password);
            if (data.token) {
                localStorage.setItem('jwtToken', data.token);
                navigate('/dashboard');
            }
        } catch (err) {
            setError('Login failed. Please check your credentials.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Logo at the top of the form */}
            <div className="mb-6 flex justify-center lg:justify-start">
                <a href="#" className="flex items-center">
                    <img className="h-12 w-auto" src={logo} alt="SalesSphere Logo" />
                    <span className="text-3xl font-bold ml-[-50px] ">
                        <span className="text-secondary">Sales</span>
                        <span className="text-[#202224]">Sphere</span>
                    </span>
                </a>
            </div>

            {/* Marketing text */}
            <div className="mb-8 text-center lg:text-left">
                <p className="text-xl font-semibold text-gray-800 text-center lg:text-center">
                    Empower Your Sales Team. Drive Growth.
                </p>
            </div>
            
            <h2 className="text-3xl font-semi-bold text-gray-900 mb-6 text-center lg:text-center">
                Log in
            </h2>

            <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Email Input */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email ID</label>
                    <div className="mt-1">
                        <input id="email" name="email" type="email" required placeholder="name@example.com" className="block w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                </div>
                
                {/* Password Input */}
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Enter Your Password</label>
                    <div className="mt-1 relative rounded-lg shadow-sm">
                        <input id="password" name="password" type={showPassword ? 'text' : 'password'} required placeholder="••••••••" className="block w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-3 pr-10 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <EyeSlashIcon className="h-5 w-5" aria-hidden="true" /> : <EyeIcon className="h-5 w-5" aria-hidden="true" />}
                        </div>
                    </div>
                </div>
                
                {/* Error Message Display */}
                {error && <p className="text-sm text-red-600 text-center">{error}</p>}

                {/* Forgot Password Link */}
                <div className="flex items-center justify-end text-sm">
                    <button type="button" onClick={onForgotPasswordClick} className="font-medium text-secondary hover:scale-105 transition duration-150">
                        Forgot password?
                    </button>
                </div>

                {/* Submit Button */}
                <div>
                    <Button type="submit" variant="secondary" className="w-full" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </Button>
                </div>
            </form>

            {/* Contact Admin Link */}
            <p className="mt-8 text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <a href="#" className="font-medium text-secondary hover:scale-105 transition duration-150">
                    Contact Admin
                </a>
            </p>
        </>
    );
};

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
            // --- MOCK API CALL ---
            await new Promise(resolve => setTimeout(resolve, 1500)); 
            setSuccess(`A password reset link has been sent to ${email}.`);
        } catch (err) {
            setError('Failed to send reset link. Please try again.');
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
                        <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700">Email</label>
                        <div className="mt-1">
                            <input id="reset-email" name="email" type="email" required placeholder="name@example.com" className="block w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                    </div>
                    {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                    <div>
                        <Button type="submit" variant="secondary" className="w-full" disabled={loading}>
                            {loading ? 'Submitting...' : 'Submit'}
                        </Button>
                    </div>
                </form>
            ) : (
                <p className="text-center text-green-700 bg-green-100 p-4 rounded-lg">{success}</p>
            )}

            <div className="mt-8 text-center">
                <button onClick={onBackToLoginClick} className="group flex items-center justify-center w-full text-secondary font-medium hover:scale-105 transition-colors">
                    <ArrowLeftIcon className="h-5 w-5 mr-2 transition-transform group-hover:-translate-x-1" />
                    Back to login
                </button>
            </div>
        </>
    );
};

// --- MAIN LOGIN PAGE COMPONENT (The Manager) ---
const LoginPage: React.FC = () => {
    // This state controls which view is shown.
    const [view, setView] = useState<'login' | 'forgotPassword'>('login');

    return (
        // Outer Container (Original Style)
        <div className="flex min-h-screen items-center justify-center bg-[#FFFAFA] p-4 sm:p-6">
            
            {/* Main Card (Original Style) */}
            <div className="flex w-full max-w-4xl overflow-hidden rounded-tl-2xl rounded-br-2xl rounded-bl-4xl rounded-br-4xl shadow-2xl bg-gray-200">
                
                {/* Left Panel (Original Style) */}
                <div className="hidden lg:flex w-5/12 flex-col items-center justify-center bg-[#71797E]- p-12">
                    <img
                        src={illustration}
                        alt="Illustration"
                        className="w-full h-full rounded-lg shadow-xl"
                    />
                </div>

                {/* Right Panel */}
                <div className="w-full lg:w-7/12 p-8 sm:p-12 flex flex-col justify-center">
                    {/* Conditional rendering logic */}
                    {view === 'login' ? (
                        <LoginForm onForgotPasswordClick={() => setView('forgotPassword')} />
                    ) : (
                        <ForgotPasswordForm onBackToLoginClick={() => setView('login')} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginPage;