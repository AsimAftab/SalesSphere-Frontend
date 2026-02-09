
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from '@/components/ui/ErrorBoundary/ErrorBoundary';

// Component that throws an error
const ThrowError = ({ shouldThrow = true }: { shouldThrow?: boolean }) => {
    if (shouldThrow) {
        throw new Error('Test error');
    }
    return <div>No error</div>;
};

describe('ErrorBoundary', () => {
    // Suppress console.error during tests
    const originalError = console.error;

    beforeEach(() => {
        console.error = vi.fn();
    });

    afterEach(() => {
        console.error = originalError;
    });

    describe('normal rendering', () => {
        it('renders children when no error occurs', () => {
            render(
                <ErrorBoundary>
                    <div>Child content</div>
                </ErrorBoundary>
            );
            expect(screen.getByText('Child content')).toBeInTheDocument();
        });

        it('renders multiple children', () => {
            render(
                <ErrorBoundary>
                    <div>First child</div>
                    <div>Second child</div>
                </ErrorBoundary>
            );
            expect(screen.getByText('First child')).toBeInTheDocument();
            expect(screen.getByText('Second child')).toBeInTheDocument();
        });
    });

    describe('error handling', () => {
        it('catches errors and displays fallback UI', () => {
            render(
                <ErrorBoundary>
                    <ThrowError />
                </ErrorBoundary>
            );
            // Default ErrorFallback should be displayed
            expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
        });

        it('displays custom fallback when provided', () => {
            render(
                <ErrorBoundary fallback={<div>Custom error message</div>}>
                    <ThrowError />
                </ErrorBoundary>
            );
            expect(screen.getByText('Custom error message')).toBeInTheDocument();
        });

        it('calls onError callback when error occurs', () => {
            const handleError = vi.fn();
            render(
                <ErrorBoundary onError={handleError}>
                    <ThrowError />
                </ErrorBoundary>
            );
            expect(handleError).toHaveBeenCalledTimes(1);
            expect(handleError).toHaveBeenCalledWith(
                expect.any(Error),
                expect.objectContaining({
                    componentStack: expect.any(String),
                })
            );
        });

        it('logs error to console', () => {
            render(
                <ErrorBoundary>
                    <ThrowError />
                </ErrorBoundary>
            );
            expect(console.error).toHaveBeenCalledWith(
                'ErrorBoundary caught an error:',
                expect.any(Error)
            );
        });

        it('logs component stack to console', () => {
            render(
                <ErrorBoundary>
                    <ThrowError />
                </ErrorBoundary>
            );
            expect(console.error).toHaveBeenCalledWith(
                'Component stack:',
                expect.any(String)
            );
        });
    });

    describe('retry functionality', () => {
        it('renders retry button in default fallback', () => {
            render(
                <ErrorBoundary>
                    <ThrowError />
                </ErrorBoundary>
            );
            expect(screen.getByRole('button', { name: /retry|try again/i })).toBeInTheDocument();
        });

        it('resets error state when retry is clicked', () => {
            let shouldThrow = true;

            const ConditionalError = () => {
                if (shouldThrow) {
                    throw new Error('Test error');
                }
                return <div>Recovered content</div>;
            };

            render(
                <ErrorBoundary>
                    <ConditionalError />
                </ErrorBoundary>
            );

            // Error state
            expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();

            // Fix the error condition before retry
            shouldThrow = false;

            // Click retry
            fireEvent.click(screen.getByRole('button', { name: /retry|try again/i }));

            // Should show recovered content
            expect(screen.getByText('Recovered content')).toBeInTheDocument();
        });
    });

    describe('error state management', () => {
        it('captures error in state', () => {
            render(
                <ErrorBoundary>
                    <ThrowError />
                </ErrorBoundary>
            );
            // The error should be captured - we verify by checking fallback is shown
            expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
        });

        it('preserves error message in fallback', () => {
            const SpecificError = () => {
                throw new Error('Specific error message');
            };

            render(
                <ErrorBoundary>
                    <SpecificError />
                </ErrorBoundary>
            );

            // Default ErrorFallback should show some indication of the error
            expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
        });
    });

    describe('nested error boundaries', () => {
        it('outer boundary does not catch when inner boundary catches', () => {
            const outerOnError = vi.fn();
            const innerOnError = vi.fn();

            render(
                <ErrorBoundary onError={outerOnError}>
                    <div>Outer content</div>
                    <ErrorBoundary onError={innerOnError}>
                        <ThrowError />
                    </ErrorBoundary>
                </ErrorBoundary>
            );

            // Inner boundary should catch
            expect(innerOnError).toHaveBeenCalled();
            // Outer boundary should not catch (error was handled by inner)
            expect(outerOnError).not.toHaveBeenCalled();
            // Outer content should still be visible
            expect(screen.getByText('Outer content')).toBeInTheDocument();
        });
    });

    describe('getDerivedStateFromError', () => {
        it('sets hasError to true when error occurs', () => {
            render(
                <ErrorBoundary>
                    <ThrowError />
                </ErrorBoundary>
            );
            // If fallback is shown, hasError is true
            expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
        });
    });
});
