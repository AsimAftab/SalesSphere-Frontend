// src/pages/Entities/shared/components/EntityGrid.tsx
import React from 'react';

interface EntityGridProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  emptyMessage?: string;
}

export function EntityGrid<T>({ items, renderItem, emptyMessage = "No items found matching your criteria." }: EntityGridProps<T>) {
  if (items.length === 0) {
    return (
      <div className="text-center p-20 text-gray-400 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 mx-1">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 px-1 md:px-0">
      {items.map(renderItem)}
    </div>
  );
}