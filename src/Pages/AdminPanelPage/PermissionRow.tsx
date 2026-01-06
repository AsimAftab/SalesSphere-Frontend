import React, { memo } from 'react';
import type { ModulePermissions, PermissionAction } from './admin.types';

interface PermissionRowProps {
  moduleName: string; 
  permissions: ModulePermissions; 
  onToggle: (type: PermissionAction) => void; 
}

const PermissionRow: React.FC<PermissionRowProps> = ({ 
  moduleName, 
  permissions, 
  onToggle 
}) => {
  const toggleBase = "relative inline-flex items-center cursor-pointer";
  const toggleInput = "sr-only peer";
  const toggleSlider = `
    w-11 h-6 bg-gray-400 rounded-full peer 
    peer-focus:ring-2 peer-focus:ring-blue-300 
    peer-checked:after:translate-x-full peer-checked:after:border-white 
    after:content-[''] after:absolute after:top-0.5 after:left-[2px] 
    after:bg-white after:border-gray-300 after:border after:rounded-full 
    after:h-5 after:w-5 after:transition-all 
    peer-checked:bg-[#2563EB]
  `;

  const permissionKeys: PermissionAction[] = ['all', 'add', 'update', 'view', 'delete'];

  return (
    <tr className="hover:bg-blue-50/50 transition-colors group">
      {/* Borders removed: divide-y on tbody now handles the alignment */}
      <td className="py-4 px-8 flex items-center gap-3">
        <div className="w-3 h-3 border-2 border-gray-300 rounded-sm rotate-45 group-hover:border-blue-400 transition-colors" />
        <span className="text-sm font-semibold text-gray-700">{moduleName}</span>
      </td>
      
      {permissionKeys.map((key) => (
        <td key={key} className="py-4 px-4 text-center">
          <label className={toggleBase} aria-label={`Toggle ${key} permission for ${moduleName}`}>
            <input
              type="checkbox"
              className={toggleInput}
              checked={permissions[key]}
              onChange={() => onToggle(key)}
            />
            <div className={toggleSlider}></div>
          </label>
        </td>
      ))}
    </tr>
  );
};

export default memo(PermissionRow);