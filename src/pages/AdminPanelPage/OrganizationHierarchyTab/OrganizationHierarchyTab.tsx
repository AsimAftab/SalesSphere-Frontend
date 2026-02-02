import React from 'react';
import { Building2, User } from 'lucide-react';
import TreeBranch from './TreeBranch';
import { useOrganizationHierarchy } from './useOrganizationHierarchy';
import HierarchySkeleton from './HierarchySkeleton';
import { Button } from '@/components/ui';

// --- Main Tab Component ---
const OrganizationHierarchyTab: React.FC = () => {
    const {
        data,
        isLoading,
        error,
        expandedNodes,
        supervisorLookup,
        toggleNode,
        expandAll,
        collapseAll
    } = useOrganizationHierarchy();

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
                        <p className="text-md text-gray-500">Total Employees: {data?.totalEmployees || 0}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="secondary"
                        onClick={expandAll}
                    >
                        Expand All
                    </Button>
                    <Button
                        variant="outline"
                        onClick={collapseAll}
                    >
                        Collapse All
                    </Button>
                </div>
            </div>
            {/* Tree Container */}
            <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-auto">
                <div className="min-w-max p-10">
                    {data?.hierarchy && data.hierarchy.length > 0 ? (
                        <div className="flex gap-12 justify-center flex-wrap">
                            {data.hierarchy.map((rootNode) => (
                                <TreeBranch
                                    key={rootNode._id}
                                    node={rootNode}
                                    level={0}
                                    isExpanded={expandedNodes.has(rootNode._id)}
                                    onToggle={toggleNode}
                                    expandedNodes={expandedNodes}
                                    supervisorLookup={supervisorLookup}
                                />
                            ))}
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
