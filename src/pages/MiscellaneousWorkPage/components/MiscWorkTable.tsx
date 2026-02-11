import React from "react";
import { Images, Trash2 } from 'lucide-react';
import { type MiscWork as MiscWorkType } from "@/api/miscellaneousWorkService";
import { DataTable, textColumn, type TableColumn } from '@/components/ui';

interface MiscWorkTableProps {
  data: MiscWorkType[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onSelectAll: (checked: boolean) => void;
  onViewImage: (images: string[]) => void;
  onDelete: (id: string) => void;
  startIndex: number;
  canDelete: boolean;
}

/**
 * SRP: This component is strictly responsible for rendering the Desktop Table view.
 * It uses standardized design tokens to maintain the "Audit System" aesthetic.
 */
export const MiscWorkTable: React.FC<MiscWorkTableProps> = ({
  data,
  selectedIds,
  onToggle,
  onSelectAll,
  onViewImage,
  onDelete,
  startIndex,
  canDelete,
}) => {
  const columns: TableColumn<MiscWorkType>[] = [
    {
      key: 'employee',
      label: 'Employee',
      render: (_, work) => (
        <div className="flex items-center gap-3">
          {work.employee?.avatarUrl ? (
            <img
              src={work.employee.avatarUrl}
              className="h-10 w-10 rounded-full object-cover border border-gray-200 shadow-sm"
              alt={work.employee.name}
            />
          ) : (
            /* UPDATED FALLBACK: bg-secondary and text-white */
            <div className="h-10 w-10 rounded-full bg-secondary text-white font-black flex items-center justify-center border border-secondary shrink-0 text-xs shadow-sm">
              {work.employee?.name?.trim().charAt(0).toUpperCase() || "?"}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-black text-black leading-tight">
              {work.employee?.name || "Unknown User"}
            </p>
            <p className="text-sm text-gray-500 tracking-tight">
              {work.employee?.role || "Staff"}
            </p>
          </div>
        </div>
      ),
    },
    textColumn<MiscWorkType>('natureOfWork', 'Nature of Work', (item) => item.natureOfWork || "—"),
    {
      key: 'workDate',
      label: 'Work Date',
      render: (_, work) => {
        // Formatting date to YYYY-MM-DD
        return work.workDate
          ? new Date(work.workDate).toISOString().split('T')[0]
          : "—";
      },
    },
    {
      key: 'address',
      label: 'Address',
      render: (_, work) => (
        <span title={work.address}>
          {work.address || "No Address Provided"}
        </span>
      ),
      cellClassName: 'max-w-lg',
    },
    textColumn<MiscWorkType>('assignedBy', 'Assigner', (item) => item.assignedBy?.name || "—"),
    {
      key: 'images',
      label: 'Images',
      render: (_, work) => (
        <button
          type="button"
          onClick={() => onViewImage(work.images)}
          className="flex items-center gap-1.5 text-blue-600 font-black text-xs hover:underline disabled:text-gray-300 disabled:no-underline transition-all"
          disabled={!work.images || work.images.length === 0}
        >
          <Images size={14} strokeWidth={3} />
          View ({work.images?.length || 0})
        </button>
      ),
    },
    ...(canDelete ? [{
      key: 'action',
      label: 'Action',
      render: (_: unknown, work: MiscWorkType) => (
        <button
          type="button"
          onClick={() => onDelete(work._id)}
          className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-all active:scale-90"
          title="Delete Entry"
        >
          <Trash2 size={18} />
        </button>
      ),
    } as TableColumn<MiscWorkType>] : []),
  ];

  return (
    <DataTable<MiscWorkType>
      data={data}
      columns={columns}
      getRowId={(item) => item._id}
      selectable={canDelete}
      selectedIds={selectedIds}
      onToggleSelection={onToggle}
      onSelectAll={onSelectAll}
      showSerialNumber
      startIndex={startIndex}
      hideOnMobile
      rowClassName={(_item, isSelected) =>
        `transition-colors duration-200 ${isSelected ? "bg-blue-50" : "hover:bg-gray-200"}`
      }
    />
  );
};
