import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StatusBadge } from '@/components/ui/StatusBadge/StatusBadge';

describe('StatusBadge', () => {
    describe('rendering', () => {
        it('renders status text', () => {
            render(<StatusBadge status="pending" />);
            expect(screen.getByRole('button', { name: 'pending' })).toBeInTheDocument();
        });

        it('renders as uppercase', () => {
            render(<StatusBadge status="approved" />);
            const badge = screen.getByRole('button');
            expect(badge).toHaveClass('uppercase');
        });
    });

    describe('status colors', () => {
        it('applies approved/completed colors', () => {
            render(<StatusBadge status="approved" />);
            const badge = screen.getByRole('button');
            expect(badge).toHaveClass('bg-green-100', 'text-green-700', 'border-green-200');
        });

        it('applies completed colors', () => {
            render(<StatusBadge status="completed" />);
            const badge = screen.getByRole('button');
            expect(badge).toHaveClass('bg-green-100', 'text-green-700');
        });

        it('applies rejected colors', () => {
            render(<StatusBadge status="rejected" />);
            const badge = screen.getByRole('button');
            expect(badge).toHaveClass('bg-red-100', 'text-red-700', 'border-red-200');
        });

        it('applies cancelled colors', () => {
            render(<StatusBadge status="cancelled" />);
            const badge = screen.getByRole('button');
            expect(badge).toHaveClass('bg-red-100', 'text-red-700');
        });

        it('applies pending colors', () => {
            render(<StatusBadge status="pending" />);
            const badge = screen.getByRole('button');
            expect(badge).toHaveClass('bg-blue-100', 'text-blue-700', 'border-blue-200');
        });

        it('applies in progress colors', () => {
            render(<StatusBadge status="in progress" />);
            const badge = screen.getByRole('button');
            expect(badge).toHaveClass('bg-purple-100', 'text-purple-700', 'border-purple-200');
        });

        it('applies in transit colors', () => {
            render(<StatusBadge status="in transit" />);
            const badge = screen.getByRole('button');
            expect(badge).toHaveClass('bg-orange-100', 'text-orange-700', 'border-orange-200');
        });

        it('applies active colors', () => {
            render(<StatusBadge status="active" />);
            const badge = screen.getByRole('button');
            expect(badge).toHaveClass('bg-green-100', 'text-green-800', 'border-green-200');
        });

        it('applies inactive colors', () => {
            render(<StatusBadge status="inactive" />);
            const badge = screen.getByRole('button');
            expect(badge).toHaveClass('bg-red-100', 'text-red-700', 'border-red-200');
        });

        it('applies default gray colors for unknown status', () => {
            render(<StatusBadge status="unknown" />);
            const badge = screen.getByRole('button');
            expect(badge).toHaveClass('bg-gray-100', 'text-gray-700', 'border-gray-200');
        });
    });

    describe('case insensitivity', () => {
        it('handles uppercase status', () => {
            render(<StatusBadge status="APPROVED" />);
            const badge = screen.getByRole('button');
            expect(badge).toHaveClass('bg-green-100');
        });

        it('handles mixed case status', () => {
            render(<StatusBadge status="Pending" />);
            const badge = screen.getByRole('button');
            expect(badge).toHaveClass('bg-blue-100');
        });

        it('handles mixed case multi-word status', () => {
            render(<StatusBadge status="In Progress" />);
            const badge = screen.getByRole('button');
            expect(badge).toHaveClass('bg-purple-100');
        });
    });

    describe('click behavior', () => {
        it('is clickable when onClick is provided', () => {
            const handleClick = vi.fn();
            render(<StatusBadge status="pending" onClick={handleClick} />);

            fireEvent.click(screen.getByRole('button'));
            expect(handleClick).toHaveBeenCalledTimes(1);
        });

        it('has hover styles when clickable', () => {
            const handleClick = vi.fn();
            render(<StatusBadge status="pending" onClick={handleClick} />);
            const badge = screen.getByRole('button');
            expect(badge).toHaveClass('hover:scale-105', 'active:scale-95', 'cursor-pointer');
        });

        it('does not call onClick when disabled', () => {
            const handleClick = vi.fn();
            render(<StatusBadge status="pending" onClick={handleClick} disabled />);

            fireEvent.click(screen.getByRole('button'));
            expect(handleClick).not.toHaveBeenCalled();
        });

        it('has default cursor when not clickable', () => {
            render(<StatusBadge status="pending" />);
            const badge = screen.getByRole('button');
            expect(badge).toHaveClass('cursor-default');
        });

        it('has default cursor when disabled', () => {
            render(<StatusBadge status="pending" onClick={() => {}} disabled />);
            const badge = screen.getByRole('button');
            expect(badge).toHaveClass('cursor-default');
        });
    });

    describe('disabled state', () => {
        it('is disabled when no onClick', () => {
            render(<StatusBadge status="pending" />);
            expect(screen.getByRole('button')).toBeDisabled();
        });

        it('is disabled when disabled prop is true', () => {
            render(<StatusBadge status="pending" onClick={() => {}} disabled />);
            expect(screen.getByRole('button')).toBeDisabled();
        });

        it('is not disabled when clickable', () => {
            render(<StatusBadge status="pending" onClick={() => {}} />);
            expect(screen.getByRole('button')).not.toBeDisabled();
        });
    });

    describe('styling', () => {
        it('has proper base styles', () => {
            render(<StatusBadge status="pending" />);
            const badge = screen.getByRole('button');
            expect(badge).toHaveClass(
                'inline-flex',
                'items-center',
                'px-3',
                'py-1',
                'text-xs',
                'font-bold',
                'rounded-xl',
                'border',
                'transition-all'
            );
        });
    });
});
