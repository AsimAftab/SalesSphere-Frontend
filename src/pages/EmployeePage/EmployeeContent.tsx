import React from 'react';
import EmployeeFormModal from '@/components/modals/Employees/EmployeeModal';
import { Loader2, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import EmployeeSkeleton from './components/EmployeeSkeleton';
import { type Employee } from '@/api/employeeService';
import { type EmployeePermissions } from './hooks/useEmployeeManager';
import EmployeeHeader from './components/EmployeeHeader';
import EmployeeGrid from './components/EmployeeGrid';
import { Button, EmptyState, Pagination } from '@/components/ui';

interface EmployeeContentProps {
  state: {
    paginatedData: Employee[];
    loading: boolean;
    error: Error | null;
    searchTerm: string;
    isExporting: 'pdf' | 'excel' | null;
    isCreating: boolean;
    isCreateModalOpen: boolean;
    permissions: EmployeePermissions;
    pagination: {
      currentPage: number;
      totalItems: number;
      itemsPerPage: number;
      onPageChange: (page: number) => void;
    };
  };
  actions: {
    setSearchTerm: (term: string) => void;
    toggleCreateModal: (isOpen: boolean) => void;
    create: (formData: FormData, roleId: string, docs: File[]) => Promise<unknown>;
    exportPdf: () => unknown;
    exportExcel: () => unknown;
  };
  helpers: {
    resolveRoleName: (emp: Employee) => string;
  };
}

const containerVariants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const EmployeeContent: React.FC<EmployeeContentProps> = ({ state, actions, helpers }) => {
  const {
    paginatedData, loading, error, searchTerm,
    isExporting, isCreating, isCreateModalOpen,
    permissions, pagination
  } = state;

  const {
    setSearchTerm, toggleCreateModal, create,
    exportPdf, exportExcel
  } = actions;

  const handleCreateSubmit = async (formData: FormData, customRoleId: string, documentFiles?: File[]) => {
    await create(formData, customRoleId, documentFiles || []);
  };

  if (loading) return <EmployeeSkeleton permissions={permissions} />;

  if (error) {
    return (
      <EmptyState title="Error" description={error.message} variant="error" />
    );
  }

  return (
    <motion.div
      className="flex-1 flex flex-col h-full overflow-hidden overflow-x-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Export Loading Overlay */}
      {isExporting && (
        <div className="w-full p-2 mb-2 text-center bg-blue-100 text-blue-800 rounded-lg text-sm animate-pulse">
          Generating {isExporting === 'pdf' ? 'PDF' : 'Excel'}... Please wait.
        </div>
      )}

      {/* Creation Loading Overlay */}
      {isCreating && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-[9999] backdrop-blur-sm">
          <div className="flex flex-col items-center bg-white px-8 py-6 rounded-2xl shadow-2xl">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-3" />
            <span className="text-gray-800 font-semibold text-lg">Creating Employee...</span>
          </div>
        </div>
      )}

      {/* Header Section */}
      <EmployeeHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        canExport={permissions.canExport}
        canCreate={permissions.canCreate}
        onExportPdf={exportPdf}
        onExportExcel={exportExcel}
        onAddEmployee={() => toggleCreateModal(true)}
      />

      {/* Content Area */}
      <motion.div
        variants={itemVariants}
        className="flex-1 flex flex-col overflow-hidden"
      >
        {paginatedData.length === 0 ? (
          <EmptyState
            title="No Employees Found"
            description={searchTerm
              ? `No employees match the search term "${searchTerm}".`
              : "Get started by adding your first employee to the system."}
            icon={<Search className="w-12 h-12 text-gray-400" />}
            action={
              permissions.canCreate && !searchTerm ? (
                <Button onClick={() => toggleCreateModal(true)}>
                  Add Employee
                </Button>
              ) : undefined
            }
          />
        ) : (
          <div className="flex-1 overflow-auto">
            <EmployeeGrid
              employees={paginatedData}
              resolveRoleName={helpers.resolveRoleName}
            />
          </div>
        )}

        {/* Pagination - Outside scrollable area */}
        <div className="flex-shrink-0 mt-4">
          <Pagination
            currentPage={pagination.currentPage}
            totalItems={pagination.totalItems}
            itemsPerPage={pagination.itemsPerPage}
            onPageChange={pagination.onPageChange}
          />
        </div>
      </motion.div>

      <EmployeeFormModal
        isOpen={isCreateModalOpen}
        onClose={() => toggleCreateModal(false)}
        mode="add"
        onSave={handleCreateSubmit}
      />
    </motion.div>
  );
};

export default EmployeeContent;