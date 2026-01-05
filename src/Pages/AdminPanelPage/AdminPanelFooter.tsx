import React from 'react';
import Button from '../../components/UI/Button/Button';

interface AdminPanelFooterProps {
  total: number;
  isPending: boolean;
  onSave: () => void;
}

export const AdminPanelFooter: React.FC<AdminPanelFooterProps> = ({ total, isPending, onSave }) => (
  <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-gray-200 shrink-0 mt-auto">
    <p className="text-md font-bold text-gray-600">
      Total modules: <span className="text-secondary ml-1">{total}</span>
    </p>
    <div className="flex gap-4">
      <Button variant='ghost' disabled={isPending}>Cancel</Button>
      <Button variant='secondary' onClick={onSave} isLoading={isPending}>
        {isPending ? 'Saving...' : 'Save Changes'}
      </Button>
    </div>
  </div>
);