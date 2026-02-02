import React, { useState } from 'react';
import Button from '../../../components/ui/Button/Button';
import CreateHierarchyModal from './CreateHierarchyModal/CreateHierarchyModal';
import HierarchyTreeModal from './HierarchyTreeModal/HierarchyTreeModal';
import ConfirmationModal from '../../../components/modals/CommonModals/ConfirmationModal';
import SupervisorTable from './SupervisorTable';
import { useSupervisorHierarchy } from './useSupervisorHierarchy';
import type { Employee } from '../../../api/employeeService';

const SupervisorHierarchyTab: React.FC = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingHierarchy, setEditingHierarchy] = useState<{ employeeId: string; supervisorIds: string[] } | null>(null);
    const [selectedEmployeeForTree, setSelectedEmployeeForTree] = useState<Employee | null>(null);

    const {
        employees,
        isLoading,
        refetch,
        deleteHierarchyMutation,
        employeeToDelete,
        setEmployeeToDelete,
        confirmDeleteHierarchy,
        getRoleName
    } = useSupervisorHierarchy();

    const handleEdit = (employee: Employee) => {
        setEditingHierarchy({
            employeeId: employee._id,
            supervisorIds: (employee.reportsTo || []).map((sup) => sup._id)
        });
        setIsCreateModalOpen(true);
    };

    return (
        <div className="flex flex-col h-full p-6 gap-6 overflow-hidden">
            {/* Header Card */}
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-900">Supervisor Hierarchy Mapping</h2>
                <Button
                    variant="primary"
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2"
                >
                    Create New Hierarchy
                </Button>
            </div>

            {/* Table Component */}
            <SupervisorTable
                employees={employees}
                isLoading={isLoading}
                onEdit={handleEdit}
                onDelete={setEmployeeToDelete}
                onViewDetails={setSelectedEmployeeForTree}
                getRoleName={getRoleName}
                isDeleting={deleteHierarchyMutation.isPending}
            />

            {/* Modal */}
            {isCreateModalOpen && (
                <CreateHierarchyModal
                    isOpen={isCreateModalOpen}
                    onClose={() => {
                        setIsCreateModalOpen(false);
                        setEditingHierarchy(null);
                    }}
                    onSuccess={refetch}
                    initialData={editingHierarchy}
                />
            )}

            {/* Hierarchy Tree Modal */}
            <HierarchyTreeModal
                isOpen={!!selectedEmployeeForTree}
                onClose={() => setSelectedEmployeeForTree(null)}
                employee={selectedEmployeeForTree}
            />

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={!!employeeToDelete}
                title="Remove Hierarchy"
                message={`Are you sure you want to remove the reporting structure for ${employeeToDelete?.name}? This action cannot be undone.`}
                onConfirm={confirmDeleteHierarchy}
                onCancel={() => setEmployeeToDelete(null)}
                confirmButtonText="Remove"
                cancelButtonText="Cancel"
                confirmButtonVariant="danger"
            />
        </div>
    );
};

export default SupervisorHierarchyTab;
