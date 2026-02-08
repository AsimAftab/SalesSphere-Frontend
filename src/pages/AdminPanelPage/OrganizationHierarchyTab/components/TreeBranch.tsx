import React from 'react';
import {
    ChevronDown,
    ChevronRight,
    Users,
} from 'lucide-react';
import type { OrgHierarchyNode } from '@/api/employeeService';
import TreeNodeCard from './TreeNodeCard';

interface TreeBranchProps {
    node: OrgHierarchyNode;
    level: number;
    isExpanded: boolean;
    onToggle: (id: string) => void;
    expandedNodes: Set<string>;
    supervisorLookup: Record<string, { _id: string; name: string; role: string }[]>;
}

const TreeBranch: React.FC<TreeBranchProps> = ({ node, level, isExpanded, onToggle, expandedNodes, supervisorLookup }) => {
    const hasChildren = node.subordinates && node.subordinates.length > 0;
    const isRoot = level === 0;
    const childCount = node.subordinates?.length || 0;

    const lineColor = isRoot ? 'bg-secondary/25' : 'bg-gray-200';

    return (
        <div className="flex flex-col">
            {/* Node Card with Toggle */}
            <div className="relative flex items-center gap-3">
                <TreeNodeCard
                    node={node}
                    isRoot={isRoot}
                    level={level}
                    allSupervisors={supervisorLookup[node._id]}
                />

                {/* Toggle Button */}
                {hasChildren && (
                    <button
                        onClick={() => onToggle(node._id)}
                        className={`
                            flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                            border-2 transition-all duration-200 cursor-pointer
                            ${isExpanded
                                ? 'bg-secondary text-white border-secondary shadow-md shadow-secondary/20'
                                : 'bg-white text-secondary border-secondary/30 hover:border-secondary hover:bg-secondary/5 shadow-sm'
                            }
                        `}
                    >
                        {isExpanded ? (
                            <ChevronDown className="w-4 h-4" />
                        ) : (
                            <ChevronRight className="w-4 h-4" />
                        )}
                    </button>
                )}

                {/* Subordinates Count Badge (when collapsed) */}
                {hasChildren && !isExpanded && (
                    <div className="px-2.5 py-1 bg-secondary/10 text-secondary rounded-full text-xs font-semibold flex items-center gap-1 whitespace-nowrap border border-secondary/15">
                        <Users className="w-3 h-3" />
                        {childCount} {childCount === 1 ? 'report' : 'reports'}
                    </div>
                )}
            </div>

            {/* Vertical children list */}
            {hasChildren && isExpanded && (
                <div className="ml-10 mt-1">
                    {node.subordinates.map((child, index) => {
                        const isLast = index === childCount - 1;

                        return (
                            <div key={child._id} className="relative flex">
                                {/* Connector lines */}
                                <div className="relative flex-shrink-0 w-7">
                                    {/* Vertical trunk line */}
                                    <div
                                        className={`absolute left-0 top-0 w-[2px] rounded-full ${lineColor}`}
                                        style={{ height: isLast ? '32px' : '100%' }}
                                    />
                                    {/* Horizontal branch to card */}
                                    <div className={`absolute left-0 top-8 h-[2px] w-full rounded-full ${lineColor}`} />
                                </div>

                                {/* Child branch */}
                                <div className="pt-3 pb-3 flex-1">
                                    <TreeBranch
                                        node={child}
                                        level={level + 1}
                                        isExpanded={expandedNodes.has(child._id)}
                                        onToggle={onToggle}
                                        expandedNodes={expandedNodes}
                                        supervisorLookup={supervisorLookup}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default TreeBranch;
