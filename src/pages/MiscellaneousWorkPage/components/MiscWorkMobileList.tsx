import React from "react";
import { Images, Trash2 } from 'lucide-react';
import { type MiscWork as MiscWorkType } from "@/api/miscellaneousWorkService";
import { MobileCard, MobileCardList } from '@/components/ui';

interface Props {
  data: MiscWorkType[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onViewImage: (images: string[]) => void;
  onDelete: (id: string) => void;
  canDelete: boolean;
}

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const MiscWorkMobileList: React.FC<Props> = ({ data, selectedIds, onToggle, onViewImage, onDelete, canDelete }) => (
  <MobileCardList isEmpty={data.length === 0} emptyMessage="No miscellaneous work found">
    {data.map((work, index) => (
      <MobileCard
        key={work._id}
        id={work._id}
        header={{
          selectable: canDelete,
          isSelected: selectedIds.includes(work._id),
          onToggleSelection: () => onToggle(work._id),
          serialNumber: index + 1,
          title: work.employee?.name || "N/A",
          badge: {
            type: 'custom',
            label: work.employee?.role || 'Staff',
            className: 'bg-blue-100 text-blue-700',
          },
        }}
        details={[
          {
            label: 'Nature of Work',
            value: work.natureOfWork || 'Miscellaneous Work',
            valueClassName: 'font-semibold text-gray-800',
            fullWidth: true,
          },
          {
            label: 'Date',
            value: formatDate(work.workDate),
          },
          {
            label: 'Assigned By',
            value: work.assignedBy?.name || 'Admin',
          },
          {
            label: 'Address',
            value: work.address || 'No Address',
            fullWidth: true,
          },
        ]}
        detailsLayout="grid"
        actions={[
          {
            label: 'View Images',
            onClick: () => onViewImage(work.images),
            icon: Images,
            variant: 'primary',
          },
          {
            label: 'Delete',
            onClick: () => onDelete(work._id),
            icon: Trash2,
            variant: 'danger',
            visible: canDelete,
          },
        ]}
        actionsFullWidth={false}
      />
    ))}
  </MobileCardList>
);
