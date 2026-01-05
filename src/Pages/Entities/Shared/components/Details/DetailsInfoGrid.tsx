// src/pages/Entities/Shared/components/Details/DetailsInfoGrid.tsx
import React from 'react';

interface InfoItem {
  icon: React.ElementType;
  label: string;
  value: string | number | null | undefined;
  className?: string;
}

/**
 * DetailsInfoGrid: Restored to original SalesSphere UI styling.
 * This maintains the specific font weights and block/inline behaviors
 * used in your original "Party Information" section.
 */
export const DetailsInfoGrid: React.FC<{ items: InfoItem[] }> = ({ items }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
    {items.map((item, idx) => (
      <div key={idx} className={`flex items-start gap-2 ${item.className || ''}`}>
        {/* Original Icon Styling */}
        <item.icon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
        
        <div>
          {/* Restored Label: font-medium text-gray-500 (No uppercase/xs) */}
          <span className="font-medium text-gray-500 block">
            {item.label}
          </span>
          
          {/* Restored Value: text-gray-800 */}
          <span className="text-gray-800 break-all">
            {item.value || 'N/A'}
          </span>
        </div>
      </div>
    ))}
  </div>
);