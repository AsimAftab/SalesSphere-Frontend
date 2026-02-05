import React from 'react';
import { MobileCard, MobileCardList } from '@/components/ui';
import { type Note } from '@/api/notesService';

interface NoteMobileListProps {
  data: Note[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const getLinkedBadge = (item: Note) => {
  if (item.partyName) return { label: 'Party', name: item.partyName, style: 'bg-blue-100 text-blue-700' };
  if (item.prospectName) return { label: 'Prospect', name: item.prospectName, style: 'bg-green-100 text-green-700' };
  if (item.siteName) return { label: 'Site', name: item.siteName, style: 'bg-orange-100 text-orange-700' };
  return { label: 'General', name: 'General Note', style: 'bg-gray-100 text-gray-700' };
};

const NoteMobileList: React.FC<NoteMobileListProps> = ({
  data = [],
  selectedIds = [],
  onToggle,
}) => {
  return (
    <MobileCardList
      isEmpty={!data || data.length === 0}
      emptyMessage="No notes found"
    >
      {data.map((item, index) => {
        const isSelected = selectedIds.includes(item.id);
        const badge = getLinkedBadge(item);

        return (
          <MobileCard
            key={item.id}
            id={item.id}
            header={{
              selectable: true,
              isSelected,
              onToggleSelection: () => onToggle(item.id),
              serialNumber: index + 1,
              title: item.title,
              badge: {
                type: 'custom',
                label: badge.label,
                className: badge.style
              }
            }}
            details={[
              {
                label: 'Linked To',
                value: badge.name,
                valueClassName: 'font-semibold text-gray-800',
              },
              {
                label: 'Date',
                value: formatDate(item.createdAt),
              },
              {
                label: 'Created By',
                value: item.createdBy?.name || 'N/A',
              },
            ]}
            detailsLayout="grid"
            actions={[
              {
                label: 'View Details',
                href: `/notes/${item.id}`,
                variant: 'primary'
              }
            ]}
            actionsFullWidth={true}
          />
        );
      })}
    </MobileCardList>
  );
};

export default NoteMobileList;
