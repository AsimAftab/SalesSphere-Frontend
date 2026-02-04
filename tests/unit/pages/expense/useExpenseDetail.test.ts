import { describe, it, expect } from 'vitest';

// Extracted modal state logic from useExpenseDetail

type ModalType = 'edit' | 'delete' | null;

function isModalOpen(activeModal: ModalType, modalType: 'edit' | 'delete'): boolean {
    return activeModal === modalType;
}

// Permission check logic
interface ExpensePermissions {
    canUpdate: boolean;
    canDelete: boolean;
    isAdmin: boolean;
}

function canPerformAction(
    permissions: ExpensePermissions,
    action: 'update' | 'delete'
): boolean {
    if (action === 'update') return permissions.canUpdate;
    if (action === 'delete') return permissions.canDelete;
    return false;
}

// Expense status validation logic
type ExpenseStatus = 'pending' | 'approved' | 'rejected';

interface Expense {
    id: string;
    status: ExpenseStatus;
    createdBy: { id: string };
}

function canUpdateExpenseStatus(
    expense: Expense,
    userId: string,
    isAdmin: boolean
): { allowed: boolean; reason?: string } {
    // Status Lock Check
    if (expense.status !== 'pending') {
        return { allowed: false, reason: `Cannot change status of a ${expense.status} expense claim` };
    }

    // Creator Check (Self-Approval Restriction)
    const isCreator = userId === expense.createdBy.id;
    if (isCreator && !isAdmin) {
        return { allowed: false, reason: 'You cannot update the status of your own expense' };
    }

    return { allowed: true };
}

function canDeleteExpense(expense: Expense): boolean {
    return expense.status !== 'approved';
}

describe('Expense Detail - Modal State Logic', () => {
    it('should identify edit modal as open', () => {
        expect(isModalOpen('edit', 'edit')).toBe(true);
        expect(isModalOpen('edit', 'delete')).toBe(false);
    });

    it('should identify delete modal as open', () => {
        expect(isModalOpen('delete', 'delete')).toBe(true);
        expect(isModalOpen('delete', 'edit')).toBe(false);
    });

    it('should identify no modal as open', () => {
        expect(isModalOpen(null, 'edit')).toBe(false);
        expect(isModalOpen(null, 'delete')).toBe(false);
    });
});

describe('Expense Detail - Permission Logic', () => {
    it('should allow update when canUpdate is true', () => {
        const permissions: ExpensePermissions = { canUpdate: true, canDelete: false, isAdmin: false };
        expect(canPerformAction(permissions, 'update')).toBe(true);
    });

    it('should deny update when canUpdate is false', () => {
        const permissions: ExpensePermissions = { canUpdate: false, canDelete: true, isAdmin: false };
        expect(canPerformAction(permissions, 'update')).toBe(false);
    });

    it('should allow delete when canDelete is true', () => {
        const permissions: ExpensePermissions = { canUpdate: false, canDelete: true, isAdmin: false };
        expect(canPerformAction(permissions, 'delete')).toBe(true);
    });
});

describe('Expense Detail - Status Update Validation', () => {
    const pendingExpense: Expense = { id: '1', status: 'pending', createdBy: { id: 'user1' } };
    const approvedExpense: Expense = { id: '2', status: 'approved', createdBy: { id: 'user1' } };
    const rejectedExpense: Expense = { id: '3', status: 'rejected', createdBy: { id: 'user1' } };

    it('should allow status update for pending expense by non-creator', () => {
        const result = canUpdateExpenseStatus(pendingExpense, 'user2', false);
        expect(result.allowed).toBe(true);
    });

    it('should deny status update for approved expense', () => {
        const result = canUpdateExpenseStatus(approvedExpense, 'user2', false);
        expect(result.allowed).toBe(false);
        expect(result.reason).toContain('approved');
    });

    it('should deny status update for rejected expense', () => {
        const result = canUpdateExpenseStatus(rejectedExpense, 'user2', false);
        expect(result.allowed).toBe(false);
        expect(result.reason).toContain('rejected');
    });

    it('should deny self-approval for non-admin', () => {
        const result = canUpdateExpenseStatus(pendingExpense, 'user1', false);
        expect(result.allowed).toBe(false);
        expect(result.reason).toContain('own expense');
    });

    it('should allow self-approval for admin', () => {
        const result = canUpdateExpenseStatus(pendingExpense, 'user1', true);
        expect(result.allowed).toBe(true);
    });
});

describe('Expense Detail - Delete Validation', () => {
    it('should allow deletion of pending expense', () => {
        const expense: Expense = { id: '1', status: 'pending', createdBy: { id: 'user1' } };
        expect(canDeleteExpense(expense)).toBe(true);
    });

    it('should not allow deletion of approved expense', () => {
        const expense: Expense = { id: '2', status: 'approved', createdBy: { id: 'user1' } };
        expect(canDeleteExpense(expense)).toBe(false);
    });

    it('should allow deletion of rejected expense', () => {
        const expense: Expense = { id: '3', status: 'rejected', createdBy: { id: 'user1' } };
        expect(canDeleteExpense(expense)).toBe(true);
    });
});
