import React from 'react';
import { FunnelIcon } from '@heroicons/react/24/outline';
import { Button, ExportActions, SearchBar } from '@/components/ui';

interface EntityHeaderProps {
  title: string;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  isFilterActive: boolean;
  onFilterToggle: () => void;
  onExportPdf?: () => void;
  onExportExcel?: () => void;
  addButtonLabel: string;
  onAddClick?: () => void;
  children?: React.ReactNode;
}

export const EntityHeader: React.FC<EntityHeaderProps> = ({
  title, searchTerm, onSearchChange, isFilterActive, onFilterToggle,
  onExportPdf, onExportExcel, addButtonLabel, onAddClick, children
}) => {
  return (
    <div className="w-full flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 px-1">
      <h1 className="text-2xl sm:text-3xl font-bold text-[#202224]">{title}</h1>

      <div className="flex flex-col lg:flex-row items-center gap-4 w-full lg:w-auto lg:justify-end">
        <div className="relative w-full lg:w-72 xl:w-80">
          <SearchBar
            value={searchTerm}
            onChange={onSearchChange}
            placeholder="Search By Name and Owner"
            className="w-full"
          />
        </div>

        <div className="flex items-center justify-between lg:justify-end gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={onFilterToggle}
              className={`p-2.5 rounded-lg border transition-all ${isFilterActive ? 'bg-secondary text-white border-blue-600 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
            >
              <FunnelIcon className="h-5 w-5" />
            </button>

            {(onExportPdf || onExportExcel) && (
              <ExportActions onExportPdf={onExportPdf} onExportExcel={onExportExcel} />
            )}
          </div>

          {/* Custom Actions (e.g. Bulk Upload) */}
          {children}

          {addButtonLabel && onAddClick && (
            <Button onClick={onAddClick} className="whitespace-nowrap">
              {addButtonLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};