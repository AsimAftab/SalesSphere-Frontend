import React from 'react';
import { type Note } from '@/api/notesService';
import { DataTable, textColumn, viewDetailsColumn, type TableColumn } from '@/components/ui';

const formatDate = (dateString: string) => {
  if (!dateString) return '—';

  return new Date(dateString).toISOString().split('T')[0];
};

const getEntityConfig = (item: Note) => {
  if (item.partyName) return { label: 'Party', name: item.partyName, color: 'bg-blue-50 text-blue-600' };
  if (item.prospectName) return { label: 'Prospect', name: item.prospectName, color: 'bg-green-50 text-green-600' };
  if (item.siteName) return { label: 'Site', name: item.siteName, color: 'bg-orange-50 text-orange-600' };
  return { label: 'General', name: '—', color: 'bg-gray-50 text-gray-600' };
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
        const { label, color } = getEntityConfig(item);
        return (
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${color} inline-block`}>
            {label}
          </span>
        );
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
