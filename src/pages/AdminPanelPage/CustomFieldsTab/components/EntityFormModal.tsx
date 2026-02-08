import React, { useState, useEffect } from 'react';
import { FormModal } from '@/components/ui';
import { Button } from '@/components/ui';

interface EntityFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => Promise<void>;
  initialName?: string;
  title: string;
  description?: string;
  isSubmitting: boolean;
  iconSrc?: string;
}

const EntityFormModal: React.FC<EntityFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialName = '',
  title,
  description,
  isSubmitting,
  iconSrc,
}) => {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName(initialName);
      setError('');
    }
  }, [isOpen, initialName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Name is required');
      return;
    }
    setError('');
    try {
      await onSubmit(trimmed);
    } catch {
      // Error is handled upstream (toast notification)
    }
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      size="sm"
      icon={iconSrc ? <img src={iconSrc} alt="" className="w-5 h-5" /> : undefined}
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div>
          <label htmlFor="entity-name" className="block text-sm font-medium text-gray-700 mb-1.5">
            Name
          </label>
          <input
            id="entity-name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError('');
            }}
            placeholder="Enter name"
            className={`w-full px-4 py-2.5 border rounded-xl outline-none transition-all bg-white ${
              error ? 'border-red-300 ring-1 ring-red-100' : 'border-gray-200 focus:border-secondary focus:ring-2 focus:ring-secondary shadow-sm'
            }`}
            autoFocus
            disabled={isSubmitting}
          />
          {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-5 py-2 text-sm"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isSubmitting}
            className="px-5 py-2 text-sm"
          >
            {initialName ? 'Save Changes' : 'Create'}
          </Button>
        </div>
      </form>
    </FormModal>
  );
};

export default EntityFormModal;
