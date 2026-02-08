import React from 'react';
import { Button } from '@/components/ui';

interface PermissionTabFooterProps {
  isPending: boolean;
  disabled?: boolean;
  onSave: () => void;
  onCancel?: () => void;
}

export const PermissionTabFooter: React.FC<PermissionTabFooterProps> = ({
  isPending,
  disabled = false,
  onSave,
  onCancel
}) => {
  return (
    <div className="bg-gray-50/80 border-t border-gray-200 px-6 py-4">
      <div className="flex items-center justify-end gap-3">
        {onCancel && (
          <Button
            onClick={onCancel}
            disabled={isPending || disabled}
            variant='outline'
          >
            Cancel
          </Button>
        )}
        <Button
          onClick={onSave}
          disabled={isPending || disabled}
          variant='secondary'
        >
          {isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
};
