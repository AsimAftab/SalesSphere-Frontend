import React from 'react';
import type { LeaveRequest } from '@/api/leaveService';
import { DataTable, StatusBadge, textColumn, statusColumn, type TableColumn } from '@/components/ui';

interface Props {
  data: LeaveRequest[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onSelectAll: (checked: boolean) => void;
  onStatusClick: (leave: LeaveRequest) => void;
  startIndex: number;
  canDelete: boolean;
  canApprove: boolean;
}

const LeaveTable: React.FC<Props> = ({ data, selectedIds, onToggle, onSelectAll, onStatusClick, startIndex, canDelete, canApprove }) => {
  const columns: TableColumn<LeaveRequest>[] = [
    textColumn<LeaveRequest>('employee', 'Employee', (item) => item.createdBy.name),
    textColumn<LeaveRequest>('category', 'Category', (item) => item.category.replace('_', ' ')),
    textColumn<LeaveRequest>('startDate', 'Start Date', 'startDate'),
    textColumn<LeaveRequest>('endDate', 'End Date', (item) => item.endDate || '-'),
    textColumn<LeaveRequest>('leaveDays', 'Days', (item) => String(item.leaveDays)),
    textColumn<LeaveRequest>('reason', 'Reason', 'reason'),
    textColumn<LeaveRequest>('reviewer', 'Reviewer', (item) => item.approvedBy?.name || 'Under Review'),
    statusColumn<LeaveRequest>('status', 'Status', 'status', {
      StatusComponent: StatusBadge,
      onClick: canApprove ? onStatusClick : undefined,
    }),
  ];

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
      rowClassName={(_item, isSelected) =>
        `transition-colors ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-200'}`
      }
    />
  );
};

export default LeaveTable;
