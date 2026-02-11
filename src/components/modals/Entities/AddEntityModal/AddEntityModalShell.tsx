import React from 'react';
import { Button, FormModal } from '@/components/ui';

interface ModalShellProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  isSaving: boolean;
  submitLabel?: string;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const ModalShell: React.FC<ModalShellProps> = ({
  isOpen, onClose, title, subtitle, isSaving, submitLabel, children, onSubmit
}) => {
  const formId = "add-entity-submit-form";

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={subtitle}
      size="xl"
      footer={
        <div className="flex justify-end gap-3 w-full">
          <Button
            variant="outline"
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="text-gray-700 bg-white border-gray-300 hover:bg-gray-50 font-medium"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form={formId}
            disabled={isSaving}
            variant="secondary"
            isLoading={isSaving}
          >
            {isSaving ? 'Creating...' : submitLabel || 'Create'}
          </Button>
        </div>
      }
    >
      <form id={formId} onSubmit={onSubmit} className="contents">
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {children}
        </div>
      </form>
    </FormModal>
  );
};