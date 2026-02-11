import type { TableColumn, TableAction } from '../types';
import { ActionButton } from './ActionButton';

interface TableRowProps<T> {
  item: T;
  index: number;
  rowId: string;
  isSelected: boolean;
  columns: TableColumn<T>[];
  selectable: boolean;
  showSerialNumber: boolean;
  startIndex: number;
  visibleActions: TableAction<T>[];
  hasActions: boolean;
  rowClassName: string;
  onRowClick?: (item: T) => void;
  onToggleSelection?: (id: string) => void;
  renderCell: (item: T, column: TableColumn<T>, index: number) => React.ReactNode;
}

export function TableRow<T>({
  item,
  index,
  rowId,
  isSelected,
  columns,
  selectable,
  showSerialNumber,
  startIndex,
  visibleActions,
  hasActions,
  rowClassName,
  onRowClick,
  onToggleSelection,
  renderCell,
}: TableRowProps<T>) {
  return (
    <tr
      className={rowClassName}
      onClick={() => onRowClick?.(item)}
    >
      {/* Selection Checkbox */}
      {selectable && (
        <td className="px-5 py-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              onToggleSelection?.(rowId);
            }}
            className="w-4 h-4 rounded border-gray-300 text-secondary cursor-pointer"
            aria-label={`Select row ${index + 1}`}
          />
        </td>
      )}

      {/* Serial Number */}
      {showSerialNumber && (
        <td className="px-5 py-3 text-black text-sm">
          {startIndex + index + 1}
        </td>
      )}

      {/* Data Cells */}
      {columns.map((column) => (
        <td
          key={column.key}
          className={`
            px-5 py-3 text-black text-sm
            ${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left'}
            ${column.width || ''}
            ${column.cellClassName || ''}
          `.trim()}
        >
          {renderCell(item, column, index)}
        </td>
      ))}

      {/* Actions */}
      {hasActions && (
        <td className="px-5 py-3 text-sm">
          <div className="flex items-center gap-x-3">
            {visibleActions.map((action, actionIndex) => (
              <ActionButton
                key={actionIndex}
                action={action}
                item={item}
                index={actionIndex}
              />
            ))}
          </div>
        </td>
      )}
    </tr>
  );
}

export default TableRow;
