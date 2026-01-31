import React from 'react';
import { User } from 'lucide-react';

export interface HierarchyNode {
    _id: string;
    name: string;
    role: string;
    customRoleId?: { name: string } | null;
    reportsTo?: HierarchyNode[];
}

// eslint-disable-next-line react-refresh/only-export-components
export const getRoleName = (emp: HierarchyNode): string => {
    if (emp.customRoleId && typeof emp.customRoleId === 'object' && emp.customRoleId.name) {
        return emp.customRoleId.name;
    }
    const role = emp.role;
    if (!role) return 'N/A';
    if (typeof role === 'string') return role.charAt(0).toUpperCase() + role.slice(1);
    return 'N/A';
};

export const TreeNode: React.FC<{ node: HierarchyNode; isCurrentSelection: boolean }> = ({
    node,
    isCurrentSelection
}) => (
    <div
        className={`
            flex items-center gap-3 px-5 py-3 rounded-lg border-2 min-w-[180px] max-w-[220px]
            ${isCurrentSelection
                ? 'bg-blue-500 border-blue-600 text-white'
                : 'bg-white border-gray-200 text-gray-900'
            }
        `}
    >
        <User className={`w-5 h-5 flex-shrink-0 ${isCurrentSelection ? 'text-white' : 'text-blue-500'}`} />
        <div className="flex flex-col min-w-0">
            <span className="font-semibold text-sm truncate">{node.name}</span>
            <span className={`text-xs ${isCurrentSelection ? 'text-blue-100' : 'text-gray-500'}`}>
                {getRoleName(node)}
            </span>
            {isCurrentSelection && (
                <span className="text-xs text-blue-200 mt-1">Current Selection</span>
            )}
        </div>
    </div>
);

export const SupervisorBranch: React.FC<{ supervisor: HierarchyNode }> = ({ supervisor }) => {
    const parentSupervisors = supervisor.reportsTo || [];

    return (
        <div className="flex flex-col items-center">
            {/* Parent supervisors of this supervisor */}
            {parentSupervisors.length > 0 && (
                <>
                    <div className="flex gap-4 justify-center flex-wrap">
                        {parentSupervisors.map((parent: HierarchyNode) => (
                            <SupervisorBranch key={parent._id} supervisor={parent} />
                        ))}
                    </div>
                    {/* Connector from parents to this supervisor */}
                    <div className="flex flex-col items-center py-1">
                        <div className="w-0.5 h-4 bg-gray-300"></div>
                        <div className="text-gray-400 text-sm">↑</div>
                        <div className="w-0.5 h-4 bg-gray-300"></div>
                    </div>
                </>
            )}
            {/* This supervisor node */}
            <TreeNode node={supervisor} isCurrentSelection={false} />
        </div>
    );
};
