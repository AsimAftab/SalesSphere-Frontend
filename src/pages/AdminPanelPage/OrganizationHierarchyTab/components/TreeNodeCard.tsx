import React from 'react';
import { Crown, ArrowUpRight, Briefcase, Users } from 'lucide-react';
import type { OrgHierarchyNode } from '@/api/employeeService';
import { getAvatarUrl } from '@/utils/userUtils';

interface TreeNodeCardProps {
    node: OrgHierarchyNode;
    isRoot?: boolean;
    level?: number;
    allSupervisors?: { _id: string; name: string; role: string }[];
}

const TreeNodeCard: React.FC<TreeNodeCardProps> = ({ node, isRoot, level = 0, allSupervisors }) => {
    const adminRoles = ['admin', 'superadmin', 'developer'];
    const isAdmin = adminRoles.includes(node.role) &&
        (!node.customRole || adminRoles.includes(node.customRole.toLowerCase()));
    const hasSupervisors = allSupervisors && allSupervisors.length > 0;
    const supervisorNames = allSupervisors?.map(s => s.name).join(', ') || '';
    const roleName = node.customRole || (node.role.charAt(0).toUpperCase() + node.role.slice(1));
    const directReports = node.subordinates?.length || 0;

    const getCardStyle = () => {
        if (isRoot && isAdmin)
            return 'bg-white border-secondary/40 shadow-lg shadow-secondary/10 ring-1 ring-secondary/10';
        if (level === 1)
            return 'bg-white border-secondary/25 shadow-md shadow-gray-100';
        return 'bg-white border-gray-200/80 shadow-md shadow-gray-100/80';
    };

    const getAvatarStyle = () => {
        if (isRoot && isAdmin) return 'ring-[3px] ring-secondary/25 shadow-md';
        if (isAdmin) return 'ring-2 ring-secondary/20 shadow-sm';
        if (level === 1) return 'ring-2 ring-blue-100 shadow-sm';
        return 'ring-2 ring-gray-100 shadow-sm';
    };

    return (
        <div
            className={`
                relative flex items-center gap-4 px-5 py-5 rounded-2xl border w-[320px]
                transition-all duration-300 ease-out cursor-default
                hover:shadow-xl hover:-translate-y-0.5 hover:border-secondary/30
                ${getCardStyle()}
            `}
        >
            {/* Avatar */}
            <div className="relative flex-shrink-0">
                <img
                    src={getAvatarUrl(node.avatarUrl, node.name, 'sm')}
                    alt={node.name}
                    className={`w-14 h-14 rounded-full object-cover ${getAvatarStyle()}`}
                />
                {isAdmin && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center shadow-sm ring-2 ring-white">
                        <Crown className="w-2.5 h-2.5 text-white" />
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="flex flex-col min-w-0 flex-1 gap-1.5">
                {/* Name */}
                <span className="font-bold text-sm text-gray-900 truncate leading-tight" title={node.name}>
                    {node.name}
                </span>

                {/* Role Badge + Direct Reports */}
                <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-secondary/10 text-secondary">
                        <Briefcase className="w-3 h-3" />
                        {roleName}
                    </span>
                    {directReports > 0 && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-secondary bg-secondary/10 px-2.5 py-1 rounded-full">
                            <Users className="w-3 h-3" />
                            {directReports}
                        </span>
                    )}
                </div>

                {/* Supervisor reference */}
                {hasSupervisors && (
                    <div className="flex items-center gap-1">
                        <ArrowUpRight className="w-3 h-3 text-secondary/50 flex-shrink-0" />
                        <span className="text-xs text-gray-400 truncate" title={supervisorNames}>
                            {supervisorNames}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TreeNodeCard;
