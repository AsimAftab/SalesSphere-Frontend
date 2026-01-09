import React from 'react';
import { X, User } from 'lucide-react';
import Button from '../../components/UI/Button/Button';

interface HierarchyNode {
    _id: string;
    name: string;
    role: string;
    customRoleId?: { name: string } | null;
    reportsTo?: HierarchyNode[];
}

interface HierarchyTreeModalProps {
    isOpen: boolean;
    onClose: () => void;
    employee: any;
}

const HierarchyTreeModal: React.FC<HierarchyTreeModalProps> = ({
    isOpen,
    onClose,
    employee,
}) => {
    if (!isOpen || !employee) return null;

    // Helper to get role name
    const getRoleName = (emp: HierarchyNode): string => {
        if (emp.customRoleId && typeof emp.customRoleId === 'object' && emp.customRoleId.name) {
            return emp.customRoleId.name;
        }
        const role = emp.role;
        if (!role) return 'N/A';
        if (typeof role === 'string') return role.charAt(0).toUpperCase() + role.slice(1);
        return 'N/A';
    };

    // Tree Node Card Component
    const TreeNode: React.FC<{ node: HierarchyNode; isCurrentSelection: boolean }> = ({
        node,
        isCurrentSelection
    }) => (
        <div
            className={`
                flex items-center gap-3 px-5 py-3 rounded-lg border-2 min-w-[180px] max-w-[220px]
                ${isCurrentSelection
                    ? 'bg-blue-500 border-blue-600 text-white'
                    : 'bg-white border-gray-200 text-gray-900'
                }
            `}
        >
            <User className={`w-5 h-5 flex-shrink-0 ${isCurrentSelection ? 'text-white' : 'text-blue-500'}`} />
            <div className="flex flex-col min-w-0">
                <span className="font-semibold text-sm truncate">{node.name}</span>
                <span className={`text-xs ${isCurrentSelection ? 'text-blue-100' : 'text-gray-500'}`}>
                    {getRoleName(node)}
                </span>
                {isCurrentSelection && (
                    <span className="text-xs text-blue-200 mt-1">Current Selection</span>
                )}
            </div>
        </div>
    );

    // Get direct supervisors of the selected employee
    const directSupervisors: HierarchyNode[] = employee.reportsTo || [];

    // Recursive component to render a supervisor and their supervisors
    const SupervisorBranch: React.FC<{ supervisor: HierarchyNode }> = ({ supervisor }) => {
        const parentSupervisors = supervisor.reportsTo || [];

        return (
            <div className="flex flex-col items-center">
                {/* Parent supervisors of this supervisor */}
                {parentSupervisors.length > 0 && (
                    <>
                        <div className="flex gap-4 justify-center flex-wrap">
                            {parentSupervisors.map((parent: HierarchyNode) => (
                                <SupervisorBranch key={parent._id} supervisor={parent} />
                            ))}
                        </div>
                        {/* Connector from parents to this supervisor */}
                        <div className="flex flex-col items-center py-1">
                            <div className="w-0.5 h-4 bg-gray-300"></div>
                            <div className="text-gray-400 text-sm">↑</div>
                            <div className="w-0.5 h-4 bg-gray-300"></div>
                        </div>
                    </>
                )}
                {/* This supervisor node */}
                <TreeNode node={supervisor} isCurrentSelection={false} />
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl mx-4 max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-start p-6 pb-4 border-b border-gray-100">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Supervisor Hierarchy Tree</h3>
                        <p className="text-sm text-gray-500 mt-1">
                            Complete reporting structure for {employee.name}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Tree Content */}
                <div className="flex-1 overflow-auto p-6">
                    <div className="border-2 border-dashed border-blue-200 rounded-lg p-6 bg-blue-50/30 min-h-[200px]">
                        <div className="flex flex-col items-center">
                            {directSupervisors.length === 0 ? (
                                <p className="text-gray-500 italic">No supervisors assigned.</p>
                            ) : (
                                <>
                                    {/* All supervisors displayed horizontally */}
                                    <div className="flex gap-6 justify-center flex-wrap">
                                        {directSupervisors.map((supervisor: HierarchyNode) => (
                                            <SupervisorBranch key={supervisor._id} supervisor={supervisor} />
                                        ))}
                                    </div>

                                    {/* Connector lines merging to employee */}
                                    <div className="flex flex-col items-center py-2">
                                        {directSupervisors.length > 1 && (
                                            <div className="flex items-center">
                                                <div className="h-0.5 bg-gray-300" style={{ width: `${(directSupervisors.length - 1) * 100}px` }}></div>
                                            </div>
                                        )}
                                        <div className="w-0.5 h-5 bg-gray-300"></div>
                                        <div className="text-gray-400 text-lg">↑</div>
                                        <div className="w-0.5 h-5 bg-gray-300"></div>
                                    </div>
                                </>
                            )}

                            {/* Current Employee (always shown at bottom) */}
                            <TreeNode node={employee} isCurrentSelection={true} />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 pt-4 border-t border-gray-100 flex justify-end">
                    <Button variant="primary" onClick={onClose}>
                        Close
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default HierarchyTreeModal;

