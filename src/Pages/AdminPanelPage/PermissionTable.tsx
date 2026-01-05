import React, { memo, useMemo } from 'react';
import PermissionRow from './PermissionRow';
import { 
  type PermissionTableProps, 
  type PermissionAction, 
  type ModulePermissions 
} from './admin.types';

const PermissionTable: React.FC<PermissionTableProps> = ({ 
  modules, 
  permissions, 
  onToggle,
  isEverythingSelected,
  onGrantAll
}) => {
  const columnConfigs = useMemo(() => [
    { key: 'add' as PermissionAction, label: 'Add' },
    { key: 'update' as PermissionAction, label: 'Update' },
    { key: 'view' as PermissionAction, label: 'View' },
    { key: 'delete' as PermissionAction, label: 'Delete' },
  ], []);

  const defaultPermissions: ModulePermissions = { 
    all: false, add: false, update: false, view: false, delete: false 
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-white rounded-2xl shadow-sm border border-gray-200">
      <div className="flex-1 overflow-auto custom-scrollbar">
        {/* border-collapse is essential for divide utilities to align perfectly */}
        <table className="w-full text-left border-collapse table-fixed">
          <thead className="sticky top-0 z-10 bg-secondary text-white text-xs uppercase">
            <tr className="border-b border-gray-700">
              <th className="py-4 px-8 font-bold w-[250px]">Modules</th>
              <th className="py-4 px-4">
                <div className="flex items-center justify-center gap-3">
                  <span className="whitespace-nowrap">All Access</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={isEverythingSelected}
                      onChange={onGrantAll}
                    />
                    <div className="w-8 h-4 bg-gray-400 rounded-full peer peer-checked:bg-white/30 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:after:translate-x-4"></div>
                  </label>
                </div>
              </th>
              {columnConfigs.map((col) => (
                <th key={col.key} className="py-4 px-4 text-center font-bold">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          {/* divide-y creates perfect dividers between rows without manual <td> borders */}
          <tbody className="divide-y divide-gray-700">
            {modules.map((moduleName: string) => (
              <PermissionRow
                key={moduleName}
                moduleName={moduleName}
                permissions={permissions[moduleName] || defaultPermissions}
                onToggle={(type: PermissionAction) => onToggle(moduleName, type)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default memo(PermissionTable);