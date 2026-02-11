import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmptyState } from '@/components/ui/EmptyState/EmptyState';

describe('EmptyState', () => {
    const defaultProps = {
        title: 'No data found',
        description: 'There is no data to display at this time.',
    };

    describe('rendering', () => {
        it('renders title', () => {
            render(<EmptyState {...defaultProps} />);
            expect(screen.getByText('No data found')).toBeInTheDocument();
        });

        it('renders description', () => {
            render(<EmptyState {...defaultProps} />);
            expect(screen.getByText('There is no data to display at this time.')).toBeInTheDocument();
        });

        it('renders default icon when no icon is provided', () => {
            const { container } = render(<EmptyState {...defaultProps} />);
            const svg = container.querySelector('svg');
            expect(svg).toBeInTheDocument();
        });

        it('renders custom icon when provided', () => {
            render(
                <EmptyState
                    {...defaultProps}
                    icon={<span data-testid="custom-icon">Custom Icon</span>}
                />
            );
            expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
        });

        it('does not render default icon when custom icon is provided', () => {
            const { container } = render(
                <EmptyState
                    {...defaultProps}
                    icon={<span data-testid="custom-icon">Custom</span>}
                />
            );
            // Should only have the custom icon, not the default SVG
            const defaultSvg = container.querySelector('svg.w-10.h-10');
            expect(defaultSvg).not.toBeInTheDocument();
        });
    });

    describe('action rendering', () => {
        it('renders action when provided', () => {
            render(
                <EmptyState
                    {...defaultProps}
                    action={<button>Add Item</button>}
                />
            );
            expect(screen.getByRole('button', { name: 'Add Item' })).toBeInTheDocument();
        });

        it('does not render action wrapper when action is not provided', () => {
            const { container } = render(<EmptyState {...defaultProps} />);
            // Check that there's no action wrapper (mt-6 class div)
            const actionWrapper = container.querySelector('.mt-6');
            expect(actionWrapper).not.toBeInTheDocument();
        });

        it('renders complex action elements', () => {
            render(
                <EmptyState
                    {...defaultProps}
                    action={
                        <div data-testid="action-container">
                            <button>Primary</button>
                            <button>Secondary</button>
                        </div>
                    }
                />
            );
            expect(screen.getByTestId('action-container')).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Primary' })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Secondary' })).toBeInTheDocument();
        });
    });

    describe('styling', () => {
        it('has centered flex layout', () => {
            const { container } = render(<EmptyState {...defaultProps} />);
            const wrapper = container.firstChild;
            expect(wrapper).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center');
        });

        it('has proper title styles', () => {
            render(<EmptyState {...defaultProps} />);
            const title = screen.getByText('No data found');
            expect(title.tagName).toBe('H3');
            expect(title).toHaveClass('text-lg', 'font-semibold', 'text-gray-900');
        });

        it('has proper description styles', () => {
            render(<EmptyState {...defaultProps} />);
            const description = screen.getByText('There is no data to display at this time.');
            expect(description.tagName).toBe('P');
            expect(description).toHaveClass('text-sm', 'text-gray-500', 'text-center');
        });

        it('has icon container styles', () => {
            const { container } = render(<EmptyState {...defaultProps} />);
            const iconContainer = container.querySelector('.mb-4');
            expect(iconContainer).toBeInTheDocument();
            // The text-gray-300 class is on the icon (SVG), not the container
            const icon = iconContainer?.querySelector('svg');
            expect(icon).toHaveClass('text-gray-300');
        });
    });

    describe('content variations', () => {
        it('handles long titles', () => {
            const longTitle = 'This is a very long title that might wrap to multiple lines';
            render(<EmptyState title={longTitle} description="Description" />);
            expect(screen.getByText(longTitle)).toBeInTheDocument();
        });

        it('handles long descriptions', () => {
            const longDescription = 'This is a very long description that provides detailed information about the empty state and what the user can do to add data.';
            render(<EmptyState title="Title" description={longDescription} />);
            expect(screen.getByText(longDescription)).toBeInTheDocument();
        });

        it('handles special characters in text', () => {
            render(
                <EmptyState
                    title="No items & data found"
                    description="Description with <special> characters"
                />
            );
            expect(screen.getByText('No items & data found')).toBeInTheDocument();
            expect(screen.getByText('Description with <special> characters')).toBeInTheDocument();
        });
    });

    describe('accessibility', () => {
        it('uses semantic heading element', () => {
            render(<EmptyState {...defaultProps} />);
            const heading = screen.getByRole('heading', { level: 3 });
            expect(heading).toHaveTextContent('No data found');
        });

        it('has readable description as paragraph', () => {
            render(<EmptyState {...defaultProps} />);
            // Description is in a paragraph element
            const description = screen.getByText('There is no data to display at this time.');
            expect(description.tagName).toBe('P');
        });
    });
});
