import React, { Component, type ReactNode } from 'react';
import ErrorFallback from './ErrorFallback';

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

/**
 * ErrorBoundary - Enterprise-grade error boundary component
 * Catches JavaScript errors in child component tree and displays fallback UI.
 * 
 * @example
 * <ErrorBoundary>
 *   <MiscellaneousWorkContent />
 * </ErrorBoundary>
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        // Log error to console (can be replaced with error tracking service)
        console.error('ErrorBoundary caught an error:', error);
        console.error('Component stack:', errorInfo.componentStack);

        // Call optional error handler
        this.props.onError?.(error, errorInfo);
    }

    handleRetry = (): void => {
        this.setState({ hasError: false, error: null });
    };

    render(): ReactNode {
        if (this.state.hasError) {
            // Use custom fallback if provided, otherwise use default ErrorFallback
            if (this.props.fallback) {
                return this.props.fallback;
            }
            return (
                <ErrorFallback
                    error={this.state.error}
                    onRetry={this.handleRetry}
                />
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
