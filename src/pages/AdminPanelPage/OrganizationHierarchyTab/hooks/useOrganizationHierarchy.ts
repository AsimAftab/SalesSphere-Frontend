import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getOrgHierarchy, type OrgHierarchyNode, type OrgHierarchyResponse } from '@/api/employeeService';

/**
 * Builds a hierarchy tree from the flat employees list when the backend
 * returns an empty hierarchy array.
 */
const buildHierarchyFromEmployees = (data: OrgHierarchyResponse): OrgHierarchyNode[] => {
    const employees = data.employees;
    if (!employees || employees.length === 0) return [];

    // Create a map of employee id -> employee node
    const nodeMap = new Map<string, OrgHierarchyNode>();
    employees.forEach((emp) => {
        nodeMap.set(emp._id, {
            _id: emp._id,
            name: emp.name,
            email: emp.email,
            role: emp.role,
            customRole: null,
            avatarUrl: null,
            subordinates: [],
        });
    });

    // Build a set of all employee ids that have at least one supervisor
    const hasParent = new Set<string>();

    employees.forEach((emp) => {
        if (emp.supervisors && emp.supervisors.length > 0) {
            hasParent.add(emp._id);
            emp.supervisors.forEach((sup) => {
                const parentNode = nodeMap.get(sup._id);
                const childNode = nodeMap.get(emp._id);
                if (parentNode && childNode) {
                    // Avoid duplicate subordinates
                    if (!parentNode.subordinates.some((s) => s._id === childNode._id)) {
                        parentNode.subordinates.push(childNode);
                    }
                }
            });
        }
    });

    // Root nodes are employees with no supervisors
    const roots: OrgHierarchyNode[] = [];
    employees.forEach((emp) => {
        if (!hasParent.has(emp._id)) {
            const node = nodeMap.get(emp._id);
            if (node) roots.push(node);
        }
    });

    return roots;
};

export const useOrganizationHierarchy = () => {
    const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

    const { data, isLoading, error } = useQuery({
        queryKey: ['org-hierarchy'],
        queryFn: getOrgHierarchy,
        staleTime: 0,
        refetchOnMount: 'always',
    });

    // Use backend hierarchy if available, otherwise build from flat employees list
    const hierarchy = useMemo(() => {
        if (!data) return [];
        if (data.hierarchy && data.hierarchy.length > 0) return data.hierarchy;
        return buildHierarchyFromEmployees(data);
    }, [data]);

    // Create a lookup for employees to get their FULL supervisor list
    const supervisorLookup = useMemo(() => {
        if (!data?.employees) return {};
        return data.employees.reduce((acc, emp) => {
            acc[emp._id] = emp.supervisors || [];
            return acc;
        }, {} as Record<string, { _id: string; name: string; role: string }[]>);
    }, [data?.employees]);

    // Auto-expand first two levels on load
    useEffect(() => {
        if (hierarchy.length > 0) {
            const idsToExpand = new Set<string>();
            hierarchy.forEach((root) => {
                idsToExpand.add(root._id);
                root.subordinates?.forEach((child) => idsToExpand.add(child._id));
            });
            setExpandedNodes(idsToExpand);
        }
    }, [hierarchy]);

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
        const allIds = new Set<string>();
        const collectIds = (nodes: OrgHierarchyNode[]) => {
            nodes.forEach((node) => {
                allIds.add(node._id);
                if (node.subordinates) collectIds(node.subordinates);
            });
        };
        collectIds(hierarchy);
        setExpandedNodes(allIds);
    };

    const collapseAll = () => {
        setExpandedNodes(new Set());
    };

    return {
        data,
        hierarchy,
        isLoading,
        error,
        expandedNodes,
        supervisorLookup,
        toggleNode,
        expandAll,
        collapseAll
    };
};
