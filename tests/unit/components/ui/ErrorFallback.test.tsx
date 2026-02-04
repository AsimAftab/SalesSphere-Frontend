import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorFallback from '@/components/ui/ErrorBoundary/ErrorFallback';

describe('ErrorFallback', () => {
    describe('rendering', () => {
        it('renders with default title', () => {
            render(<ErrorFallback error={null} />);
            expect(screen.getByText('Something went wrong')).toBeInTheDocument();
        });

        it('renders with custom title', () => {
            render(<ErrorFallback error={null} title="Connection Error" />);
            expect(screen.getByText('Connection Error')).toBeInTheDocument();
        });

        it('renders error icon', () => {
            const { container } = render(<ErrorFallback error={null} />);
            const icon = container.querySelector('svg');
            expect(icon).toBeInTheDocument();
        });
    });

    describe('error message handling', () => {
        it('displays error message from Error object', () => {
            const error = new Error('Database connection failed');
            render(<ErrorFallback error={error} />);
            expect(screen.getByText('Database connection failed')).toBeInTheDocument();
        });

        it('displays error message when error is a string', () => {
            render(<ErrorFallback error="Network timeout" />);
            expect(screen.getByText('Network timeout')).toBeInTheDocument();
        });

        it('displays custom message over error message', () => {
            const error = new Error('Original error');
            render(<ErrorFallback error={error} message="Custom error message" />);
            expect(screen.getByText('Custom error message')).toBeInTheDocument();
            expect(screen.queryByText('Original error')).not.toBeInTheDocument();
        });

        it('displays default message when error is null', () => {
            render(<ErrorFallback error={null} />);
            expect(screen.getByText('An unexpected error occurred. Please try again.')).toBeInTheDocument();
        });

        it('displays default message when error has no message', () => {
            render(<ErrorFallback error={new Error()} />);
            expect(screen.getByText('An unexpected error occurred. Please try again.')).toBeInTheDocument();
        });
    });

    describe('retry button', () => {
        it('renders retry button when onRetry is provided', () => {
            const handleRetry = vi.fn();
            render(<ErrorFallback error={null} onRetry={handleRetry} />);
            expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
        });

        it('does not render retry button when onRetry is not provided', () => {
            render(<ErrorFallback error={null} />);
            expect(screen.queryByRole('button', { name: /try again/i })).not.toBeInTheDocument();
        });

        it('calls onRetry when retry button is clicked', () => {
            const handleRetry = vi.fn();
            render(<ErrorFallback error={null} onRetry={handleRetry} />);

            fireEvent.click(screen.getByRole('button', { name: /try again/i }));
            expect(handleRetry).toHaveBeenCalledTimes(1);
        });

        it('retry button has refresh icon', () => {
            const handleRetry = vi.fn();
            render(<ErrorFallback error={null} onRetry={handleRetry} />);
            const button = screen.getByRole('button', { name: /try again/i });
            const icon = button.querySelector('svg');
            expect(icon).toBeInTheDocument();
        });
    });

    describe('styling', () => {
        it('has centered flex layout', () => {
            const { container } = render(<ErrorFallback error={null} />);
            const wrapper = container.firstChild;
            expect(wrapper).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center');
        });

        it('has error-themed container', () => {
            const { container } = render(<ErrorFallback error={null} />);
            const errorBox = container.querySelector('.bg-red-50');
            expect(errorBox).toBeInTheDocument();
            expect(errorBox).toHaveClass('border-red-200', 'rounded-2xl');
        });

        it('has proper title styling', () => {
            render(<ErrorFallback error={null} />);
            const title = screen.getByText('Something went wrong');
            expect(title.tagName).toBe('H2');
            expect(title).toHaveClass('text-xl', 'font-black', 'text-red-700');
        });

        it('has proper message styling', () => {
            render(<ErrorFallback error="Test error" />);
            const message = screen.getByText('Test error');
            expect(message).toHaveClass('text-sm', 'text-red-600');
        });

        it('has icon container with red styling', () => {
            const { container } = render(<ErrorFallback error={null} />);
            const iconContainer = container.querySelector('.bg-red-100');
            expect(iconContainer).toBeInTheDocument();
            expect(iconContainer).toHaveClass('rounded-full');
        });
    });

    describe('accessibility', () => {
        it('uses semantic heading element', () => {
            render(<ErrorFallback error={null} />);
            const heading = screen.getByRole('heading', { level: 2 });
            expect(heading).toHaveTextContent('Something went wrong');
        });

        it('error message is in a paragraph', () => {
            render(<ErrorFallback error="Test error" />);
            const message = screen.getByText('Test error');
            expect(message.tagName).toBe('P');
        });
    });

    describe('edge cases', () => {
        it('handles empty string error', () => {
            render(<ErrorFallback error="" />);
            expect(screen.getByText('An unexpected error occurred. Please try again.')).toBeInTheDocument();
        });

        it('handles error with only whitespace', () => {
            render(<ErrorFallback error="   " />);
            // Whitespace is truthy, so it will show the whitespace (or implementation might trim it)
            expect(screen.getByText(/\s+|An unexpected error/)).toBeInTheDocument();
        });
    });
});
