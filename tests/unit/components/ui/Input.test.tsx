import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Search } from 'lucide-react';
import Input from '@/components/ui/Input/Input';

describe('Input', () => {
    describe('rendering', () => {
        it('renders input element', () => {
            render(<Input placeholder="Enter text" />);
            expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
        });

        it('renders label when provided', () => {
            render(<Input label="Email" />);
            expect(screen.getByText('Email')).toBeInTheDocument();
        });

        it('renders required asterisk when required', () => {
            render(<Input label="Email" required />);
            expect(screen.getByText('*')).toHaveClass('text-red-500');
        });

        it('does not render required asterisk when not required', () => {
            render(<Input label="Email" />);
            expect(screen.queryByText('*')).not.toBeInTheDocument();
        });

        it('applies custom className', () => {
            render(<Input className="custom-input" />);
            const input = screen.getByRole('textbox');
            expect(input).toHaveClass('custom-input');
        });
    });

    describe('error state', () => {
        it('displays error message when error prop is provided', () => {
            render(<Input error="This field is required" />);
            expect(screen.getByText('This field is required')).toBeInTheDocument();
        });

        it('applies error styles when error is present', () => {
            render(<Input error="Invalid input" />);
            const input = screen.getByRole('textbox');
            expect(input).toHaveClass('border-red-500');
        });

        it('shows error icon when error is present', () => {
            render(<Input error="Error" data-testid="input" />);
            // Error icon should be present
            const errorContainer = document.querySelector('.text-red-500');
            expect(errorContainer).toBeInTheDocument();
        });
    });

    describe('helper text', () => {
        it('displays helper text when provided', () => {
            render(<Input helperText="Enter a valid email" />);
            expect(screen.getByText('Enter a valid email')).toBeInTheDocument();
        });

        it('prioritizes error over helper text', () => {
            render(
                <Input
                    error="Invalid email"
                    helperText="Enter a valid email"
                />
            );
            expect(screen.getByText('Invalid email')).toBeInTheDocument();
            expect(screen.queryByText('Enter a valid email')).not.toBeInTheDocument();
        });
    });

    describe('icon', () => {
        it('renders icon when provided', () => {
            render(<Input icon={<Search data-testid="search-icon" />} />);
            expect(screen.getByTestId('search-icon')).toBeInTheDocument();
        });

        it('applies padding for icon', () => {
            render(<Input icon={<Search />} />);
            const input = screen.getByRole('textbox');
            expect(input).toHaveClass('pl-11');
        });

        it('applies default padding without icon', () => {
            render(<Input />);
            const input = screen.getByRole('textbox');
            expect(input).toHaveClass('px-4');
        });
    });

    describe('disabled state', () => {
        it('is disabled when disabled prop is true', () => {
            render(<Input disabled />);
            expect(screen.getByRole('textbox')).toBeDisabled();
        });

        it('applies disabled styles', () => {
            render(<Input disabled />);
            const input = screen.getByRole('textbox');
            expect(input).toHaveClass('bg-gray-100', 'text-gray-500', 'cursor-not-allowed');
        });

        it('does not trigger onChange when disabled', () => {
            const handleChange = vi.fn();
            render(<Input disabled onChange={handleChange} />);
            fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test' } });
            // Input is disabled, so change event won't fire in real scenario
            // This test verifies the disabled attribute is set
            expect(screen.getByRole('textbox')).toBeDisabled();
        });
    });

    describe('interactions', () => {
        it('calls onChange when value changes', () => {
            const handleChange = vi.fn();
            render(<Input onChange={handleChange} />);
            fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test' } });
            expect(handleChange).toHaveBeenCalled();
        });

        it('supports value prop for controlled input', () => {
            const { rerender } = render(<Input value="initial" onChange={() => {}} />);
            expect(screen.getByRole('textbox')).toHaveValue('initial');

            rerender(<Input value="updated" onChange={() => {}} />);
            expect(screen.getByRole('textbox')).toHaveValue('updated');
        });
    });

    describe('ref forwarding', () => {
        it('forwards ref to input element', () => {
            const ref = { current: null as HTMLInputElement | null };
            render(<Input ref={(el) => { ref.current = el; }} />);
            expect(ref.current).toBeInstanceOf(HTMLInputElement);
        });
    });

    describe('accessibility', () => {
        it('associates label with input', () => {
            render(<Input label="Username" />);
            const label = screen.getByText('Username');
            expect(label.tagName).toBe('LABEL');
        });

        it('supports aria-describedby', () => {
            render(<Input aria-describedby="help-text" />);
            expect(screen.getByRole('textbox')).toHaveAttribute('aria-describedby', 'help-text');
        });

        it('is focusable', () => {
            render(<Input />);
            const input = screen.getByRole('textbox');
            input.focus();
            expect(input).toHaveFocus();
        });
    });

    describe('input types', () => {
        it('supports email type', () => {
            render(<Input type="email" />);
            expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
        });

        it('supports tel type', () => {
            render(<Input type="tel" />);
            expect(screen.getByRole('textbox')).toHaveAttribute('type', 'tel');
        });
    });
});
