import React, { useState } from 'react';
import CreateHierarchyModal from './CreateHierarchyModal/CreateHierarchyModal';
import HierarchyTreeModal from './HierarchyTreeModal/HierarchyTreeModal';
import ConfirmationModal from '@/components/modals/CommonModals/ConfirmationModal';
import SupervisorTable from './SupervisorTable';
import { useSupervisorHierarchy } from './useSupervisorHierarchy';
import { Button, Pagination } from '@/components/ui';
import type { Employee } from '@/api/employeeService';
import SupervisorHierarchySkeleton from './SupervisorHierarchySkeleton';

const SupervisorHierarchyTab: React.FC = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingHierarchy, setEditingHierarchy] = useState<{ employeeId: string; supervisorIds: string[] } | null>(null);
    const [selectedEmployeeForTree, setSelectedEmployeeForTree] = useState<Employee | null>(null);

    const {
        employees,
        totalEmployees,
        currentPage,
        itemsPerPage,
        setCurrentPage,
        isLoading,
        refetch,
        deleteHierarchyMutation,
        employeeToDelete,
        setEmployeeToDelete,
        confirmDeleteHierarchy,
        getRoleName
    } = useSupervisorHierarchy();

    if (isLoading) {
        return <SupervisorHierarchySkeleton />;
    }

    const handleEdit = (employee: Employee) => {
        setEditingHierarchy({
            employeeId: employee.id || employee._id || '',
            supervisorIds: (employee.reportsTo || []).map((sup) => sup._id)
        });
        setIsCreateModalOpen(true);
    };

    return (
        <>
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-6 pt-4 sm:pt-6">
                <div>
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#202224]">Reporting Structure</h1>
                    <p className="text-xs sm:text-sm text-gray-500">Manage supervisor-subordinate assignments</p>
                </div>
                <Button
                    variant="secondary"
                    onClick={() => setIsCreateModalOpen(true)}
                >
                    Assign Supervisor
                </Button>
            </div>

            <div className="flex flex-col h-full px-4 sm:px-6 py-4 sm:py-6 gap-4 sm:gap-6 overflow-hidden">
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

                {/* Pagination */}
                <Pagination
                    currentPage={currentPage}
                    totalItems={totalEmployees}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                    className="w-full"
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
                    title="Remove Reporting Structure"
                    message={`Are you sure you want to remove the supervisor assignments for ${employeeToDelete?.name}? This action cannot be undone.`}
                    onConfirm={confirmDeleteHierarchy}
                    onCancel={() => setEmployeeToDelete(null)}
                    confirmButtonText="Remove"
                    cancelButtonText="Cancel"
                    confirmButtonVariant="danger"
                />
            </div>
        </>
    );
};

export default SupervisorHierarchyTab;
