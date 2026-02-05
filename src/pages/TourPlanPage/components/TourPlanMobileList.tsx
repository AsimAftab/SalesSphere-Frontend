import React from 'react';
import { type TourPlan } from '@/api/tourPlanService';
import { MobileCard, MobileCardList } from '@/components/ui';

interface TourPlanMobileListProps {
  data: TourPlan[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onStatusClick: (plan: TourPlan) => void;
  canDelete: boolean;
}

const TourPlanMobileList: React.FC<TourPlanMobileListProps> = ({
  data = [],
  selectedIds = [],
  onToggle,
  onStatusClick,
  canDelete
}) => {
  if (!data || data.length === 0) {
    return <MobileCardList isEmpty emptyMessage="No tour plans found" />;
  }

  return (
    <MobileCardList>
      {data.map((item, index) => {
        const isSelected = (selectedIds || []).includes(item.id);

        return (
          <MobileCard
            key={item.id}
            id={item.id}
            header={{
              selectable: canDelete,
              isSelected,
              onToggleSelection: () => onToggle(item.id),
              serialNumber: index + 1,
              title: item.placeOfVisit || 'Tour Plan',
              badge: {
                type: 'status',
                status: item.status,
                onClick: () => onStatusClick(item),
              },
            }}
            details={[
              {
                label: 'Purpose',
                value: item.purposeOfVisit || 'Not specified',
                fullWidth: true,
              },
              {
                label: 'Duration',
                value: `${item.numberOfDays || 0} Days`,
                valueClassName: 'font-semibold text-gray-800',
              },
              {
                label: 'Start Date',
                value: item.startDate || 'N/A',
              },
              {
                label: 'End Date',
                value: item.endDate || 'N/A',
              },
              {
                label: 'Created By',
                value: item.createdBy?.name || 'Unknown',
              },
              {
                label: 'Reviewer',
                value: item.approvedBy?.name || 'Pending',
              },
            ]}
            detailsLayout="grid"
            actions={[
              {
                label: 'View Details',
                href: `/tour-plan/${item.id}`,
                variant: 'primary',
              },
            ]}
            actionsFullWidth={true}
          />
        );
      })}
    </MobileCardList>
  );
};

export default TourPlanMobileList;
