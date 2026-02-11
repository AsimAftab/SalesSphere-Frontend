import React from 'react';
import { ListPageSkeleton, type TableColumnSkeleton } from '@/components/ui';

const tableColumns: TableColumnSkeleton[] = [
  { width: 130, type: 'text' }, // Employee Name
  { width: 90, type: 'text' },  // Employee ID
  { width: 120, type: 'text' }, // Supervisor
  { width: 90, type: 'text' },  // Department
  { width: 80, type: 'text' },  // Role
  { width: 60, type: 'actions' }, // Actions
];

const SupervisorHierarchySkeleton: React.FC = () => (
  <ListPageSkeleton
    header={{
      titleWidth: 260,
      subtitleWidth: 320,
      showSearch: false,
      showFilter: false,
      showExportPdf: false,
      showExportExcel: false,
      showCreate: true,
      createWidth: 150,
    }}
    table={{
      rows: 10,
      columns: tableColumns,
      showCheckbox: false,
      showSerialNumber: true,
    }}
    mobileCards={{
      cards: 4,
      config: {
        showCheckbox: false,
        showAvatar: false,
        detailRows: 5,
        detailColumns: 2,
        showAction: true,
        actionCount: 2,
        actionsLayout: 'row',
      },
    }}
  />
);

export default SupervisorHierarchySkeleton;
