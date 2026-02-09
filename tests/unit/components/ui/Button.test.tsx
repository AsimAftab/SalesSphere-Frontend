import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '@/components/ui/Button/Button';

describe('Button', () => {
    describe('rendering', () => {
        it('renders children correctly', () => {
            render(<Button>Click Me</Button>);
            expect(screen.getByRole('button', { name: 'Click Me' })).toBeInTheDocument();
        });

        it('renders with default variant (secondary)', () => {
            render(<Button>Default</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('bg-secondary/90');
        });

        it('applies custom className', () => {
            render(<Button className="custom-class">Test</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('custom-class');
        });
    });

    describe('variants', () => {
        it('renders primary variant', () => {
            render(<Button variant="primary">Primary</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('bg-secondary/90', 'text-white');
        });

        it('renders secondary variant', () => {
            render(<Button variant="secondary">Secondary</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('bg-secondary/90', 'text-white');
        });

        it('renders outline variant', () => {
            render(<Button variant="outline">Outline</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('bg-white', 'text-gray-700', 'border-gray-300');
        });

        it('renders danger variant', () => {
            render(<Button variant="danger">Danger</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('text-red-600', 'border-red-300');
        });

        it('renders success variant', () => {
            render(<Button variant="success">Success</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('text-green-600', 'border-green-300');
        });

        it('renders ghost variant', () => {
            render(<Button variant="ghost">Ghost</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('bg-transparent', 'text-primary');
        });
    });

    describe('sizes', () => {
        it('renders default size', () => {
            render(<Button size="default">Default Size</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('px-6', 'py-3');
        });

        it('renders icon size', () => {
            render(<Button size="icon">Icon</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('p-1');
        });
    });

    describe('loading state', () => {
        it('shows loading spinner when isLoading is true', () => {
            render(<Button isLoading>Submit</Button>);
            expect(screen.getByText('Processing...')).toBeInTheDocument();
        });

        it('disables button when isLoading is true', () => {
            render(<Button isLoading>Submit</Button>);
            expect(screen.getByRole('button')).toBeDisabled();
        });

        it('shows children when not loading', () => {
            render(<Button isLoading={false}>Submit</Button>);
            expect(screen.getByText('Submit')).toBeInTheDocument();
            expect(screen.queryByText('Processing...')).not.toBeInTheDocument();
        });
    });

    describe('disabled state', () => {
        it('is disabled when disabled prop is true', () => {
            render(<Button disabled>Disabled</Button>);
            expect(screen.getByRole('button')).toBeDisabled();
        });

        it('is disabled when both isLoading and disabled are true', () => {
            render(<Button isLoading disabled>Submit</Button>);
            expect(screen.getByRole('button')).toBeDisabled();
        });

        it('has disabled styles when disabled', () => {
            render(<Button disabled>Disabled</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('disabled:opacity-50');
        });
    });

    describe('interactions', () => {
        it('calls onClick when clicked', () => {
            const handleClick = vi.fn();
            render(<Button onClick={handleClick}>Click</Button>);
            fireEvent.click(screen.getByRole('button'));
            expect(handleClick).toHaveBeenCalledTimes(1);
        });

        it('does not call onClick when disabled', () => {
            const handleClick = vi.fn();
            render(<Button onClick={handleClick} disabled>Click</Button>);
            fireEvent.click(screen.getByRole('button'));
            expect(handleClick).not.toHaveBeenCalled();
        });

        it('does not call onClick when loading', () => {
            const handleClick = vi.fn();
            render(<Button onClick={handleClick} isLoading>Click</Button>);
            fireEvent.click(screen.getByRole('button'));
            expect(handleClick).not.toHaveBeenCalled();
        });
    });

    describe('accessibility', () => {
        it('supports type attribute', () => {
            render(<Button type="submit">Submit</Button>);
            expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
        });

        it('supports aria-label', () => {
            render(<Button aria-label="Close dialog">X</Button>);
            expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Close dialog');
        });

        it('is focusable', () => {
            render(<Button>Focus Me</Button>);
            const button = screen.getByRole('button');
            button.focus();
            expect(button).toHaveFocus();
        });
    });
});
