import React from 'react';
import { DataTable, textColumn, SearchBar, Button, EmptyState, Pagination, TableSkeleton } from '@/components/ui';
import ConfirmationModal from '@/components/modals/CommonModals/ConfirmationModal';
import type { TableColumn, TableAction, TableColumnSkeleton } from '@/components/ui';
import type { CategoryConfig, CustomizableEntity } from '../categoryConfig';
import { useCustomizableEntity } from '../hooks/useCustomizableEntity';
import EntityFormModal from './EntityFormModal';
import InterestCategoryCrudPanel from './InterestCategoryCrudPanel';

interface EntityCrudPanelProps {
  config: CategoryConfig;
}

const StandardEntityCrudPanel: React.FC<EntityCrudPanelProps> = ({ config }) => {
  const {
    state,
    actions,
    isFormModalOpen,
    isDeleteModalOpen,
    editingEntity,
    deletingEntity,
    openAddModal,
    openEditModal,
    openDeleteModal,
    closeFormModal,
    closeDeleteModal,
    handleSubmit,
    handleConfirmDelete,
  } = useCustomizableEntity(config);

  const columns: TableColumn<CustomizableEntity>[] = [
    textColumn<CustomizableEntity>('name', 'Name'),
  ];
  const skeletonColumns: TableColumnSkeleton[] = [
    { width: 220, type: 'text' },   // Name
    { width: 60, type: 'actions' }, // Actions
  ];

  const tableActions: TableAction<CustomizableEntity>[] = [
    {
      type: 'edit',
      label: 'Edit',
      onClick: (entity) => openEditModal(entity),
    },
    {
      type: 'delete',
      label: 'Delete',
      onClick: (entity) => openDeleteModal(entity),
    },
  ];

  return (
    <div className="flex-1 flex flex-col min-w-0 min-h-0 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Panel Header */}
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
          {state.totalItems} {state.totalItems === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* Search + Add Bar */}
      <div className="px-4 sm:px-6 py-3 border-b border-gray-100 flex items-center gap-3">
        <SearchBar
          value={state.searchTerm}
          onChange={actions.setSearchTerm}
          placeholder={`Search ${config.messages.entityName}s...`}
          className="flex-1"
        />
        {config.supportsCreate && (
          <Button
            onClick={openAddModal}
            className="px-4 py-2.5 text-sm flex-shrink-0"
          >
            Add New
          </Button>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        {state.isLoading ? (
          <div className="px-4 sm:px-6 py-4">
            <TableSkeleton
              rows={6}
              columns={skeletonColumns}
              showCheckbox={false}
              showSerialNumber={true}
              hideOnMobile={false}
            />
          </div>
        ) : state.totalItems === 0 ? (
          <EmptyState
            title={state.searchTerm ? 'No Results Found' : config.messages.emptyTitle}
            description={
              state.searchTerm
                ? `No ${config.messages.entityName}s match your current filters. Try adjusting your search criteria.`
                : config.messages.emptyDescription
            }
            icon={<img src={config.icon} alt="" className="w-12 h-12 opacity-30" />}
          />
        ) : (
          <DataTable<CustomizableEntity>
            data={state.items}
            columns={columns}
            getRowId={(item) => item._id}
            actions={tableActions}
            loading={state.isLoading}
            showSerialNumber
            startIndex={state.startIndex}
            hideOnMobile={false}
            emptyMessage={`No ${config.messages.entityName}s found`}
          />
        )}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={state.currentPage}
        totalItems={state.totalItems}
        itemsPerPage={state.itemsPerPage}
        onPageChange={actions.setCurrentPage}
        className="border-t border-gray-100"
      />

      {/* Form Modal (Add/Edit) */}
      <EntityFormModal
        isOpen={isFormModalOpen}
        onClose={closeFormModal}
        onSubmit={handleSubmit}
        initialName={editingEntity?.name || ''}
        title={editingEntity ? `Edit ${config.messages.entityName}` : `Add ${config.messages.entityName}`}
        description={editingEntity ? `Update the name for this ${config.messages.entityName}.` : `Enter a name for the new ${config.messages.entityName}.`}
        isSubmitting={state.isCreating || state.isUpdating}
        iconSrc={config.icon}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title={`Delete ${config.messages.entityName}`}
        message={`Are you sure you want to delete "${deletingEntity?.name}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={closeDeleteModal}
        confirmButtonText="Delete"
        confirmButtonVariant="danger"
      />
    </div>
  );
};

const EntityCrudPanel: React.FC<EntityCrudPanelProps> = ({ config }) => {
  if (config.key === 'siteInterestCategories') {
    return <InterestCategoryCrudPanel config={config} mode="site" />;
  }

  if (config.key === 'prospectInterestCategories') {
    return <InterestCategoryCrudPanel config={config} mode="prospect" />;
  }

  return <StandardEntityCrudPanel config={config} />;
};

export default EntityCrudPanel;
