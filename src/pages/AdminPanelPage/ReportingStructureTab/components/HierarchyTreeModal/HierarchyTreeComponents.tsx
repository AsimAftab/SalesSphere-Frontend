import React from 'react';
import { User, Crown, ChevronDown } from 'lucide-react';

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
            flex items-center gap-3 px-4 py-3 rounded-xl border-2 shadow-sm w-[220px]
            ${isCurrentSelection
                ? 'bg-secondary border-secondary text-white shadow-secondary/25 shadow-md'
                : 'bg-white border-gray-200 text-gray-900'
            }
        `}
    >
        <div className={`flex-shrink-0 p-2 rounded-lg ${isCurrentSelection ? 'bg-white/20' : 'bg-secondary/10'}`}>
            {isCurrentSelection
                ? <User className="w-4 h-4 text-white" />
                : <Crown className="w-4 h-4 text-secondary" />
            }
        </div>
        <div className="flex flex-col min-w-0 flex-1">
            <span className="font-semibold text-sm truncate" title={node.name}>{node.name}</span>
            <span className={`text-xs font-medium ${isCurrentSelection ? 'text-white/80' : 'text-gray-500'}`}>
                {getRoleName(node)}
            </span>
        </div>
    </div>
);

const Connector: React.FC = () => (
    <div className="flex flex-col items-center py-1">
        <div className="w-0.5 h-5 bg-secondary/30"></div>
        <ChevronDown className="w-3.5 h-3.5 text-secondary/40 -my-1" />
        <div className="w-0.5 h-5 bg-secondary/30"></div>
    </div>
);

export const SupervisorBranch: React.FC<{ supervisor: HierarchyNode }> = ({ supervisor }) => {
    const parentSupervisors = supervisor.reportsTo || [];

    return (
        <div className="flex flex-col items-center">
            {/* Parent supervisors of this supervisor */}
            {parentSupervisors.length > 0 && (
                <>
                    <div className="flex gap-6 justify-center flex-wrap">
                        {parentSupervisors.map((parent: HierarchyNode) => (
                            <SupervisorBranch key={parent._id} supervisor={parent} />
                        ))}
                    </div>
                    <Connector />
                </>
            )}
            {/* This supervisor node */}
            <TreeNode node={supervisor} isCurrentSelection={false} />
        </div>
    );
};

export { Connector };
