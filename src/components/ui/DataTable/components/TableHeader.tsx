import type { TableColumn } from '../types';

interface TableHeaderProps<T> {
  columns: TableColumn<T>[];
  selectable: boolean;
  allSelected: boolean;
  someSelected: boolean;
  onSelectAll: () => void;
  showSerialNumber: boolean;
  hasActions: boolean;
  actionsLabel: string;
}

export function TableHeader<T>({
  columns,
  selectable,
  allSelected,
  someSelected,
  onSelectAll,
  showSerialNumber,
  hasActions,
  actionsLabel,
}: TableHeaderProps<T>) {
  return (
    <thead className="bg-secondary text-white text-sm">
      <tr>
        {/* Selection Checkbox */}
        {selectable && (
          <th className="px-5 py-3 text-left w-12">
            <input
              type="checkbox"
              checked={allSelected}
              ref={(input) => {
                if (input) input.indeterminate = someSelected;
              }}
              onChange={onSelectAll}
              className="w-4 h-4 rounded border-gray-300 accent-white cursor-pointer"
              aria-label="Select all rows"
            />
          </th>
        )}

        {/* Serial Number */}
        {showSerialNumber && (
          <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">
            S.NO.
          </th>
        )}

        {/* Data Columns */}
        {columns.map((column) => (
          <th
            key={column.key}
            className={`
              px-5 py-3 font-semibold whitespace-nowrap
              ${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left'}
              ${column.width || ''}
              ${column.headerClassName || ''}
            `.trim()}
          >
            {column.label}
          </th>
        ))}

        {/* Actions */}
        {hasActions && (
          <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">
            {actionsLabel}
          </th>
        )}
      </tr>
    </thead>
  );
}

export default TableHeader;
