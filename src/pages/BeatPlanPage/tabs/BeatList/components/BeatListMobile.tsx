import React from 'react';
import { Send, SquarePen, Trash2 } from 'lucide-react';
import type { BeatPlanList } from '@/api/beatPlanService';
import type { BeatPlanPermissions } from '../../../hooks/useBeatPlanPermissions';
import { MobileCard, MobileCardList } from '@/components/ui';
import type { MobileCardAction } from '@/components/ui';

interface BeatListMobileProps {
    templates: BeatPlanList[];
    currentPage: number;
    itemsPerPage: number;
    onAssign: (template: BeatPlanList) => void;
    onView: (template: BeatPlanList) => void;
    onEdit: (template: BeatPlanList) => void;
    onDelete: (id: string) => void;
    permissions: BeatPlanPermissions;
}

const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const BeatListMobile: React.FC<BeatListMobileProps> = ({
    templates,
    currentPage,
    itemsPerPage,
    onAssign,
    onView,
    onEdit,
    onDelete,
    permissions
}) => {
    return (
        <MobileCardList isEmpty={templates.length === 0} emptyMessage="No beat plans found">
            {templates.map((template, index) => {
                const serialNumber = (currentPage - 1) * itemsPerPage + index + 1;

                // Build actions based on permissions - limit to 2 main actions
                const actions: MobileCardAction[] = [];

                if (permissions.canAssign) {
                    actions.push({
                        label: 'Assign Beat',
                        icon: Send,
                        onClick: () => onAssign(template),
                        variant: 'primary',
                    });
                }

                if (permissions.canUpdateTemplate) {
                    actions.push({
                        label: 'Edit',
                        icon: SquarePen,
                        onClick: () => onEdit(template),
                        variant: 'secondary',
                    });
                }

                if (permissions.canDeleteTemplate) {
                    actions.push({
                        label: 'Delete',
                        icon: Trash2,
                        onClick: () => onDelete(template._id),
                        variant: 'danger',
                    });
                }

                return (
                    <MobileCard
                        key={template._id}
                        id={template._id}
                        header={{
                            serialNumber,
                            title: template.name,
                            badge: {
                                type: 'custom',
                                label: `${template.totalDirectories} Stops`,
                                className: 'bg-purple-100 text-purple-700',
                            },
                        }}
                        details={[
                            {
                                label: 'Total Stops',
                                value: `${template.totalDirectories} locations`,
                                valueClassName: 'font-bold text-secondary',
                            },
                            {
                                label: 'Created Date',
                                value: formatDate(template.createdAt),
                            },
                            {
                                label: 'Created By',
                                value: template.createdBy?.name || 'Unknown',
                            },
                        ]}
                        detailsLayout="grid"
                        actions={actions.length > 0 ? actions : [{
                            label: 'View Details',
                            onClick: () => onView(template),
                            variant: 'primary',
                            visible: permissions.canViewTemplateDetails,
                        }]}
                        actionsFullWidth={actions.length <= 1}
                    />
                );
            })}
        </MobileCardList>
    );
};

export default BeatListMobile;
