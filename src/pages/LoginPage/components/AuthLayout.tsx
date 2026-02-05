import React from 'react';
import { ErrorBoundary } from '@/components/ui';

interface AuthLayoutProps {
    bgImage: string | null;
    illustrationImage: string | null;
    illustrationAlt: string;
    children: React.ReactNode;
}

/**
 * AuthLayout - Shared two-column layout for all authentication pages.
 * Left side: decorative background + illustration (hidden on mobile).
 * Right side: form content passed as children.
 * Wraps children in ErrorBoundary for crash protection.
 */
const AuthLayout: React.FC<AuthLayoutProps> = ({
    bgImage,
    illustrationImage,
    illustrationAlt,
    children,
}) => {
    return (
        <div className="flex h-screen overflow-hidden bg-gray-900">
            {/* LEFT SIDE - Illustration (Desktop only) */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#1e3a5f] to-[#2d5a7b] relative overflow-hidden">
                {bgImage && (
                    <img
                        src={bgImage}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover opacity-100 transition-opacity duration-500"
                    />
                )}

                <div className="relative flex flex-col items-center justify-center w-full px-12 z-10">
                    <div className="flex flex-col items-center max-w-sm">
                        {illustrationImage && (
                            <img
                                src={illustrationImage}
                                alt={illustrationAlt}
                                className="w-full h-auto transition-opacity duration-500"
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE - Form Content */}
            <div className="relative w-full lg:w-1/2 flex items-center justify-center px-4 py-4 sm:px-6 md:px-12 sm:py-6 lg:py-10 overflow-y-auto">
                {/* Mobile Background - Subtle illustration */}
                <div className="absolute inset-0 lg:hidden">
                    {bgImage && (
                        <img
                            src={bgImage}
                            alt=""
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    )}
                    {/* Dark gradient overlay for readability */}
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/90 via-primary to-primary" />
                </div>

                {/* Desktop background */}
                <div className="absolute inset-0 hidden lg:block bg-gray-100" />

                {/* Form Card */}
                <div className="relative z-10 w-full max-w-[440px] bg-white rounded-2xl border border-gray-100 shadow-xl lg:shadow-sm px-5 py-6 sm:px-8 sm:py-8 md:px-10">
                    <ErrorBoundary>
                        {children}
                    </ErrorBoundary>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
