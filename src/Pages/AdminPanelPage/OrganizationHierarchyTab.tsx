import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getOrgHierarchy, type OrgHierarchyNode } from '../../api/employeeService';
import { ChevronDown, ChevronRight, User, Crown, Building2, Users } from 'lucide-react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// --- Tree Node Card Component ---
interface TreeNodeCardProps {
    node: OrgHierarchyNode;
    isRoot?: boolean;
}

const TreeNodeCard: React.FC<TreeNodeCardProps> = ({ node, isRoot }) => {
    const isAdmin = node.role === 'admin';

    return (
        <div
            className={`
        flex items-center gap-3 px-5 py-3 rounded-lg border-2 min-w-[200px] max-w-[260px] shadow-sm
        ${isRoot
                    ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-300'
                    : 'bg-white border-gray-200'
                }
      `}
        >
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
            </div>
        </div>
    );
};

// --- Recursive Tree Branch Component ---
interface TreeBranchProps {
    node: OrgHierarchyNode;
    level: number;
    isExpanded: boolean;
    onToggle: (id: string) => void;
    expandedNodes: Set<string>;
}

const TreeBranch: React.FC<TreeBranchProps> = ({ node, level, isExpanded, onToggle, expandedNodes }) => {
    const hasChildren = node.subordinates && node.subordinates.length > 0;
    const isRoot = level === 0;

    return (
        <div className="flex flex-col items-center">
            {/* Node Card with Toggle */}
            <div className="relative">
                <TreeNodeCard node={node} isRoot={isRoot} />

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
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Loading Skeleton ---
const HierarchySkeleton: React.FC = () => (
    <div className="flex flex-col items-center space-y-6 p-10">
        <div className="flex flex-col items-center">
            <Skeleton width={240} height={60} borderRadius={8} />
            <div className="w-0.5 h-8 bg-gray-200 mt-2"></div>
            <div className="flex gap-8 mt-2">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex flex-col items-center">
                        <div className="w-0.5 h-4 bg-gray-200"></div>
                        <Skeleton width={200} height={56} borderRadius={8} />
                    </div>
                ))}
            </div>
        </div>
    </div>
);

// --- Main Tab Component ---
const OrganizationHierarchyTab: React.FC = () => {
    const [expandedNodes, setExpandedNodes] = React.useState<Set<string>>(new Set());

    const { data, isLoading, error } = useQuery({
        queryKey: ['org-hierarchy'],
        queryFn: getOrgHierarchy,
    });

    // Auto-expand first two levels on load
    React.useEffect(() => {
        if (data?.hierarchy) {
            const idsToExpand = new Set<string>();
            data.hierarchy.forEach((root) => {
                idsToExpand.add(root._id);
                root.subordinates?.forEach((child) => idsToExpand.add(child._id));
            });
            setExpandedNodes(idsToExpand);
        }
    }, [data]);

    const toggleNode = (id: string) => {
        setExpandedNodes((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const expandAll = () => {
        if (!data?.hierarchy) return;
        const allIds = new Set<string>();
        const collectIds = (nodes: OrgHierarchyNode[]) => {
            nodes.forEach((node) => {
                allIds.add(node._id);
                if (node.subordinates) collectIds(node.subordinates);
            });
        };
        collectIds(data.hierarchy);
        setExpandedNodes(allIds);
    };

    const collapseAll = () => {
        setExpandedNodes(new Set());
    };

    if (isLoading) {
        return (
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-gray-100 p-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex-1">
                    <HierarchySkeleton />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center text-red-600">
                    <p>Failed to load organization hierarchy.</p>
                    <p className="text-sm text-gray-500 mt-1">{(error as Error).message}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-gray-100 p-6 gap-6">
            {/* Header Card */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-sm">
                        <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">{data?.organization || 'Organization'}</h2>
                        <p className="text-sm text-gray-500">{data?.totalEmployees || 0} total employees</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={expandAll}
                        className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
                    >
                        Expand All
                    </button>
                    <button
                        onClick={collapseAll}
                        className="px-4 py-2 text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
                    >
                        Collapse All
                    </button>
                </div>
            </div>

            {/* Tree Container */}
            <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-auto">
                <div className="min-w-max p-10">
                    {data?.hierarchy && data.hierarchy.length > 0 ? (
                        <div className="border-2 border-dashed border-blue-200 rounded-xl p-8 bg-gradient-to-b from-blue-50/30 to-transparent">
                            <div className="flex gap-12 justify-center flex-wrap">
                                {data.hierarchy.map((rootNode) => (
                                    <TreeBranch
                                        key={rootNode._id}
                                        node={rootNode}
                                        level={0}
                                        isExpanded={expandedNodes.has(rootNode._id)}
                                        onToggle={toggleNode}
                                        expandedNodes={expandedNodes}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                            <User className="w-16 h-16 mb-4 text-gray-300" />
                            <p className="font-semibold text-lg">No hierarchy data available</p>
                            <p className="text-sm mt-1">Add employees and assign supervisors to see the organization structure.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrganizationHierarchyTab;
