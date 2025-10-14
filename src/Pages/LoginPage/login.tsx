import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon, LockClosedIcon } from '@heroicons/react/20/solid';
import logo from '../../assets/Image/logo.png';
import illustration from '../../assets/Image/illustration.svg';
import Button from '../../Components/UI/Button/Button';
import { loginUser } from '../../api/authService';

// --- LOGIN FORM COMPONENT ---
const LoginForm = ({ onForgotPasswordClick, onContactAdminClick }: { onForgotPasswordClick: () => void; onContactAdminClick: () => void; }) => {
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
            <div className="mb-6 flex  justify-center"> 
                <a href="#" className="flex items-center -ml-8">
                    {/* ADD a small margin-right here for spacing */}
                    <img className="h-16 w-auto" src={logo} alt="SalesSphere Logo" />

                    {/* REMOVE the negative margin from this span */}
                    <span className="-ml-20 text-3xl font-bold">
                        <span className="text-secondary">Sales</span>
                        <span className="text-black">Sphere</span>
                    </span>
                </a>
            </div>
            <div className="mb-8 text-center">
                <p className="text-xl font-semibold text-gray-800">
                    Empower Your Sales Team. Drive Growth.
                </p>
            </div>
            <h2 className="text-3xl font-semi-bold text-gray-900 mb-6 text-center lg:text-center">
                Log in
            </h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email ID</label>
                    <div className="mt-1">
                        <input id="email" name="email" type="email" required placeholder="name@example.com" className="block w-full appearance-none rounded-lg border border-gray-300 bg-gray-200 px-4 py-3 text-gray-900 placeholder-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Enter Your Password</label>
                    <div className="mt-1 relative rounded-lg shadow-sm">
                        <input id="password" name="password" type={showPassword ? 'text' : 'password'} required placeholder="••••••••" className="block w-full appearance-none rounded-lg border border-gray-300 bg-gray-200 px-4 py-3 pr-10 text-gray-900 placeholder-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <EyeSlashIcon className="h-5 w-5" aria-hidden="true" /> : <EyeIcon className="h-5 w-5" aria-hidden="true" />}
                        </div>
                    </div>
                </div>
                {error && <p className="text-sm text-red-600 text-center">{error}</p>}
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
                            <>
                                Login <span aria-hidden="true" className="ml-1">&rarr;</span>
                            </>
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
                            <input id="reset-email" name="email" type="email" required placeholder="name@example.com" className="block w-full appearance-none rounded-lg border border-gray-300 bg-gray-200 px-4 py-3 text-gray-900 placeholder-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                    </div>
                    {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                    <div className="flex flex-col-reverse justify-center  sm:flex-row sm:gap-4 pt-4">
                        <Button variant="secondary" type="button" onClick={onBackToLoginClick} className="w-fit mt-2 sm:mt-0">
                            <span aria-hidden="true" className="mr-1">&larr;</span> Back to Login
                        </Button>
                        <Button type="submit" variant="secondary" className="w-fit" disabled={loading}>
                                {loading ? 'Submitting...' : 'Submit'}
                        </Button>      
                    </div>
                </form>
            ) : (
                <p className="text-center text-green-700 bg-green-100 p-4 rounded-lg">{success}</p>
            )}
            
            
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
        try {
            await new Promise(resolve => setTimeout(resolve, 1500)); // Mock API call
            setSuccess(true);
        } catch (err) {
            setError('There was an error submitting your request.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="text-center">
                <p className="text-lg text-green-800 bg-green-100 p-4 rounded-lg">✅ Your message has been sent successfully. The admin team will reach out to you within 24 hours.</p>
                <div className="mt-8">
                    <Button variant="secondary" onClick={onBackToLoginClick} className="w-full">
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
                <p className="mt-2 text-gray-600">Need access or facing an issue? Fill out the form below and our admin will contact you.</p>
            </div>
            <form className="space-y-3" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                    <div className="mt-1"><input id="fullName" type="text" required placeholder="Enter your full name" className="block w-full appearance-none rounded-lg border border-gray-300 bg-gray-200 px-4 py-3 text-gray-900 placeholder-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" /></div>
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email ID</label>
                    <div className="mt-1"><input id="email" type="email" required placeholder="name@example.com" className="block w-full appearance-none rounded-lg border border-gray-300 bg-gray-200 px-4 py-3 text-gray-900 placeholder-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" /></div>
                </div>
                <div>
                    <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department / Role <span className="text-gray-500">(optional)</span></label>
                    <div className="mt-1"><input id="department" type="text" placeholder="e.g., Sales, Marketing" className="block w-full appearance-none rounded-lg border border-gray-300 bg-gray-200 px-4 py-3 text-gray-900 placeholder-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" /></div>
                </div>
                <div>
                    <label htmlFor="requestType" className="block text-sm font-medium text-gray-700">Request Type</label>
                    <div className="mt-1">
                        <select id="requestType" required className="block w-full appearance-none rounded-lg border border-gray-300 bg-gray-200 px-4 py-3 text-gray-900 placeholder-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                            <option value="" disabled selected>Select an option</option>
                            <option value="new-account">Request for new account</option>
                            <option value="login-issue">Forgot password / login issue</option>
                            <option value="update-details">Update user details</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message / Description</label>
                    <div className="mt-1"><textarea id="message" required rows={1} placeholder="Describe your issue or request in detail..." className="block w-full appearance-none rounded-lg border border-gray-300 bg-gray-200 px-4 py-3 text-gray-900 placeholder-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"></textarea></div>
                </div>
                {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                <div className="flex flex-col-reverse sm:flex-row sm:gap-4 pt-4">
                    <Button variant="secondary" type="button" onClick={onBackToLoginClick} className="w-full mt-2 sm:mt-0">
                        <span aria-hidden="true" className="mr-1">&larr;</span> Back to Login
                    </Button>
                    <Button variant="secondary" type="submit" className="w-full" disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</Button>
                </div>
            </form>
        </>
    );
};

// --- MAIN LOGIN PAGE COMPONENT (The Manager) ---
const LoginPage: React.FC = () => {
    const [view, setView] = useState<'login' | 'forgotPassword' | 'contactAdmin'>('login');

    return (
        <div className="flex min-h-screen items-center justify-center bg-primary p-4 sm:p-6">
            <div className="flex w-full max-w-4xl overflow-hidden rounded-tl-2xl rounded-br-2xl rounded-bl-4xl rounded-br-4xl shadow-2xl bg-white">
                <div className="hidden lg:flex w-5/12 flex-col items-center justify-center bg-[#71797E]- p-12">
                    <img src={illustration} alt="Illustration" className="w-full h-full rounded-lg shadow-xl" />
                </div>
                <div className="w-full lg:w-7/12 p-8 sm:p-12 flex flex-col justify-center">
                    {view === 'login' && <LoginForm onForgotPasswordClick={() => setView('forgotPassword')} onContactAdminClick={() => setView('contactAdmin')} />}
                    {view === 'forgotPassword' && <ForgotPasswordForm onBackToLoginClick={() => setView('login')} />}
                    {view === 'contactAdmin' && <ContactAdminForm onBackToLoginClick={() => setView('login')} />}
                </div>
            </div>
        </div>
    );
};

export default LoginPage;