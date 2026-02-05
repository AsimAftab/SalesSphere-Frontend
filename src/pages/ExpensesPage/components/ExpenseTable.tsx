import React, { useMemo } from 'react';
import { type Expense } from "@/api/expensesService";
import { DataTable, StatusBadge, textColumn, statusColumn, viewDetailsColumn } from '@/components/ui';
import type { TableColumn } from '@/components/ui';

interface TableProps {
  data: Expense[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onSelectAll: (checked: boolean) => void;
  onBadgeClick: (exp: Expense) => void;
  startIndex: number;
  permissions: {
    canDelete: boolean;
    canViewDetail: boolean;
  };
}

export const ExpenseTable: React.FC<TableProps> = ({
  data,
  selectedIds,
  onToggle,
  onSelectAll,
  onBadgeClick,
  startIndex,
  permissions
}) => {
  const columns = useMemo<TableColumn<Expense>[]>(() => {
    const cols: TableColumn<Expense>[] = [
      textColumn<Expense>('title', 'Title', 'title', {
        width: 'max-w-[180px]',
      }),
      {
        key: 'amount',
        label: 'Amount',
        accessor: 'amount',
        render: (value) => `RS ${Number(value).toLocaleString('en-IN')}`,
      },
      textColumn<Expense>('incurredDate', 'Incurred Date', 'incurredDate'),
      textColumn<Expense>('category', 'Category', 'category'),
      textColumn<Expense>('submittedBy', 'Submitted By', (item) => item.createdBy.name),
    ];

    if (permissions.canViewDetail) {
      cols.push(
        viewDetailsColumn<Expense>((item) => `/expenses/${item.id}`)
      );
    }

    cols.push(
      textColumn<Expense>('reviewer', 'Reviewer', (item) => item.approvedBy?.name || 'Under Review'),
      statusColumn<Expense>('status', 'Status', 'status', {
        onClick: onBadgeClick,
        StatusComponent: StatusBadge,
      })
    );

    return cols;
  }, [permissions.canViewDetail, onBadgeClick]);

  return (
    <DataTable<Expense>
      data={data}
      columns={columns}
      getRowId={(item) => item.id}
      selectable={permissions.canDelete}
      selectedIds={selectedIds}
      onToggleSelection={onToggle}
      onSelectAll={onSelectAll}
      showSerialNumber={true}
      startIndex={startIndex}
      hideOnMobile={true}
    />
  );
};
