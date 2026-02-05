import React from 'react';
import { Eye, Trash2 } from 'lucide-react';
import type { BeatPlan } from '@/api/beatPlanService';
import { toast } from 'react-hot-toast';
import { MobileCard, MobileCardList } from '@/components/ui';
import type { MobileCardAction } from '@/components/ui';

interface ActiveBeatsMobileProps {
    beatPlans: BeatPlan[];
    currentPage: number;
    itemsPerPage: number;
    onView: (plan: BeatPlan) => void;
    onDelete: (id: string) => void;
    canDelete: boolean;
    canViewDetails: boolean;
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const ActiveBeatsMobile: React.FC<ActiveBeatsMobileProps> = ({
    beatPlans,
    currentPage,
    itemsPerPage,
    onView,
    onDelete,
    canDelete,
    canViewDetails
}) => {
    return (
        <MobileCardList isEmpty={beatPlans.length === 0} emptyMessage="No active beat plans found">
            {beatPlans.map((plan, index) => {
                const serialNumber = (currentPage - 1) * itemsPerPage + index + 1;
                const assignee = plan.employees[0];

                const actions: MobileCardAction[] = [
                    {
                        label: 'View Details',
                        icon: Eye,
                        onClick: () => onView(plan),
                        variant: 'primary',
                        visible: canViewDetails,
                    },
                    {
                        label: 'Delete',
                        icon: Trash2,
                        onClick: () => {
                            if (plan.status === 'active') {
                                toast.error("You cannot delete an Active beat plan.");
                            } else {
                                onDelete(plan._id);
                            }
                        },
                        variant: 'danger',
                        visible: canDelete,
                    },
                ];

                const visibleActions = actions.filter(a => a.visible !== false);

                return (
                    <MobileCard
                        key={plan._id}
                        id={plan._id}
                        header={{
                            serialNumber,
                            title: plan.name,
                            badge: {
                                type: 'status',
                                status: plan.status,
                            },
                        }}
                        details={[
                            {
                                label: 'Assigned To',
                                value: assignee?.name || 'Unassigned',
                                valueClassName: assignee ? 'font-semibold text-gray-800' : 'text-gray-400 italic',
                            },
                            {
                                label: 'Start Date',
                                value: formatDate(plan.schedule.startDate),
                            },
                        ]}
                        detailsLayout="grid"
                        actions={actions}
                        actionsFullWidth={visibleActions.length === 1}
                    />
                );
            })}
        </MobileCardList>
    );
};

export default ActiveBeatsMobile;
