import React from 'react';
import { SearchBar, Button, Pagination } from '@/components/ui';
import ConfirmationModal from '@/components/modals/CommonModals/ConfirmationModal';
import type { CategoryConfig } from '../categoryConfig';
import { useInterestCategoryCrud } from '../hooks/useInterestCategoryCrud';
import InterestCategoryFormModal from './InterestCategoryFormModal';
import InterestCategoryContent from './InterestCategoryContent';

interface InterestCategoryCrudPanelProps {
  config: CategoryConfig;
  mode: 'site' | 'prospect';
}

const InterestCategoryCrudPanel: React.FC<InterestCategoryCrudPanelProps> = ({ config, mode }) => {
  const controller = useInterestCategoryCrud({ config, mode });
  const searchPlaceholder = controller.isSiteMode
    ? 'Search site interest categories...'
    : 'Search prospect interest categories...';

  return (
    <div className="flex-1 flex flex-col min-w-0 min-h-0 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-white z-10">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 p-2 bg-secondary/10 rounded-lg hidden sm:flex">
            <img src={config.icon} alt="" className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-gray-900">{config.label}</h3>
            <p className="text-xs text-gray-500">{config.description}</p>
          </div>
        </div>
        <span className="text-xs sm:text-sm font-semibold px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-secondary/10 text-secondary">
          {controller.manager.state.totalItems} {controller.manager.state.totalItems === 1 ? 'item' : 'items'}
        </span>
      </div>

      <div className="px-4 sm:px-6 py-3 border-b border-gray-100 flex items-center gap-3">
        <SearchBar
          value={controller.manager.state.searchTerm}
          onChange={controller.manager.actions.setSearchTerm}
          placeholder={searchPlaceholder}
          className="flex-1"
        />
        <Button onClick={controller.openAddModal} className="px-4 py-2.5 text-sm flex-shrink-0">
          Add New
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <InterestCategoryContent
          config={config}
          isSiteMode={controller.isSiteMode}
          isLoading={controller.manager.state.isLoading}
          totalItems={controller.manager.state.totalItems}
          searchTerm={controller.manager.state.searchTerm}
          items={controller.manager.state.items}
          startIndex={controller.manager.state.startIndex}
          onEdit={controller.openEditModal}
          onDelete={controller.openDeleteModal}
        />
      </div>

      <Pagination
        currentPage={controller.manager.state.currentPage}
        totalItems={controller.manager.state.totalItems}
        itemsPerPage={controller.manager.state.itemsPerPage}
        onPageChange={controller.manager.actions.setCurrentPage}
        className="border-t border-gray-100"
      />

      <InterestCategoryFormModal config={config} controller={controller} />

      <ConfirmationModal
        isOpen={controller.isDeleteModalOpen}
        title={`Delete ${config.messages.entityName}`}
        message={`Are you sure you want to delete "${controller.deletingEntity?.name}"? This action cannot be undone.`}
        onConfirm={controller.confirmDelete}
        onCancel={controller.closeDeleteModal}
        confirmButtonText="Delete"
        confirmButtonVariant="danger"
      />
    </div>
  );
};

export default InterestCategoryCrudPanel;
