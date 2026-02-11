import React from 'react';
import { Eye } from 'lucide-react';
import type { BeatPlan } from '@/api/beatPlanService';
import { MobileCard, MobileCardList } from '@/components/ui';

interface CompletedBeatsMobileProps {
    beatPlans: BeatPlan[];
    currentPage: number;
    itemsPerPage: number;
    onView: (plan: BeatPlan) => void;
    canViewDetails: boolean;
}

const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const CompletedBeatsMobile: React.FC<CompletedBeatsMobileProps> = ({
    beatPlans,
    currentPage,
    itemsPerPage,
    onView,
    canViewDetails
}) => {
    return (
        <MobileCardList isEmpty={beatPlans.length === 0} emptyMessage="No completed beat plans found">
            {beatPlans.map((plan, index) => {
                const serialNumber = (currentPage - 1) * itemsPerPage + index + 1;
                const completedBy = plan.employees?.[0];
                const visitedStops = plan.progress?.visitedDirectories ?? 0;
                const totalStops = plan.progress?.totalDirectories ?? 0;

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
                                label: 'Total Stops',
                                value: `${visitedStops} / ${totalStops}`,
                                valueClassName: 'font-bold text-secondary',
                            },
                            {
                                label: 'Completed Date',
                                value: formatDate(plan.completedAt),
                            },
                            {
                                label: 'Completed By',
                                value: completedBy?.name || 'Unknown',
                                fullWidth: true,
                            },
                        ]}
                        detailsLayout="grid"
                        actions={canViewDetails ? [
                            {
                                label: 'View Details',
                                icon: Eye,
                                onClick: () => onView(plan),
                                variant: 'primary',
                            },
                        ] : []}
                        actionsFullWidth={true}
                    />
                );
            })}
        </MobileCardList>
    );
};

export default CompletedBeatsMobile;
