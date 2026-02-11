import React from 'react';
import type { LeaveRequest } from '@/api/leaveService';
import toast from 'react-hot-toast';
import { type MobileCardAction } from '@/components/ui/MobileCard/MobileCard';
import { MobileCard, MobileCardList } from '@/components/ui';
import { Pencil, Trash2 } from 'lucide-react';

interface LeaveMobileListProps {
  data: LeaveRequest[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onStatusClick: (leave: LeaveRequest) => void;
  onEdit?: (leave: LeaveRequest) => void;
  onDelete?: (id: string) => void;
  currentUserId?: string;
}



const formatCategory = (category: string) => {
  return category?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Leave';
};

const LeaveMobileList: React.FC<LeaveMobileListProps> = ({
  data = [],
  selectedIds = [],
  onToggle,
  onStatusClick,
  onEdit,
  onDelete
}) => {
  return (
    <MobileCardList
      isEmpty={!data || data.length === 0}
      emptyMessage="No leave requests found"
    >
      {data.map((item, index) => {
        const isSelected = selectedIds.includes(item.id);

        const actions: MobileCardAction[] = [];

        if (onEdit) {
          const isEditDisabled = item.status?.toLowerCase() !== 'pending';
          actions.push({
            label: 'Edit',
            icon: Pencil,
            onClick: () => {
              if (isEditDisabled) {
                toast.error(`Cannot edit leave request with status: ${item.status}`);
                return;
              }
              onEdit(item);
            },
            variant: 'primary',
            className: isEditDisabled ? 'opacity-50' : '',
          });
        }

        if (onDelete) {
          const isDeleteDisabled = item.status?.toLowerCase() === 'approved';
          actions.push({
            label: 'Delete',
            icon: Trash2,
            onClick: () => {
              if (isDeleteDisabled) {
                toast.error("Cannot delete approved leave request.");
                return;
              }
              onDelete(item.id);
            },
            variant: 'danger',
            className: isDeleteDisabled ? 'opacity-50' : '',
          });
        }

        return (
          <MobileCard
            key={item.id}
            id={item.id}
            header={{
              selectable: true,
              selectionDisabled: item.status?.toLowerCase() === 'approved',
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
                valueClassName: 'font-semibold text-gray-800',
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
              ...(item.reason ? [{
                label: 'Reason',
                value: item.reason,
                valueClassName: 'text-gray-600 break-words',
                fullWidth: true,
              }] : []),
            ]}
            detailsLayout="grid"
            actions={actions}
            actionsFullWidth={actions.length === 1}
          />
        );
      })}
    </MobileCardList >
  );
};

export default LeaveMobileList;
