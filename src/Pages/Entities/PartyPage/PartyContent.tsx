// src/pages/Entities/PartyPage/PartyContent.tsx
import  { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import PartyCard from '../../../components/UI/ProfileCard';
import AddEntityModal from '../../../components/Entities/AddEntityModal';
import { BulkUploadPartiesModal } from '../../../components/modals/superadmin/BulkUploadPartiesModal'; 
import FilterBar from '../../../components/UI/FilterDropDown/FilterBar';
import FilterDropdown from '../../../components/UI/FilterDropDown/FilterDropDown';

// Shared enterprise components - Fixed casing to match "Shared" folder
import { useEntityManager } from '../Shared/useEntityManager';
import { EntityHeader } from '../Shared/components/EntityHeader';
import { EntityGrid } from '../Shared/components/EntityGrid';
import { EntityPagination } from '../Shared/components/EntityPagination';

// Ensure this file exists in the same directory
import PartyContentSkeleton from './PartyContentSkeleton'; 

const PartyContent = ({ 
  data, partyTypesList, loading, error, onSaveParty, isCreating, 
  onExportPdf, onExportExcel, exportingStatus, organizationId, 
  organizationName, onRefreshData 
}: any) => {
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  // Initialize Manager Hook
  const {
    searchTerm, setSearchTerm, activeFilters, setActiveFilters,
    currentPage, setCurrentPage, paginatedData, totalPages, filteredData, resetFilters
  } = useEntityManager(data, ['companyName', 'ownerName']);

  if (loading && !data) return <PartyContentSkeleton />;
  if (error && !data) return <div className="text-center p-10 text-red-600 bg-red-50 rounded-lg">{error}</div>;

  return (
    <motion.div className="flex-1 flex flex-col h-full overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      
      {/* Export Status Banner */}
      {exportingStatus && (
        <div className="w-full p-2 mb-2 text-center bg-blue-100 text-blue-800 rounded-lg text-sm animate-pulse">
          Generating {exportingStatus.toUpperCase()}... Please wait.
        </div>
      )}

      {/* Enterprise Header */}
      <EntityHeader 
        title="Parties"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        isFilterActive={isFilterVisible}
        onFilterToggle={() => setIsFilterVisible(!isFilterVisible)}
        onExportPdf={() => onExportPdf(filteredData)}
        onExportExcel={() => onExportExcel(filteredData)}
        addButtonLabel="Add New Party"
        onAddClick={() => setIsAddModalOpen(true)}
      />

      {/* Filter Section */}
      <FilterBar isVisible={isFilterVisible} onReset={resetFilters} onClose={() => setIsFilterVisible(false)}>
        <FilterDropdown
          label="Party Type"
          options={partyTypesList}
          selected={activeFilters.partyType || []}
          onChange={(val) => setActiveFilters({ ...activeFilters, partyType: val })}
        />
        <FilterDropdown
          label="Created By"
          options={Array.from(new Set(data?.map((p: any) => p.createdBy?.name).filter(Boolean)))}
          selected={activeFilters.createdBy || []}
          onChange={(val) => setActiveFilters({ ...activeFilters, createdBy: val })}
        />
      </FilterBar>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden pb-6">
        <EntityGrid 
          items={paginatedData}
          emptyMessage="No parties found matching your current selection."
          renderItem={(party: any) => (
            <PartyCard
              key={party.id}
              {...party}
              basePath="/parties"
              title={party.companyName}
              cardType="party"
            />
          )}
        />
      </div>

      {/* Standardized Pagination */}
      <EntityPagination 
        current={currentPage}
        total={totalPages}
        totalItems={filteredData.length}
        itemsPerPage={12}
        onPageChange={setCurrentPage}
      />

      {/* Modals & Loaders */}
      {isCreating && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-[9999]">
          <div className="bg-white px-8 py-6 rounded-lg shadow-lg flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="mt-3 font-semibold">Creating party...</span>
          </div>
        </div>
      )}

      <AddEntityModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={(modalData: any) => onSaveParty(modalData)}
        title="Add New Party"
        entityType="Party"
        partyTypesList={partyTypesList}
        // ✅ Added missing required props
        nameLabel="Party Name"
        ownerLabel="Owner Name"
        panVatMode="required"
      />

      <BulkUploadPartiesModal 
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        organizationId={organizationId} 
        organizationName={organizationName} 
        onUploadSuccess={onRefreshData}
      />
    </motion.div>
  );
};

export default PartyContent;