import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getOrgHierarchy, type OrgHierarchyNode } from '../../../api/employeeService';

export const useOrganizationHierarchy = () => {
    const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

    const { data, isLoading, error } = useQuery({
        queryKey: ['org-hierarchy'],
        queryFn: getOrgHierarchy,
    });

    // Create a lookup for employees to get their FULL supervisor list
    const supervisorLookup = useMemo(() => {
        if (!data?.employees) return {};
        return data.employees.reduce((acc, emp) => {
            acc[emp._id] = emp.supervisors; // Array of full supervisor objects
            return acc;
        }, {} as Record<string, any[]>);
    }, [data?.employees]);

    // Auto-expand first two levels on load
    useEffect(() => {
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

    return {
        data,
        isLoading,
        error,
        expandedNodes,
        supervisorLookup,
        toggleNode,
        expandAll,
        collapseAll
    };
};
