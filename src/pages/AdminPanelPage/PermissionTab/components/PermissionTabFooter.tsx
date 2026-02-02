import React from 'react';
import { Button } from '@/components/ui';

interface PermissionTabFooterProps {
  totalModules: number;
  isPending: boolean;
  onSave: () => void;
  onCancel?: () => void;
}

export const PermissionTabFooter: React.FC<PermissionTabFooterProps> = ({
  totalModules,
  isPending,
  onSave,
  onCancel
}) => {
  return (
    <div className="bg-white border-t border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Total Modules Count */}
        <div className="text-sm text-gray-600">
          Total modules: <span className="font-semibold text-gray-900">{totalModules}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {onCancel && (
            <Button
              onClick={onCancel}
              disabled={isPending}
              variant='outline'
            >
              Cancel
            </Button>
          )}
          <Button
            onClick={onSave}
            disabled={isPending}
            variant='secondary'
          >
            {isPending && (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            )}
            {isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
};