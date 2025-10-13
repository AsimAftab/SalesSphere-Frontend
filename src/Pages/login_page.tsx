// src/pages/LoginPage.tsx

import React, { useState } from 'react';
import { EyeIcon, EyeSlashIcon, EnvelopeIcon } from '@heroicons/react/20/solid'; 
// You'll want to replace these with your actual logo and illustration images
// import UnstopLogo from '../assets/unstop-logo.png'; 
// import LoginIllustration from '../assets/login-illustration.png';

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password'); // To toggle between password and OTP

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt...');
    // Add your login API call logic here
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    // Outer Container: Full screen height, centered content, dark background
    <div className="flex min-h-screen items-center justify-center bg-[#1A202C] p-4 sm:p-6">
      
      {/* Main Login Card/Container: Split into two panels */}
      <div className="flex w-full max-w-5xl overflow-hidden rounded-2xl shadow-3xl bg-[#2D3748]">
        
        {/* Left Panel: Illustration / Marketing Content */}
        <div className="hidden lg:flex w-2/5 flex-col items-center justify-center p-8 relative">
          {/* Background for the left panel - can be a gradient or solid dark */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1A202C] to-[#2D3748] opacity-90 rounded-l-2xl"></div> 
          
          <div className="relative z-10 text-center">
            {/* Placeholder for Unstop Logo (replace with your SalesSphere logo) */}
            <div className="mb-6">
                <div className="h-16 w-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">SS</span> 
                </div>
                <h1 className="text-3xl font-bold text-gray-100">SalesSphere</h1>
            </div>

            {/* Placeholder for the Illustration Image */}
            <div className="w-full max-w-sm mx-auto my-8">
              {/* Replace with your actual illustration image */}
              <img 
                src="https://via.placeholder.com/400x300/2C3E50/FFFFFF?text=Login+Illustration" 
                alt="Login Illustration" 
                className="rounded-lg shadow-xl" 
              />
            </div>

            {/* Marketing Text */}
            <p className="text-gray-300 text-lg font-semibold mt-6">
              Empower Your Sales Team. <br/> Drive Growth.
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Access the tools you need to excel in 130k+ opportunities.
            </p>
          </div>
        </div>

        {/* Right Panel: Login Form */}
        <div className="w-full lg:w-3/5 p-8 sm:p-12 lg:p-16 bg-[#2A313C] rounded-r-2xl">
          <h2 className="text-4xl font-extrabold text-gray-100 mb-8 text-center lg:text-left">
            Log in
          </h2>

          {/* Social Login Buttons */}
          <div className="space-y-4 mb-6">
            <button className="flex w-full items-center justify-center rounded-lg border border-gray-600 bg-[#2A313C] py-2 px-4 text-gray-200 shadow-sm hover:bg-[#3C4A5A] transition duration-150">
              <img src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png" alt="Google" className="h-5 w-5 mr-3" />
              Continue with Google
            </button>
            <button className="flex w-full items-center justify-center rounded-lg border border-gray-600 bg-[#2A313C] py-2 px-4 text-gray-200 shadow-sm hover:bg-[#3C4A5A] transition duration-150">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/600px-LinkedIn_logo_initials.png" alt="LinkedIn" className="h-5 w-5 mr-3" />
              Login with LinkedIn
            </button>
          </div>

          {/* Separator */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-[#2A313C] px-2 text-gray-400">
                Or login with email
              </span>
            </div>
          </div>

          {/* Email/Password/OTP Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Email Input */}
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-gray-300"
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
                  className="block w-full appearance-none rounded-lg border border-gray-600 bg-[#3C4A5A] px-3 py-2 text-gray-100 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Password / OTP Toggle */}
            <div className="flex justify-between items-center text-sm">
                <button 
                    type="button" 
                    onClick={() => setLoginMethod(loginMethod === 'password' ? 'otp' : 'password')}
                    className="font-medium text-blue-400 hover:text-blue-300 transition duration-150 flex items-center"
                >
                    {loginMethod === 'password' ? 'Login via OTP' : 'Login with Password'}
                    <EnvelopeIcon className="w-4 h-4 ml-1" />
                </button>
            </div>

            {/* Conditional Input for Password or OTP */}
            {loginMethod === 'password' ? (
                // Password Input
                <div>
                    <label 
                        htmlFor="password" 
                        className="block text-sm font-medium text-gray-300"
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
                            className="block w-full appearance-none rounded-lg border border-gray-600 bg-[#3C4A5A] px-3 py-2 pr-10 text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                        />
                        <div 
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200 cursor-pointer"
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
            ) : (
                // OTP Input (Placeholder)
                <div>
                    <label 
                        htmlFor="otp" 
                        className="block text-sm font-medium text-gray-300"
                    >
                        Enter OTP
                    </label>
                    <div className="mt-1">
                        <input
                            id="otp"
                            name="otp"
                            type="text" // OTP is often text or number
                            required
                            placeholder="Check your email/phone"
                            className="block w-full appearance-none rounded-lg border border-gray-600 bg-[#3C4A5A] px-3 py-2 text-gray-100 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                        />
                    </div>
                </div>
            )}


            {/* Forgot Password Link */}
            <div className="flex items-center justify-end text-sm">
              <a href="#" className="font-medium text-blue-400 hover:text-blue-300 transition duration-150">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-lg border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#2A313C] transition duration-150"
              >
                Login
              </button>
            </div>
          </form>

          {/* Sign Up Link */}
          <p className="mt-8 text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <a href="#" className="font-medium text-blue-400 hover:text-blue-300 transition duration-150">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;