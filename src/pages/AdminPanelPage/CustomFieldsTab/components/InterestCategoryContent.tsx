import React, { useMemo } from 'react';
import { DataTable, EmptyState, TableSkeleton, textColumn } from '@/components/ui';
import type { TableAction, TableColumn, TableColumnSkeleton } from '@/components/ui';
import type { CategoryConfig } from '../categoryConfig';
import type { InterestCategory } from '../types/interestCategory';

interface InterestCategoryContentProps {
  config: CategoryConfig;
  isSiteMode: boolean;
  isLoading: boolean;
  totalItems: number;
  searchTerm: string;
  items: InterestCategory[];
  startIndex: number;
  onEdit: (entity: InterestCategory) => void;
  onDelete: (entity: InterestCategory) => void;
}

const renderEmptyPill = (label: string) => (
  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-500 border border-gray-200">
    {label}
  </span>
);

const renderPreviewPills = (values: string[], tone: 'blue' | 'slate') => {
  if (!values.length) return renderEmptyPill('None');

  const toneClasses = tone === 'blue'
    ? 'bg-blue-50 text-blue-700 border-blue-100'
    : 'bg-slate-50 text-slate-700 border-slate-200';

  return (
    <div className="flex flex-wrap gap-1.5" title={values.join(', ')}>
      {values.map((value) => (
        <span
          key={value}
          className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${toneClasses}`}
        >
          {value}
        </span>
      ))}
    </div>
  );
};

const InterestCategoryContent: React.FC<InterestCategoryContentProps> = ({
  config,
  isSiteMode,
  isLoading,
  totalItems,
  searchTerm,
  items,
  startIndex,
  onEdit,
  onDelete,
}) => {
  const columns: TableColumn<InterestCategory>[] = useMemo(() => {
    const base: TableColumn<InterestCategory>[] = [
      textColumn<InterestCategory>('name', 'Category', {
        className: 'font-medium',
      }),
      {
        key: 'brands',
        label: 'Brands',
        render: (_, item) => renderPreviewPills(item.brands || [], 'blue'),
        cellClassName: 'min-w-[220px]',
      },
    ];

    if (isSiteMode) {
      base.push({
        key: 'technicians',
        label: 'Site Contacts',
        render: (_, item) => {
          const contacts = 'technicians' in item ? item.technicians : undefined;
          const contactLabels = (contacts || []).map((c) => `${c.name} (${c.phone})`);
          return renderPreviewPills(contactLabels, 'slate');
        },
        cellClassName: 'min-w-[280px]',
      });
    }

    return base;
  }, [isSiteMode]);

  const tableActions: TableAction<InterestCategory>[] = [
    { type: 'edit', label: 'Edit', onClick: onEdit },
    { type: 'delete', label: 'Delete', onClick: onDelete },
  ];

  const skeletonColumns: TableColumnSkeleton[] = isSiteMode
    ? [
      { width: 180, type: 'text' },
      { width: 260, type: 'text' },
      { width: 300, type: 'text' },
      { width: 60, type: 'actions' },
    ]
    : [
      { width: 180, type: 'text' },
      { width: 320, type: 'text' },
      { width: 60, type: 'actions' },
    ];

  if (isLoading) {
    return (
      <div className="px-4 sm:px-6 py-4">
        <TableSkeleton
          rows={6}
          columns={skeletonColumns}
          showCheckbox={false}
          showSerialNumber={true}
          hideOnMobile={false}
        />
      </div>
    );
  }

  if (totalItems === 0) {
    return (
      <EmptyState
        title={searchTerm ? 'No Results Found' : config.messages.emptyTitle}
        description={
          searchTerm
            ? `No ${config.messages.entityName}s match your current filters. Try adjusting your search criteria.`
            : config.messages.emptyDescription
        }
        icon={<img src={config.icon} alt="" className="w-12 h-12 opacity-30" />}
      />
    );
  }

  return (
    <DataTable<InterestCategory>
      data={items}
      columns={columns}
      getRowId={(item) => item._id}
      actions={tableActions}
      showSerialNumber
      startIndex={startIndex}
      hideOnMobile={false}
      emptyMessage={`No ${config.messages.entityName}s found`}
    />
  );
};

export default InterestCategoryContent;
