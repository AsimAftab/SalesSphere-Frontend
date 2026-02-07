import React from 'react';
import { User, Users, Building2 } from 'lucide-react';
import TreeBranch from './TreeBranch';
import { useOrganizationHierarchy } from './useOrganizationHierarchy';
import HierarchySkeleton from './HierarchySkeleton';
import { Button, EmptyState } from '@/components/ui';

const OrganizationHierarchyTab: React.FC = () => {
    const {
        data,
        hierarchy,
        isLoading,
        error,
        expandedNodes,
        supervisorLookup,
        toggleNode,
        expandAll,
        collapseAll
    } = useOrganizationHierarchy();

    if (isLoading) {
        return <HierarchySkeleton />;
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
        <>
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-6 pt-4 sm:pt-6">
                <div>
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#202224]">Organization Hierarchy</h1>
                    <p className="text-xs sm:text-sm text-gray-500">View the complete organization structure and reporting chain</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="secondary" onClick={expandAll}>
                        Expand All
                    </Button>
                    <Button variant="outline" onClick={collapseAll}>
                        Collapse All
                    </Button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden px-4 sm:px-6 py-4 sm:py-6 gap-4">
                {/* Info Bar */}
                <div className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 px-5 py-3.5 shadow-sm">
                    <div className="p-2.5 bg-secondary/10 rounded-lg">
                        <Building2 className="w-5 h-5 text-secondary" />
                    </div>
                    <div className="flex-1">
                        <span className="text-sm font-bold text-gray-900">{data?.organization || 'Organization'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-secondary/10 px-3 py-1.5 rounded-full">
                        <Users className="w-3.5 h-3.5 text-secondary" />
                        <span className="text-xs font-semibold text-secondary">{data?.totalEmployees || 0} Employees</span>
                    </div>
                </div>

                {/* Tree Container */}
                <div className="flex-1 bg-gradient-to-b from-gray-50/50 to-white rounded-xl shadow-sm border border-gray-200 overflow-auto">
                    {/* Subtle dot pattern background */}
                    <div
                        className="min-w-max p-10"
                        style={{
                            backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
                            backgroundSize: '24px 24px'
                        }}
                    >
                        {hierarchy.length > 0 ? (
                            <div className="flex flex-col gap-6">
                                {hierarchy.map((rootNode) => (
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
                            <div className="flex items-center justify-center py-16">
                                <EmptyState
                                    title="No hierarchy data available"
                                    description="Add employees and assign supervisors to see the organization structure."
                                    icon={<User className="w-10 h-10 text-gray-400" />}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default OrganizationHierarchyTab;
