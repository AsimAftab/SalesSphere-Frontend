import React, { useMemo } from 'react';
import { Trash2 } from 'lucide-react';
import type { BeatPlan } from '@/api/beatPlanService';
import beatPlanIcon from '@/assets/images/icons/beat-plan-icon.svg';
import { toast } from 'react-hot-toast';
import { StatusBadge, EmptyState, Pagination, DataTable, textColumn, statusColumn, viewDetailsColumn } from '@/components/ui';
import type { TableColumn, TableAction } from '@/components/ui';

interface ActiveBeatsTableProps {
    beatPlans: BeatPlan[];
    currentPage: number;
    itemsPerPage: number;
    totalPlans: number;
    onPageChange: (page: number) => void;
    onView: (plan: BeatPlan) => void;
    onDelete: (id: string) => void;
    canDelete: boolean;
    canViewDetails: boolean;
}

const ActiveBeatsTable: React.FC<ActiveBeatsTableProps> = ({
    beatPlans,
    currentPage,
    itemsPerPage,
    totalPlans,
    onPageChange,
    onView,
    onDelete,
    canDelete,
    canViewDetails,
}) => {
    const columns = useMemo<TableColumn<BeatPlan>[]>(() => {
        const cols: TableColumn<BeatPlan>[] = [
            textColumn<BeatPlan>('name', 'Beat Plan Name', 'name'),
            textColumn<BeatPlan>('totalStops', 'Total Stops', (plan) => String(plan.progress.totalDirectories)),
            textColumn<BeatPlan>('assignedTo', 'Assigned To', (plan) => plan.employees[0]?.name || ''),
            textColumn<BeatPlan>('beatDate', 'Beat Date', (plan) =>
                new Date(plan.schedule.startDate).toISOString().split('T')[0]
            ),
        ];

        if (canViewDetails) {
            cols.push(viewDetailsColumn<BeatPlan>('', { onClick: onView }));
        }

        cols.push(
            statusColumn<BeatPlan>('status', 'Status', 'status', {
                StatusComponent: StatusBadge,
            })
        );

        return cols;
    }, [canViewDetails, onView]);

    const actions = useMemo<TableAction<BeatPlan>[]>(() => {
        if (!canDelete) return [];

        return [
            {
                type: 'custom',
                icon: Trash2,
                label: 'Delete Beat Plan',
                className: 'text-red-600 hover:text-red-800',
                onClick: (plan) => {
                    if (plan.status === 'active') {
                        toast.error("You cannot delete an Active beat plan.");
                    } else {
                        onDelete(plan._id);
                    }
                },
            },
        ];
    }, [canDelete, onDelete]);

    if (beatPlans.length === 0) {
        return (
            <div className="hidden md:flex min-h-[400px] items-center justify-center">
                <EmptyState
                    icon={<img src={beatPlanIcon} alt="No Active Assignments" className="w-12 h-12" />}
                    title="No Active Assignments Found"
                    description="Try adjusting your filters or search query."
                />
            </div>
        );
    }

    const startIndex = (currentPage - 1) * itemsPerPage;

    return (
        <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <DataTable<BeatPlan>
                data={beatPlans}
                columns={columns}
                getRowId={(plan) => plan._id}
                showSerialNumber
                startIndex={startIndex}
                actions={actions}
                actionsLabel="Action"
                hideOnMobile={false}
                className="border-0 shadow-none"
            />

            {/* Pagination */}
            <Pagination
                currentPage={currentPage}
                onPageChange={onPageChange}
                totalItems={totalPlans}
                itemsPerPage={itemsPerPage}
            />
        </div>
    );
};

export default ActiveBeatsTable;
