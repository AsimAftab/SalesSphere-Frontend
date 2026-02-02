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
        <div className="flex min-h-screen bg-gray-900">
            {/* LEFT SIDE - Illustration */}
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
            <div className="w-full lg:w-1/2 bg-gray-100 flex items-center justify-center px-6 py-10 sm:px-12 overflow-y-auto">
                <div className="w-full max-w-[440px] bg-white rounded-2xl border border-gray-100 shadow-sm px-8 py-10 sm:px-10">
                    <ErrorBoundary>
                        {children}
                    </ErrorBoundary>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
