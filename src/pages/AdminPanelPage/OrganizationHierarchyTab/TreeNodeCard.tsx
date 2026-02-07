import React from 'react';
import { Crown, ArrowUpRight, Briefcase } from 'lucide-react';
import type { OrgHierarchyNode } from '@/api/employeeService';
import { getAvatarUrl } from '@/utils/userUtils';

interface TreeNodeCardProps {
    node: OrgHierarchyNode;
    isRoot?: boolean;
    level?: number;
    allSupervisors?: { _id: string; name: string; role: string }[];
}

const TreeNodeCard: React.FC<TreeNodeCardProps> = ({ node, isRoot, level = 0, allSupervisors }) => {
    const isAdmin = ['admin', 'superadmin', 'developer'].includes(node.role);
    const hasSupervisors = allSupervisors && allSupervisors.length > 0;
    const supervisorNames = allSupervisors?.map(s => s.name).join(', ') || '';
    const roleName = node.customRole || (node.role.charAt(0).toUpperCase() + node.role.slice(1));

    // Level-based styling
    const getCardStyle = () => {
        if (isRoot && isAdmin) return 'bg-gradient-to-br from-secondary/5 to-blue-50 border-secondary shadow-md shadow-secondary/10';
        if (level === 1) return 'bg-white border-secondary/40 shadow-sm';
        return 'bg-white border-gray-200 shadow-sm';
    };

    return (
        <div
            className={`
                relative flex items-center gap-3.5 px-4 py-3.5 rounded-xl border w-[270px] transition-all duration-200
                hover:shadow-lg hover:-translate-y-0.5
                ${getCardStyle()}
            `}
        >
            {/* Avatar */}
            <img
                src={getAvatarUrl(node.avatarUrl, node.name, 'sm')}
                alt={node.name}
                className={`
                    w-11 h-11 rounded-full object-cover flex-shrink-0
                    ${isAdmin ? 'ring-2 ring-secondary/20' : ''}
                `}
            />

            {/* Info */}
            <div className="flex flex-col min-w-0 flex-1 gap-0.5">
                <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-sm text-gray-900 truncate" title={node.name}>
                        {node.name}
                    </span>
                    {isAdmin && <Crown className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />}
                </div>

                {/* Role Badge */}
                <div className="flex items-center gap-1.5">
                    <span className={`
                        inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full
                        ${isAdmin
                            ? 'bg-secondary/10 text-secondary'
                            : level === 1
                                ? 'bg-blue-50 text-blue-600'
                                : 'bg-gray-100 text-gray-600'
                        }
                    `}>
                        <Briefcase className="w-2.5 h-2.5" />
                        {roleName}
                    </span>
                </div>

                {/* Supervisor reference */}
                {hasSupervisors && (
                    <div className="flex items-center gap-1 mt-0.5">
                        <ArrowUpRight className="w-3 h-3 text-secondary/70 flex-shrink-0" />
                        <span className="text-[11px] text-gray-500 truncate" title={supervisorNames}>
                            {supervisorNames}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TreeNodeCard;
