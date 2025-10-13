import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/20/solid';
import logo from '../../assets/image/logo.png';
import illustration from '../../assets/image/illustration.png';
import Button from '../../Components/UI/Button/Button';
import { loginUser } from '../../api/authService'; // We assume this service exists

const LoginPage: React.FC = () => {
    // 1. State management for form inputs, loading, and errors
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // 2. Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Call the backend API
            const data = await loginUser(email, password);

            // On success, store the token and navigate
            if (data.token) {
                localStorage.setItem('jwtToken', data.token);
                navigate('/dashboard');
            }
        } catch (err) {
            // On failure, show an error message
            setError('Login failed. Please check your credentials.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        // Outer Container
        <div className="flex min-h-screen items-center justify-center bg-[#FFFAFA] p-4 sm:p-6">
            
            {/* Main Card */}
            <div className="flex w-full max-w-4xl overflow-hidden rounded-tl-2xl rounded-br-2xl rounded-bl-4xl rounded-br-4xl shadow-2xl bg-gray-200">
                
                {/* Left Panel */}
                <div className="hidden lg:flex w-5/12 flex-col items-center justify-center bg-[#71797E]- p-12">
                    <img
                        src={illustration}
                        alt="Illustration"
                        className="w-full h-full rounded-lg shadow-xl"
                    />
                </div>

                {/* Right Panel */}
                <div className="w-full lg:w-7/12 p-8 sm:p-12 flex flex-col justify-center">
                
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
                            <label 
                                htmlFor="email" 
                                className="block text-sm font-medium text-gray-700"
                            >
                                Email ID
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="name@example.com"
                                    className="block w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>
                        
                        {/* Password Input */}
                        <div>
                            <label 
                                htmlFor="password" 
                                className="block text-sm font-medium text-gray-700"
                            >
                                Enter Your Password
                            </label>
                            <div className="mt-1 relative rounded-lg shadow-sm">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    placeholder="••••••••"
                                    className="block w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-3 pr-10 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <div 
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 cursor-pointer"
                                    onClick={togglePasswordVisibility}
                                >
                                    {showPassword ? (
                                        <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5" aria-hidden="true" />
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        {/* Error Message Display */}
                        {error && (
                            <p className="text-sm text-red-600 text-center">{error}</p>
                        )}

                        {/* Forgot Password Link */}
                        <div className="flex items-center justify-end text-sm">
                            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-150">
                                Forgot password?
                            </a>
                        </div>

                        {/* Submit Button */}
                        <div>
                            <Button 
                                type="submit" 
                                variant="secondary" 
                                className="w-full"
                                disabled={loading}
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </Button>
                        </div>
                    </form>

                    {/* Contact Admin Link */}
                    <p className="mt-8 text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-150">
                            Contact Admin
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
