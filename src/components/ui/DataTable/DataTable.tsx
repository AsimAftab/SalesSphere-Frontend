import React, { useCallback, useMemo } from 'react';
import type { DataTableProps, TableColumn, TableAction } from './types';
import { LoadingOverlay, TableEmptyState, TableHeader, TableRow } from './components';

// Re-export types for backward compatibility
export type { TableColumn, TableAction, DataTableProps } from './types';

/* eslint-disable react-refresh/only-export-components */
// Re-export column helpers for backward compatibility
export {
  textColumn,
  currencyColumn,
  imageColumn,
  statusColumn,
  linkColumn,
  viewDetailsColumn,
  dateColumn,
} from './columnHelpers';
/* eslint-enable react-refresh/only-export-components */

// ============================================================================
// Main Component
// ============================================================================

function DataTableInner<T>(
  props: DataTableProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const {
    data,
    columns,
    getRowId: getRowIdProp,
    keyExtractor,
    selectable = false,
    selectedIds = [],
    onToggleSelection,
    onSelectAll,
    isRowSelectable, // Add this
    showSerialNumber = true,
    startIndex = 0,
    actions,
    actionsLabel = 'Actions',
    loading = false,
    loadingComponent,
    emptyMessage = 'No data found',
    emptyComponent,
    className = '',
    tableClassName = '',
    hideOnMobile = true,
    onRowClick,
    rowClassName,
  } = props;

  // Get row ID function (supports both getRowId and keyExtractor)
  const getRowId = useMemo(
    () => getRowIdProp || keyExtractor || ((item: T) => String((item as Record<string, unknown>).id || (item as Record<string, unknown>)._id || '')),
    [getRowIdProp, keyExtractor]
  );

  // Filter visible columns
  const visibleColumns = useMemo(
    () => columns.filter((col) => col.visible !== false),
    [columns]
  );

  // Check if all selectable rows are selected
  const allSelected = useMemo(
    () => {
      if (data.length === 0) return false;
      const selectableData = isRowSelectable ? data.filter(isRowSelectable) : data;
      return selectableData.length > 0 && selectableData.every((item) => selectedIds.includes(getRowId(item)));
    },
    [data, selectedIds, getRowId, isRowSelectable]
  );

  // Check if some rows are selected
  const someSelected = useMemo(
    () => {
      const selectableData = isRowSelectable ? data.filter(isRowSelectable) : data;
      return selectableData.some((item) => selectedIds.includes(getRowId(item))) && !allSelected;
    },
    [data, selectedIds, getRowId, allSelected, isRowSelectable]
  );

  // Handle select all checkbox
  const handleSelectAll = useCallback(() => {
    if (onSelectAll) {
      // Using the simplified boolean logic that TableHeader expects
      onSelectAll(!allSelected);
    }
  }, [allSelected, onSelectAll]);

  // Get cell value from item
  const getCellValue = useCallback((item: T, column: TableColumn<T>): unknown => {
    if (column.accessor) {
      if (typeof column.accessor === 'function') {
        return column.accessor(item);
      }
      return item[column.accessor];
    }
    return (item as Record<string, unknown>)[column.key];
  }, []);

  // Render cell content
  const renderCell = useCallback(
    (item: T, column: TableColumn<T>, index: number): React.ReactNode => {
      const value = getCellValue(item, column);
      if (column.render) {
        return column.render(value, item, index);
      }
      return value as React.ReactNode;
    },
    [getCellValue]
  );

  // Check if action is visible
  const isActionVisible = useCallback((action: TableAction<T>, item: T): boolean => {
    if (action.visible === undefined) return true;
    if (typeof action.visible === 'function') return action.visible(item);
    return action.visible;
  }, []);

  // Get visible actions for an item
  const getVisibleActions = useCallback(
    (item: T) => actions?.filter((action) => isActionVisible(action, item)) || [],
    [actions, isActionVisible]
  );

  // Check if any item has visible actions
  const hasActions = useMemo(
    () => actions && actions.length > 0 && data.some((item) => getVisibleActions(item).length > 0),
    [actions, data, getVisibleActions]
  );

  // Get row className
  const getRowClassName = useCallback(
    (item: T, isSelected: boolean): string => {
      const baseClass = `transition-colors ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-200'}`;
      const cursorClass = onRowClick ? 'cursor-pointer' : '';

      if (typeof rowClassName === 'function') {
        return `${baseClass} ${cursorClass} ${rowClassName(item, isSelected)}`;
      }
      return `${baseClass} ${cursorClass} ${rowClassName || ''}`;
    },
    [rowClassName, onRowClick]
  );

  const wrapperClassName = `
    bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden relative
    ${hideOnMobile ? 'hidden md:block' : ''}
    ${className}
  `.trim();

  return (
    <div ref={ref} className={wrapperClassName}>
      {/* Loading Overlay */}
      {loading && (loadingComponent || <LoadingOverlay />)}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className={`w-full border-collapse ${tableClassName}`}>
          {/* Header */}
          <TableHeader
            columns={visibleColumns}
            selectable={selectable}
            allSelected={allSelected}
            someSelected={someSelected}
            onSelectAll={handleSelectAll}
            showSerialNumber={showSerialNumber}
            hasActions={hasActions || false}
            actionsLabel={actionsLabel}
          />

          {/* Body */}
          <tbody className="divide-y divide-gray-700">
            {data.map((item, index) => {
              const rowId = getRowId(item);
              const isSelected = selectedIds.includes(rowId);
              const visibleActions = getVisibleActions(item);

              return (
                <TableRow
                  key={rowId}
                  item={item}
                  index={index}
                  rowId={rowId}
                  isSelected={isSelected}
                  columns={visibleColumns}
                  selectable={selectable}
                  isSelectable={isRowSelectable ? isRowSelectable(item) : true} // Check per row
                  showSerialNumber={showSerialNumber}
                  startIndex={startIndex}
                  visibleActions={visibleActions}
                  hasActions={hasActions || false}
                  rowClassName={getRowClassName(item, isSelected)}
                  onRowClick={onRowClick}
                  onToggleSelection={onToggleSelection}
                  renderCell={renderCell}
                />
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {data.length === 0 && !loading && (
        emptyComponent || <TableEmptyState message={emptyMessage} />
      )}
    </div>
  );
}

// Forward ref with generic type support
export const DataTable = React.forwardRef(DataTableInner) as <T>(
  props: DataTableProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> }
) => React.ReactElement;

export default DataTable;
