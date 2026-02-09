import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from '@/components/ui/Page/Pagination';

describe('Pagination', () => {
    const defaultProps = {
        currentPage: 1,
        totalItems: 100,
        itemsPerPage: 10,
        onPageChange: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('rendering', () => {
        it('renders pagination when items exceed itemsPerPage', () => {
            render(<Pagination {...defaultProps} />);
            expect(screen.getByText('1 / 10')).toBeInTheDocument();
        });

        it('returns null when totalItems is less than or equal to itemsPerPage', () => {
            const { container } = render(
                <Pagination {...defaultProps} totalItems={10} itemsPerPage={10} />
            );
            expect(container.firstChild).toBeNull();
        });

        it('returns null when totalItems is less than itemsPerPage', () => {
            const { container } = render(
                <Pagination {...defaultProps} totalItems={5} itemsPerPage={10} />
            );
            expect(container.firstChild).toBeNull();
        });

        it('shows correct entry count on first page', () => {
            render(<Pagination {...defaultProps} />);
            expect(screen.getByText((_content, element) => {
                return element?.textContent === 'Showing 1-10 of 100';
            })).toBeInTheDocument();
        });

        it('shows correct entry count on middle page', () => {
            render(<Pagination {...defaultProps} currentPage={5} />);
            expect(screen.getByText((_content, element) => {
                return element?.textContent === 'Showing 41-50 of 100';
            })).toBeInTheDocument();
        });

        it('shows correct entry count on last page', () => {
            render(<Pagination {...defaultProps} currentPage={10} />);
            expect(screen.getByText((_content, element) => {
                return element?.textContent === 'Showing 91-100 of 100';
            })).toBeInTheDocument();
        });

        it('shows correct entry count when last page has fewer items', () => {
            render(<Pagination {...defaultProps} totalItems={95} currentPage={10} />);
            expect(screen.getByText((_content, element) => {
                return element?.textContent === 'Showing 91-95 of 95';
            })).toBeInTheDocument();
        });

        it('applies custom className', () => {
            const { container } = render(
                <Pagination {...defaultProps} className="custom-pagination" />
            );
            expect(container.firstChild).toHaveClass('custom-pagination');
        });
    });

    describe('navigation buttons', () => {
        it('does not show Previous button on first page', () => {
            render(<Pagination {...defaultProps} currentPage={1} />);
            expect(screen.queryByRole('button', { name: 'Previous' })).not.toBeInTheDocument();
        });

        it('shows Previous button on pages after first', () => {
            render(<Pagination {...defaultProps} currentPage={2} />);
            expect(screen.getByRole('button', { name: 'Previous' })).toBeInTheDocument();
        });

        it('shows Next button when not on last page', () => {
            render(<Pagination {...defaultProps} currentPage={1} />);
            expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
        });

        it('does not show Next button on last page', () => {
            render(<Pagination {...defaultProps} currentPage={10} />);
            expect(screen.queryByRole('button', { name: 'Next' })).not.toBeInTheDocument();
        });

        it('shows both buttons on middle pages', () => {
            render(<Pagination {...defaultProps} currentPage={5} />);
            expect(screen.getByRole('button', { name: 'Previous' })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
        });
    });

    describe('page change callbacks', () => {
        it('calls onPageChange with previous page when Previous is clicked', () => {
            const handlePageChange = vi.fn();
            render(
                <Pagination
                    {...defaultProps}
                    currentPage={5}
                    onPageChange={handlePageChange}
                />
            );

            fireEvent.click(screen.getByRole('button', { name: 'Previous' }));
            expect(handlePageChange).toHaveBeenCalledWith(4);
        });

        it('calls onPageChange with next page when Next is clicked', () => {
            const handlePageChange = vi.fn();
            render(
                <Pagination
                    {...defaultProps}
                    currentPage={5}
                    onPageChange={handlePageChange}
                />
            );

            fireEvent.click(screen.getByRole('button', { name: 'Next' }));
            expect(handlePageChange).toHaveBeenCalledWith(6);
        });
    });

    describe('page indicator', () => {
        it('displays current page and total pages', () => {
            render(<Pagination {...defaultProps} currentPage={3} />);
            expect(screen.getByText('3 / 10')).toBeInTheDocument();
        });

        it('calculates total pages correctly', () => {
            render(<Pagination {...defaultProps} totalItems={55} itemsPerPage={10} />);
            expect(screen.getByText('1 / 6')).toBeInTheDocument();
        });

        it('handles edge case with exactly divisible items', () => {
            render(<Pagination {...defaultProps} totalItems={50} itemsPerPage={10} />);
            expect(screen.getByText('1 / 5')).toBeInTheDocument();
        });
    });

    describe('boundary conditions', () => {
        it('handles single extra item over itemsPerPage', () => {
            render(<Pagination {...defaultProps} totalItems={11} itemsPerPage={10} />);
            expect(screen.getByText('1 / 2')).toBeInTheDocument();
        });

        it('handles large number of pages', () => {
            render(<Pagination {...defaultProps} totalItems={10000} itemsPerPage={10} />);
            expect(screen.getByText('1 / 1000')).toBeInTheDocument();
        });

        it('handles custom items per page', () => {
            render(<Pagination {...defaultProps} totalItems={100} itemsPerPage={25} />);
            expect(screen.getByText('1 / 4')).toBeInTheDocument();
        });
    });
});
