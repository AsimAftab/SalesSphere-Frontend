import React from 'react';
import { Crown, Info } from 'lucide-react';
import type { OrgHierarchyNode } from '../../../api/employeeService';

interface TreeNodeCardProps {
    node: OrgHierarchyNode;
    isRoot?: boolean;
    allSupervisors?: { _id: string; name: string; role: string }[];
}

const TreeNodeCard: React.FC<TreeNodeCardProps> = ({ node, isRoot, allSupervisors }) => {
    const isAdmin = node.role === 'admin';
    const hasMultipleSupervisors = allSupervisors && allSupervisors.length > 1;
    //const hasSupervisors = allSupervisors && allSupervisors.length > 0;

    // Build supervisor names for display
    const supervisorNames = allSupervisors?.map(s => s.name).join(', ') || '';

    return (
        <div
            className={`
        relative flex items-center gap-3 px-5 py-3 rounded-lg border-2 min-w-[220px] max-w-[280px] shadow-sm group
        ${isRoot
                    ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-300'
                    : 'bg-white border-gray-200'
                }
      `}
        >
            {/* Multiple Supervisor Indicator */}
            {hasMultipleSupervisors && (
                <div
                    className="absolute -top-2 -right-2 bg-blue-100 text-blue-700 p-1 rounded-full shadow-sm cursor-help z-20 border border-blue-200"
                    title={`Reports to: ${supervisorNames}`}
                >
                    <Info className="w-3 h-3" />
                </div>
            )}

            {/* Avatar */}
            <div className={`
        w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0
        ${isAdmin ? 'bg-gradient-to-br from-amber-500 to-orange-600' : 'bg-gradient-to-br from-blue-500 to-indigo-600'}
      `}>
                {node.avatarUrl ? (
                    <img src={node.avatarUrl} alt={node.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                    node.name.charAt(0).toUpperCase()
                )}
            </div>

            {/* Info */}
            <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-gray-900 truncate">{node.name}</span>
                    {isAdmin && <Crown className="w-4 h-4 text-amber-500 flex-shrink-0" />}
                </div>
                <span className="text-xs text-gray-500 truncate">
                    {node.customRole || (node.role.charAt(0).toUpperCase() + node.role.slice(1))}
                </span>

                {/* Reports To Line - Professional Display
                {hasSupervisors && (
                    <div className="mt-1 flex items-start gap-1">
                        <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mt-0.5 flex-shrink-0">
                            Reports to:
                        </span>
                        <span className="text-xs text-gray-700 font-medium leading-tight line-clamp-2" title={supervisorNames}>
                            {supervisorNames}
                        </span>
                    </div>
                )} */}
            </div>
        </div>
    );
};

export default TreeNodeCard;
