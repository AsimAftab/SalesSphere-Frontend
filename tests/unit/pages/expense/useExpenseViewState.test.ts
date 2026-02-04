import { describe, it, expect } from 'vitest';

// Extracted filter logic from useExpenseViewState

interface Expense {
    id: string;
    title: string;
    category: string;
    status: 'pending' | 'approved' | 'rejected';
    incurredDate: string;
    createdBy: { id?: string; name: string };
    approvedBy?: { name: string };
}

function filterExpenses(
    expenses: Expense[],
    searchTerm: string,
    selectedMonth: string[],
    selectedDate: Date | null,
    selectedUser: string[],
    selectedCategory: string[],
    selectedReviewer: string[],
    selectedStatus: string[]
): Expense[] {
    return expenses.filter((exp) => {
        const title = (exp.title || "").toLowerCase();
        const category = (exp.category || "").toLowerCase();
        const term = (searchTerm || "").toLowerCase();
        const matchesSearch = term === "" || title.includes(term) || category.includes(term);

        let matchesMonth = true;
        if (selectedMonth.length > 0 && exp.incurredDate) {
            const date = new Date(exp.incurredDate);
            const monthName = date.toLocaleString('default', { month: 'long' });
            matchesMonth = selectedMonth.includes(monthName);
        }

        let matchesDate = true;
        if (selectedDate && exp.incurredDate) {
            const d1 = new Date(exp.incurredDate);
            const d2 = selectedDate;
            matchesDate = d1.getFullYear() === d2.getFullYear() &&
                d1.getMonth() === d2.getMonth() &&
                d1.getDate() === d2.getDate();
        }

        const matchesUser = selectedUser.length === 0 ||
            (exp.createdBy?.name && selectedUser.includes(exp.createdBy.name));

        const matchesCategory = selectedCategory.length === 0 ||
            selectedCategory.includes(exp.category);

        const reviewerName = exp.approvedBy?.name || "None";
        const matchesReviewer = selectedReviewer.length === 0 ||
            selectedReviewer.includes(reviewerName);

        const matchesStatus = selectedStatus.length === 0 ||
            selectedStatus.includes(exp.status);

        return matchesSearch && matchesMonth && matchesDate && matchesUser && matchesCategory && matchesReviewer && matchesStatus;
    });
}

function paginateExpenses(
    expenses: Expense[],
    currentPage: number,
    itemsPerPage: number
): Expense[] {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return expenses.slice(startIndex, startIndex + itemsPerPage);
}

function canDeleteExpense(expense: Expense): boolean {
    return expense.status !== 'approved';
}

function filterDeletableExpenses(expenses: Expense[], ids: string[]): string[] {
    return ids.filter(id => {
        const expense = expenses.find(e => e.id === id);
        return expense?.status !== 'approved';
    });
}

// Test data
const mockExpenses: Expense[] = [
    { id: '1', title: 'Travel Expense', category: 'Travel', status: 'pending', incurredDate: '2026-01-15', createdBy: { id: 'u1', name: 'John' }, approvedBy: undefined },
    { id: '2', title: 'Office Supplies', category: 'Supplies', status: 'approved', incurredDate: '2026-01-20', createdBy: { id: 'u2', name: 'Jane' }, approvedBy: { name: 'Admin' } },
    { id: '3', title: 'Client Lunch', category: 'Meals', status: 'pending', incurredDate: '2026-02-10', createdBy: { id: 'u1', name: 'John' }, approvedBy: undefined },
    { id: '4', title: 'Software License', category: 'Software', status: 'rejected', incurredDate: '2026-02-15', createdBy: { id: 'u3', name: 'Bob' }, approvedBy: { name: 'Admin' } },
    { id: '5', title: 'Taxi Fare', category: 'Travel', status: 'approved', incurredDate: '2026-03-01', createdBy: { id: 'u2', name: 'Jane' }, approvedBy: { name: 'Manager' } },
];

describe('Expense View State - Filter Logic', () => {
    it('should return all expenses when no filters applied', () => {
        const result = filterExpenses(mockExpenses, '', [], null, [], [], [], []);
        expect(result).toHaveLength(5);
    });

    it('should filter by search term (title)', () => {
        const result = filterExpenses(mockExpenses, 'Travel', [], null, [], [], [], []);
        expect(result).toHaveLength(2);
    });

    it('should filter by search term (category)', () => {
        const result = filterExpenses(mockExpenses, 'Meals', [], null, [], [], [], []);
        expect(result).toHaveLength(1);
    });

    it('should filter by status', () => {
        const result = filterExpenses(mockExpenses, '', [], null, [], [], [], ['pending']);
        expect(result).toHaveLength(2);
    });

    it('should filter by category', () => {
        const result = filterExpenses(mockExpenses, '', [], null, [], ['Travel'], [], []);
        expect(result).toHaveLength(2);
    });

    it('should filter by user (created by)', () => {
        const result = filterExpenses(mockExpenses, '', [], null, ['John'], [], [], []);
        expect(result).toHaveLength(2);
    });

    it('should filter by reviewer', () => {
        const result = filterExpenses(mockExpenses, '', [], null, [], [], ['Admin'], []);
        expect(result).toHaveLength(2);
    });

    it('should handle "None" reviewer for unapproved expenses', () => {
        const result = filterExpenses(mockExpenses, '', [], null, [], [], ['None'], []);
        expect(result).toHaveLength(2); // Expenses without approvedBy
    });

    it('should combine multiple filters', () => {
        const result = filterExpenses(mockExpenses, '', [], null, ['John'], [], [], ['pending']);
        expect(result).toHaveLength(2);
    });

    it('should return empty when no matches', () => {
        const result = filterExpenses(mockExpenses, 'nonexistent', [], null, [], [], [], []);
        expect(result).toHaveLength(0);
    });
});

describe('Expense View State - Pagination', () => {
    it('should return first page correctly', () => {
        const result = paginateExpenses(mockExpenses, 1, 2);
        expect(result).toHaveLength(2);
        expect(result[0].id).toBe('1');
    });

    it('should return second page correctly', () => {
        const result = paginateExpenses(mockExpenses, 2, 2);
        expect(result).toHaveLength(2);
        expect(result[0].id).toBe('3');
    });

    it('should handle last page with fewer items', () => {
        const result = paginateExpenses(mockExpenses, 3, 2);
        expect(result).toHaveLength(1);
    });
});

describe('Expense View State - Delete Logic', () => {
    it('should allow deletion of pending expense', () => {
        expect(canDeleteExpense(mockExpenses[0])).toBe(true);
    });

    it('should not allow deletion of approved expense', () => {
        expect(canDeleteExpense(mockExpenses[1])).toBe(false);
    });

    it('should allow deletion of rejected expense', () => {
        expect(canDeleteExpense(mockExpenses[3])).toBe(true);
    });

    it('should filter out approved expenses from bulk delete', () => {
        const idsToDelete = ['1', '2', '3', '4', '5'];
        const result = filterDeletableExpenses(mockExpenses, idsToDelete);
        expect(result).toHaveLength(3); // 1, 3, 4 (pending and rejected)
        expect(result).not.toContain('2');
        expect(result).not.toContain('5');
    });
});
