import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '@/components/ui/SearchBar/SearchBar';

describe('SearchBar', () => {
    const defaultProps = {
        value: '',
        onChange: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('rendering', () => {
        it('renders search input', () => {
            render(<SearchBar {...defaultProps} />);
            expect(screen.getByRole('searchbox')).toBeInTheDocument();
        });

        it('renders with default placeholder', () => {
            render(<SearchBar {...defaultProps} />);
            expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
        });

        it('renders with custom placeholder', () => {
            render(<SearchBar {...defaultProps} placeholder="Search employees..." />);
            expect(screen.getByPlaceholderText('Search employees...')).toBeInTheDocument();
        });

        it('displays search icon', () => {
            const { container } = render(<SearchBar {...defaultProps} />);
            const icon = container.querySelector('svg');
            expect(icon).toBeInTheDocument();
        });

        it('applies custom className', () => {
            const { container } = render(<SearchBar {...defaultProps} className="custom-search" />);
            const wrapper = container.firstChild;
            expect(wrapper).toHaveClass('custom-search');
        });
    });

    describe('controlled value', () => {
        it('displays the provided value', () => {
            render(<SearchBar {...defaultProps} value="john" />);
            expect(screen.getByRole('searchbox')).toHaveValue('john');
        });

        it('updates when value prop changes', () => {
            const { rerender } = render(<SearchBar {...defaultProps} value="john" />);
            expect(screen.getByRole('searchbox')).toHaveValue('john');

            rerender(<SearchBar {...defaultProps} value="jane" />);
            expect(screen.getByRole('searchbox')).toHaveValue('jane');
        });
    });

    describe('onChange behavior', () => {
        it('calls onChange when user types', () => {
            const handleChange = vi.fn();
            render(<SearchBar value="" onChange={handleChange} />);

            fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'test' } });
            expect(handleChange).toHaveBeenCalledWith('test');
        });

        it('calls onChange with each keystroke', () => {
            const handleChange = vi.fn();
            render(<SearchBar value="" onChange={handleChange} />);
            const input = screen.getByRole('searchbox');

            fireEvent.change(input, { target: { value: 'a' } });
            fireEvent.change(input, { target: { value: 'ab' } });
            fireEvent.change(input, { target: { value: 'abc' } });

            expect(handleChange).toHaveBeenCalledTimes(3);
            expect(handleChange).toHaveBeenNthCalledWith(1, 'a');
            expect(handleChange).toHaveBeenNthCalledWith(2, 'ab');
            expect(handleChange).toHaveBeenNthCalledWith(3, 'abc');
        });
    });

    describe('clear functionality', () => {
        it('calls onChange with empty string when cleared via input event', () => {
            const handleChange = vi.fn();
            render(<SearchBar value="test" onChange={handleChange} />);
            const input = screen.getByRole('searchbox');

            // Simulate the clear action (X button click in search input)
            fireEvent.input(input, { target: { value: '' } });
            expect(handleChange).toHaveBeenCalledWith('');
        });

        it('handles onInput for clearing', () => {
            const handleChange = vi.fn();
            render(<SearchBar value="" onChange={handleChange} />);
            const input = screen.getByRole('searchbox');

            // When value is already empty and input event fires with empty value
            Object.defineProperty(input, 'value', { value: '', writable: true });
            fireEvent.input(input, { target: { value: '' } });
            expect(handleChange).toHaveBeenCalledWith('');
        });
    });

    describe('styling', () => {
        it('has responsive width classes', () => {
            const { container } = render(<SearchBar {...defaultProps} />);
            const wrapper = container.firstChild;
            expect(wrapper).toHaveClass('w-full', 'sm:w-64', 'xl:w-72', '2xl:w-80');
        });

        it('has proper input styling', () => {
            render(<SearchBar {...defaultProps} />);
            const input = screen.getByRole('searchbox');
            expect(input).toHaveClass('rounded-full', 'bg-gray-200');
        });
    });

    describe('accessibility', () => {
        it('has type="search"', () => {
            render(<SearchBar {...defaultProps} />);
            expect(screen.getByRole('searchbox')).toHaveAttribute('type', 'search');
        });

        it('is focusable', () => {
            render(<SearchBar {...defaultProps} />);
            const input = screen.getByRole('searchbox');
            input.focus();
            expect(input).toHaveFocus();
        });

        it('has accessible placeholder', () => {
            render(<SearchBar {...defaultProps} placeholder="Search by name" />);
            // Placeholder provides context for screen readers
            expect(screen.getByPlaceholderText('Search by name')).toBeInTheDocument();
        });
    });
});
