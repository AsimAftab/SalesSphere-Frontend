import React, { useMemo } from 'react';
import type { BeatPlan } from '@/api/beatPlanService';
import beatPlanIcon from '@/assets/images/icons/beat-plan-icon.svg';
import { StatusBadge, EmptyState, Pagination, DataTable, textColumn, statusColumn, viewDetailsColumn } from '@/components/ui';
import type { TableColumn } from '@/components/ui';

interface CompletedBeatsTableProps {
    beatPlans: BeatPlan[];
    currentPage: number;
    itemsPerPage: number;
    totalPlans: number;
    onPageChange: (page: number) => void;
    onView: (plan: BeatPlan) => void;
    canViewDetails: boolean;
}

const CompletedBeatsTable: React.FC<CompletedBeatsTableProps> = ({
    beatPlans,
    currentPage,
    itemsPerPage,
    totalPlans,
    onPageChange,
    onView,
    canViewDetails,
}) => {
    const columns = useMemo<TableColumn<BeatPlan>[]>(() => {
        const cols: TableColumn<BeatPlan>[] = [
            textColumn<BeatPlan>('name', 'Beat Plan Name', 'name'),
            textColumn<BeatPlan>('totalStops', 'Total Stops', (plan) =>
                `${plan.progress?.visitedDirectories ?? 0} / ${plan.progress?.totalDirectories ?? 0}`
            ),
            textColumn<BeatPlan>('completedBy', 'Completed By', (plan) => plan.employees?.[0]?.name || 'Unknown'),
            textColumn<BeatPlan>('completedDate', 'Completed Date', (plan) =>
                plan.completedAt
                    ? new Date(plan.completedAt).toISOString().split('T')[0]
                    : 'N/A'
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

    if (beatPlans.length === 0) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <EmptyState
                    icon={<img src={beatPlanIcon} alt="No Completed Beats" className="w-12 h-12 grayscale opacity-50" />}
                    title="No Completed Beats Found"
                    description="Beat plans that have been completed will appear here."
                />
            </div>
        );
    }

    const startIndex = (currentPage - 1) * itemsPerPage;

    return (
        <div className="hidden md:block">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <DataTable<BeatPlan>
                    data={beatPlans}
                    columns={columns}
                    getRowId={(plan) => plan._id}
                    showSerialNumber
                    startIndex={startIndex}
                    hideOnMobile={false}
                    className="border-0 shadow-none"
                />
            </div>

            {/* Pagination */}
            <div className="mt-4">
                <Pagination
                    currentPage={currentPage}
                    onPageChange={onPageChange}
                    totalItems={totalPlans}
                    itemsPerPage={itemsPerPage}
                />
            </div>
        </div>
    );
};

export default CompletedBeatsTable;
