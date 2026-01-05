// src/pages/Entities/shared/components/EntityHeader.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import Button from '../../../../components/UI/Button/Button';
import ExportActions from '../../../../components/UI/ExportActions';

interface EntityHeaderProps {
  title: string;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  isFilterActive: boolean;
  onFilterToggle: () => void;
  onExportPdf: () => void;
  onExportExcel: () => void;
  addButtonLabel: string;
  onAddClick: () => void;
}

export const EntityHeader: React.FC<EntityHeaderProps> = ({
  title, searchTerm, onSearchChange, isFilterActive, onFilterToggle,
  onExportPdf, onExportExcel, addButtonLabel, onAddClick
}) => {
  return (
    <motion.div className="flex flex-col xl:flex-row xl:items-center justify-between mb-6 gap-4 flex-shrink-0 px-1">
      <h1 className="text-3xl font-bold text-[#202224]">{title}</h1>
      
      <div className="flex flex-col md:flex-row md:items-center gap-3 w-full xl:w-auto">
        <div className="relative w-full sm:w-64">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search By Name and Owner"
            className="h-10 w-full bg-gray-200 border-none pl-10 pr-4 rounded-full text-sm outline-none focus:ring-2 focus:ring-secondary transition-all"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <button 
            onClick={onFilterToggle}
            className={`p-2.5 rounded-lg border transition-all ${isFilterActive ? 'bg-secondary text-white border-blue-600 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
          >
            <FunnelIcon className="h-5 w-5" />
          </button>

          <ExportActions onExportPdf={onExportPdf} onExportExcel={onExportExcel} />
          
          <Button onClick={onAddClick} className="whitespace-nowrap">
            {addButtonLabel}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};