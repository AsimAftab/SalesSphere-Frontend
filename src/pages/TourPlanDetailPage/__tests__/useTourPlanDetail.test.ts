import { describe, it, expect } from 'vitest';

// Extracted modal state and permission logic for tour plan detail

type ModalType = 'edit' | 'delete' | 'status' | null;

function isModalOpen(activeModal: ModalType, modalType: 'edit' | 'delete' | 'status'): boolean {
    return activeModal === modalType;
}

// Permission check logic
interface TourPlanPermissions {
    canUpdate: boolean;
    canDelete: boolean;
    canUpdateStatus: boolean;
}

function canPerformAction(
    permissions: TourPlanPermissions,
    action: 'update' | 'delete' | 'updateStatus'
): boolean {
    if (action === 'update') return permissions.canUpdate;
    if (action === 'delete') return permissions.canDelete;
    if (action === 'updateStatus') return permissions.canUpdateStatus;
    return false;
}

// Tour plan status logic
type TourPlanStatus = 'pending' | 'approved' | 'rejected';

interface TourPlan {
    id: string;
    status: TourPlanStatus;
    employee: { id: string };
    startDate: string;
    endDate: string;
}

function canEditTourPlan(tourPlan: TourPlan): boolean {
    // Can only edit pending tour plans
    return tourPlan.status === 'pending';
}

function canDeleteTourPlan(tourPlan: TourPlan): boolean {
    // Can only delete pending or rejected tour plans
    return tourPlan.status !== 'approved';
}

function canUpdateTourPlanStatus(
    tourPlan: TourPlan,
    userId: string,
    isAdmin: boolean
): { allowed: boolean; reason?: string } {
    // Status Lock Check
    if (tourPlan.status !== 'pending') {
        return { allowed: false, reason: `Cannot change status of a ${tourPlan.status} tour plan` };
    }

    // Creator Check (Self-Approval Restriction)
    const isCreator = userId === tourPlan.employee.id;
    if (isCreator && !isAdmin) {
        return { allowed: false, reason: 'You cannot approve your own tour plan' };
    }

    return { allowed: true };
}

