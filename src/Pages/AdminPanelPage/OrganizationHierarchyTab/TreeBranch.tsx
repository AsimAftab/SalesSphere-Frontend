import React from 'react';
import { ChevronDown, ChevronRight, Users } from 'lucide-react';
import type { OrgHierarchyNode } from '../../../api/employeeService';
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

    return (
        <div className="flex flex-col items-center">
            {/* Node Card with Toggle */}
            <div className="relative">
                <TreeNodeCard
                    node={node}
                    isRoot={isRoot}
                    allSupervisors={supervisorLookup[node._id]}
                />

                {/* Toggle Button */}
                {hasChildren && (
                    <button
                        onClick={() => onToggle(node._id)}
                        className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center hover:border-blue-400 hover:bg-blue-50 transition-colors z-10"
                    >
                        {isExpanded ? (
                            <ChevronDown className="w-3 h-3 text-gray-600" />
                        ) : (
                            <ChevronRight className="w-3 h-3 text-gray-600" />
                        )}
                    </button>
                )}

                {/* Subordinates Count Badge */}
                {hasChildren && !isExpanded && (
                    <div className="absolute -bottom-3 right-2 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {node.subordinates.length}
                    </div>
                )}
            </div>

            {/* Connector Line and Children */}
            {hasChildren && isExpanded && (
                <div className="flex flex-col items-center">
                    {/* Vertical Connector */}
                    <div className="w-0.5 h-8 bg-gray-300"></div>

                    {/* Horizontal Connector */}
                    {node.subordinates.length > 1 && (
                        <div
                            className="h-0.5 bg-gray-300"
                            style={{ width: `${Math.min(node.subordinates.length - 1, 4) * 280}px` }}
                        ></div>
                    )}

                    {/* Children */}
                    <div className="flex gap-8 flex-wrap justify-center pt-2">
                        {node.subordinates.map((child) => (
                            <div key={child._id} className="flex flex-col items-center">
                                {/* Vertical Connector from horizontal line to child */}
                                <div className="w-0.5 h-4 bg-gray-300"></div>
                                <TreeBranch
                                    node={child}
                                    level={level + 1}
                                    isExpanded={expandedNodes.has(child._id)}
                                    onToggle={onToggle}
                                    expandedNodes={expandedNodes}
                                    supervisorLookup={supervisorLookup}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TreeBranch;
