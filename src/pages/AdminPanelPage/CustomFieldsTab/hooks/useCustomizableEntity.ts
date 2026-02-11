import { useState, useCallback } from 'react';
import { useEntityManager } from '@/hooks';
import type { CategoryConfig, CustomizableEntity } from '../categoryConfig';

export function useCustomizableEntity(config: CategoryConfig) {
  const entityManager = useEntityManager<CustomizableEntity, string, string>({
    queryKey: config.queryKey,
    fetchFn: config.api.fetch,
    searchKeys: ['name'],
    itemsPerPage: 10,
    mutations: {
      create: config.api.create,
      update: (id: string, name: string) => config.api.update(id, name),
      delete: config.api.delete,
    },
    messages: {
      createSuccess: `${config.messages.entityName} created successfully`,
      createError: `Failed to create ${config.messages.entityName}`,
      updateSuccess: `${config.messages.entityName} updated successfully`,
      updateError: `Failed to update ${config.messages.entityName}`,
      deleteSuccess: `${config.messages.entityName} deleted successfully`,
      deleteError: `Failed to delete ${config.messages.entityName}`,
    },
  });

  // Modal state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingEntity, setEditingEntity] = useState<CustomizableEntity | null>(null);
  const [deletingEntity, setDeletingEntity] = useState<CustomizableEntity | null>(null);

  const openAddModal = useCallback(() => {
    setEditingEntity(null);
    setIsFormModalOpen(true);
  }, []);

  const openEditModal = useCallback((entity: CustomizableEntity) => {
    setEditingEntity(entity);
    setIsFormModalOpen(true);
  }, []);

  const openDeleteModal = useCallback((entity: CustomizableEntity) => {
    setDeletingEntity(entity);
    setIsDeleteModalOpen(true);
  }, []);

  const closeFormModal = useCallback(() => {
    setIsFormModalOpen(false);
    setEditingEntity(null);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false);
    setDeletingEntity(null);
  }, []);

  const handleSubmit = useCallback(async (name: string) => {
    try {
      if (editingEntity) {
        await entityManager.actions.update(editingEntity._id, name);
      } else {
        await entityManager.actions.create(name);
      }
      closeFormModal();
    } catch {
      // Error toast is already shown by useEntityManager's mutation onError
    }
  }, [editingEntity, entityManager.actions, closeFormModal]);

  const handleConfirmDelete = useCallback(async () => {
    if (deletingEntity) {
      await entityManager.actions.delete(deletingEntity._id);
      closeDeleteModal();
    }
  }, [deletingEntity, entityManager.actions, closeDeleteModal]);

  return {
    ...entityManager,
    // Modal state
    isFormModalOpen,
    isDeleteModalOpen,
    editingEntity,
    deletingEntity,
    // Modal actions
    openAddModal,
    openEditModal,
    openDeleteModal,
    closeFormModal,
    closeDeleteModal,
    handleSubmit,
    handleConfirmDelete,
  };
}
