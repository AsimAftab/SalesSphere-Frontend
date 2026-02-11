import React from 'react';
import { type Note } from '@/api/notesService';
import { DataTable, textColumn, viewDetailsColumn, type TableColumn, StatusBadge } from '@/components/ui';

const formatDate = (dateString: string) => {
  if (!dateString) return '—';

  return new Date(dateString).toISOString().split('T')[0];
};

const getEntityConfig = (item: Note) => {
  if (item.partyName) return { label: 'Party', name: item.partyName };
  if (item.prospectName) return { label: 'Prospect', name: item.prospectName };
  if (item.siteName) return { label: 'Site', name: item.siteName };
  return { label: 'General', name: '—' };
};

interface Props {
  data: Note[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onSelectAll: (checked: boolean) => void;
  startIndex: number;
}

const NoteTable: React.FC<Props> = ({ data, selectedIds, onToggle, onSelectAll, startIndex }) => {
  const columns: TableColumn<Note>[] = [
    textColumn<Note>('title', 'Title', 'title', {
      cellClassName: 'font-medium align-top',
    }),
    {
      key: 'date',
      label: 'Date',
      render: (_, item) => formatDate(item.createdAt),
      cellClassName: 'whitespace-nowrap align-top',
    },
    {
      key: 'entityType',
      label: 'Entity Type',
      render: (_, item) => {
        const { label } = getEntityConfig(item);
        return <StatusBadge status={label} />;
      },
      cellClassName: 'align-top',
    },
    {
      key: 'entityName',
      label: 'Entity Name',
      render: (_, item) => getEntityConfig(item).name,
      cellClassName: 'align-top',
    },
    textColumn<Note>('createdBy', 'Created By', (item) => item.createdBy.name, {
      cellClassName: 'align-top',
    }),
    viewDetailsColumn<Note>((item) => `/notes/${item.id}`, {
      cellClassName: 'align-top',
    }),
  ];

  return (
    <DataTable<Note>
      data={data}
      columns={columns}
      getRowId={(item) => item.id}
      selectable
      selectedIds={selectedIds}
      onToggleSelection={onToggle}
      onSelectAll={onSelectAll}
      showSerialNumber
      startIndex={startIndex}
      hideOnMobile
      rowClassName={(_item, isSelected) =>
        `transition-colors duration-150 ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-200'}`
      }
    />
  );
};

export default NoteTable;
