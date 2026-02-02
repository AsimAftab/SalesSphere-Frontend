import React from 'react';
import { X } from 'lucide-react';
import type { HierarchyNode } from './HierarchyTreeComponents';
import { TreeNode, SupervisorBranch } from './HierarchyTreeComponents';
import { Button } from '@/components/ui';
import type { Employee } from '@/api/employeeService';

interface HierarchyTreeModalProps {
    isOpen: boolean;
    onClose: () => void;
    employee: Employee | null;
}

const HierarchyTreeModal: React.FC<HierarchyTreeModalProps> = ({
    isOpen,
    onClose,
    employee,
}) => {
    if (!isOpen || !employee) return null;

    // Get direct supervisors of the selected employee
    const directSupervisors = (employee.reportsTo || []) as HierarchyNode[];

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
                            <TreeNode node={employee as unknown as HierarchyNode} isCurrentSelection={true} />
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
