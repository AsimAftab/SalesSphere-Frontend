import React, { useMemo } from 'react';
import { DataTable, textColumn } from '@/components/ui';
import type { TableColumn } from '@/components/ui';
import type { BlogPost } from '@/api/blogService';
import { SquarePen, Trash2 } from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge/StatusBadge';

interface BlogManagementTableProps {
  data: BlogPost[];
  startIndex: number;
  onEdit: (post: BlogPost) => void;
  onDelete: (post: BlogPost) => void;
  onToggleStatus: (post: BlogPost) => void;
  permissions: {
    canUpdate: boolean;
    canDelete: boolean;
  };
}

const BlogManagementTable: React.FC<BlogManagementTableProps> = ({
  data,
  startIndex,
  onEdit,
  onDelete,
  onToggleStatus,
  permissions,
}) => {
  const columns = useMemo<TableColumn<BlogPost>[]>(() => {
    const cols: TableColumn<BlogPost>[] = [
      textColumn<BlogPost>('title', 'Title', 'title', {
        width: 'max-w-[250px]',
      }),
      {
        key: 'date',
        label: 'Published Date',
        accessor: 'createdAt',
        render: (value) =>
          value ? new Date(value as string).toISOString().split('T')[0] : '—',
      },
      textColumn<BlogPost>('author', 'Author', (item) => item.author.name),
      {
        key: 'status',
        label: 'Status',
        accessor: 'status',
        render: (value) => <StatusBadge status={value as string} />,
      },
      {
        key: 'publish',
        label: 'Publish',
        accessor: 'status',
        render: (_value, item) => (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (permissions.canUpdate) {
                onToggleStatus(item);
              }
            }}
            disabled={!permissions.canUpdate}
            className={`
              relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2
              ${item.status === 'published' ? 'bg-green-600' : 'bg-gray-200'}
              ${!permissions.canUpdate ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            role="switch"
            aria-checked={item.status === 'published'}
            title={item.status === 'published' ? 'Unpublish' : 'Publish'}
          >
            <span
              aria-hidden="true"
              className={`
                pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
                ${item.status === 'published' ? 'translate-x-5' : 'translate-x-0'}
              `}
            />
          </button>
        ),
      },
      {
        key: 'actions',
        label: 'Actions',
        accessor: 'id',
        render: (_value, item) => (
          <div className="flex items-center gap-3">
            {permissions.canUpdate && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(item);
                }}
                className="text-blue-600 hover:text-blue-800 transition-colors"
                title="Edit"
              >
                <SquarePen className="h-5 w-5" />
              </button>
            )}
            {permissions.canDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item);
                }}
                className="text-red-600 hover:text-red-800 transition-colors"
                title="Delete"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            )}
          </div>
        ),
      },
    ];

    return cols;
  }, [permissions, onEdit, onDelete, onToggleStatus]);

  return (
    <DataTable<BlogPost>
      data={data}
      columns={columns}
      getRowId={(item) => item.id}
      showSerialNumber={true}
      startIndex={startIndex}
      hideOnMobile={true}
    />
  );
};

export default BlogManagementTable;
