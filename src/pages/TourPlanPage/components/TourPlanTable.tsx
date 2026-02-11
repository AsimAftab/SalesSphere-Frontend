import React from 'react';
import { type TourPlan } from '@/api/tourPlanService';
import { DataTable, StatusBadge, textColumn, statusColumn, viewDetailsColumn, type TableColumn } from '@/components/ui';

interface Props {
  data: TourPlan[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onSelectAll: (checked: boolean) => void;
  onStatusClick: (plan: TourPlan) => void;
  onViewDetails?: (plan: TourPlan) => void;
  startIndex: number;
  canDelete: boolean;
  canApprove: boolean;
}

const TourPlanTable: React.FC<Props> = ({
  data,
  selectedIds,
  onToggle,
  onSelectAll,
  onStatusClick,
  startIndex,
  canDelete,
}) => {
  const columns: TableColumn<TourPlan>[] = [
    textColumn<TourPlan>('placeOfVisit', 'Place of Visit', 'placeOfVisit'),
    textColumn<TourPlan>('startDate', 'Start Date', 'startDate'),
    textColumn<TourPlan>('endDate', 'End Date', (item) => item.endDate || '-'),
    textColumn<TourPlan>('numberOfDays', 'Days', (item) => String(item.numberOfDays)),
    textColumn<TourPlan>('createdBy', 'Created By', (item) => item.createdBy?.name || 'Unknown'),
    viewDetailsColumn<TourPlan>((item) => `/tour-plan/${item.id}`, {
      label: 'Details',
      cellClassName: 'align-top',
    }),
    textColumn<TourPlan>('reviewer', 'Reviewer', (item) => item.approvedBy?.name || 'Under Review'),
    statusColumn<TourPlan>('status', 'Status', 'status', {
      StatusComponent: StatusBadge,
      onClick: onStatusClick,
    }),
  ];

  return (
    <DataTable<TourPlan>
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

export default TourPlanTable;
