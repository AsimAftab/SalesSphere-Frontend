import React from 'react';
import type { LeaveRequest } from '@/api/leaveService';
import { MobileCard, MobileCardList } from '@/components/ui';

interface LeaveMobileListProps {
  data: LeaveRequest[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onStatusClick: (leave: LeaveRequest) => void;
}

const getCategoryStyle = (category: string) => {
  switch (category?.toLowerCase()) {
    case 'sick_leave': return 'bg-red-100 text-red-700';
    case 'casual_leave': return 'bg-blue-100 text-blue-700';
    case 'earned_leave': return 'bg-green-100 text-green-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const formatCategory = (category: string) => {
  return category?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Leave';
};

const LeaveMobileList: React.FC<LeaveMobileListProps> = ({
  data = [],
  selectedIds = [],
  onToggle,
  onStatusClick
}) => {
  return (
    <MobileCardList
      isEmpty={!data || data.length === 0}
      emptyMessage="No leave requests found"
    >
      {data.map((item, index) => {
        const isSelected = selectedIds.includes(item.id);

        return (
          <MobileCard
            key={item.id}
            id={item.id}
            header={{
              selectable: true,
              isSelected,
              onToggleSelection: () => onToggle(item.id),
              serialNumber: index + 1,
              title: item.createdBy.name,
              badge: {
                type: 'status',
                status: item.status,
                onClick: () => onStatusClick(item),
              },
            }}
            details={[
              {
                label: 'Category',
                value: formatCategory(item.category),
                valueClassName: `font-semibold ${getCategoryStyle(item.category).split(' ')[1]}`,
              },
              {
                label: 'Duration',
                value: `${item.leaveDays} Day${item.leaveDays > 1 ? 's' : ''}`,
                valueClassName: 'font-semibold text-gray-800',
              },
              {
                label: 'From',
                value: item.startDate,
              },
              {
                label: 'To',
                value: item.endDate || 'Same Day',
              },
              {
                label: 'Reviewer',
                value: item.approvedBy?.name || 'Pending',
              },
            ]}
            detailsLayout="grid"
            footerContent={
              item.reason && (
                <div className="bg-gray-50 p-2.5 rounded-lg text-xs text-gray-600 italic border border-gray-100">
                  "{item.reason}"
                </div>
              )
            }
          />
        );
      })}
    </MobileCardList>
  );
};

export default LeaveMobileList;
