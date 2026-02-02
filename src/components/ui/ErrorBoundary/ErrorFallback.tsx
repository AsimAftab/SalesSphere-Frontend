import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui';

interface ErrorFallbackProps {
    error: Error | string | null;
    onRetry?: () => void;
    title?: string;
    message?: string;
}

/**
 * ErrorFallback - Displays a user-friendly error message when something goes wrong.
 * Used by ErrorBoundary component.
 */
const ErrorFallback: React.FC<ErrorFallbackProps> = ({
    error,
    onRetry,
    title = "Something went wrong",
    message
}) => {
    const errorMessage = message || (typeof error === 'string' ? error : error?.message) || "An unexpected error occurred. Please try again.";

    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
            <div className="bg-red-50 rounded-2xl border border-red-200 p-8 max-w-md w-full text-center shadow-sm">
                {/* Icon */}
                <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>

                {/* Title */}
                <h2 className="text-xl font-black text-red-700 mb-2">{title}</h2>

                {/* Message */}
                <p className="text-sm text-red-600 mb-6 leading-relaxed">{errorMessage}</p>

                {/* Retry Button */}
                {onRetry && (
                    <Button
                        onClick={onRetry}
                        variant="secondary"
                        className="inline-flex items-center gap-2"
                    >
                        <RefreshCw size={16} />
                        Try Again
                    </Button>
                )}
            </div>
        </div>
    );
};

export default ErrorFallback;
