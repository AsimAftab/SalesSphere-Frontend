import React, { useMemo } from 'react';
import { DataTable, textColumn } from '@/components/ui';
import type { TableColumn } from '@/components/ui';
import type { BlogPost } from '@/api/blogService';
import { Pencil, Trash2, Eye, EyeOff } from 'lucide-react';

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
        key: 'status',
        label: 'Status',
        accessor: 'status',
        render: (value) => {
          const status = value as string;
          return (
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                status === 'published'
                  ? 'bg-green-50 text-green-700'
                  : 'bg-amber-50 text-amber-700'
              }`}
            >
              {status === 'published' ? 'Published' : 'Draft'}
            </span>
          );
        },
      },
      textColumn<BlogPost>('author', 'Author', (item) => item.author.name),
      {
        key: 'date',
        label: 'Date',
        accessor: 'createdAt',
        render: (value) =>
          new Date(value as string).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          }),
      },
      {
        key: 'actions',
        label: 'Actions',
        accessor: 'id',
        render: (_value, item) => (
          <div className="flex items-center gap-2">
            {permissions.canUpdate && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleStatus(item);
                  }}
                  className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                  title={item.status === 'published' ? 'Unpublish' : 'Publish'}
                >
                  {item.status === 'published' ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(item);
                  }}
                  className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-blue-600 transition-colors"
                  title="Edit"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              </>
            )}
            {permissions.canDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item);
                }}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-red-600 transition-colors"
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
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
