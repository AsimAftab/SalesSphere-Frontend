import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import Pagination from '../../../components/UI/Page/Pagination';
import ConfirmationModal from '../../../components/modals/CommonModals/ConfirmationModal';
import { useEstimateExport } from './useEstimateExport';

// --- SOLID Components ---
import EstimateListHeader from './components/EstimateListHeader';
import EstimateListFilters from './components/EstimateListFilters';
import EstimateListTable from './components/EstimateListTable';
import EstimateListMobile from './components/EstimateListMobile';
import EstimateListSkeleton from './components/EstimateListSkeleton';

import { EmptyState } from '../../../components/UI/EmptyState/EmptyState';

import type useEstimateManager from './useEstimateManager';

type EstimateManagerReturn = ReturnType<typeof useEstimateManager>;

interface EstimateListContentProps {
  state: EstimateManagerReturn['state'];
  actions: EstimateManagerReturn['actions'];
  permissions?: {
    canCreate?: boolean;
    canDelete?: boolean;
    canBulkDelete?: boolean;
  };
}

const containerVariants = { hidden: { opacity: 1 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const EstimateListContent: React.FC<EstimateListContentProps> = ({ state, actions, permissions }) => {
  const navigate = useNavigate();

  const {
    estimates, allEstimates, rawEstimates, isLoading, error, currentPage,
    searchTerm, isFilterVisible, filters, options, selection, modals,
    isDeleting, startIndex, totalItems
  } = state;

  const {
    setCurrentPage, setSearchTerm, setIsFilterVisible, setFilters,
    onResetFilters, toggleSelectEstimate, toggleSelectAll,
    openBulkDelete, closeBulkDelete,
    closeDelete, confirmDelete, confirmBulkDelete, openDelete
  } = actions;

  const { handleExportPdf } = useEstimateExport(allEstimates || []);

  // Show skeleton when loading and no raw data yet (rawEstimates is undefined from query)
  if (isLoading && !rawEstimates) return (
    <EstimateListSkeleton
      canDelete={permissions?.canDelete}
      canBulkDelete={permissions?.canBulkDelete}
      canCreate={permissions?.canCreate}
    />
  );
  if (error && !rawEstimates) return <div className="text-center p-10 text-red-600 bg-red-50 rounded-lg">{error}</div>;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex flex-col overflow-x-hidden">

      <ConfirmationModal
        isOpen={modals.isDeleteOpen}
        title="Delete Estimate"
        message="Are you sure you want to delete this estimate?"
        confirmButtonText={isDeleting ? "Deleting..." : "Delete"}
        confirmButtonVariant="danger"
        onConfirm={confirmDelete}
        onCancel={closeDelete}
      />

      <ConfirmationModal
        isOpen={modals.isBulkDeleteOpen}
        title="Mass Delete Estimates"
        message={`Confirm deletion of ${selection.selectedIds.length} selected items.`}
        confirmButtonText={isDeleting ? "Deleting..." : "Mass Delete"}
        confirmButtonVariant="danger"
        onConfirm={confirmBulkDelete}
        onCancel={closeBulkDelete}
      />

      <EstimateListHeader
        searchTerm={searchTerm}
        onSearchChange={(val) => { setSearchTerm(val); setCurrentPage(1); }}
        isFilterVisible={isFilterVisible}
        onToggleFilters={() => setIsFilterVisible(!isFilterVisible)}
        onExportPdf={handleExportPdf}
        onCreateEstimate={() => navigate('/sales/create?type=estimate')}
        selectionCount={selection.selectedIds.length}
        onBulkDelete={openBulkDelete}
        canCreate={permissions?.canCreate}
        canBulkDelete={permissions?.canBulkDelete}
      />

      <EstimateListFilters
        isVisible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        onReset={onResetFilters}
        filters={filters}
        setFilters={setFilters}
        options={options}
      />

      {/* Table Content */}
      <motion.div variants={itemVariants} className="relative">
        {(isDeleting || isLoading) && <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /></div>}

        {estimates.length > 0 ? (
          <>
            <EstimateListTable
              estimates={estimates}
              startIndex={startIndex}
              selection={selection}
              onToggleSelect={toggleSelectEstimate}
              onToggleSelectAll={toggleSelectAll}
              onDelete={openDelete}
              canDelete={permissions?.canDelete}
              canBulkDelete={permissions?.canBulkDelete}
            />
            <EstimateListMobile
              estimates={estimates}
              selection={selection}
              onToggleSelect={toggleSelectEstimate}
              onDelete={openDelete}
              canDelete={permissions?.canDelete}
              canBulkDelete={permissions?.canBulkDelete}
            />
          </>
        ) : (
          <EmptyState
            title="No Estimates Found"
            description={searchTerm || filters.parties.length > 0 || filters.creators.length > 0
              ? "No estimates match your current filters. Try adjusting your search criteria."
              : "No estimates have been created yet. Create your first estimate to get started."}
            icon={
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
          />
        )}

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={10}
          onPageChange={setCurrentPage}
        />
      </motion.div>
    </motion.div>
  );
};

export default EstimateListContent;