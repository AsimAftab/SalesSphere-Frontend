import React from 'react';
import { RotateCcw } from 'lucide-react';
import Button from '../../components/UI/Button/Button';

interface AdminPanelHeaderProps {
  onRevoke: () => void;
  isPending: boolean;
}

export const AdminPanelHeader: React.FC<AdminPanelHeaderProps> = ({ onRevoke, isPending }) => (
  <div className="flex justify-between items-center shrink-0">
    <div>
      <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Admin Panel</h1>
      <p className="text-sm text-gray-500">Manage role permissions and access control</p>
    </div>
    <div className="flex items-center gap-4">
      <Button 
        onClick={onRevoke} 
        variant='outline' 
        className="flex items-center gap-2 text-red-500 border-red-100 hover:bg-red-50" 
        disabled={isPending}
      >
        <RotateCcw size={14} /> Revoke All Access
      </Button>
      <Button disabled={isPending}>Add New Role</Button>
    </div>
  </div>
);