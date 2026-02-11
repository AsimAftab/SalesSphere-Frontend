import React from 'react';
import { PageHeader } from '@/components/ui';

interface EntityHeaderProps {
  title: string;
  subtitle?: string;
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

/**
 * EntityHeader - A wrapper around the generic PageHeader component.
 * Maintains backward compatibility with existing entity pages.
 */
export const EntityHeader: React.FC<EntityHeaderProps> = ({
  title,
  subtitle,
  searchTerm,
  onSearchChange,
  isFilterActive,
  onFilterToggle,
  onExportPdf,
  onExportExcel,
  addButtonLabel,
  onAddClick,
  children,
}) => {
  return (
    <PageHeader
      title={title}
      subtitle={subtitle}
      searchTerm={searchTerm}
      onSearchChange={onSearchChange}
      searchPlaceholder="Search By Name and Owner"
      isFilterVisible={isFilterActive}
      onFilterToggle={onFilterToggle}
      showFilter={true}
      onExportPdf={onExportPdf}
      onExportExcel={onExportExcel}
      createButtonLabel={addButtonLabel || undefined}
      onCreate={onAddClick}
      permissions={{
        canCreate: !!onAddClick && !!addButtonLabel,
        canExportPdf: !!onExportPdf,
        canExportExcel: !!onExportExcel,
      }}
      customActions={children}
    />
  );
};