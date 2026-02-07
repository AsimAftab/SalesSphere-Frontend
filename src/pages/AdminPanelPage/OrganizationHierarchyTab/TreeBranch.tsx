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

    const lineColor = level === 0 ? 'bg-secondary/30' : 'bg-gray-300';

    return (
        <div className="flex flex-col">
            {/* Node Card with Toggle */}
            <div className="relative flex items-center">
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
                            ml-3 flex-shrink-0
                            w-7 h-7 rounded-full flex items-center justify-center
                            border-2 transition-all duration-200
                            ${isExpanded
                                ? 'bg-secondary text-white border-secondary shadow-sm shadow-secondary/20'
                                : 'bg-white text-secondary border-secondary/30 hover:border-secondary hover:bg-secondary/5'
                            }
                        `}
                    >
                        {isExpanded ? (
                            <ChevronDown className="w-3.5 h-3.5" />
                        ) : (
                            <ChevronRight className="w-3.5 h-3.5" />
                        )}
                    </button>
                )}

                {/* Subordinates Count Badge (when collapsed) */}
                {hasChildren && !isExpanded && (
                    <div className="ml-2 px-2 py-0.5 bg-secondary/10 text-secondary rounded-full text-[11px] font-semibold flex items-center gap-1 whitespace-nowrap border border-secondary/15">
                        <Users className="w-3 h-3" />
                        {childCount}
                    </div>
                )}
            </div>

            {/* Vertical children list */}
            {hasChildren && isExpanded && (
                <div className="ml-8 mt-2">
                    {node.subordinates.map((child, index) => {
                        const isLast = index === childCount - 1;

                        return (
                            <div key={child._id} className="relative flex">
                                {/* Vertical line (continuous for all except last) */}
                                <div className="relative flex-shrink-0 w-6">
                                    {/* Vertical trunk line */}
                                    <div
                                        className={`absolute left-0 top-0 w-0.5 ${lineColor}`}
                                        style={{ height: isLast ? '24px' : '100%' }}
                                    />
                                    {/* Horizontal branch to card */}
                                    <div className={`absolute left-0 top-6 h-0.5 w-full ${lineColor}`} />
                                </div>

                                {/* Child branch */}
                                <div className="pt-2 pb-2 flex-1">
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
