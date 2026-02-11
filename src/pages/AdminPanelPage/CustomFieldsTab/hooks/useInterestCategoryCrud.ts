import { useState } from 'react';
import { useEntityManager } from '@/hooks';
import { SiteRepository } from '@/api/siteService';
import { ProspectRepository } from '@/api/prospectService';
import type { CategoryConfig } from '../categoryConfig';
import type { InterestCategory, InterestFormState } from '../types/interestCategory';

interface UseInterestCategoryCrudArgs {
  config: CategoryConfig;
  mode: 'site' | 'prospect';
}

export function useInterestCategoryCrud({ config, mode }: UseInterestCategoryCrudArgs) {
  const isSiteMode = mode === 'site';

  const manager = useEntityManager<InterestCategory, InterestFormState, InterestFormState>({
    queryKey: isSiteMode ? ['customization', 'siteInterestCategories'] : ['customization', 'prospectInterestCategories'],
    fetchFn: () => (isSiteMode ? SiteRepository.getSiteCategoriesList() : ProspectRepository.getProspectCategoriesList()),
    searchKeys: ['name'],
    itemsPerPage: 10,
    mutations: {
      create: (data) => (
        isSiteMode
          ? SiteRepository.createSiteCategory({ name: data.name, brands: data.brands, technicians: data.technicians })
          : ProspectRepository.createProspectCategory({ name: data.name, brands: data.brands })
      ),
      update: (id, data) => (
        isSiteMode
          ? SiteRepository.updateSiteCategory(id, { name: data.name, brands: data.brands, technicians: data.technicians })
          : ProspectRepository.updateProspectCategory(id, { name: data.name, brands: data.brands })
      ),
      delete: (id) => (isSiteMode ? SiteRepository.deleteSiteCategory(id) : ProspectRepository.deleteProspectCategory(id)),
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

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingEntity, setEditingEntity] = useState<InterestCategory | null>(null);
  const [deletingEntity, setDeletingEntity] = useState<InterestCategory | null>(null);

  const [form, setForm] = useState<InterestFormState>({ name: '', brands: [], technicians: [] });
  const [brandInput, setBrandInput] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [error, setError] = useState('');

  const openAddModal = () => {
    setEditingEntity(null);
    setForm({ name: '', brands: [], technicians: [] });
    setBrandInput('');
    setContactName('');
    setContactPhone('');
    setError('');
    setIsFormModalOpen(true);
  };

  const openEditModal = (entity: InterestCategory) => {
    setEditingEntity(entity);
    setForm({
      name: entity.name,
      brands: entity.brands || [],
      technicians: ('technicians' in entity ? entity.technicians : []) || [],
    });
    setBrandInput('');
    setContactName('');
    setContactPhone('');
    setError('');
    setIsFormModalOpen(true);
  };

  const closeFormModal = () => {
    setIsFormModalOpen(false);
    setEditingEntity(null);
    setError('');
  };

  const openDeleteModal = (entity: InterestCategory) => {
    setDeletingEntity(entity);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingEntity(null);
  };

  const addBrand = () => {
    const value = brandInput.trim();
    if (!value) return;
    if (form.brands.some((b) => b.toLowerCase() === value.toLowerCase())) return;
    setForm((prev) => ({ ...prev, brands: [...prev.brands, value] }));
    setBrandInput('');
  };

  const removeBrand = (brand: string) => {
    setForm((prev) => ({ ...prev, brands: prev.brands.filter((b) => b !== brand) }));
  };

  const addContact = () => {
    const name = contactName.trim();
    const phone = contactPhone.trim();
    if (!name || phone.length !== 10) return;
    if (form.technicians.some((t) => t.name === name && t.phone === phone)) return;
    setForm((prev) => ({ ...prev, technicians: [...prev.technicians, { name, phone }] }));
    setContactName('');
    setContactPhone('');
  };

  const removeContact = (index: number) => {
    setForm((prev) => ({ ...prev, technicians: prev.technicians.filter((_, i) => i !== index) }));
  };

  const submit = async () => {
    if (!form.name.trim()) {
      setError('Category name is required');
      return;
    }
    if (form.brands.length === 0) {
      setError('At least one brand is required');
      return;
    }
    setError('');

    try {
      if (editingEntity) {
        await manager.actions.update(editingEntity._id, {
          name: form.name.trim(),
          brands: form.brands,
          technicians: form.technicians,
        });
      } else {
        await manager.actions.create({
          name: form.name.trim(),
          brands: form.brands,
          technicians: form.technicians,
        });
      }
      closeFormModal();
    } catch {
      // toast handled by useEntityManager
    }
  };

  const confirmDelete = async () => {
    if (!deletingEntity) return;
    await manager.actions.delete(deletingEntity._id);
    closeDeleteModal();
  };

  const setContactPhoneDigits = (value: string) => setContactPhone(value.replace(/\D/g, '').slice(0, 10));

  return {
    isSiteMode,
    manager,
    isFormModalOpen,
    isDeleteModalOpen,
    editingEntity,
    deletingEntity,
    form,
    brandInput,
    contactName,
    contactPhone,
    error,
    openAddModal,
    openEditModal,
    closeFormModal,
    openDeleteModal,
    closeDeleteModal,
    setForm,
    setBrandInput,
    setContactName,
    setContactPhoneDigits,
    addBrand,
    removeBrand,
    addContact,
    removeContact,
    submit,
    confirmDelete,
  };
}

export type InterestCategoryCrudController = ReturnType<typeof useInterestCategoryCrud>;
