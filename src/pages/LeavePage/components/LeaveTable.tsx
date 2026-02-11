import React from 'react';
import type { LeaveRequest } from '@/api/leaveService';
import toast from 'react-hot-toast';
import { DataTable, StatusBadge, textColumn, statusColumn, type TableColumn, type TableAction } from '@/components/ui';


interface Props {
  data: LeaveRequest[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onSelectAll: (checked: boolean) => void;
  onStatusClick: (leave: LeaveRequest) => void;
  startIndex: number;
  canDelete: boolean;
  canApprove: boolean;
  onEdit?: (leave: LeaveRequest) => void;
  onDelete?: (id: string) => void;
  currentUserId?: string;
}

const LeaveTable: React.FC<Props> = ({
  data,
  selectedIds,
  onToggle,
  onSelectAll,
  onStatusClick,
  startIndex,
  canDelete,
  canApprove,
  onEdit,
  onDelete
}) => {
  const columns: TableColumn<LeaveRequest>[] = [
    textColumn<LeaveRequest>('employee', 'Employee', (item) => item.createdBy.name),
    textColumn<LeaveRequest>('category', 'Category', (item) => item.category.replace('_', ' ')),
    textColumn<LeaveRequest>('startDate', 'Start Date', 'startDate'),
    textColumn<LeaveRequest>('endDate', 'End Date', (item) => item.endDate || '-'),
    textColumn<LeaveRequest>('leaveDays', 'Days', (item) => String(item.leaveDays)),
    {
      ...textColumn<LeaveRequest>('reason', 'Reason', 'reason'),
      cellClassName: 'max-w-[200px] truncate', // Ensure it doesn't expand too much and wraps/truncates
    },
    textColumn<LeaveRequest>('reviewer', 'Reviewer', (item) => item.approvedBy?.name || 'Under Review'),
    statusColumn<LeaveRequest>('status', 'Status', 'status', {
      StatusComponent: StatusBadge,
      onClick: canApprove ? onStatusClick : undefined,
    }),
  ];

  const actions: TableAction<LeaveRequest>[] = React.useMemo(() => {
    const actionList: TableAction<LeaveRequest>[] = [];

    if (onEdit) {
      actionList.push({
        type: 'edit',
        label: 'Edit',
        onClick: (item) => {
          if (item.status?.toLowerCase() !== 'pending') {
            toast.error(`Cannot edit leave request with status: ${item.status}`);
            return;
          }
          onEdit(item);
        },
      });
    }

    if (onDelete) {
      actionList.push({
        type: 'delete',
        label: 'Delete',
        onClick: (item) => {
          if (item.status?.toLowerCase() === 'approved') {
            toast.error("Cannot delete approved leave request.");
            return;
          }
          onDelete(item.id);
        },
        className: 'text-red-600 hover:text-red-700 hover:bg-red-50', // maintain red style
      });
    }

    return actionList;
  }, [onEdit, onDelete]);

  return (
    <DataTable<LeaveRequest>
      data={data}
      columns={columns}
      getRowId={(item) => item.id}
      selectable={canDelete}
      selectedIds={selectedIds}
      onToggleSelection={onToggle}
      onSelectAll={onSelectAll}
      showSerialNumber
      startIndex={startIndex}
      hideOnMobile
      isRowSelectable={(item) => item.status?.toLowerCase() !== 'approved'}
      actions={actions}
      actionsLabel="Actions"
      rowClassName={(_item, isSelected) =>
        `transition-colors ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-200'}`
      }
    />
  );
};

export default LeaveTable;