// Date validation
function isTourPlanInFuture(tourPlan: TourPlan): boolean {
    const startDate = new Date(tourPlan.startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return startDate >= today;
}

function getTourPlanDuration(tourPlan: TourPlan): number {
    const start = new Date(tourPlan.startDate);
    const end = new Date(tourPlan.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1; // Include both start and end day
}

describe('Tour Plan Detail - Modal State Logic', () => {
    it('should identify edit modal as open', () => {
        expect(isModalOpen('edit', 'edit')).toBe(true);
        expect(isModalOpen('edit', 'delete')).toBe(false);
    });

    it('should identify delete modal as open', () => {
        expect(isModalOpen('delete', 'delete')).toBe(true);
        expect(isModalOpen('delete', 'edit')).toBe(false);
    });

    it('should identify status modal as open', () => {
        expect(isModalOpen('status', 'status')).toBe(true);
        expect(isModalOpen('status', 'edit')).toBe(false);
    });

    it('should identify no modal as open', () => {
        expect(isModalOpen(null, 'edit')).toBe(false);
        expect(isModalOpen(null, 'delete')).toBe(false);
        expect(isModalOpen(null, 'status')).toBe(false);
    });
});

describe('Tour Plan Detail - Permission Logic', () => {
    it('should allow update when canUpdate is true', () => {
        const permissions: TourPlanPermissions = { canUpdate: true, canDelete: false, canUpdateStatus: false };
        expect(canPerformAction(permissions, 'update')).toBe(true);
    });

    it('should allow delete when canDelete is true', () => {
        const permissions: TourPlanPermissions = { canUpdate: false, canDelete: true, canUpdateStatus: false };
        expect(canPerformAction(permissions, 'delete')).toBe(true);
    });

    it('should allow status update when canUpdateStatus is true', () => {
        const permissions: TourPlanPermissions = { canUpdate: false, canDelete: false, canUpdateStatus: true };
        expect(canPerformAction(permissions, 'updateStatus')).toBe(true);
    });
});

describe('Tour Plan Detail - Edit Validation', () => {
    it('should allow editing pending tour plan', () => {
        const tourPlan: TourPlan = { id: '1', status: 'pending', employee: { id: 'user1' }, startDate: '2026-02-01', endDate: '2026-02-05' };
        expect(canEditTourPlan(tourPlan)).toBe(true);
    });

    it('should not allow editing approved tour plan', () => {
        const tourPlan: TourPlan = { id: '2', status: 'approved', employee: { id: 'user1' }, startDate: '2026-02-01', endDate: '2026-02-05' };
        expect(canEditTourPlan(tourPlan)).toBe(false);
    });

    it('should not allow editing rejected tour plan', () => {
        const tourPlan: TourPlan = { id: '3', status: 'rejected', employee: { id: 'user1' }, startDate: '2026-02-01', endDate: '2026-02-05' };
        expect(canEditTourPlan(tourPlan)).toBe(false);
    });
});

describe('Tour Plan Detail - Delete Validation', () => {
    it('should allow deleting pending tour plan', () => {
        const tourPlan: TourPlan = { id: '1', status: 'pending', employee: { id: 'user1' }, startDate: '2026-02-01', endDate: '2026-02-05' };
        expect(canDeleteTourPlan(tourPlan)).toBe(true);
    });

    it('should not allow deleting approved tour plan', () => {
        const tourPlan: TourPlan = { id: '2', status: 'approved', employee: { id: 'user1' }, startDate: '2026-02-01', endDate: '2026-02-05' };
        expect(canDeleteTourPlan(tourPlan)).toBe(false);
    });

    it('should allow deleting rejected tour plan', () => {
        const tourPlan: TourPlan = { id: '3', status: 'rejected', employee: { id: 'user1' }, startDate: '2026-02-01', endDate: '2026-02-05' };
        expect(canDeleteTourPlan(tourPlan)).toBe(true);
    });
});

describe('Tour Plan Detail - Status Update Validation', () => {
    const pendingPlan: TourPlan = { id: '1', status: 'pending', employee: { id: 'user1' }, startDate: '2026-02-01', endDate: '2026-02-05' };
    const approvedPlan: TourPlan = { id: '2', status: 'approved', employee: { id: 'user1' }, startDate: '2026-02-01', endDate: '2026-02-05' };

    it('should allow status update by non-creator', () => {
        const result = canUpdateTourPlanStatus(pendingPlan, 'user2', false);
        expect(result.allowed).toBe(true);
    });

    it('should deny status update for approved plan', () => {
        const result = canUpdateTourPlanStatus(approvedPlan, 'user2', false);
        expect(result.allowed).toBe(false);
        expect(result.reason).toContain('approved');
    });

    it('should deny self-approval for non-admin', () => {
        const result = canUpdateTourPlanStatus(pendingPlan, 'user1', false);
        expect(result.allowed).toBe(false);
        expect(result.reason).toContain('own tour plan');
    });

    it('should allow self-approval for admin', () => {
        const result = canUpdateTourPlanStatus(pendingPlan, 'user1', true);
        expect(result.allowed).toBe(true);
    });
});

describe('Tour Plan Detail - Future Date Validation', () => {
    it('should identify future tour plan', () => {
        const futurePlan: TourPlan = { id: '1', status: 'pending', employee: { id: 'user1' }, startDate: '2030-01-01', endDate: '2030-01-05' };
        expect(isTourPlanInFuture(futurePlan)).toBe(true);
    });

    it('should identify past tour plan', () => {
        const pastPlan: TourPlan = { id: '2', status: 'pending', employee: { id: 'user1' }, startDate: '2020-01-01', endDate: '2020-01-05' };
        expect(isTourPlanInFuture(pastPlan)).toBe(false);
    });
});

describe('Tour Plan Detail - Duration Calculation', () => {
    it('should calculate single day duration', () => {
        const tourPlan: TourPlan = { id: '1', status: 'pending', employee: { id: 'user1' }, startDate: '2026-02-01', endDate: '2026-02-01' };
        expect(getTourPlanDuration(tourPlan)).toBe(1);
    });

    it('should calculate multi-day duration', () => {
        const tourPlan: TourPlan = { id: '2', status: 'pending', employee: { id: 'user1' }, startDate: '2026-02-01', endDate: '2026-02-05' };
        expect(getTourPlanDuration(tourPlan)).toBe(5);
    });

    it('should calculate week-long duration', () => {
        const tourPlan: TourPlan = { id: '3', status: 'pending', employee: { id: 'user1' }, startDate: '2026-02-01', endDate: '2026-02-07' };
        expect(getTourPlanDuration(tourPlan)).toBe(7);
    });
});
