import React from 'react';
import { Network, Users, UserCheck } from 'lucide-react';
import type { HierarchyNode } from './HierarchyTreeComponents';
import { TreeNode, SupervisorBranch, Connector } from './HierarchyTreeComponents';
import { Button, FormModal, EmptyState } from '@/components/ui';
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
    if (!employee) return null;

    // Get direct supervisors of the selected employee
    const directSupervisors = (employee.reportsTo || []) as HierarchyNode[];

    return (
        <FormModal
            isOpen={isOpen}
            onClose={onClose}
            title="Reporting Structure"
            description={`Complete reporting chain for ${employee.name}`}
            icon={<Network className="w-5 h-5 text-secondary" />}
            size="lg"
            footer={
                <div className="flex items-center justify-end">
                    <Button variant="outline" onClick={onClose}>
                        Close
                    </Button>
                </div>
            }
        >
            <div className="p-6">
                {directSupervisors.length === 0 ? (
                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-8">
                        <EmptyState
                            title="No Supervisors Assigned"
                            description="This employee does not have any supervisors configured yet."
                            icon={<Network className="w-8 h-8 text-gray-400" />}
                        />
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {/* Supervisors Section */}
                        <div className="rounded-xl border border-gray-200 bg-white p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-1.5 bg-amber-50 rounded-lg">
                                    <Users className="w-3.5 h-3.5 text-amber-600" />
                                </div>
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Reports To
                                </span>
                                <span className="ml-auto text-xs font-semibold text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">
                                    {directSupervisors.length}
                                </span>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="flex gap-6 justify-center flex-wrap">
                                    {directSupervisors.map((supervisor: HierarchyNode) => (
                                        <SupervisorBranch key={supervisor._id} supervisor={supervisor} />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Connector between sections */}
                        <div className="flex justify-center">
                            <Connector />
                        </div>

                        {/* Selected Employee Section */}
                        <div className="rounded-xl border border-secondary/20 bg-secondary/5 p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-1.5 bg-secondary/10 rounded-lg">
                                    <UserCheck className="w-3.5 h-3.5 text-secondary" />
                                </div>
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Employee
                                </span>
                            </div>
                            <div className="flex justify-center">
                                <TreeNode node={employee as unknown as HierarchyNode} isCurrentSelection={true} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </FormModal>
    );
};

export default HierarchyTreeModal;
