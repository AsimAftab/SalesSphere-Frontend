import { EmptyState } from '../../../../components/UI/EmptyState/EmptyState';
import { FolderOpen } from 'lucide-react';

interface EntityGridProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  emptyMessage?: string;
}

export function EntityGrid<T>({ items, renderItem, emptyMessage = "No items found matching your criteria." }: EntityGridProps<T>) {
  if (items.length === 0) {
    return (
      <EmptyState
        title="No Records Found"
        description={emptyMessage}
        icon={<FolderOpen className="w-12 h-12 text-gray-400" />}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 px-1 md:px-0">
      {items.map(renderItem)}
    </div>
  );
}