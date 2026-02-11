import React from 'react';
import { FormModal, Button } from '@/components/ui';
import { Plus, X } from 'lucide-react';
import type { CategoryConfig } from '../categoryConfig';
import type { InterestCategoryCrudController } from '../hooks/useInterestCategoryCrud';

interface InterestCategoryFormModalProps {
  config: CategoryConfig;
  controller: InterestCategoryCrudController;
}

const InterestCategoryFormModal: React.FC<InterestCategoryFormModalProps> = ({ config, controller }) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await controller.submit();
  };

  return (
    <FormModal
      isOpen={controller.isFormModalOpen}
      onClose={controller.closeFormModal}
      title={controller.editingEntity ? `Edit ${config.messages.entityName}` : `Add ${config.messages.entityName}`}
      description={controller.editingEntity ? `Update ${config.messages.entityName} details.` : `Enter details for the new ${config.messages.entityName}.`}
      size="lg"
      icon={<img src={config.icon} alt="" className="w-5 h-5" />}
      footer={
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={controller.closeFormModal}
            disabled={controller.manager.state.isCreating || controller.manager.state.isUpdating}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="interest-category-form"
            isLoading={controller.manager.state.isCreating || controller.manager.state.isUpdating}
          >
            {controller.editingEntity ? 'Save Changes' : 'Create'}
          </Button>
        </div>
      }
    >
      <form id="interest-category-form" onSubmit={handleSubmit} className="p-6 space-y-4">
        <div>
          <label htmlFor="interest-category-name" className="block text-sm font-semibold text-gray-700 mb-2">
            Category Name <span className="text-red-500">*</span>
          </label>
          <input
            id="interest-category-name"
            type="text"
            value={controller.form.name}
            onChange={(e) => controller.setForm((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="Enter category name"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none transition-all bg-white focus:border-secondary focus:ring-2 focus:ring-secondary shadow-sm"
            autoFocus
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Brands <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {controller.form.brands.map((brand) => (
              <span key={brand} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-sm font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                {brand}
                <button type="button" onClick={() => controller.removeBrand(brand)} className="text-blue-500 hover:text-red-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={controller.brandInput}
              onChange={(e) => controller.setBrandInput(e.target.value)}
              placeholder="Add brand"
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl outline-none transition-all bg-white focus:border-secondary focus:ring-2 focus:ring-secondary shadow-sm"
            />
            <Button
              type="button"
              onClick={controller.addBrand}
              className="px-3 min-h-[46px] bg-secondary hover:bg-secondary/90 text-white"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {controller.isSiteMode && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Site Contacts</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {controller.form.technicians.map((tech, idx) => (
                <span key={`${tech.name}-${tech.phone}-${idx}`} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-sm font-medium bg-gray-50 text-gray-700 border border-gray-200">
                  {tech.name} ({tech.phone})
                  <button type="button" onClick={() => controller.removeContact(idx)} className="text-gray-500 hover:text-red-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <input
                type="text"
                value={controller.contactName}
                onChange={(e) => controller.setContactName(e.target.value)}
                placeholder="Contact name"
                className="px-4 py-2.5 border border-gray-200 rounded-xl outline-none transition-all bg-white focus:border-secondary focus:ring-2 focus:ring-secondary shadow-sm"
              />
              <div className="flex gap-2">
                <input
                  type="tel"
                  value={controller.contactPhone}
                  onChange={(e) => controller.setContactPhoneDigits(e.target.value)}
                  placeholder="Phone (10 digits)"
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl outline-none transition-all bg-white focus:border-secondary focus:ring-2 focus:ring-secondary shadow-sm"
                />
                <Button
                  type="button"
                  onClick={controller.addContact}
                  className="px-3 min-h-[46px] bg-secondary hover:bg-secondary/90 text-white"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {controller.error && <p className="text-sm text-red-500">{controller.error}</p>}
      </form>
    </FormModal>
  );
};

export default InterestCategoryFormModal;
